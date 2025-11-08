const assert = require("node:assert");
const bcrypt = require("bcrypt");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

describe("when there are initially some blogs saved", () => {
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

  test("blogs format _id property as id", async () => {
    const response = await api.get("/api/blogs");

    const blog = response.body[0];
    assert.ok(blog.id);
    assert.match(blog.id, /^[a-f0-9]{24}$/);
    assert.strictEqual(blog._id, undefined);
  });

  describe("viewing a specific blog", () => {
    test("succeeds with a valid id", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    });

    test("fails with status code 404 if blog does not exist", async () => {
      const nonexistingId = await helper.nonExistingId();

      await api.get(`/api/blogs/${nonexistingId}`).expect(404);
    });

    test("fails with status code 400 if id is invalid", async () => {
      const invalidId = "6b4e6fb60181192b93b4556";

      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new blog", () => {
    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash("password123", 10);
      const user = new User({ username: "root", passwordHash });
      await user.save();

      const loginResponse = await api
        .post("/api/login")
        .send({ username: "root", password: "password123" });

      token = loginResponse.body.token;
    });

    test("succeeds with valid data", async () => {
      const newBlog = {
        title: "How to Add a Blog to a Blog List",
        author: "John Blogger",
        url: "http://example.com/how-to-add-blog",
        likes: 1,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const titles = blogsAtEnd.map((n) => n.title);
      assert(titles.includes("How to Add a Blog to a Blog List"));
    });

    test("no likes data defaults to 0 likes", async () => {
      const newBlog = {
        title: "Nobody Likes This",
        author: "Unlikable Author",
        url: "http://example.com/no-likes",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const addedBlog = blogsAtEnd.find((b) => b.title === "Nobody Likes This");
      assert.strictEqual(addedBlog.likes, 0);
    });

    test("fails with status code 400 if title is not included", async () => {
      const newBlog = {
        author: "John Blogger",
        url: "http://example.com/how-to-add-blog",
        likes: 1,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test("fails with status code 400 if url is not included", async () => {
      const newBlog = {
        title: "How to Add a Blog to a Blog List",
        author: "John Blogger",
        likes: 1,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deletion of a blog", () => {
    beforeEach(async () => {
      await User.deleteMany({});
      await Blog.deleteMany({});

      const passwordHash = await bcrypt.hash("password123", 10);
      const user = new User({ username: "root", passwordHash });
      await user.save();

      const loginResponse = await api
        .post("/api/login")
        .send({ username: "root", password: "password123" });

      token = loginResponse.body.token;

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Delete This Blog",
          author: "John Doe",
          url: "http://example.com/delete-this-blog",
          likes: 1,
        });

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Just Another Blog",
          author: "Jane Smith",
          url: "http://example.com/just-another-blog",
          likes: 1,
        });
    });

    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const ids = blogsAtEnd.map((n) => n.id);
      assert(!ids.includes(blogToDelete.id));

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    });

    test("succeeds with status code 204 if blog is already deleted", async () => {
      const nonexistingId = await helper.nonExistingId();

      await api
        .delete(`/api/blogs/${nonexistingId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);
    });

    test("fails with status code 400 if id is invalid", async () => {
      const invalidId = "6b4e6fb60181192b93b4556";

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });

  describe("editing a blog", () => {
    test("changing url succeeds with status code 200", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToEdit = blogsAtStart[0];

      const newUrl = "http://example.com/updated-url";
      const editedBlog = {
        ...blogToEdit,
        url: newUrl,
      };

      await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(editedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlog = blogsAtEnd.find((b) => b.id === blogToEdit.id);

      assert.strictEqual(updatedBlog.url, newUrl);
    });

    test("adding a like succeeds with status code 200", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToEdit = blogsAtStart[0];

      const editedBlog = {
        ...blogToEdit,
        likes: blogToEdit.likes + 1,
      };

      await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(editedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlog = blogsAtEnd.find((b) => b.id === blogToEdit.id);

      assert.strictEqual(updatedBlog.likes, 2);
    });

    test("fails with status code 404 if blog does not exist", async () => {
      const nonexistingId = await helper.nonExistingId();

      const editedBlog = {
        title: "Non-existing Blog",
        url: "http://example.com/non-existing",
      };

      await api.put(`/api/blogs/${nonexistingId}`).send(editedBlog).expect(404);
    });

    test("fails with status code 400 if id is invalid", async () => {
      const invalidId = "6b4e6fb60181192b93b4556";

      const editedBlog = {
        title: "Non-existing Blog",
        url: "http://example.com/non-existing",
      };

      await api.put(`/api/blogs/${invalidId}`).send(editedBlog).expect(400);
    });
  });

  describe("when there is initially one user at db", () => {
    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash("password123", 10);
      const user = new User({ username: "root", passwordHash });

      await user.save();
    });

    test("creation succeeds with a fresh username", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "mmeikalai",
        name: "Matti Meikäläinen",
        password: "password123",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      assert(usernames.includes(newUser.username));
    });

    test("creation fails with proper statuscode and message if username already taken", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        name: "Superuser",
        password: "password123",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes("expected `username` to be unique"));

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if username too short", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "ro",
        name: "Superuser",
        password: "password123",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes("username must be at least 3 characters")
      );

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if username missing", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        name: "Superuser",
        password: "password123",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes("username required"));

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if password too short", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        name: "Superuser",
        password: "pa",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes("password must be at least 3 characters")
      );

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if password missing", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        name: "Superuser",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes("password required"));

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
