const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;
  if (!request.token) {
    return response.status(401).json({ error: "token missing" });
  }
  if (!user) {
    return response.status(400).json({ error: "userId missing or invalid" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes || 0,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const user = request.user;
  if (!request.token) {
    return response.status(401).json({ error: "token missing" });
  }
  if (!user) {
    return response.status(400).json({ error: "userId missing or invalid" });
  }
  if (!blog) {
    return response.status(204).end();
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(401)
      .json({ error: "you are not authorized to delete this blog" });
  }
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).end();
  }
  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes;

  const updatedBlog = await blog.save();
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
