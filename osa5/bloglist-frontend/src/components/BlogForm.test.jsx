import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const user = userEvent.setup();
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByLabelText("title:");
  const authorInput = screen.getByLabelText("author:");
  const urlInput = screen.getByLabelText("url:");
  const sendButton = screen.getByText("create");

  await user.type(titleInput, "Title for Testing");
  await user.type(authorInput, "Test Author");
  await user.type(urlInput, "www.example.com");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Title for Testing");
  expect(createBlog.mock.calls[0][0].author).toBe("Test Author");
  expect(createBlog.mock.calls[0][0].url).toBe("www.example.com");
});
