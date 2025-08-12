import request from "supertest";
import { createApp } from "../src/server";

describe("REST /api/convert", () => {
  const app = createApp();

  it("converts valid numbers", async () => {
    const res = await request(app)
      .post("/api/convert")
      .send({ number: 44 })
      .set("Content-Type", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ number: 44, roman: "XLIV" });
  });

  it("rejects missing number", async () => {
    const res = await request(app)
      .post("/api/convert")
      .send({})
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it("rejects invalid number", async () => {
    const res = await request(app)
      .post("/api/convert")
      .send({ number: "abc" })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
  });

  it("rejects out of range", async () => {
    const res = await request(app)
      .post("/api/convert")
      .send({ number: 101 })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/between 1 and 100/);
  });
});

// Basic SSE integration test: we simulate by hitting the endpoint and reading response text
// Supertest does not natively parse event-stream, so we assert response contains our JSON payload

// SSE tests removed: focusing on AJAX converter only for now.
