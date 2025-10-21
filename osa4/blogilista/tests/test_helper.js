const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "HTML Tricks",
    author: "John Doe",
    url: "http://example.com/html-is-easy",
    likes: 1,
  },
  {
    title: "CSS Explained",
    author: "Jane Smith",
    url: "http://example.com/css-is-hard",
    likes: 1,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    url: "http://tempurl.com",
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((note) => note.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
