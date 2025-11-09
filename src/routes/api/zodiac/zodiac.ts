import { Router, Request, Response } from "express";
import { Zodiac } from "../../../models/zodiacs/zodiac.model";

const router = Router();


// GET /api/zodiac
router.get("/", async (_req: Request, res: Response) => {
  const items = await Zodiac.find().sort({ name: 1 }).lean();
  res.json(items);
});


// POST /api/zodiac
// body: { name: "Some Zodiac" }
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });
    const created = await Zodiac.create({ name });
    res.status(201).json(created);
  } catch (err: any) {
    if (err?.code === 11000) return res.status(409).json({ error: "duplicate" });
    res.status(500).json({ error: "server error" });
  }
});

export default router;
