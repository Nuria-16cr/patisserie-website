// Responsive Cart Logic for La Maison Patisserie
// All cart state is stored in localStorage under 'cartItems'.
// This script is loaded on all relevant pages.

(function () {
  // --- Cart Data Management ---
  const CART_KEY = "cartItems";

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
  }

  function findCartItem(cart, name) {
    return cart.find((item) => item.name === name);
  }

  // --- Product Data Extraction (for add-to-cart) ---
  function extractProductInfoFromRow(row) {
    const name = row
      .querySelector(".product-header-row h2")
      ?.textContent?.trim();
    const priceText = row
      .querySelector(".product-price")
      ?.textContent?.replace(/[^\d.]/g, "");
    const price = priceText ? parseFloat(priceText) : 0;
    const img = row.querySelector("img.product-img")?.getAttribute("src") || "";
    return { name, price, img };
  }

  function extractProductInfoFromModal(modal) {
    // Support both product.html and index.html modal structures
    const name = modal
      .querySelector(".product-modal-title")
      ?.textContent?.trim();
    let priceText = modal.querySelector(".product-modal-price")?.textContent;
    if (!priceText) {
      // fallback: try .product-modal-info strong or .product-modal-info div
      priceText = modal.querySelector(
        ".product-modal-info strong, .product-modal-info div"
      )?.textContent;
    }
    priceText = priceText?.replace(/[^\d.]/g, "");
    const price = priceText ? parseFloat(priceText) : 0;
    const img =
      modal.querySelector(".product-modal-img")?.getAttribute("src") || "";
    // Try to get qty, fallback to 1
    let qty = 1;
    const qtyValue = modal.querySelector(
      ".product-modal-qty-value, .product-modal-qty-box span"
    );
    if (qtyValue && !isNaN(parseInt(qtyValue.textContent))) {
      qty = parseInt(qtyValue.textContent);
    }
    return { name, price, img, qty };
  }

  // --- Add to Cart (Product Page & Modals) ---
  function setupAddToCartButtons() {
    // Product page: .product-row .button-primary
    document.querySelectorAll(".product-row").forEach((row) => {
      const addBtn = row.querySelector(".button-primary");
      if (addBtn) {
        addBtn.addEventListener("click", () => {
          const { name, price, img } = extractProductInfoFromRow(row);
          addToCart({ name, price, img, qty: 1 });
        });
      }
    });
    // Product modals: .add-to-cart.product-modal-add
    document
      .querySelectorAll(".add-to-cart.product-modal-add")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const modal = btn.closest(".product-modal");
          if (!modal) return;
          const { name, price, img, qty } = extractProductInfoFromModal(modal);
          addToCart({ name, price, img, qty });
        });
      });
  }

  function addToCart({ name, price, img, qty }) {
    if (!name) return;
    const cart = getCart();
    let item = findCartItem(cart, name);
    if (item) {
      item.qty += qty;
    } else {
      cart.push({ name, price, img, qty });
    }
    setCart(cart);
    updateCartUI();
    showCartAddedFeedback(name);
  }

  function showCartAddedFeedback(name) {
    // Optionally show a toast or highlight the cart icon
    // For now, just a simple alert (replace with better UI as needed)
    // alert(`${name} added to cart!`);
  }

  // --- Cart Page Rendering ---
  function renderCartPage() {
    const cart = getCart();
    const cartLeft = document.querySelector(".cart-left");
    if (!cartLeft) return;
    // Remove all .cart-item
    cartLeft.querySelectorAll(".cart-item").forEach((el) => el.remove());
    // Find the add-more-btn
    const addMoreBtn = cartLeft.querySelector(".add-more-btn");
    // Insert cart items before the add-more-btn
    if (cart.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "cart-empty-msg";
      emptyMsg.textContent = "Your cart is empty";
      if (addMoreBtn) cartLeft.insertBefore(emptyMsg, addMoreBtn);
      else cartLeft.appendChild(emptyMsg);
    } else {
      cart.forEach((item) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
          <img src="${item.img}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <div class="cart-item-title-row">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">$${item.price}</div>
            </div>
            <div class="cart-item-qty-label">Qty: <span class="qty-value">${item.qty}</span></div>
            <div class="cart-item-qty">
              <button class="qty-btn" data-action="decrease">-</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-action="increase">+</button>
              <img src="assets/bin.svg" alt="Remove" class="cart-bin-icon" />
            </div>
          </div>
        `;
        // Attach event listeners for qty and remove
        const qtyBtns = div.querySelectorAll(".qty-btn");
        const minusBtn = qtyBtns[0];
        const plusBtn = qtyBtns[1];
        if (minusBtn)
          minusBtn.addEventListener("click", () =>
            updateCartItemQty(item.name, -1)
          );
        if (plusBtn)
          plusBtn.addEventListener("click", () =>
            updateCartItemQty(item.name, 1)
          );
        const binIcon = div.querySelector(".cart-bin-icon");
        if (binIcon)
          binIcon.addEventListener("click", () => removeCartItem(item.name));
        if (addMoreBtn) cartLeft.insertBefore(div, addMoreBtn);
        else cartLeft.appendChild(div);
      });
    }
    updateCartSummary();
  }

  function updateCartItemQty(name, delta) {
    const cart = getCart();
    const item = findCartItem(cart, name);
    if (!item) return;
    item.qty += delta;
    if (item.qty < 1) {
      removeCartItem(name);
      return;
    }
    setCart(cart);
    updateCartUI();
  }

  function removeCartItem(name) {
    let cart = getCart();
    cart = cart.filter((item) => item.name !== name);
    setCart(cart);
    updateCartUI();
  }

  function updateCartSummary() {
    // Update summary on cart.html and checkout.html
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const gst = Math.round(subtotal * 0.05); // 5% GST
    const total = subtotal + gst;
    // Cart page
    const cartSummary = document.querySelector(".cart-summary");
    if (cartSummary) {
      const rows = cartSummary.querySelectorAll(".cart-summary-row");
      if (rows[0]) rows[0].lastElementChild.textContent = `$${subtotal}`;
      if (rows[1]) rows[1].lastElementChild.textContent = `$${gst}`;
      if (cartSummary.querySelector(".cart-summary-row.total span:last-child"))
        cartSummary.querySelector(
          ".cart-summary-row.total span:last-child"
        ).textContent = `$${total}`;
    }
    // Checkout page
    const orderTotal = document.querySelector(".order-total-price");
    if (orderTotal) orderTotal.textContent = `$${total}`;
    // Update .order-summary-totals if present
    const orderSummaryTotals = document.querySelector(".order-summary-totals");
    if (orderSummaryTotals) {
      const rows = orderSummaryTotals.querySelectorAll(".order-summary-row");
      if (rows[0]) rows[0].lastElementChild.textContent = `$${subtotal}`;
      if (rows[1]) rows[1].lastElementChild.textContent = `$${gst}`;
      if (
        orderSummaryTotals.querySelector(
          ".order-summary-row.total span:last-child"
        )
      )
        orderSummaryTotals.querySelector(
          ".order-summary-row.total span:last-child"
        ).textContent = `$${total}`;
    }
    // Order summary items
    const orderSummary = document.querySelector(".order-summary-items");
    if (orderSummary) {
      orderSummary.innerHTML = "";
      cart.forEach((item) => {
        const div = document.createElement("div");
        div.className = "order-item";
        div.innerHTML = `
          <img src="${item.img}" alt="${item.name}" class="order-item-img" />
          <div class="order-item-info">
            <div class="order-item-title-row">
              <div class="order-item-title">${item.name}</div>
              <div class="order-item-price">$${item.price}</div>
            </div>
            <div class="order-item-qty">Qty: ${item.qty}</div>
          </div>
        `;
        orderSummary.appendChild(div);
      });
    }
  }

  // --- Cart Icon Badge (optional) ---
  function updateCartIconBadge() {
    // Show a badge with cart count on the cart icon
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll(".nav-cart").forEach((icon) => {
      let badge = icon.querySelector(".cart-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-badge";
        badge.style.position = "absolute";
        badge.style.top = "2px";
        badge.style.right = "2px";
        badge.style.background = "#cd934b";
        badge.style.color = "#fff";
        badge.style.fontSize = "12px";
        badge.style.fontWeight = "bold";
        badge.style.borderRadius = "50%";
        badge.style.padding = "2px 6px";
        badge.style.zIndex = "10";
        icon.style.position = "relative";
        icon.appendChild(badge);
      }
      badge.textContent = count > 0 ? count : "";
      badge.style.display = count > 0 ? "inline-block" : "none";
    });
  }

  // --- Cart UI Update (all pages) ---
  function updateCartUI() {
    renderCartPage();
    updateCartSummary();
    updateCartIconBadge();
  }

  // --- Checkout: Clear cart on confirmation ---
  function setupConfirmationPage() {
    if (window.location.pathname.endsWith("confirmation.html")) {
      clearCart();
    }
  }

  // --- Responsive Pickup Date ---
  function setupPickupDate() {
    const input = document.getElementById("pickup-date-input");
    if (!input) return;
    // Load saved date
    const saved = localStorage.getItem("pickupDate");
    if (saved) {
      input.value = saved;
    }
    input.addEventListener("change", () => {
      if (input.value) {
        localStorage.setItem("pickupDate", input.value);
      }
    });
  }

  // --- Init on DOMContentLoaded ---
  document.addEventListener("DOMContentLoaded", function () {
    setupAddToCartButtons();
    if (document.querySelector(".cart-left")) renderCartPage();
    updateCartSummary();
    setupConfirmationPage();
    setupPickupDate();
  });
})();
