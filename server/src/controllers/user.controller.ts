import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import auth from '../middlewares/auth.middleware'
import { CartModel } from '../models/cart.model'
import { UserModel } from '../models/user.model'

declare module 'express-session' {
	export interface SessionData {
		user: {
			name: string
			email: string
			role: 'user' | 'admin'
		}
	}
}

const getUserData = async (req: Request, res: Response) => {
	try {
		const userId = await auth(req)
		const user = await UserModel.findById(userId)
		if (!user) return res.status(404).json({ message: 'User not found!' })

		res.status(200).json({
			message: 'User fetched Successfully!',
			user: {
				name: user.name,
				email: user.email,
			},
		})
	} catch (err: any) {
		if (err.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token has expired.' })
		else return res.status(401).json({ message: 'Unauthorized!' })
	}
}

const createNewUser = async (req: Request, res: Response) => {
	const { name, email, password } = req.body

	try {
		// 先確認該 email 是否已經被註冊過
		const isNewUser = await UserModel.findOne({ email })
		if (isNewUser) return res.status(400).json({ message: 'User already Exists!' })

		// 將 password 進行 hash
		const hashedPassword = await bcrypt.hash(password, 10)
		// 建立新的 user
		const newUser = new UserModel({ name, email, password: hashedPassword })
		await newUser.save()

		const newCart = new CartModel({ userId: newUser._id, items: [] })
		await newCart.save()

		res.status(201).json({ message: 'User registered Successfully!' })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const loginUser = async (req: Request, res: Response) => {
	const { email, password } = req.body

	try {
		// 確認該 email 是否已經被註冊過
		const user = await UserModel.findOne({ email })
		if (!user) return res.status(400).json({ message: "User does'nt Exist!" })

		// 確認 password 是否正確
		const passwordMatch = await bcrypt.compare(password, user.password)
		if (!passwordMatch) return res.status(400).json({ message: 'Invalid Password!' })

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as Secret, {
			expiresIn: '3d',
		})

		req.session.user = {
			name: user.name,
			email: user.email,
			role: user.role as 'user' | 'admin',
		}

		req.session.save() // 儲存 session

		res.status(200).json({ message: 'User logged in Successfully!', user: req.session.user, token })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const logoutUser = async (req: Request, res: Response) => {
	try {
		req.session.destroy((err: any) => {
			if (err) throw new Error(err)
		})
		res.status(200).json({ message: 'User logged out Successfully!' })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

export { createNewUser, getUserData, loginUser, logoutUser }
