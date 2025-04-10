![alt text](<Screenshot 2025-04-10 at 8.54.41 PM.png>) ![alt text](<Screenshot 2025-04-10 at 8.54.48 PM.png>) ![alt text](<Screenshot 2025-04-10 at 8.54.58 PM.png>)
🌟 ## What This App Does:
It lets users search products (from a fake online API).

It shows matching products with pagination (10 products per page).

Clearing the search resets everything.

URL changes based on your search and page.

Browser back/forward buttons also work properly.

🛠️ ## How It Works:

1. Setting Initial State:

```
const initialQuery = urlParams.get("q") || "";
const initialPage = parseInt(urlParams.get("page")) || 1;
```

Reads the query and page number from the URL when the page first loads.

If nothing is there, starts fresh.

2. States:
```
const [query, setQuery] = useState(initialQuery);
const [currentPage, setCurrentPage] = useState(initialPage);
const [results, setResults] = useState([]);
const [totalResults, setTotalResults] = useState(0);
const [loading, setLoading] = useState(false);
```


Keeps track of:

What the user is typing (query)

Which page they're on (currentPage)

List of products found (results)

Total number of results (totalResults)

If data is still loading (loading)

3. Fetching Products:

const fetchData = async (q, page) => { ... }

Calls a fake API.

Filters products by search term.

Slices the results for the current page (10 products per page).

4. Updating the URL:
   javascript
   Copy
   Edit
   const updateURL = (q, page) => { ... }
   Changes the URL when you search or move between pages.

Example: ?q=phone&page=2

Helps with bookmarking or sharing.

5. Handling User Actions:
   Search:

handleSearch submits the form.

Updates the page to 1.

Updates the URL and fetches new results.

Clear:

handleClear empties the search box.

Resets everything.

Pagination (Page Change):

handlePageChange moves you to a new page and fetches that page's results.

Back/Forward Buttons:

javascript
Copy
Edit
window.onpopstate = (event) => { ... }

Detects when users click the browser's Back or Forward.

Updates the page and search automatically based on URL

6. UI Components:
   Search Bar with a Clear (X) button inside it.

Loading Spinner when data is being fetched.

List of Products (if any found).

Pagination Controls (Prev ⬅️, Page Numbers, Next ➡️).

No results message if nothing matches.

Tests

Test Simple Meaning

1. Handles page change - After typing a search and clicking the search button, it checks if page numbers (pagination) appear.
2. Shows no results when empty - If no products are found (empty result from API), it should display “No results found.”
3. Renders search input and button- Checks if the search input box and the search button are on the screen when the app first loads.
4. Allows typing in search input - Makes sure when a user types something into the search box, the text appears correctly.
5. Restores search on browser back button - Tests that if the user presses the browser back button, the app updates the search and shows new results properly (simulates going back in history).

In short:
👉 The tests check that the search bar works, results show correctly, empty search is handled, typing is allowed, pagination shows up, and the app handles browser navigation properly.
