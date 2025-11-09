import { Router, Request, Response } from "express";
import { Mbti } from "../../../models/mbti/mbti.model";

const router = Router();


// GET /api/mbti
router.get("/", async (_req: Request, res: Response) => {
  const items = await Mbti.find().sort({ code: 1 }).lean();
  res.json(items);
});

// POST /api/mbti
// body: { code: "ISFJ" }
router.post("/", async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "code is required" });
    const created = await Mbti.create({ code });
    res.status(201).json(created);
  } catch (err: any) {
    if (err?.code === 11000) return res.status(409).json({ error: "duplicate" });
    res.status(500).json({ error: "server error" });
  }
});

export default router;
