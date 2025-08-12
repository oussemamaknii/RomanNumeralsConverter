"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../src/server");
describe("REST /api/convert", () => {
    const app = (0, server_1.createApp)();
    it("converts valid numbers", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/api/convert")
            .send({ number: 44 })
            .set("Content-Type", "application/json");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ number: 44, roman: "XLIV" });
    });
    it("rejects missing number", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/api/convert")
            .send({})
            .set("Content-Type", "application/json");
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/required/i);
    });
    it("rejects invalid number", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/api/convert")
            .send({ number: "abc" })
            .set("Content-Type", "application/json");
        expect(res.status).toBe(400);
    });
    it("rejects out of range", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/api/convert")
            .send({ number: 101 })
            .set("Content-Type", "application/json");
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/between 1 and 100/);
    });
});
// Basic SSE integration test: we simulate by hitting the endpoint and reading response text
// Supertest does not natively parse event-stream, so we assert response contains our JSON payload
describe("SSE /api/convert-sse/:number", () => {
    const app = (0, server_1.createApp)();
    it("returns one event then closes", async () => {
        const res = await (0, supertest_1.default)(app).get("/api/convert-sse/9");
        expect(res.status).toBe(200);
        expect(res.header["content-type"]).toContain("text/event-stream");
        expect(res.text).toContain("{\"number\":9,\"roman\":\"IX\"}");
    }, 10000);
    it("returns error for invalid input", async () => {
        const res = await (0, supertest_1.default)(app).get("/api/convert-sse/abc");
        expect(res.status).toBe(200);
        expect(res.text).toContain("error");
    }, 10000);
});
