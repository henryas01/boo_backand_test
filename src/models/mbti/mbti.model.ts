import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMbti extends Document {
  _id: string;
  code: string;
}

const MbtiSchema = new Schema<IMbti>({
  code: { type: String, required: true, unique: true },
});

export const Mbti: Model<IMbti> =
  mongoose.models.Mbti || mongoose.model<IMbti>("Mbti", MbtiSchema);
