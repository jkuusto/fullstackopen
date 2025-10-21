const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "HTML is easy",
    author: "John Doe",
    url: "http://example.com/html-is-easy",
    likes: 5,
  },
  {
    title: "CSS is hard",
    author: "Jane Smith",
    url: "http://example.com/css-is-hard",
    likes: 3,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, 2);
});

after(async () => {
  await mongoose.connection.close();
});
