import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import "./App.css";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q") || "";
  const initialPage = parseInt(urlParams.get("page")) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const no_Of_pages = Math.ceil(totalResults / 10);

  /*---Fetch data from dummyJson search API ------*/

  const fetchData = async (q, page) => {
    setLoading(true);
    try {
      let url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
        q
      )}&limit=200`;

      const res = await fetch(url);
      const data = await res.json();
      const filteredProducts = data.products.filter((product) =>
        product.title.toLowerCase().includes(q.toLowerCase())
      );
      const products = filteredProducts || [];

      setResults(filteredProducts.slice((page - 1) * 10, page * 10));
      setTotalResults(products.length);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };
  /*------ Update the URL according to the current page ------*/
  const updateURL = (q, page) => {
    const newUrl = `?q=${encodeURIComponent(q)}&page=${page}`;
    window.history.pushState({ q, page }, "", newUrl);
  };

  /*-- Function to search data from API,it sets the current page,fetch data and updates URL ------*/
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    updateURL(query, 1);
    fetchData(query, 1);
  };
  /* This function clears the query , resets the current page ,updates the URL and fetch all data"----*/
  const handleClear = () => {
    setQuery("");
    setCurrentPage(1);
    updateURL("", 1);
    fetchData("", 1);
  };

  /*This function handles Page change and updates the data accordingly ------*/
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL(query, page);
    fetchData(query, page);
  };
  useEffect(() => {
    fetchData(query, currentPage);

    window.onpopstate = (event) => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
      const page = parseInt(params.get("page")) || 1;

      setQuery(q);
      setCurrentPage(page);
      fetchData(q, page);
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Product Search</h1>
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: 10, marginBottom: 20 }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button variant="contained" color="primary" type="submit">
          Search
        </Button>
      </form>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : results.length > 0 ? (
        <>
          <ul>
            {results.map((product) => (
              <li key={product.id}>{product.title}</li>
            ))}
          </ul>

          <div className="pagination-container">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              {"<"}
            </button>
            {[...Array(no_Of_pages).keys()].map((n) => (
              <button
                className={
                  "page_no " + (n + 1 === currentPage ? "active" : " ")
                }
                key={n + 1}
                onClick={() => handlePageChange(n + 1)}
              >
                {n + 1}
              </button>
            ))}
            <button
              disabled={currentPage === no_Of_pages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              {">"}
            </button>
          </div>
        </>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default App;
