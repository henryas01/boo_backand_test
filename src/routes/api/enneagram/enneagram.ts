import { Router, Request, Response } from "express";
import { Enneagram } from "../../../models/enneagram/enneagram.model";

const router = Router();


// GET /api/enneagram
router.get("/", async (_req: Request, res: Response) => {
  const items = await Enneagram.find().sort({ code: 1 }).lean();
  res.json(items);
});


// POST /api/enneagram
// body: { code: "9w3" }
router.post("/", async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "code is required" });
    const created = await Enneagram.create({ code });
    res.status(201).json(created);
  } catch (err: any) {
    if (err?.code === 11000) return res.status(409).json({ error: "duplicate" });
    res.status(500).json({ error: "server error" });
  }
});

export default router;
