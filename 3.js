// ======================
// GET&BUY - FULL SHOP SCRIPT 
// ======================

// PRODUCTS DATA
const PRODUCTS = [
  {
    id: 1,
    name: "18k Saudi Gold Vca/Onyx Necklace",
    price: 215,
    category: "accessories",
    description: "18 inches chain with 15mm VCA/Onyx pendant. Premium Saudi gold look.",
    images: ["onyx.jpg", "onyx.jpg", "images/necklace3.jpg"],
    video: "onyx.mp4",
    colors: []
  },
  {
    id: 2,
    name: "Charles & Keith Sling Bag",
    price: 200,
    category: "bags",
    description: "Original-style Charles & Keith sling bag in stylish modern design.",
    images: ["charles & keith.jpg", "charles & keith black.jpg", "images/sunglass3.jpg"],
    video: "charles & keith.mp4",
    colors: ["Black", "Beige", "Brown"]
  },
  {
    id: 3,
    name: "Escrow Earrings by Chanel",
    price: 215,
    category: "accessories",
    description: "Chanel-inspired earrings that embody timeless elegance.",
    images: ["chanel earrings.jpg", "chanel earrings1.jpg", "chanel earrings1.jpg"],
    video: "chanel.mp4",
    colors: []
  },
  {
    id: 4,
    name: "Michael Kors Women Watch",
    price: 500,
    category: "accessories",
    description: "Michael Kors ladies watch – gold & silver tones, elegant and durable.",
    images: ["michelle korks.jpg", "michelle korks1.jpg", "michelle korks2.jpg"],
    video: "videos/totebag.mp4",
    colors: ["Gold", "Silver"]
  },
  {
    id: 5,
    name: "M88 Kogen Triple Action Kojic Soap",
    price: 40,
    category: "Beuty product",
    description: "M88 Kogen Triple Action Kojic Soap, 135g — whitening & glowing effect.",
    images: ["kogen.jpg", "images/handbag2.jpg", "images/handbag3.jpg"],
    video: "videos/handbag.mp4",
    colors: []
  },
  {
    id: 6,
    name: "Max Diet Slimming Capsules",
    price: 300,
    category: "Beuty product",
    description: "Max Diet capsules to support weight management. Use with proper guidance.",
    images: ["Max diet.jpg", "images/backpack2.jpg", "images/backpack3.jpg"],
    video: "videos/backpack.mp4",
    colors: []
  }
];

// STATE
let cart = [];
let selectedColor = null;
let currentCategory = "all";
let currentSearch = "";
let modalQuantity = 1;

// DOM REFERENCES
const productsContainer = document.getElementById("products");
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout");
const closeCart = document.getElementById("close-cart");
const categoryBtns = document.querySelectorAll(".category-btn");
const colorSection = document.getElementById("color-section");
const colorOptions = document.getElementById("color-options");
const flyAnimation = document.getElementById("fly-animation");
const addCartSound = document.getElementById("add-cart-sound");
const bgMusic = document.getElementById("bg-music");

// SEARCH
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// MODAL
const productView = document.getElementById("product-view");
const viewTitle = document.getElementById("view-title");
const viewDescription = document.getElementById("view-description");
const viewPrice = document.getElementById("view-price");
const closeView = document.getElementById("close-view");
const addToCartView = document.getElementById("add-to-cart-view");

const modalMainImage = document.getElementById("modal-main-image");
const thumb0 = document.getElementById("thumb-0");
const thumb1 = document.getElementById("thumb-1");
const thumb2 = document.getElementById("thumb-2");
const thumbVideo = document.getElementById("thumb-video");

const qtyMinus = document.getElementById("qty-minus");
const qtyPlus = document.getElementById("qty-plus");
const qtyCount = document.getElementById("qty-count");

// ======================
// INITIAL SETUP
// ======================

// Try to play background music after first click
document.body.addEventListener(
  "click",
  () => bgMusic.play().catch(() => {}),
  { once: true }
);

// First render
displayProducts();

// ======================
// DISPLAY PRODUCTS (CATEGORY + SEARCH)
// ======================
function displayProducts(category = "all", searchTerm = "") {
  currentCategory = category;
  currentSearch = searchTerm.toLowerCase();
  productsContainer.innerHTML = "";

  const filtered = PRODUCTS.filter((p) => {
    const matchCategory = category === "all" || p.category === category;
    const matchSearch =
      !currentSearch ||
      p.name.toLowerCase().includes(currentSearch) ||
      p.description.toLowerCase().includes(currentSearch);
    return matchCategory && matchSearch;
  });

  filtered.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>AED ${p.price}</p>
      <div class="btn-row">
        <button class="view-btn" data-id="${p.id}">View</button>
        <button class="add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    `;
    productsContainer.appendChild(div);
  });

  // Attach event listeners
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => viewProduct(+btn.dataset.id));
  });
  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const product = PRODUCTS.find((p) => p.id === +btn.dataset.id);
      if (!product) return;

      // If has colors, open modal instead
      if (product.colors && product.colors.length > 0) {
        viewProduct(product.id);
        return;
      }
      addToCart(product.id, null, product.images[0], e);
    });
  });
}

// ======================
// VIEW PRODUCT (LAZADA MODAL)
// ======================
function viewProduct(id) {
  const p = PRODUCTS.find((item) => item.id === id);
  if (!p) return;

  productView.classList.remove("hidden");

  // Reset quantity
  modalQuantity = 1;
  qtyCount.textContent = "1";

  // Text
  viewTitle.textContent = p.name;
  viewDescription.textContent = p.description;
  viewPrice.textContent = `AED ${p.price}`;

  // Images
  modalMainImage.src = p.images[0];
  thumb0.src = p.images[0];
  thumb1.src = p.images[1];
  thumb2.src = p.images[2];
  thumbVideo.src = p.video;

  // Thumbnails click logic
  thumb0.onclick = () => {
    modalMainImage.src = p.images[0];
    modalMainImage.style.display = "block";
  };
  thumb1.onclick = () => {
    modalMainImage.src = p.images[1];
    modalMainImage.style.display = "block";
  };
  thumb2.onclick = () => {
    modalMainImage.src = p.images[2];
    modalMainImage.style.display = "block";
  };
  thumbVideo.onclick = () => {
    // Show video in place of image
    modalMainImage.style.display = "none";
    const videoEl = document.createElement("video");
    videoEl.src = p.video;
    videoEl.controls = true;
    videoEl.autoplay = true;
    videoEl.className = "main-preview";
    // Remove any previous video
    const oldVid = document.querySelector(".modal-left video.main-preview");
    if (oldVid) oldVid.remove();
    document.querySelector(".modal-left").appendChild(videoEl);
  };

  // Color options
  colorOptions.innerHTML = "";
  selectedColor = null;

  if (p.colors && p.colors.length > 0) {
    colorSection.classList.remove("hidden");
    p.colors.forEach((color) => {
      const opt = document.createElement("div");
      opt.className = "color-option";
      opt.textContent = color;
      opt.onclick = () => {
        document
          .querySelectorAll(".color-option")
          .forEach((o) => o.classList.remove("selected"));
        opt.classList.add("selected");
        selectedColor = color;
      };
      colorOptions.appendChild(opt);
    });
  } else {
    colorSection.classList.add("hidden");
  }

  // Add to cart from modal
  addToCartView.onclick = (e) => {
    if (p.colors && p.colors.length > 0 && !selectedColor) {
      alert("Please select a color first!");
      return;
    }
    addToCart(id, selectedColor, p.images[0], e, modalQuantity);
    closeModal();
  };
}

// ======================
// MODAL QUANTITY CONTROL
// ======================
qtyMinus.onclick = () => {
  if (modalQuantity > 1) {
    modalQuantity--;
    qtyCount.textContent = String(modalQuantity);
  }
};
qtyPlus.onclick = () => {
  modalQuantity++;
  qtyCount.textContent = String(modalQuantity);
};

// ======================
// CLOSE MODAL
// ======================
function closeModal() {
  productView.classList.add("hidden");
  // remove any video used as main preview
  const vid = document.querySelector(".modal-left video.main-preview");
  if (vid) vid.remove();
  modalMainImage.style.display = "block";
}

closeView.onclick = closeModal;

// close when clicking outside the card
productView.addEventListener("click", (e) => {
  if (e.target === productView) closeModal();
});

// ======================
// ADD TO CART + FLY ANIMATION
// ======================
function addToCart(id, color, image, e, qty = 1) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;

  const keyColor = color || "none";
  const existing = cart.find(
    (i) => i.id === id && (i.color || "none") === keyColor
  );

  if (existing) existing.qty += qty;
  else cart.push({ ...product, color, qty });

  updateCart();
  animateFly(image, e);

  addCartSound.currentTime = 0;
  addCartSound.play().catch(() => {});
}

function animateFly(imgSrc, e) {
  const img = document.createElement("img");
  img.src = imgSrc;
  flyAnimation.appendChild(img);

  const rect = cartBtn.getBoundingClientRect();
  const startX = e?.clientX ?? window.innerWidth / 2;
  const startY = e?.clientY ?? window.innerHeight / 2;

  img.style.left = startX + "px";
  img.style.top = startY + "px";

  setTimeout(() => {
    img.style.left = rect.left + "px";
    img.style.top = rect.top + "px";
    img.style.transform = "scale(0.1)";
    img.style.opacity = "0";
  }, 10);

  setTimeout(() => img.remove(), 900);

  cartCount.style.animation = "popBadge 0.3s";
  cartCount.addEventListener(
    "animationend",
    () => {
      cartCount.style.animation = "";
    },
    { once: true }
  );
}

// ======================
// UPDATE CART SIDEBAR
// ======================
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${item.images[0]}" alt="${item.name}">
        <span>${item.name} ${item.color ? `(${item.color})` : ""}</span>
      </div>
      <div>
        <button class="qty-btn" data-id="${item.id}" data-color="${item.color || ""}" data-delta="-1">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-id="${item.id}" data-color="${item.color || ""}" data-delta="1">+</button>
        <button class="remove-btn" data-id="${item.id}" data-color="${item.color || ""}">x</button>
      </div>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Total: AED ${total}`;
  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);

  // quantity buttons
  document.querySelectorAll(".qty-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = +btn.dataset.id;
      const delta = +btn.dataset.delta;
      const color = btn.dataset.color || null;
      const item = cart.find(
        (i) => i.id === id && (i.color || "none") === (color || "none")
      );
      if (!item) return;
      item.qty += delta;
      if (item.qty < 1) item.qty = 1;
      updateCart();
    })
  );

  // remove buttons
  document.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = +btn.dataset.id;
      const color = btn.dataset.color || null;
      cart = cart.filter(
        (i) => !(i.id === id && (i.color || "none") === (color || "none"))
      );
      updateCart();
    })
  );
}

// ======================
// CART SIDEBAR CONTROL
// ======================
cartBtn.onclick = () => cartSidebar.classList.add("show");
closeCart.onclick = () => cartSidebar.classList.remove("show");

// ======================
// CHECKOUT VIA WHATSAPP
// ======================
checkoutBtn.onclick = () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  let msg = "🛍️ *My Get&Buy Order:*\n\n";
  cart.forEach((i) => {
    msg += `• ${i.name}${i.color ? ` (${i.color})` : ""} x ${
      i.qty
    } = AED ${i.price * i.qty}\n\n`;
  });
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  msg += `*Total:* AED ${total}\n\nName: `;

  // YOUR NUMBER HERE
  window.open(
    `https://wa.me/971504238543?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
};

// ======================
// CATEGORY FILTER
// ======================
categoryBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelector(".category-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    const cat = btn.dataset.category;
    displayProducts(cat, currentSearch);
  })
);

// ======================
// SEARCH FUNCTION
// ======================
function triggerSearch() {
  const term = searchInput.value.trim();
  displayProducts(currentCategory, term);
}

searchInput.addEventListener("keyup", (e) => {
  // live search as user types
  triggerSearch();
});
searchBtn.addEventListener("click", () => {
  triggerSearch();
});
