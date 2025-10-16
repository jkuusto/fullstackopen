const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce(
    (fav, blog) => (blog.likes > fav.likes ? blog : fav),
    blogs[0]
  );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const blogCount = _.countBy(blogs, "author");

  const mostBlogsAuthor = Object.keys(blogCount).reduce((max, author) => {
    return blogCount[author] > blogCount[max] ? author : max;
  });

  return {
    author: mostBlogsAuthor,
    blogs: blogCount[mostBlogsAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const blogsByAuthor = _.groupBy(blogs, "author");

  const likesByAuthor = _.mapValues(blogsByAuthor, (authorBlogs) => {
    return authorBlogs.reduce((sum, blog) => sum + blog.likes, 0);
  });

  const mostLikesAuthor = Object.keys(likesByAuthor).reduce((max, author) => {
    return likesByAuthor[author] > likesByAuthor[max] ? author : max;
  });

  return {
    author: mostLikesAuthor,
    likes: likesByAuthor[mostLikesAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
