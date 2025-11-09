import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnneagram extends Document {
  code: string;
}

const EnneagramSchema = new Schema<IEnneagram>({
  code: { type: String, required: true, unique: true },
});

export const Enneagram: Model<IEnneagram> =
  mongoose.models.Enneagram || mongoose.model<IEnneagram>("Enneagram", EnneagramSchema);
