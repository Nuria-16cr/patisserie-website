// Responsive search bar toggle and search functionality

document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector(".nav-search");
  const searchBar = document.querySelector(".nav-search-bar");
  const searchInput = document.querySelector(".search-input");
  const navRight = document.querySelector(".nav-right");

  if (navRight) navRight.style.position = "relative";

  // Feedback message
  const searchMsg = Object.assign(document.createElement("div"), {
    className: "search-message",
    style: "margin:4px 0 0 0;color:red;font-size:0.9em;",
  });
  searchBar.appendChild(searchMsg);

  // Dropdown for search results
  const dropdown = Object.assign(document.createElement("div"), {
    className: "search-dropdown",
    style: "display:none;",
  });
  searchBar.appendChild(dropdown);

  // Toggle search bar
  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchBar.style.display = "flex";
    searchInput.focus();
  });

  // Hide on outside click
  document.addEventListener("click", (e) => {
    if (!searchBar.contains(e.target) && !searchBtn.contains(e.target)) {
      searchBar.style.display = "none";
      searchMsg.textContent = "";
      dropdown.style.display = "none";
    }
  });

  // Show dropdown as user types
  searchInput.addEventListener("input", () => {
    showDropdownResults(searchInput.value.trim().toLowerCase());
    searchMsg.textContent = "";
  });

  // Show dropdown on submit
  searchBar.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    showDropdownResults(query);
    searchMsg.textContent = !query
      ? ""
      : dropdown.innerHTML === ""
      ? "No products found."
      : "";
  });

  function getProductElements() {
    let els = Array.from(document.querySelectorAll(".best-seller-grid figure"));
    if (els.length) return { els, type: "home" };
    els = Array.from(document.querySelectorAll(".products-grid .product-row"));
    return { els, type: "products" };
  }

  function extractProductInfo(el, type) {
    if (type === "home") {
      return {
        img: el.querySelector("img"),
        title:
          el.querySelector(".figcaption-title-row strong:first-child")
            ?.textContent || "",
        price:
          el.querySelector(".figcaption-title-row strong:last-child")
            ?.textContent || "",
        text: el.textContent.toLowerCase(),
      };
    } else {
      return {
        img: el.querySelector("img"),
        title: el.querySelector(".product-header-row h2")?.textContent || "",
        price:
          el.querySelector(".product-header-row .product-price")?.textContent ||
          "",
        text: el.textContent.toLowerCase(),
      };
    }
  }

  function showDropdownResults(query) {
    dropdown.innerHTML = "";
    const { els: productElements, type } = getProductElements();
    if (!productElements.length) {
      dropdown.innerHTML =
        "<div style='padding:12px;color:#888;'>No products to search on this page.</div>";
      dropdown.style.display = "block";
      return;
    }
    if (!query) {
      dropdown.style.display = "none";
      return;
    }
    let count = 0;
    productElements.forEach((el) => {
      const { img, title, price, text } = extractProductInfo(el, type);
      if (text.includes(query)) {
        count++;
        dropdown.innerHTML += `
          <div class="dropdown-product-card">
            <div class="dropdown-product-img-wrap">
              <img src="${img?.src || ""}" alt="${img?.alt || ""}" />
            </div>
            <div class="dropdown-product-title">${title}</div>
            <div class="dropdown-product-price">${price}</div>
          </div>
        `;
      }
    });
    if (!count) {
      dropdown.innerHTML =
        "<div style='padding:12px;color:#888;'>No products found.</div>";
    }
    dropdown.style.display = "block";
  }
});
