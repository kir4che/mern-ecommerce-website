import { Router } from 'express'
import { addPost, deletePostById, getPost, getPostById, updatePost } from '../controllers/post.controller'
const router = Router()

router.route('/').get(getPost)
router.route('/:id').get(getPostById)
router.route('/').post(addPost)
router.route('/:id').patch(updatePost)
router.route('/:id').delete(deletePostById)

export { router as postRouter }
