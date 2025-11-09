import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../ulits/dbtesting";
import { seedTestDB } from "./seed";
import {Category} from "../../models/categories/category.model";
import {Mbti} from "../../models/mbti/mbti.model";

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("Seed Data", () => {
  it("should seed categories correctly", async () => {
    await seedTestDB();

    const categories = await Category.find({});
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.map(c => c.name)).toContain("Anime");
    expect(categories.map(c => c.name)).toContain("Music");
  });

  it("should seed MBTI codes correctly", async () => {
    await seedTestDB();

    const mbti = await Mbti.find({});
    expect(mbti.length).toBeGreaterThan(0);
    expect(mbti.map(m => m.code)).toContain("INTP");
    expect(mbti.map(m => m.code)).toContain("ENFP");
  });
});
