"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
}, { timestamps: true });
exports.PostModel = (0, mongoose_1.model)('post', postSchema);
//# sourceMappingURL=post.model.js.map