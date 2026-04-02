import { Request, Response } from "express";

import { NewsModel } from "../models/news.model";

const getNew = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const total = await NewsModel.countDocuments();

    const news = await NewsModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      news,
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "NEWS_FETCH_FAILED", message });
  }
};

const getNewById = async (req: Request, res: Response) => {
  try {
    const newsItem = await NewsModel.findById(req.params.id);
    res
      .status(200)
      .json({ success: true, newsItem });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "NEWS_DETAIL_FETCH_FAILED", message });
  }
};

const addNew = async (req: Request, res: Response) => {
  try {
    const newsItem = new NewsModel(req.body);
    await newsItem.save();
    res.status(201).json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "NEWS_CREATE_FAILED", message });
  }
};

const updateNew = async (req: Request, res: Response) => {
  try {
    const newId = req.params.id;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0)
      return res.status(400).json({
        success: false,
        code: "INVALID_NEWS_UPDATE_DATA",
        message: "Invalid update data. Please provide data to update.",
      });

    const updatedNew = await NewsModel.findByIdAndUpdate(newId, updateData, {
      new: true,
    });

    if (!updatedNew)
      return res
        .status(404)
        .json({ success: false, code: "NEWS_NOT_FOUND", message: "News not found." });

    res
      .status(200)
      .json({ success: true, message: "News updated successfully!", news: updatedNew });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "NEWS_UPDATE_FAILED", message });
  }
};

const deleteNewById = async (req: Request, res: Response) => {
  try {
    const newId = req.params.id;

    const deletedNews = await NewsModel.findByIdAndDelete(newId);

    if (!deletedNews)
      return res
        .status(404)
        .json({ success: false, code: "NEWS_NOT_FOUND", message: "News not found." });

    res
      .status(200)
      .json({ success: true, message: "News deleted successfully!" });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "NEWS_DELETE_FAILED", message });
  }
};

export { addNew, deleteNewById, getNew, getNewById, updateNew };
