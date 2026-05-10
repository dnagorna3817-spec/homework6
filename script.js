const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const cartButtons = document.querySelectorAll(".btn-cart");
const cartStatus = document.querySelector(".cart-status");
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const newsletterForm = document.querySelector(".newsletter-form");
const newsletterFeedback = document.querySelector(".newsletter-feedback");
const contactForm = document.querySelector(".contact-form");
const contactNote = document.querySelector(".form-note");
const cartToggle = document.querySelector(".cart-toggle");
const cartClose = document.querySelector(".cart-close");
const cartDrawer = document.querySelector(".cart-drawer");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total");
const clearCartButton = document.querySelector(".clear-cart");

const savedCart = localStorage.getItem("auraCart");
let cart = savedCart ? JSON.parse(savedCart) : [];

function saveCart() {
  localStorage.setItem("auraCart", JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function renderCart() {
  if (!cartItems || !cartCount || !cartTotal) return;

  cartCount.textContent = getCartQuantity();
  cartTotal.textContent = `$${getCartTotal()}`;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (cartStatus) cartStatus.textContent = "Your cart is empty.";
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <div>
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
      </div>
      <button class="cart-remove" type="button" data-name="${item.name}">Remove</button>
      <p class="cart-item-price">$${item.price * item.quantity}</p>
    </article>
  `).join("");
}

function openCart() {
  cartDrawer?.classList.add("is-open");
  cartOverlay?.classList.add("is-open");
}

function closeCart() {
  cartDrawer?.classList.remove("is-open");
  cartOverlay?.classList.remove("is-open");
}

function addToCart(productName, productPrice) {
  const existingItem = cart.find((item) => item.name === productName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: productName, price: productPrice, quantity: 1 });
  }

  saveCart();
  renderCart();

  if (cartStatus) {
    const itemLabel = getCartQuantity() === 1 ? "item" : "items";
    cartStatus.textContent = `${productName} added. Cart: ${getCartQuantity()} ${itemLabel}.`;
  }
}

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

cartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const productName = card?.querySelector(".product-name")?.textContent || "Product";
    const productPriceText = card?.querySelector(".product-price")?.textContent || "$0";
    const productPrice = Number(productPriceText.replace("$", ""));

    addToCart(productName, productPrice);
    button.textContent = "Added";
    button.classList.add("added");
    openCart();

    window.setTimeout(() => {
      button.textContent = "Add to Cart";
      button.classList.remove("added");
    }, 1400);
  });
});

cartItems?.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".cart-remove");
  if (!removeButton) return;

  cart = cart.filter((item) => item.name !== removeButton.dataset.name);
  saveCart();
  renderCart();
});

cartToggle?.addEventListener("click", openCart);
cartClose?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", closeCart);

clearCartButton?.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    productCards.forEach((card) => {
      const matchesFilter = activeFilter === "all" || card.dataset.cat === activeFilter;
      card.classList.toggle("is-hidden", !matchesFilter);
    });
  });
});

if (newsletterForm && newsletterFeedback) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterForm.querySelector("input[type='email']").value.trim();

    newsletterFeedback.textContent = email
      ? `Thank you. Skincare updates will be sent to ${email}.`
      : "Please enter a valid email address.";
    newsletterForm.reset();
  });
}

if (contactForm && contactNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstName = contactForm.querySelector("#firstName").value.trim();

    contactNote.textContent = `Thank you${firstName ? `, ${firstName}` : ""}. Your support message has been received.`;
    contactForm.reset();
  });
}

renderCart();
