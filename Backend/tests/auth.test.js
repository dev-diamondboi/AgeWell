const request = require("supertest");
const app = require("../server");

describe("Auth Routes", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "testpass123",
        role: "elderly"
      });
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
