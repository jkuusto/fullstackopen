const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("returned blogs format _id property as id", async () => {
  const response = await api.get("/api/blogs");

  const blog = response.body[0];
  assert.ok(blog.id);
  assert.match(blog.id, /^[a-f0-9]{24}$/);
  assert.strictEqual(blog._id, undefined);
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "How to Add a Blog to a Blog List",
    author: "John Blogger",
    url: "http://example.com/how-to-add-blog",
    likes: 1,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((n) => n.title);
  assert(titles.includes("How to Add a Blog to a Blog List"));
});

test("blog without likes value defaults to 0", async () => {
  const newBlog = {
    title: "Nobody Likes This",
    author: "Unlikable Author",
    url: "http://example.com/no-likes",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const addedBlog = blogsAtEnd.find((b) => b.title === "Nobody Likes This");
  assert.strictEqual(addedBlog.likes, 0);
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "John Blogger",
    url: "http://example.com/how-to-add-blog",
    likes: 1,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("blog without url is not added", async () => {
  const newBlog = {
    title: "How to Add a Blog to a Blog List",
    author: "John Blogger",
    likes: 1,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
