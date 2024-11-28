import { Request, Response } from "express";

import { NewModel } from "@/models/new.model";

const getNew = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const total = await NewModel.countDocuments();

    const news = await NewModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    res.status(200).json({
      message: "News fetched successfully!",
      news,
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const getNewById = async (req: Request, res: Response) => {
  try {
    const newsItem = await NewModel.findById(req.params.id);
    res.status(200).json({ message: "New fetched Successfully!", newsItem });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const addNew = async (req: Request, res: Response) => {
  try {
    const newsItem = new NewModel(req.body);
    await newsItem.save();
    res.status(201).json({ message: "New added Successfully!" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const updateNew = async (req: Request, res: Response) => {
  try {
    const newId = req.params.id;

    const newsItem = await NewModel.findById(newId);
    if (newsItem) {
      const updateData = req.body;
      if (!updateData || Object.keys(updateData).length === 0)
        return res.status(400).json({
          message: "Invalid update data. Please provide data to update.",
        });

      const updatedNew = await NewModel.findByIdAndUpdate(
        newId,
        updateData,
        { new: true },
      );
      if (!updatedNew)
        return res.status(404).json({ message: "New not found." });

      res
        .status(200)
        .json({ message: "New updated Successfully!", new: updatedNew });
    } else res.status(404).json({ message: "New not found!" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const deleteNewById = async (req: Request, res: Response) => {
  try {
    const newId = req.params.id;

    const newsItem = await NewModel.findById(newId);
    if (newsItem) {
      await NewModel.deleteOne({ _id: newId });
      res.status(200).json({ message: "New deleted Successfully!" });
    } else res.status(404).json({ message: "New not found!" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export { addNew, deleteNewById, getNew, getNewById, updateNew };
