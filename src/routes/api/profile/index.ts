import { Router, Request, Response } from "express";
import ProfileModel from "../../../models/profiles/profile.model";
import { resolveCategories, resolveMbti } from "../../../utils/resolveReferences";

const router = Router();

// GET all profiles
router.get("/", async (_req, res) => {
  try {
    const profiles = await ProfileModel.find()
      .populate("selected_categories", "name")
      .populate("mbti", "code");

    res.json(profiles);
  } catch (err) {
    console.error("Error fetching profiles:", err);
    res.status(500).json({ message: "Failed to get profiles" });
  }
});

//  GET profile by ID
router.get("/:id", async (req, res) => {
  try {
    const profile = await ProfileModel.findById(req.params.id)
      .populate("selected_categories", "name")
      .populate("mbti", "code");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const formatted = {
      id: profile._id,
      name: profile.name,
      age: profile.age,
      bio: profile.bio,
      image: profile.image,
      selected_categories: profile.selected_categories.map((cat: any) => ({
        id: cat._id,
        name: cat.name,
      })),
      mbti: profile.mbti
        ? { id: (profile.mbti as any)._id, code: (profile.mbti as any).code }
        : null,
      instinctual_variant: profile.instinctual_variant,
      tritype: profile.tritype,
      socionics: profile.socionics,
      big_five_sloan: profile.big_five_sloan,
      attitudinal_psyche: profile.attitudinal_psyche,
      temperament: profile.temperament,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Failed to get profile" });
  }
});


// POST create profile
// body: {
//   "name": "Henry Smith",
//   "age": 25,
//   "bio": "A dedicated Backend Engineer focused on scalable systems.",
//   "selected_categories": ["Anime", "Music"], // you could pass an id or a name
//   "mbti": "INTP", // you could pass an id or a name
//   "instinctual_variant": "so/sp",
//   "tritype": "513",
//   "socionics": "ILE",
//   "big_five_sloan": "RCOEI",
//   "attitudinal_psyche": "VLFE",
//   "temperament": "phlegmatic"
// }
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      age,
      bio,
      image,
      selected_categories,
      mbti,
      instinctual_variant,
      tritype,
      socionics,
      big_five_sloan,
      attitudinal_psyche,
      temperament,
    } = req.body;

    // Convert readable names to ObjectIds
    const categoryIds = await resolveCategories(selected_categories);
    const mbtiDoc = await resolveMbti(mbti);

    if (!mbtiDoc) {
      return res.status(400).json({ message: "Invalid MBTI" });
    }

    // Save the profile
    const profile = await ProfileModel.create({
      name,
      age,
      bio,
      image,
      selected_categories: categoryIds,
      mbti: mbtiDoc?._id,
      instinctual_variant,
      tritype,
      socionics,
      big_five_sloan,
      attitudinal_psyche,
      temperament,
    });

    // Populate category + mbti references
    const populated = await profile.populate([
      { path: "selected_categories", select: "name" },
      { path: "mbti", select: "code" },
    ]);

    // Transform populated data → readable names
    const response = {
      _id: populated._id,
      name: populated.name,
      age: populated.age,
      bio: populated.bio,
      image: populated.image,
      selected_categories: profile.selected_categories.map((cat: any) => ({
        id: cat._id,
        name: cat.name,
      })),
      mbti: profile.mbti
        ? { id: (profile.mbti as any)._id, code: (profile.mbti as any).code }
        : null,
      instinctual_variant: populated.instinctual_variant,
      tritype: populated.tritype,
      socionics: populated.socionics,
      big_five_sloan: populated.big_five_sloan,
      attitudinal_psyche: populated.attitudinal_psyche,
      temperament: populated.temperament,
      created_at: populated.created_at,
      updated_at: populated.updated_at,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
});




export default router;
