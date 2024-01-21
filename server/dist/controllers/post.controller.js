"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = exports.getPostById = exports.getPost = exports.deletePostById = exports.addPost = void 0;
const post_model_1 = require("../models/post.model");
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.PostModel.find();
        res.status(200).json({ message: 'Posts fetched Successfully!', posts });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getPost = getPost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.PostModel.findById(req.params.id);
        res.status(200).json({ message: 'Post fetched Successfully!', post });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getPostById = getPostById;
const addPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = new post_model_1.PostModel(req.body);
        yield post.save();
        res.status(201).json({ message: 'Post added Successfully!' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.addPost = addPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const post = yield post_model_1.PostModel.findById(postId);
        if (post) {
            const updateData = req.body;
            if (!updateData || Object.keys(updateData).length === 0)
                return res.status(400).json({ message: 'Invalid update data. Please provide data to update.' });
            const updatedPost = yield post_model_1.PostModel.findByIdAndUpdate(postId, updateData, { new: true });
            if (!updatedPost)
                return res.status(404).json({ message: 'Post not found.' });
            res.status(200).json({ message: 'Post updated Successfully!', post: updatedPost });
        }
        else
            res.status(404).json({ message: 'Post not found!' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.updatePost = updatePost;
const deletePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const post = yield post_model_1.PostModel.findById(postId);
        if (post) {
            yield post_model_1.PostModel.deleteOne({ _id: postId });
            res.status(200).json({ message: 'Post deleted Successfully!' });
        }
        else
            res.status(404).json({ message: 'Post not found!' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.deletePostById = deletePostById;
//# sourceMappingURL=post.controller.js.map