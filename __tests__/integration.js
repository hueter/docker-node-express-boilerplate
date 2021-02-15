/**
 * These tests currently only work if you have a local MongoDB database
 */
const app = require("../app/app");
const request = require("supertest");
const mongoose = require("mongoose");

let { Thing } = require("../app/models");
let exampleThing = {
  name: "Example",
  number: 5,
  stuff: ["cats", "dogs"],
  url: "https://google.com"
};

beforeEach(async () => {
  const testThing = new Thing(exampleThing);
  await testThing.save();
});

afterEach(async () => {
  await mongoose.connection.dropCollection("things");
});

afterAll(async () => {
  // CLEAN UP
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("GET /things", () => {
  test("Get a list of things", async () => {
    let response = await request(app).get("/things");
    expect(response.body).toEqual([exampleThing]);
  });
});

describe("POST /things", () => {
  test("Create a mini new Thing", async () => {
    let response = await request(app)
      .post("/things")
      .send({ name: "A Thing" });
    expect(response.body).toEqual({ name: "A Thing", stuff: [] });
  });
  test("Create a full new Thing", async () => {
    const fullThing = {
      name: "Other Thing",
      stuff: ["cats", "dogs"],
      number: 5,
      url: "http://google.com"
    };
    let response = await request(app)
      .post("/things")
      .send(fullThing);
    expect(response.body).toEqual(fullThing);

    let duplicateResponse = await request(app)
      .post("/things")
      .send({ name: "Other Thing" });
    expect(duplicateResponse.status).toEqual(409);
  });
});

describe("PATCH /things/:name", () => {
  test("Update a thing's name", async () => {
    let response = await request(app)
      .patch("/things/Example")
      .send({ name: "New Name" });
    expect(response.body).toEqual({ ...exampleThing, name: "New Name" });
  });
});

describe("DELETE /things/:name", () => {
  test("Delete a thing name", async () => {
    let response = await request(app).delete("/things/Example");
    expect(response.body).toEqual(exampleThing);
  });
});
