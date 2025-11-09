import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { connectDB } from "../../src/utils/db";
import { Zodiac } from "../../src/models/zodiacs/zodiac.model";

describe("Zodiac API", () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await Zodiac.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should get all zodiac (empty at first)", async () => {
    const res = await request(app).get("/api/zodiac");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("should create a new zodiac", async () => {
    const res = await request(app)
      .post("/api/zodiac")
      .send({ name: "Aries" });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toBe("Aries");

    const dbItem = await Zodiac.findOne({ name: "Aries" });
    expect(dbItem).not.toBeNull();
  });

  it("should return 400 if name is missing", async () => {
    const res = await request(app).post("/api/zodiac").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("name is required");
  });

  it("GET /api/zodiac should return sorted names", async () => {
    await Zodiac.insertMany([{ name: "Cancer" }, { name: "Aries" }, { name: "Libra" }]);

    const res = await request(app).get("/api/zodiac");

    expect(res.status).toBe(200);
    expect(res.body.map((z: any) => z.name)).toEqual(["Aries", "Cancer", "Libra"]);
  });
});
