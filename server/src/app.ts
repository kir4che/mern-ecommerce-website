import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import { cartRouter } from './routes/cart.route'
import { postRouter } from './routes/post.route'
import { productRouter } from './routes/product.route'
import { userRouter } from './routes/user.route'
import { orderRouter } from './routes/order.route'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }))

app.use(
	session({
		secret: Math.random().toString(36).substring(2),
		resave: false, // 固定寫法
		saveUninitialized: true, // 固定寫法: 是否保存初始化的 session
		cookie: {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
			secure: false, // true: 只有 https 才能使用 cookie
		},
	})
)

app.use('/api/user', userRouter)
app.use('/api/products', productRouter)
app.use('/api/posts', postRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)

mongoose
	.connect(process.env.MONGO_URI || '')
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error(err))

app.listen(process.env.PORT, () => {
	console.log(`Server started on ${process.env.BACKEND_URL}`)
})
