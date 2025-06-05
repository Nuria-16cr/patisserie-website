// Responsive search bar toggle and search functionality

document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector(".nav-search");
  const searchBar = document.querySelector(".nav-search-bar");
  const searchInput = document.querySelector(".search-input");
  const searchForm = document.querySelector(".nav-search-bar");
  const navRight = document.querySelector(".nav-right");

  // Ensure nav-right is position: relative for absolute positioning inside
  if (navRight) {
    navRight.style.position = "relative";
  }

  // Add a message element for feedback (inside the search bar)
  let searchMsg = document.createElement("div");
  searchMsg.className = "search-message";
  searchMsg.style.margin = "4px 0 0 0";
  searchMsg.style.color = "red";
  searchMsg.style.fontSize = "0.9em";
  searchBar.appendChild(searchMsg);

  // Dropdown for search results (append as child of searchBar)
  let dropdown = document.createElement("div");
  dropdown.className = "search-dropdown";
  dropdown.style.display = "none";
  searchBar.appendChild(dropdown);

  // Toggle search bar visibility
  searchBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    searchBar.style.display = "flex";
    searchInput.focus();
  });

  // Hide search bar and dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!searchBar.contains(e.target) && !searchBtn.contains(e.target)) {
      searchBar.style.display = "none";
      searchMsg.textContent = "";
      dropdown.style.display = "none";
    }
  });

  // Show dropdown results as user types
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim().toLowerCase();
    showDropdownResults(query);
    searchMsg.textContent = "";
  });

  // Also show dropdown on submit (for enter key)
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    showDropdownResults(query);
    if (!query) {
      searchMsg.textContent = "";
    } else if (dropdown.innerHTML === "") {
      searchMsg.textContent = "No products found.";
    } else {
      searchMsg.textContent = "";
    }
  });

  function showDropdownResults(query) {
    dropdown.innerHTML = "";
    // Try to find products in .best-seller-grid (Home) or .products-grid .product-row (Products)
    let productElements = Array.from(
      document.querySelectorAll(".best-seller-grid figure")
    );
    if (productElements.length === 0) {
      // Try .product-row for Products page
      productElements = Array.from(
        document.querySelectorAll(".products-grid .product-row")
      );
    }
    if (productElements.length === 0) {
      // No products on this page
      dropdown.innerHTML =
        "<div style='padding: 12px; color: #888;'>No products to search on this page.</div>";
      dropdown.style.display = "block";
      return;
    }
    if (!query) {
      dropdown.style.display = "none";
      return;
    }
    let found = false;
    productElements.forEach((el) => {
      let text = "";
      let img = null,
        title = "",
        price = "";
      // Home page product card
      if (el.matches("figure")) {
        text = el.textContent.toLowerCase();
        img = el.querySelector("img");
        const t = el.querySelector(".figcaption-title-row strong:first-child");
        const p = el.querySelector(".figcaption-title-row strong:last-child");
        title = t ? t.textContent : "";
        price = p ? p.textContent : "";
      } else {
        // Products page .product-row
        text = el.textContent.toLowerCase();
        img = el.querySelector("img");
        const t = el.querySelector(".product-header-row h2");
        const p = el.querySelector(".product-header-row .product-price");
        title = t ? t.textContent : "";
        price = p ? p.textContent : "";
      }
      if (text.includes(query)) {
        found = true;
        const card = document.createElement("div");
        card.className = "dropdown-product-card";
        card.innerHTML = `
          <div class="dropdown-product-img-wrap">
            <img src="${img ? img.src : ""}" alt="${img ? img.alt : ""}" />
          </div>
          <div class="dropdown-product-title">${title}</div>
          <div class="dropdown-product-price">${price}</div>
        `;
        dropdown.appendChild(card);
      }
    });
    dropdown.style.display = found ? "block" : "none";
    if (!found) {
      dropdown.innerHTML =
        "<div style='padding: 12px; color: #888;'>No products found.</div>";
      dropdown.style.display = "block";
    }
  }
});
