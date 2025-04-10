import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// // Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn();
  fetch.mockReset();
  window.history.pushState({}, "", "/");
});

const mockProducts = [
  { id: 1, title: "iPhone 12" },
  { id: 2, title: "Galaxy S21" },
];

describe("App Logic", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            products: [
              { id: 1, title: "Apple iPhone 13" },
              { id: 2, title: "Samsung Galaxy S21" },
              { id: 3, title: "Apple MacBook Air" },
            ],
          }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("handles page change", async () => {
    render(<App />);

    const searchInput = screen.getByLabelText(/search/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    fireEvent.change(searchInput, { target: { value: "Apple" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const pageButton = screen.getByRole("button", { name: "1" });
      expect(pageButton).toBeInTheDocument();
    });
  });

  it("shows no results when empty", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            products: [],
          }),
      })
    );

    render(<App />);

    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: "Nothing" } });

    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });
});
describe("App Component", () => {
  it("renders search input and button", () => {
    render(<App />);
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });
});
it("allows typing in search input", () => {
  render(<App />);
  const input = screen.getByLabelText(/search/i);
  fireEvent.change(input, { target: { value: "phone" } });
  expect(input.value).toBe("phone");
});
it("restores search on browser back button", async () => {
  fetch.mockResolvedValueOnce({
    json: async () => ({
      products: mockProducts,
      total: 2,
    }),
  });

  render(<App />);
  fireEvent.change(screen.getByLabelText(/search/i), {
    target: { value: "phone" },
  });
  fireEvent.click(screen.getByRole("button", { name: /search/i }));

  await waitFor(() => {
    expect(screen.getByText("iPhone 12")).toBeInTheDocument();
  });

  // Simulate user going back in browser
  window.history.pushState({}, "", "/?q=watch&page=1");

  fetch.mockResolvedValueOnce({
    json: async () => ({
      products: [{ id: 3, title: "Apple Watch" }],
      total: 1,
    }),
  });

  fireEvent.popState(window);

  await waitFor(() => {
    expect(screen.getByText("Apple Watch")).toBeInTheDocument();
  });
});
