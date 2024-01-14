import { Request, Response } from 'express'
import auth from '../middlewares/auth.middleware'
import { CartModel } from '../models/cart.model'
import { CartItemModel, ICartItem } from '../models/cartItem.model'
import { ProductModel } from '../models/product.model'

const getCart = async (req: Request, res: Response) => {
	try {
		const userId = await auth(req)
		// populate() 方法會將指定的欄位填入資料，也就是會將 cart.items 中的所有資料填入。
		const cart = (await CartModel.findOne({ userId }).populate('items')) as { items: ICartItem[] }
		if (!cart) return res.status(404).json({ message: 'Cart not found.' })

		const populatedItems = await Promise.all(
			cart.items.map(async (item: ICartItem) => {
				const product = await ProductModel.findById(item.productId)

				return {
					_id: item._id,
					cartId: item.cartId,
					productId: item.productId,
					quantity: item.quantity,
					product: product
						? {
								title: product.title,
								price: product.price,
								imageUrl: product.imageUrl,
								countInStock: product.countInStock,
						  }
						: null,
				}
			})
		)

		res.status(200).json({ message: 'Cart fetched successfully!', cart: populatedItems })
	} catch (err: any) {
		res.status(401).json({ message: err.message })
	}
}

const addToCart = async (req: Request, res: Response) => {
	const { productId, quantity } = req.body

	try {
		const userId = await auth(req)
		const cart = await CartModel.findOne({ userId })
		if (!cart) return res.status(404).json({ message: 'Cart not found.' })

		// 檢查購物車中是否已經存在相同產品
		const existingCartItem = await CartItemModel.findOne({ cartId: cart._id, productId })

		if (existingCartItem) {
			// 更新數量
			existingCartItem.quantity += quantity
			await existingCartItem.save()
		} else {
			// 如果不存在，創建新的購物車項目
			const cartItem = new CartItemModel({ cartId: cart._id, productId, quantity })
			await cartItem.save()
			cart.items.push(cartItem._id)
			await cart.save()
		}

		res.status(200).json({ message: 'Item added to cart successfully!', cart })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const removeFromCart = async (req: Request, res: Response) => {
	const itemId = req.params.id

	try {
		const userId = await auth(req)
		const cart = await CartModel.findOne({ userId })
		if (!cart) return res.status(404).json({ message: 'Cart not found.' })

		const cartItem = await CartItemModel.findById(itemId)
		if (!cartItem) return res.status(404).json({ message: 'Item not found in the cart.' })

		await cartItem.deleteOne({ _id: itemId })
		res.status(200).json({ message: 'Selected items removed successfully!', cart })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const changeQuantity = async (req: Request, res: Response) => {
	try {
		const userId = await auth(req)
		const cart = await CartModel.findOne({ userId })
		if (!cart) return res.status(404).json({ message: 'Cart not found.' })

		const cartItem = await CartItemModel.findOne({ cartId: cart._id, productId: req.params.id })
		if (!cartItem) return res.status(404).json({ message: 'Item not found in the cart.' })

		cartItem.quantity = req.body.quantity
		await cartItem.save()

		res.status(200).json({ message: 'Cart updated successfully!', cart })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const clearCart = async (req: Request, res: Response) => {
	try {
		const userId = await auth(req)
		const cart = await CartModel.findOne({ userId })
		if (!cart) return res.status(404).json({ message: 'Cart not found.' })

		await CartItemModel.deleteMany({ cartId: cart._id })
		res.status(200).json({ message: 'Cart cleared successfully!', cart })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

export { addToCart, getCart, removeFromCart, changeQuantity, clearCart }
