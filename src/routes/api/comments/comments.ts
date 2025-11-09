import { Router, Request, Response } from "express";
import { CommentModel } from "../../../models/comments/comment.model";

const router = Router();

/**
 * GET /api/comments?sort_by=recent|best&system_type=all|mbti|enneagram|zodiac
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { sort_by = "recent", system_type = "all" } = req.query;

    // Filter
    const filter: any = {};
    if (system_type !== "all") {
      filter.system_type = system_type;
    }

    // Sorting
    let sortOption: any = {};
    if (sort_by === "best") {
      sortOption = { count_love: -1, created_at: -1 };
    } else {
      sortOption = { created_at: -1 };
    }

    const comments = await CommentModel.find(filter).sort(sortOption).lean();

    const formatted = comments.map((c) => ({
      id: c._id,
      name: c.name,
      image: c.image,
      title: c.title,
      system_type: c.system_type,
      description: c.description,
      count_love: c.count_love,
      created_at: c.created_at,
      updated_at: c.updated_at,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

/**
 * ✅ POST /api/comments
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, title, system_type, description } = req.body;

    if (!name || !title || !system_type || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Static image from public folder
    const image = `${process.env.BASE_URL}/images/avatar1.jpg`;

    const comment = await CommentModel.create({
      name,
      image,
      title,
      system_type,
      description,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
});

/**
 * PATCH /api/comments/:id/like
 * Action: like or unlike
 * Body: { "action": "like" } or { "action": "unlike" }
 */
router.patch("/:id/like", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!["like", "unlike"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Must be 'like' or 'unlike'." });
    }

    const comment = await CommentModel.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Increment or decrement love count safely (no negative)
    if (action === "like") comment.count_love += 1;
    else comment.count_love = Math.max(comment.count_love - 1, 0);

    await comment.save();

    res.json({
      id: comment._id,
      count_love: comment.count_love,
      message: `Comment ${action}d successfully`,
    });
  } catch (error) {
    console.error("Error updating like:", error);
    res.status(500).json({ message: "Failed to update like status" });
  }
});

export default router;
