import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn();
  fetch.mockReset();
  window.history.pushState({}, "", "/");
});

const mockProducts = [
  { id: 1, title: "iPhone 12" },
  { id: 2, title: "Galaxy S21" },
];

describe("App Component", () => {
  it("renders search input and button", () => {
    render(<App />);
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("allows typing in search input", () => {
    render(<App />);
    const input = screen.getByLabelText(/search/i);
    fireEvent.change(input, { target: { value: "phone" } });
    expect(input.value).toBe("phone");
  });

  it("shows 'No results found' if empty result", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        products: [],
        total: 0,
      }),
    });

    render(<App />);
    fireEvent.change(screen.getByLabelText(/search/i), {
      target: { value: "nonexistent" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  it("updates URL on search", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        products: mockProducts,
        total: 2,
      }),
    });

    render(<App />);
    const input = screen.getByLabelText(/search/i);
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "laptop" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.location.search).toContain("q=laptop");
      expect(window.location.search).toContain("page=1");
    });
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

  it("shows loading spinner while fetching", async () => {
    let resolveFetch;
    fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<App />);
    fireEvent.change(screen.getByLabelText(/search/i), {
      target: { value: "phone" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Finish fetch
    resolveFetch({
      json: async () => ({
        products: mockProducts,
        total: 2,
      }),
    });

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });
});
