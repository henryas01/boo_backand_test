import { Router, Request, Response } from "express";

// ===== Type Definition =====
interface Profile {
  id: number;
  name: string;
  description: string;
  mbti: string;
  enneagram: string;
  variant: string;
  tritype: number;
  socionics: string;
  sloan: string;
  psyche: string;
  image: string;
}

// ===== Mock Data (can later come from DB or API) =====
const profiles: Profile[] = [
  {
    id: 1,
    name: "A Martinez",
    description: "Adolph Larrue Martinez III.",
    mbti: "ISFJ",
    enneagram: "9w3",
    variant: "sp/so",
    tritype: 725,
    socionics: "SEE",
    sloan: "RCOEN",
    psyche: "FEVL",
    image: "https://soulverse.boo.world/images/1.png",
  },
];

// ===== Router Setup =====
const router = Router();

/**
 * Render a profile page with EJS.
 * - Path: GET /
 * - View: views/profile_template.ejs
 * - Data: `profile` object passed to EJS
 */
router.get("/", (_req: Request, res: Response) => {
  const profile = profiles[0];
  res.render("profile_template", { profile });
});

export default router;
