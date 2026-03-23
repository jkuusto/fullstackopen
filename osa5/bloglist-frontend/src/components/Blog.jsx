import { useState } from "react";

const Blog = ({ blog, handleLike, currentUser, handleRemove }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const buttonStyle = {
    marginLeft: 4,
  };

  if (!expanded) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleExpansion} style={buttonStyle}>
          view
        </button>
      </div>
    );
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleExpansion} style={buttonStyle}>
          hide
        </button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <button onClick={() => handleLike(blog.id)} style={buttonStyle}>
          like
        </button>
      </div>
      <div>{blog.user.name}</div>
      {blog.user.username === currentUser.username && (
        <button onClick={() => handleRemove(blog.id)} style={buttonStyle}>
          remove
        </button>
      )}
    </div>
  );
};

export default Blog;
