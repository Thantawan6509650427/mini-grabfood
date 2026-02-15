import request from "supertest";
import app from "../app.js";

describe("Restaurant API", () => {

  it("GET /health should return status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET unknown route should return 404", async () => {
    const res = await request(app).get("/unknown-route");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Route not found");
  });

});
