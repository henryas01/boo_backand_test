import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { connectDB } from "../../src/utils/db";
import { Mbti } from "../../src/models/mbti/mbti.model";

describe("MBTI API", () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await Mbti.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should get all MBTI (empty at first)", async () => {
    const res = await request(app).get("/api/mbti");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("should create a new MBTI", async () => {
    const res = await request(app).post("/api/mbti").send({ code: "INTP" });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.code).toBe("INTP");

    const dbItem = await Mbti.findOne({ code: "INTP" });
    expect(dbItem).not.toBeNull();
  });

  it("should return 400 if code is missing", async () => {
    const res = await request(app).post("/api/mbti").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("code is required");
  });

  it("should not allow duplicate MBTI codes", async () => {
    await Mbti.create({ code: "INFJ" });

    const res = await request(app).post("/api/mbti").send({ code: "INFJ" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("duplicate");
  });

  it("GET /api/mbti should return sorted codes", async () => {
    await Mbti.insertMany([{ code: "ENFP" }, { code: "INTJ" }, { code: "ISFJ" }]);

    const res = await request(app).get("/api/mbti");

    expect(res.status).toBe(200);
    expect(res.body.map((m: any) => m.code)).toEqual(["ENFP", "INTJ", "ISFJ"]);
  });
});
