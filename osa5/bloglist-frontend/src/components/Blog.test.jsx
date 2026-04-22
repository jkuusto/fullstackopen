import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "Title testing",
    url: "www.example.com",
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText("Title testing");
  expect(element).toBeDefined();
});
