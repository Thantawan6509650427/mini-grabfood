import request from "supertest";
import app from "../app.js";

describe("App basic routes", () => {

  it("GET /health should return ok", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("Unknown route should return 404", async () => {
    const res = await request(app).get("/some-random-route");

    expect(res.statusCode).toBe(404);
  });

});
