import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  name: string;
  image: string;
  title: string;
  system_type: "mbti" | "enneagram" | "zodiac";
  description: string;
  count_love: number;
  created_at: Date;
  updated_at: Date;
}

const CommentSchema: Schema = new Schema<IComment>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    system_type: {
      type: String,
      enum: ["mbti", "enneagram", "zodiac"],
      required: true,
    },
    description: { type: String, required: true },
    count_love: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const CommentModel: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
