// Responsive search bar toggle and search functionality

document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector(".nav-search");
  const searchBar = document.querySelector(".nav-search-bar");
  const searchInput = document.querySelector(".search-input");
  const navRight = document.querySelector(".nav-right");

  if (navRight) navRight.style.position = "relative";

  // Only run search bar logic if searchBtn exists
  if (searchBtn && searchBar && searchInput) {
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

    // Toggle search bar (show/hide)
    let searchBarOpen = false;
    searchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      searchBarOpen = !searchBarOpen;
      searchBar.style.display = searchBarOpen ? "flex" : "none";
      if (searchBarOpen) {
        searchInput.focus();
      } else {
        searchMsg.textContent = "";
        dropdown.style.display = "none";
      }
    });

    // Hide on outside click
    document.addEventListener("click", (e) => {
      if (
        searchBarOpen &&
        !searchBar.contains(e.target) &&
        !searchBtn.contains(e.target)
      ) {
        searchBar.style.display = "none";
        searchMsg.textContent = "";
        dropdown.style.display = "none";
        searchBarOpen = false;
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

    // Move showDropdownResults here so it can access dropdown
    function showDropdownResults(query) {
      dropdown.innerHTML = "";
      const { els: productElements, type } = getProductElements();
      console.log(
        "[Search Debug] Query:",
        query,
        "| Type:",
        type,
        "| Product elements found:",
        productElements.length
      );
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
            <div class=\"dropdown-product-card\">\n              <div class=\"dropdown-product-img-wrap\">\n                <img src=\"${
              img?.src || ""
            }\" alt=\"${
            img?.alt || ""
          }\" />\n              </div>\n              <div class=\"dropdown-product-title\">${title}</div>\n              <div class=\"dropdown-product-price\">${price}</div>\n            </div>\n          `;
        }
      });
      console.log("[Search Debug] Matches found:", count);
      if (!count) {
        dropdown.innerHTML =
          "<div style='padding:12px;color:#888;'>No products found.</div>";
      }
      dropdown.style.display = "block";
    }
  }

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

  // Product modal logic (all products)
  const productModals = [
    {
      btnIndex: 0,
      modalId: "product-modal",
      qtyMinusId: "modal-qty-minus",
      qtyPlusId: "modal-qty-plus",
      qtyValueId: "modal-qty-value",
    },
    {
      btnIndex: 1,
      modalId: "product-modal-lemon-crepe",
      qtyMinusId: "modal-qty-minus-lemon-crepe",
      qtyPlusId: "modal-qty-plus-lemon-crepe",
      qtyValueId: "modal-qty-value-lemon-crepe",
    },
    {
      btnIndex: 2,
      modalId: "product-modal-lemon-cheesecake",
      qtyMinusId: "modal-qty-minus-lemon-cheesecake",
      qtyPlusId: "modal-qty-plus-lemon-cheesecake",
      qtyValueId: "modal-qty-value-lemon-cheesecake",
    },
    {
      btnIndex: 3,
      modalId: "product-modal-passionfruit-cake",
      qtyMinusId: "modal-qty-minus-passionfruit-cake",
      qtyPlusId: "modal-qty-plus-passionfruit-cake",
      qtyValueId: "modal-qty-value-passionfruit-cake",
    },
    {
      btnIndex: 4,
      modalId: "product-modal-rum-cake",
      qtyMinusId: "modal-qty-minus-rum-cake",
      qtyPlusId: "modal-qty-plus-rum-cake",
      qtyValueId: "modal-qty-value-rum-cake",
    },
    {
      btnIndex: 5,
      modalId: "product-modal-flan",
      qtyMinusId: "modal-qty-minus-flan",
      qtyPlusId: "modal-qty-plus-flan",
      qtyValueId: "modal-qty-value-flan",
    },
    {
      btnIndex: 6,
      modalId: "product-modal-hazelnut-cake",
      qtyMinusId: "modal-qty-minus-hazelnut-cake",
      qtyPlusId: "modal-qty-plus-hazelnut-cake",
      qtyValueId: "modal-qty-value-hazelnut-cake",
    },
    {
      btnIndex: 7,
      modalId: "product-modal-mouse-cake",
      qtyMinusId: "modal-qty-minus-mouse-cake",
      qtyPlusId: "modal-qty-plus-mouse-cake",
      qtyValueId: "modal-qty-value-mouse-cake",
    },
  ];
  const readMoreBtns = document.querySelectorAll(
    ".product-actions .button-secondary"
  );
  let openModal = null;
  function closeAnyModal() {
    if (openModal) {
      openModal.style.display = "none";
      document.body.style.overflow = "";
      openModal = null;
    }
  }
  productModals.forEach((prod, i) => {
    const btn = readMoreBtns[prod.btnIndex];
    const modal = document.getElementById(prod.modalId);
    if (!modal) return;
    const modalOverlay = modal.querySelector(".product-modal-overlay");
    const modalClose = modal.querySelector(".product-modal-close");
    // Desktop: open modal on button click
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        closeAnyModal();
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
        openModal = modal;
      });
    }
    // Mobile: open modal on product-row click
    if (window.matchMedia && window.matchMedia("(max-width: 480px)").matches) {
      const productRows = document.querySelectorAll(
        ".products-grid .product-row"
      );
      const row = productRows[prod.btnIndex];
      if (row) {
        row.addEventListener("click", function (e) {
          // Prevent double open if modal already open
          if (openModal === modal) return;
          closeAnyModal();
          modal.style.display = "flex";
          document.body.style.overflow = "hidden";
          openModal = modal;
        });
      }
    }
    function closeModal() {
      modal.style.display = "none";
      document.body.style.overflow = "";
      if (openModal === modal) openModal = null;
    }
    modalOverlay.addEventListener("click", closeModal);
    modalClose.addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) {
      if (modal.style.display === "flex" && e.key === "Escape") closeModal();
    });
    // Modal quantity selector logic
    const qtyMinus = document.getElementById(prod.qtyMinusId);
    const qtyPlus = document.getElementById(prod.qtyPlusId);
    const qtyValue = document.getElementById(prod.qtyValueId);
    let qty = 1;
    function updateQty() {
      qtyValue.textContent = qty;
    }
    if (qtyMinus && qtyPlus && qtyValue) {
      qtyMinus.addEventListener("click", function () {
        if (qty > 1) {
          qty--;
          updateQty();
        }
      });
      qtyPlus.addEventListener("click", function () {
        qty++;
        updateQty();
      });
    }
  });

  // Home page modal logic for best sellers
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    const homeProductModals = [
      {
        btnIndex: 0, // Chocolate Cake
        modalId: "product-modal",
        qtyMinusId: "modal-qty-minus",
        qtyPlusId: "modal-qty-plus",
        qtyValueId: "modal-qty-value",
      },
      {
        btnIndex: 1, // Lemon Crepe Cake
        modalId: "product-modal-lemon-crepe",
        qtyMinusId: "modal-qty-minus-lemon-crepe",
        qtyPlusId: "modal-qty-plus-lemon-crepe",
        qtyValueId: "modal-qty-value-lemon-crepe",
      },
      {
        btnIndex: 2, // Lemon Cheesecake
        modalId: "product-modal-lemon-cheesecake",
        qtyMinusId: "modal-qty-minus-lemon-cheesecake",
        qtyPlusId: "modal-qty-plus-lemon-cheesecake",
        qtyValueId: "modal-qty-value-lemon-cheesecake",
      },
      {
        btnIndex: 3, // Passionfruit Cake
        modalId: "product-modal-passionfruit-cake",
        qtyMinusId: "modal-qty-minus-passionfruit-cake",
        qtyPlusId: "modal-qty-plus-passionfruit-cake",
        qtyValueId: "modal-qty-value-passionfruit-cake",
      },
    ];
    const seeMoreBtns = document.querySelectorAll(
      ".best-seller-grid figure button"
    );
    let openModal = null;
    function closeAnyModal() {
      if (openModal) {
        openModal.style.display = "none";
        document.body.style.overflow = "";
        openModal = null;
      }
    }
    homeProductModals.forEach((prod, i) => {
      const btn = seeMoreBtns[prod.btnIndex];
      const modal = document.getElementById(prod.modalId);
      if (!btn || !modal) return;
      const modalOverlay = modal.querySelector(".product-modal-overlay");
      const modalClose = modal.querySelector(".product-modal-close");
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        closeAnyModal();
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
        openModal = modal;
      });
      function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "";
        if (openModal === modal) openModal = null;
      }
      modalOverlay.addEventListener("click", closeModal);
      modalClose.addEventListener("click", closeModal);
      document.addEventListener("keydown", function (e) {
        if (modal.style.display === "flex" && e.key === "Escape") closeModal();
      });
      // Modal quantity selector logic
      const qtyMinus = document.getElementById(prod.qtyMinusId);
      const qtyPlus = document.getElementById(prod.qtyPlusId);
      const qtyValue = document.getElementById(prod.qtyValueId);
      let qty = 1;
      function updateQty() {
        qtyValue.textContent = qty;
      }
      if (qtyMinus && qtyPlus && qtyValue) {
        qtyMinus.addEventListener("click", function () {
          if (qty > 1) {
            qty--;
            updateQty();
          }
        });
        qtyPlus.addEventListener("click", function () {
          qty++;
          updateQty();
        });
      }
    });
  }

  const hamburger = document.querySelector(".nav-hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("active")
        ? "hidden"
        : "";
    });
    // Optional: close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
    // Close menu when clicking outside nav-links
    document.addEventListener("click", function (e) {
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
});
//end of search bar

// Payment form validation for checkout.html
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("payment-form");
    if (!form) return;
    const requiredFields = [
      { id: "first-name", regex: /^[A-Za-z\s'-]+$/ },
      { id: "last-name", regex: /^[A-Za-z\s'-]+$/ },
      { id: "email", regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      { id: "phone", regex: /^[0-9\s()+-]{7,}$/ },
      { id: "card-number", regex: /^\d{4} \d{4} \d{4} \d{4}$/ },
      { id: "cardholder", regex: /^[A-Za-z\s'-]+$/ },
      { id: "expiry", regex: /^(0[1-9]|1[0-2])\/(\d{2})$/ },
      { id: "cvc", regex: /^\d{3}$/ },
    ];
    const terms = document.getElementById("terms");

    // Immediate feedback on input
    requiredFields.forEach((field) => {
      const input = document.getElementById(field.id);
      input.addEventListener("input", function () {
        if (!field.regex.test(input.value.trim())) {
          input.classList.add("input-error");
        } else {
          input.classList.remove("input-error");
        }
      });
    });
    if (terms) {
      terms.addEventListener("change", function () {
        if (!terms.checked) {
          terms.classList.add("input-error");
        } else {
          terms.classList.remove("input-error");
        }
      });
    }

    form.addEventListener("submit", function (e) {
      let valid = true;
      requiredFields.forEach((field) => {
        const input = document.getElementById(field.id);
        if (!input.value.trim() || !field.regex.test(input.value.trim())) {
          input.classList.add("input-error");
          valid = false;
        } else {
          input.classList.remove("input-error");
        }
      });
      if (!terms.checked) {
        terms.classList.add("input-error");
        terms.focus();
        valid = false;
      } else {
        terms.classList.remove("input-error");
      }
      e.preventDefault();
      if (valid) {
        window.location.href = "confirmation.html";
      }
    });

    // Card number auto-formatting (groups of 4)
    const cardNumberInput = document.getElementById("card-number");
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", function (e) {
        let value = cardNumberInput.value.replace(/\D/g, "");
        value = value.substring(0, 16); // max 16 digits
        let formatted = value.replace(/(.{4})/g, "$1 ").trim();
        cardNumberInput.value = formatted;
      });
    }

    // Expiry auto-formatting (MM/YY)
    const expiryInput = document.getElementById("expiry");
    if (expiryInput) {
      expiryInput.addEventListener("input", function (e) {
        let value = expiryInput.value.replace(/[^\d]/g, "");
        if (value.length > 4) value = value.substring(0, 4);
        if (value.length > 2) {
          value = value.substring(0, 2) + "/" + value.substring(2);
        }
        expiryInput.value = value;
      });
    }
  });
})();
