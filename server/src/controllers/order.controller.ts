import auth from '../middlewares/auth.middleware'
import { OrderModel } from '../models/order.model'
import { Request, Response } from 'express'

const getOrders = async (req: Request, res: Response) => {
	try {
		const { role } = req.session.user
		if (role == 'admin') {
			await auth(req)
			const orders = await OrderModel.find()
			res.status(200).json({ message: 'Orders fetched successfully!', orders })
		} else {
			const userId = await auth(req)
			const orders = await OrderModel.find({ userId })
			res.status(200).json({ message: 'Orders fetched successfully!', orders })
		}
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const getOrderById = async (req: Request, res: Response) => {
	try {
		await auth(req)
		const order = await OrderModel.findById(req.params.id)
		res.status(200).json({ message: 'Order fetched successfully!', order })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const createOrder = async (req: Request, res: Response) => {
	const { name, phone, address, orderItems, totalAmount } = req.body
	try {
		const userId = await auth(req)
		const order = new OrderModel({
			userId,
			name,
			phone,
			address,
			orderItems,
			totalAmount,
		})
		await order.save()

		res.status(201).json({ message: 'Order created Successfully!', order })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const updateOrder = async (req: Request, res: Response) => {
	const { status, shippingStatus, paymentStatus } = req.body
	try {
		await auth(req)
		const order = await OrderModel.findByIdAndUpdate(
			req.params.id,
			{ status, shippingStatus, paymentStatus },
			{ new: true }
		)
		res.status(200).json({ message: 'Order updated successfully!', order })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

export { getOrders, getOrderById, createOrder, updateOrder }
