const request = require("supertest");
const app = require("../server");

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWFiYWQ3OTQyOTY2NTM4ODE1Y2E4MyIsInJvbGUiOiJlbGRlcmx5IiwiaWF0IjoxNzQ0MzYwNzE4LCJleHAiOjE3NDQ5NjU1MTh9.M5TROtNGXgiArev-_pQZ-G-BOHah3_48SYff_PzAguk";

describe("Notification Routes", () => {
  it("should mark notification as read", async () => {
    const res = await request(app)
      .post("/api/notifications/mark-read/67eabad7942966538815ca83")
      .set("Authorization", token);
    expect(res.statusCode).toBe(200);
  });
});
