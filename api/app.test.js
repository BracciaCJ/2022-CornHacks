const request = require("supertest");
const app = require("./app");
jest.setTimeout(30000);
describe("GET / ", () => {
  test("It should respond with an error stating url was not defined", async () => {
    // Ensure that when a URL is not passed that the API returns a JSON object with an error field.
    // Also ensures that the error string is as expected per the app.js
    const response = await request(app).get("/");
    expect(response.body['issues']).toBeUndefined();
    expect(response.body['error']).toBe('Failed to read URL from string');
    expect(response.statusCode).toBe(200);
  });
});
describe("GET different testing urls", () => {
  test("It should respond with a score when passing google.come ", async () => {
    const response = await request(app).get("/?url=google.com");
    expect(response.body['issues']).toBeUndefined();
    // This site's score may change over time.
    expect(response.body['totalScore']).toBeDefined();
    expect(response.statusCode).toBe(200);
  });
});