import {Category} from "../models/categories/category.model";
import {Mbti} from "../models/mbti/mbti.model";
import mongoose from "mongoose";

export async function resolveCategories(
  input: string | mongoose.Types.ObjectId | (string | mongoose.Types.ObjectId)[]
) {
  if (!input) return [];

  // Normalize to array
  const inputs = Array.isArray(input) ? input : [input];

  const results: mongoose.Types.ObjectId[] = [];

  for (const value of inputs) {
    let found = null;

    // Step 1: Try by ObjectId
    if (mongoose.isValidObjectId(value)) {
      found = await Category.findById(value);
    }

    // Step 2: Try by name (case-insensitive)
    if (!found && typeof value === "string") {
      found = await Category.findOne({
        name: new RegExp(`^${value}$`, "i"),
      });
    }

    // Step 3: If found, push the ID
    if (found) results.push(found.id);
  }

  return results;

}

/**
 * Resolves an MBTI input (can be ObjectId or code/name)
 * to a valid ObjectId from the database.
 */
export async function resolveMbti(input: string | mongoose.Types.ObjectId) {
  if (!input) return null;

  let found = null;

  // Step 1. Try find by ObjectId
  if (mongoose.isValidObjectId(input)) {
    found = await Mbti.findById(input);
  }

  // Step 2. If not found, find by name or code (case insensitive)
  if (!found) {
    found = await Mbti.findOne({
      $or: [
        { code: new RegExp(`^${input}$`, "i") },
      ],
    });
  }

  return found;
}