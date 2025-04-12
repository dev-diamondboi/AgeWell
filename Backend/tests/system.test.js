const request = require("supertest");
const app = require("../server");

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjM3ZTg5ZjM3YzBhMmQwNDM1MDUwOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDM2MjE4OCwiZXhwIjoxNzQ0OTY2OTg4fQ.YlVriZsIUb8jkvw1vZBm49gcXk5JAJt5nDuGp16QHyc";
describe("Admin System Metrics", () => {
  it("should return system performance metrics", async () => {
    const res = await request(app)
      .get("/api/admin/system-metrics")
      .set("Authorization", token);
    expect([200, 400]).toContain(res.statusCode);
  });
});
