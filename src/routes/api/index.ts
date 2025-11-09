import { Router } from "express";
import profileRouter from "./profile/";
import categories from "./categories/categories";
import mbti from "./mbti/mbti";
import enneagram from "./enneagram/enneagram";
import zodiac from "./zodiac/zodiac";
import seed from "./seed/seed";
import { connectDB } from "../../utils/db";
import comments from "./comments/comments";

const router = Router();

// Connect to DB once before handling requests
router.use(async (_req, _res, next) => {
  await connectDB();
  next();
});


router.use("/profiles", profileRouter);
router.use("/categories", categories);
router.use("/mbti", mbti);
router.use("/enneagram", enneagram);
router.use("/zodiac", zodiac);
router.use("/seed", seed);
router.use("/comments", comments);

export default router;
