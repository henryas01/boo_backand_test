import mongoose, { Document, Schema } from "mongoose";

export interface IProfile extends Document {
  name: string;
  age: number;
  bio?: string;
  image: string;
  selected_categories: mongoose.Types.ObjectId[];
  mbti: mongoose.Types.ObjectId;
  instinctual_variant: string;
  tritype: string;
  socionics: string;
  big_five_sloan: string;
  attitudinal_psyche: string;
  temperament: string;
  created_at: Date;
  updated_at: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    bio: String,
    image: {
      type: String,
      default: `${process.env.BASE_URL}/images/avatar.png`,
    },
    selected_categories: [
      { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ],
    mbti: { type: Schema.Types.ObjectId, ref: "Mbti", required: true },
    instinctual_variant: String,
    tritype: String,
    socionics: String,
    big_five_sloan: String,
    attitudinal_psyche: String,
    temperament: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.models.Profile ||
  mongoose.model<IProfile>("Profile", ProfileSchema);
