import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { connectDB } from "../../src/utils/db";
import { Category } from "../../src/models/categories/category.model";

describe("Categories API", () => {
  // Connect to test DB before all tests
  beforeAll(async () => {
    await connectDB();
  });

  // Clear the Category collection before each test
  beforeEach(async () => {
    await Category.deleteMany({});
  });

  // Disconnect after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should get all categories (empty at first)", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("should create a new category", async () => {
    const res = await request(app)
      .post("/api/categories")
      .send({ name: "Anime" });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toBe("Anime");

    // Ensure the category exists in DB
    const dbItem = await Category.findOne({ name: "Anime" });
    expect(dbItem).not.toBeNull();
  });

  it("should return 400 if name is missing", async () => {
    const res = await request(app).post("/api/categories").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("name is required");
  });

  it("should not allow duplicate categories", async () => {
    // First create a category
    await Category.create({ name: "Music" });

    // Attempt to create duplicate
    const res = await request(app)
      .post("/api/categories")
      .send({ name: "Music" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("duplicate");
  });

  it("GET /api/categories should return all categories sorted by name", async () => {
    await Category.insertMany([
      { name: "Zebra" },
      { name: "Apple" },
      { name: "Music" },
    ]);

    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body.map((c: any) => c.name)).toEqual(["Apple", "Music", "Zebra"]);
  });
});
