import { Router } from "express";
import { Category } from "../../../models/categories/category.model";
import { Mbti } from "../../../models/mbti/mbti.model";
import { Enneagram } from "../../../models/enneagram/enneagram.model";
import { Zodiac } from "../../../models/zodiacs/zodiac.model";
import { connectDB } from "../../../utils/db";

const router = Router();

// Connect to DB once before handling requests
router.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

router.post("/", async (req, res) => {
  try {
    await Promise.all([
      Category.deleteMany({}),
      Mbti.deleteMany({}),
      Enneagram.deleteMany({}),
      Zodiac.deleteMany({})
    ]);

    await Category.insertMany([
      { name: "Anime" },
      { name: "Music" },
      { name: "Politics" },
      { name: "Historians" },
      { name: "Gaming" },
      { name: "Art" },
      { name: "Comics" },
      { name: "Science" },
      { name: "Philosophy" },
      { name: "Movies" },
      { name: "Television" },
      { name: "Literature" },
      { name: "Business" },
      { name: "Religion" },
      { name: "Pop Culture" },
      { name: "Internet" },
      { name: "Technology" },
    ]);

    await Mbti.insertMany([
      { code: "INFP" },
      { code: "INFJ" },
      { code: "ENFP" },
      { code: "ENFJ" },
      { code: "INTJ" },
      { code: "INTP" },
      { code: "ENTP" },
      { code: "ENTJ" },
      { code: "ISFP" },
      { code: "ISFJ" },
      { code: "ESFP" },
      { code: "ESFJ" },
      { code: "ISTP" },
      { code: "ISTJ" },
      { code: "ESTP" },
      { code: "ESTJ" },
    ]);

    await Enneagram.insertMany([
      { code: "1w2" },
      { code: "2w3" },
      { code: "3w2" },
      { code: "3w4" },
      { code: "4w3" },
      { code: "4w5" },
      { code: "5w4" },
      { code: "5w6" },
      { code: "6w5" },
      { code: "6w7" },
      { code: "7w6" },
      { code: "7w8" },
      { code: "8w7" },
      { code: "8w9" },
      { code: "9w8" },
      { code: "9w1" },
    ]);

    await Zodiac.insertMany([
      { name: "Aries" },
      { name: "Taurus" },
      { name: "Gemini" },
      { name: "Cancer" },
      { name: "Leo" },
      { name: "Virgo" },
      { name: "Libra" },
      { name: "Scorpio" },
      { name: "Sagittarius" },
      { name: "Capricorn" },
      { name: "Aquarius" },
      { name: "Pisces" },
    ]);

    res.status(201).json({ message: "Seed data created successfully." });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ error: "Failed to seed data." });
  }
});

export default router;
