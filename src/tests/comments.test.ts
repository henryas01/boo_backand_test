import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { connectDB } from "../../src/utils/db";
import { CommentModel } from "../../src/models/comments/comment.model";

describe("Comments API", () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await CommentModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("GET /api/comments should return empty array initially", async () => {
    const res = await request(app).get("/api/comments");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("POST /api/comments should create a new comment", async () => {
    const res = await request(app)
      .post("/api/comments")
      .send({
        name: "John",
        title: "He’s definitely an INTP",
        system_type: "mbti",
        description: "Thoughtful and analytical",
        image: "http://localhost:3000/images/avatar1.jpg",
      });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toBe("John");
    expect(res.body.count_love).toBe(0);
    expect(res.body.image).toContain("/images/avatar1.jpg");
  });

  it("GET /api/comments should return created comments", async () => {
    await CommentModel.create({
      name: "Alice",
      title: "She is an ENFP",
      system_type: "mbti",
      description: "Creative and spontaneous",
      image: "http://localhost:3000/images/avatar1.jpg",
    });

    const res = await request(app).get("/api/comments");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Alice");
  });

  it("PATCH /api/comments/:id/like should increment and decrement count_love", async () => {
    const comment = await CommentModel.create({
      name: "Bob",
      title: "INTJ profile",
      system_type: "mbti",
      description: "Strategic thinker",
      image: "http://localhost:3000/images/avatar1.jpg",
    });

    // Like
    let res = await request(app).patch(`/api/comments/${comment._id}/like`).send({ action: "like" });
    expect(res.status).toBe(200);
    expect(res.body.count_love).toBe(1);

    // Unlike
    res = await request(app).patch(`/api/comments/${comment._id}/like`).send({ action: "unlike" });
    expect(res.status).toBe(200);
    expect(res.body.count_love).toBe(0);

    // Invalid action
    res = await request(app).patch(`/api/comments/${comment._id}/like`).send({ action: "invalid" });
    expect(res.status).toBe(400);
  });

  it("GET /api/comments with sort_by=best should sort by count_love", async () => {
    await CommentModel.insertMany([
      { name: "A", title: "T1", system_type: "mbti", description: "desc", count_love: 2, image: "" },
      { name: "B", title: "T2", system_type: "mbti", description: "desc", count_love: 5, image: "" },
      { name: "C", title: "T3", system_type: "mbti", description: "desc", count_love: 1, image: "" },
    ]);

    const res = await request(app).get("/api/comments?sort_by=best");
    expect(res.status).toBe(200);
    expect(res.body.map((c: any) => c.count_love)).toEqual([5, 2, 1]);
  });

  it("GET /api/comments with system_type filter should work", async () => {
    await CommentModel.insertMany([
      { name: "A", title: "T1", system_type: "mbti", description: "desc", image: "" },
      { name: "B", title: "T2", system_type: "enneagram", description: "desc", image: "" },
    ]);

    const res = await request(app).get("/api/comments?system_type=mbti");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].system_type).toBe("mbti");
  });
});
