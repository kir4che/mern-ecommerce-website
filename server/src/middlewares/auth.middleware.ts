import { Request } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { Types } from 'mongoose'

interface Decoded {
	userId: Types.ObjectId
}

const auth = async (req: Request) => {
	const token = req.header('Authorization')?.split(' ')[1]
	if (!token) throw new Error('Unauthorized!')

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as Decoded
		if (!decoded) throw new Error('Authentication failed!')
		return decoded.userId
	} catch (err: any) {
		if (err.name === 'TokenExpiredError') throw new Error('Token has expired.')
		else throw new Error('Invalid token!')
	}
}

export default auth
