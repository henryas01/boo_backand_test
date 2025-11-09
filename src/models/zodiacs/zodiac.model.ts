import mongoose, { Schema, Document, Model } from "mongoose";

export interface IZodiac extends Document {
  name: string;
}

const ZodiacSchema = new Schema<IZodiac>({
  name: { type: String, required: true, unique: true },
});

export const Zodiac: Model<IZodiac> =
  mongoose.models.Zodiac || mongoose.model<IZodiac>("Zodiac", ZodiacSchema);
