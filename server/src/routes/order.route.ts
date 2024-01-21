import { Router } from 'express'
import { createOrder, getOrderById, getOrdersForAdmin, getOrders, updateOrder } from '../controllers/order.controller'

const router = Router()

router.route('/').get(getOrders)
router.route('/admin').get(getOrdersForAdmin)
router.route('/:id').get(getOrderById)
router.route('/').post(createOrder)
router.route('/:id').patch(updateOrder)

export { router as orderRouter }
