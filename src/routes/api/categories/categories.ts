import { Router, Request, Response } from "express";
import { Category } from "../../../models/categories/category.model";

const router = Router();

// GET /api/categories
router.get("/", async (_req: Request, res: Response) => {
  const items = await Category.find().sort({ name: 1 }).lean();
  res.json(items);
});

// POST /api/categories
// body: { name: "Some Category" }
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });
    const created = await Category.create({ name });
    res.status(201).json(created);
  } catch (err: any) {
    if (err?.code === 11000) return res.status(409).json({ error: "duplicate" });
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

export default router;
