import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { connectDB } from "../../src/utils/db";
import { Enneagram } from "../../src/models/enneagram/enneagram.model";

describe("Enneagram API", () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await Enneagram.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should get all enneagrams (empty at first)", async () => {
    const res = await request(app).get("/api/enneagram");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it("should create a new enneagram", async () => {
    const res = await request(app)
      .post("/api/enneagram")
      .send({ code: "9w3" });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.code).toBe("9w3");

    const dbItem = await Enneagram.findOne({ code: "9w3" });
    expect(dbItem).not.toBeNull();
  });

  it("should return 400 if code is missing", async () => {
    const res = await request(app).post("/api/enneagram").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("code is required");
  });

  it("should not allow duplicate codes", async () => {
    await Enneagram.create({ code: "7w6" });

    const res = await request(app)
      .post("/api/enneagram")
      .send({ code: "7w6" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("duplicate");
  });

  it("GET /api/enneagram should return sorted codes", async () => {
    await Enneagram.insertMany([{ code: "3w2" }, { code: "1w2" }, { code: "2w3" }]);

    const res = await request(app).get("/api/enneagram");

    expect(res.status).toBe(200);
    expect(res.body.map((e: any) => e.code)).toEqual(["1w2", "2w3", "3w2"]);
  });
});
