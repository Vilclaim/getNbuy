// =======================================================
// GET&BUY FULL SHOP SYSTEM WITH FLASH DEALS + RETURN TO FLASH
// FIXED: FLASH MODAL VISIBILITY + SCROLL ISSUE
// =======================================================

// ======================
// PRODUCTS DATA
// ======================
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
    description: "Kogen Kojic Soap, 135g — whitening & glowing effect.",
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

// ======================
// STATE
// ======================
let cart = [];
let selectedColor = null;
let currentCategory = "all";
let currentSearch = "";
let modalQuantity = 1;
let cameFromFlash = false;

// ======================
// DOM REFERENCES
// ======================
const productsContainer = document.getElementById("products");
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout");
const closeCart = document.getElementById("close-cart");
const categoryBtns = document.querySelectorAll(".category-btn");

const bgMusic = document.getElementById("bg-music");
const addCartSound = document.getElementById("add-cart-sound");
const flyAnimation = document.getElementById("fly-animation");

// Search
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Product modal
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

// Qty modal
const qtyMinus = document.getElementById("qty-minus");
const qtyPlus = document.getElementById("qty-plus");
const qtyCount = document.getElementById("qty-count");

const colorSection = document.getElementById("color-section");
const colorOptions = document.getElementById("color-options");

// Flash sale
const superSaleModal = document.getElementById("super-sale-modal");
const flashSaleGrid = document.getElementById("flash-sale-grid");
const openSuperSaleBtn = document.getElementById("open-super-sale");
const closeSuperSale = document.getElementById("close-super-sale");

// ======================
// INITIAL SETUP
// ======================
document.body.addEventListener("click", () => {
  bgMusic.play().catch(() => {});
}, { once: true });

displayProducts();

// ======================
// DISPLAY PRODUCTS
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

  document.querySelectorAll(".view-btn").forEach((btn) =>
    btn.addEventListener("click", () => viewProduct(+btn.dataset.id))
  );

  document.querySelectorAll(".add-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const product = PRODUCTS.find((p) => p.id === +btn.dataset.id);
      if (!product) return;

      if (product.colors.length > 0) {
        viewProduct(product.id);
        return;
      }
      addToCart(product.id, null, product.images[0], e);
    })
  );
}

// ======================
// VIEW PRODUCT MODAL
// FIX: ADD BODY SCROLL LOCK
// ======================
function viewProduct(id) {
  const p = PRODUCTS.find((item) => item.id === id);
  if (!p) return;

  productView.classList.remove("hidden");
  document.body.classList.add("modal-open"); // ⭐ FIX

  modalQuantity = 1;
  qtyCount.textContent = "1";

  viewTitle.textContent = p.name;
  viewDescription.textContent = p.description;
  viewPrice.textContent = `AED ${p.price}`;

  modalMainImage.src = p.images[0];
  thumb0.src = p.images[0];
  thumb1.src = p.images[1];
  thumb2.src = p.images[2];
  thumbVideo.src = p.video;

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
    modalMainImage.style.display = "none";
    const videoEl = document.createElement("video");
    videoEl.src = p.video;
    videoEl.controls = true;
    videoEl.autoplay = true;
    videoEl.className = "main-preview";

    const oldVid = document.querySelector(".modal-left video.main-preview");
    if (oldVid) oldVid.remove();

    document.querySelector(".modal-left").appendChild(videoEl);
  };

  colorOptions.innerHTML = "";
  selectedColor = null;

  if (p.colors.length > 0) {
    colorSection.classList.remove("hidden");
    p.colors.forEach((color) => {
      const opt = document.createElement("div");
      opt.className = "color-option";
      opt.textContent = color;
      opt.onclick = () => {
        document.querySelectorAll(".color-option").forEach((o) => o.classList.remove("selected"));
        opt.classList.add("selected");
        selectedColor = color;
      };
      colorOptions.appendChild(opt);
    });
  } else {
    colorSection.classList.add("hidden");
  }

  addToCartView.onclick = (e) => {
    if (p.colors.length > 0 && !selectedColor) {
      alert("Please select a color first!");
      return;
    }
    addToCart(id, selectedColor, p.images[0], e, modalQuantity);
    closeModal();
  };
}

// ======================
// CLOSE PRODUCT MODAL — FIX SCROLL LOCK
// ======================
function closeModal() {
  productView.classList.add("hidden");
  document.body.classList.remove("modal-open"); // ⭐ FIX

  const vid = document.querySelector(".modal-left video.main-preview");
  if (vid) vid.remove();
  modalMainImage.style.display = "block";

  if (cameFromFlash) {
    cameFromFlash = false;
    superSaleModal.classList.remove("hidden");
    document.body.classList.add("modal-open"); // ⭐ FIX
  }
}

closeView.onclick = closeModal;

productView.addEventListener("click", (e) => {
  if (e.target === productView) closeModal();
});

// ======================
// QUANTITY
// ======================
qtyMinus.onclick = () => {
  if (modalQuantity > 1) {
    modalQuantity--;
    qtyCount.textContent = modalQuantity;
  }
};
qtyPlus.onclick = () => {
  modalQuantity++;
  qtyCount.textContent = modalQuantity;
};

// ======================
// ADD TO CART
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

// ======================
// ADD FLY ANIMATION
// ======================
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
  cartCount.addEventListener("animationend", () => {
    cartCount.style.animation = "";
  }, { once: true });
}

// ======================
// UPDATE CART
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
// CART PANEL
// ======================
cartBtn.onclick = () => cartSidebar.classList.add("show");
closeCart.onclick = () => cartSidebar.classList.remove("show");

// ======================
// CHECKOUT WHATSAPP
// ======================
checkoutBtn.onclick = () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let msg = "🛍️ *My Get&Buy Order:*\n\n";

  cart.forEach((i) => {
    msg += `• ${i.name}${i.color ? ` (${i.color})` : ""} x ${i.qty} = AED ${i.price * i.qty}\n\n`;
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  msg += `*Total:* AED ${total}\n\nName: `;

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
    displayProducts(btn.dataset.category, currentSearch);
  })
);

// ======================
// SEARCH SYSTEM
// ======================
searchInput.addEventListener("keyup", () => triggerSearch());
searchBtn.addEventListener("click", () => triggerSearch());

function triggerSearch() {
  const term = searchInput.value.trim();
  displayProducts(currentCategory, term);
}

// =======================================================
// 🔥 FLASH SALE SYSTEM
// =======================================================
function loadFlashDeals() {
  const flash = PRODUCTS.sort(() => 0.5 - Math.random()).slice(0, 6);

  flashSaleGrid.innerHTML = flash
    .map(
      (p) => `
        <div class="flash-item">
          <img src="${p.images[0]}" class="flash-thumb">

          <video class="flash-video" muted loop>
            <source src="${p.video}" type="video/mp4">
          </video>

          <p class="flash-name">${p.name}</p>
          <p class="flash-price">AED ${p.price}</p>

          <button class="flash-btn" onclick="openFlashProduct(${p.id})">
            View
          </button>

          <button class="flash-buy-btn"
            onclick="flashBuy(${p.id}, '${p.images[0]}', event)">
            Buy
          </button>
        </div>
      `
    )
    .join("");
}

// =============================
// OPEN PRODUCT FROM FLASH — FIX BODY SCROLL
// =============================
function openFlashProduct(id) {
  cameFromFlash = true;

  superSaleModal.classList.add("hidden");
  document.body.classList.remove("modal-open"); // ⭐ FIX

  setTimeout(() => {
    viewProduct(id);
  }, 150);
}

// =============================
// BUY FROM FLASH DEALS
// =============================
function flashBuy(id, image, e) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;

  if (product.colors.length > 0) {
    openFlashProduct(id);
    return;
  }

  addToCart(id, null, image, e, 1);
}

// =============================
// FLASH SALE MODAL — FIX SCROLL
// =============================
openSuperSaleBtn.onclick = () => {
  loadFlashDeals();
  superSaleModal.classList.remove("hidden");
  document.body.classList.add("modal-open"); // ⭐ FIX
};

closeSuperSale.onclick = () => {
  superSaleModal.classList.add("hidden");
  document.body.classList.remove("modal-open"); // ⭐ FIX
};

superSaleModal.addEventListener("click", (e) => {
  if (e.target === superSaleModal) {
    superSaleModal.classList.add("hidden");
    document.body.classList.remove("modal-open"); // ⭐ FIX
  }
});
