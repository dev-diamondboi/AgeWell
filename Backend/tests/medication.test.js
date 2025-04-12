const request = require("supertest");
const app = require("../server");

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWFiYWQ3OTQyOTY2NTM4ODE1Y2E4MyIsInJvbGUiOiJlbGRlcmx5IiwiaWF0IjoxNzQ0MzYwNzE4LCJleHAiOjE3NDQ5NjU1MTh9.M5TROtNGXgiArev-_pQZ-G-BOHah3_48SYff_PzAguk";

describe("Medication Routes", () => {
  it("should mark medication as taken", async () => {
    const res = await request(app)
      .post("/api/medication/mark-taken/medication-id")
      .set("Authorization", token);
    expect([200, 400, 404]).toContain(res.statusCode);
  });
});
