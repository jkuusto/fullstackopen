import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { beforeEach, describe, vi } from "vitest";

describe("Blog component", () => {
  const blog = {
    title: "Title for Testing",
    author: "Test Author",
    url: "www.example.com",
    user: { username: "testuser", name: "Test User" },
    likes: "7",
  };
  const mockCurrentUser = { username: "testuser", name: "Test User" };
  let mockHandleLike;

  beforeEach(() => {
    mockHandleLike = vi.fn();
    render(
      <Blog
        blog={blog}
        currentUser={mockCurrentUser}
        handleLike={mockHandleLike}
        handleRemove={vi.fn()}
      />,
    );
  });

  test("renders title", async () => {
    const element = await screen.findByText("Title for Testing", {
      exact: false,
    });
    expect(element).toBeDefined();
  });

  test("shows url, likes, and user after clicking view button", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    expect(screen.getByText("www.example.com")).toBeDefined();
    expect(screen.getByText("likes 7", { exact: false })).toBeDefined();
    expect(screen.getByText("Test User")).toBeDefined();
  });

  test("calls handleLike twice when like button is pressed twice", async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandleLike.mock.calls).toHaveLength(2);
  });
});
