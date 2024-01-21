import { Request, Response } from 'express'
import { PostModel } from '../models/post.model'

const getPost = async (req: Request, res: Response) => {
	try {
		const posts = await PostModel.find()
		res.status(200).json({ message: 'Posts fetched Successfully!', posts })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const getPostById = async (req: Request, res: Response) => {
	try {
		const post = await PostModel.findById(req.params.id)
		res.status(200).json({ message: 'Post fetched Successfully!', post })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const addPost = async (req: Request, res: Response) => {
	try {
		const post = new PostModel(req.body)
		await post.save()
		res.status(201).json({ message: 'Post added Successfully!' })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const updatePost = async (req: Request, res: Response) => {
	try {
		const postId = req.params.id

		const post = await PostModel.findById(postId)
		if (post) {
			const updateData = req.body
			if (!updateData || Object.keys(updateData).length === 0)
				return res.status(400).json({ message: 'Invalid update data. Please provide data to update.' })

			const updatedPost = await PostModel.findByIdAndUpdate(postId, updateData, { new: true })
			if (!updatedPost) return res.status(404).json({ message: 'Post not found.' })

			res.status(200).json({ message: 'Post updated Successfully!', post: updatedPost })
		} else {
			res.status(404).json({ message: 'Post not found!' })
		}
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

const deletePostById = async (req: Request, res: Response) => {
	try {
		const postId = req.params.id

		const post = await PostModel.findById(postId)
		if (post) {
			await PostModel.deleteOne({ _id: postId })
			res.status(200).json({ message: 'Post deleted Successfully!' })
		} else res.status(404).json({ message: 'Post not found!' })
	} catch (err: any) {
		res.status(500).json({ message: err.message })
	}
}

export { addPost, deletePostById, getPost, getPostById, updatePost }
