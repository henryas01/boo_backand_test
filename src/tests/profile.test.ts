import request from "supertest";
import app from "../app";
import { connectTestDB, disconnectTestDB, clearTestDB } from "./ulits/dbtesting";

beforeAll(async () => {
  await connectTestDB(); // start in-memory MongoDB
});

beforeEach(async () => {
  await clearTestDB();
  await request(app).post("/api/seed").send(); // seed MBTI, categories, etc.

});

afterAll(async () => {
  await disconnectTestDB(); // disconnect and stop MongoMemoryServer
});

describe("Profile API Tests", () => {
  it("should create a new profile", async () => {
    await request(app).post("/api/seed").send();
    const res = await request(app)
      .post("/api/profiles")
      .send({
        name: "Henry Smith",
        age: 25,
        bio: "Backend Engineer",
        image: "http://localhost:3000/images/avatar.jpg",
        selected_categories: ["Anime", "Music"], // names from seed
        mbti: "INTP", // code from seed
        instinctual_variant: "so/sp",
        tritype: "513",
        socionics: "ILE",
        big_five_sloan: "RCOEI",
        attitudinal_psyche: "VLFE",
        temperament: "phlegmatic",
      });

      // console.log('iniii', res.text);
      //  console.log('status', res.status);
      //  console.log('bodyyyy', res.body);


    expect(res.status).toBe(201);  // POST should return 201
    expect(res.body.name).toBe("Henry Smith");
    expect(res.body.selected_categories.map((c: any) => c.name))
      .toEqual(expect.arrayContaining(["Anime", "Music"]));
    expect(res.body.mbti.code).toBe("INTP");
    expect(res.body._id).toBeDefined();
  });

  it("should get all profiles", async () => {
    await request(app)
      .post("/api/profiles")
      .send({
        name: "Henry Smith",
        age: 25,
        bio: "Backend Engineer",
        image: "http://localhost:3000/images/avatar.jpg",
        selected_categories: ["Anime"],
        mbti: "INTP",
      });



    const res = await request(app).get("/api/profiles");

    expect(res?.status).toBe(200);  // GET all returns 200
    expect(res?.body).not.toBeNull();
    expect(res?.body.length).toBe(1);
    expect(res?.body[0].name).toBe("Henry Smith");
    expect(res?.body[0].selected_categories[0].name).toBe("Anime");
    expect(res?.body[0].mbti.code).toBe("INTP");
  });

  it("should get profile by ID", async () => {
    const createRes = await request(app)
      .post("/api/profiles")
      .send({
        name: "Henry Smith",
        age: 25,
        bio: "Backend Engineer",
        image: "http://localhost:3000/images/avatar.jpg",
        selected_categories: ["Anime"],
        mbti: "INTP",
      });

    const profileId = createRes.body._id;
    const res = await request(app).get(`/api/profiles/${profileId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(profileId);
    expect(res.body.selected_categories[0].name).toBe("Anime");
    expect(res.body.mbti.code).toBe("INTP");
  });

});