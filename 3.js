// ======================
// GETNBUY - FULL SHOP SCRIPT
// ======================

// PRODUCTS DATA
const PRODUCTS = [
  { id: 1, name: "18k Saudi Gold Vca/Onyx Necklace", price: 215, category: "accessories", description: "18 inches Chain/15mm pendant", images: ["onyx.jpg","onyx.jpg","images/necklace3.jpg"], video: "onyx.mp4", colors: [] },
  { id: 2, name: "Sling Bag", price: 200, category: "bags", description: "Charles & Keith sling bag in stylish design.", images: ["charles & keith.jpg","charles & keith black.jpg","images/sunglass3.jpg"], video: "charles & keith.mp4", colors: ["Black","Beige","Brown"] },
  { id: 3, name: "Escrow earrings by Chanel", price: 215, category: "accessories", description: "Chanel earrings embody timeless elegance.", images: ["chanel earrings.jpg","chanel earrings1.jpg","chanel earrings1.jpg"], video: "chanel.mp4", colors: [] },
  { id: 4, name: "Michael Kors Women Watches", price: 500, category: "accessories", description: "Durable and stylish tote bag for everyday use.", images: ["michelle korks.jpg","michelle korks1.jpg","michelle korks2.jpg"], video: "videos/totebag.mp4", colors: ["Gold","Silver"] },
  { id: 5, name: "M88 Kogen Triple Action Kojic Soap", price: 40, category: "Beuty product", description: "M88 Kogen Triple Action Kojic Soap, 135g.", images: ["kogen.jpg","images/handbag2.jpg","images/handbag3.jpg"], video: "videos/handbag.mp4", colors: [] },
  { id: 6, name: "Max diet", price: 300, category: "Beuty product", description: "Revolutionize your health regimen.", images: ["Max diet.jpg","images/backpack2.jpg","images/backpack3.jpg"], video: "videos/backpack.mp4", colors: [] }
];

let cart = [];
let selectedColor = null;

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

// PRODUCT VIEW MODAL
const productView = document.getElementById("product-view");
const viewTitle = document.getElementById("view-title");
const viewDescription = document.getElementById("view-description");
const viewPrice = document.getElementById("view-price");
const viewImage1 = document.getElementById("view-image1");
const viewImage2 = document.getElementById("view-image2");
const viewImage3 = document.getElementById("view-image3");
const viewVideo = document.getElementById("view-video");
const closeView = document.getElementById("close-view");
const cancelView = document.getElementById("cancel-view");
const addToCartView = document.getElementById("add-to-cart-view");

// GALLERY VIEWER
const galleryViewer = document.getElementById("gallery-viewer");
const galleryImage = document.getElementById("gallery-image");
const closeGallery = document.getElementById("close-gallery");
const prevGallery = document.getElementById("prev-gallery");
const nextGallery = document.getElementById("next-gallery");
let galleryImages = [];
let galleryIndex = 0;

// ======================
// INITIAL SETUP
// ======================
document.body.addEventListener("click", () => bgMusic.play().catch(() => {}), { once: true });
displayProducts();

// ======================
// DISPLAY PRODUCTS
// ======================
function displayProducts(category = "all") {
  productsContainer.innerHTML = "";
  const filtered = category === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>AED ${p.price}</p>
      <button class="view-btn" data-id="${p.id}">View</button>
      <button class="add-btn" data-id="${p.id}">Add to Cart</button>
    `;
    productsContainer.appendChild(div);
  });

  // Attach event listeners
  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => viewProduct(+btn.dataset.id));
  });
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const product = PRODUCTS.find(p => p.id === +btn.dataset.id);
      if (product.colors.length > 0) { viewProduct(product.id); return; }
      addToCart(product.id, null, product.images[0], e);
    });
  });
}

// ======================
// VIEW PRODUCT DETAILS
// ======================
function viewProduct(id) {
  const product = PRODUCTS.find(p => p.id === id);
  productView.classList.remove("hidden");

  viewTitle.textContent = product.name;
  viewDescription.textContent = product.description;
  viewPrice.textContent = `AED ${product.price}`;
  viewImage1.src = product.images[0];
  viewImage2.src = product.images[1];
  viewImage3.src = product.images[2];
  viewVideo.src = product.video;

  // COLORS
  colorOptions.innerHTML = "";
  selectedColor = null;
  if (product.colors.length > 0) {
    colorSection.classList.remove("hidden");
    product.colors.forEach(color => {
      const opt = document.createElement("div");
      opt.className = "color-option";
      opt.innerHTML = `<div class="color-circle" style="background:${color.toLowerCase()};"></div>${color}`;
      opt.onclick = () => {
        document.querySelectorAll(".color-option").forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        selectedColor = color;
      };
      colorOptions.appendChild(opt);
    });
  } else colorSection.classList.add("hidden");

  // ADD TO CART
  addToCartView.onclick = e => {
    if (product.colors.length > 0 && !selectedColor) { alert("Please select a color first!"); return; }
    addToCart(product.id, selectedColor, product.images[0], e);
    productView.classList.add("hidden");
  };

  // GALLERY CLICK
  const modalImages = [viewImage1, viewImage2, viewImage3];
  modalImages.forEach((img, i) => {
    img.onclick = () => {
      galleryImages = product.images;
      galleryIndex = i;
      galleryImage.src = galleryImages[galleryIndex];
      galleryViewer.classList.remove("hidden");
    };
  });
}

// CLOSE MODAL
closeView.onclick = cancelView.onclick = () => productView.classList.add("hidden");

// ======================
// ADD TO CART WITH FLYING ANIMATION
// ======================
function addToCart(id, color, image, e) {
  const product = PRODUCTS.find(p => p.id === id);
  const keyColor = color || "none";
  const existing = cart.find(i => i.id === id && (i.color || "none") === keyColor);
  if (existing) existing.qty++; else cart.push({ ...product, color, qty: 1 });

  updateCart();
  animateFly(image, e);

  addCartSound.currentTime = 0;
  addCartSound.play().catch(() => {});
}

// FLYING ANIMATION
function animateFly(imgSrc, e) {
  const img = document.createElement("img");
  img.src = imgSrc;
  flyAnimation.appendChild(img);

  const rect = cartBtn.getBoundingClientRect();
  img.style.left = e.clientX + "px";
  img.style.top = e.clientY + "px";

  setTimeout(() => {
    img.style.left = rect.left + "px";
    img.style.top = rect.top + "px";
    img.style.transform = "scale(0.1)";
    img.style.opacity = "0";
  }, 10);

  setTimeout(() => img.remove(), 900);

  cartCount.style.animation = "popBadge 0.3s";
  cartCount.addEventListener("animationend", () => cartCount.style.animation = "");
}

// ======================
// UPDATE CART SIDEBAR
// ======================
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
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

  document.querySelectorAll(".qty-btn").forEach(btn => btn.addEventListener("click", () => {
    const id = +btn.dataset.id, delta = +btn.dataset.delta, color = btn.dataset.color || null;
    const item = cart.find(i => i.id === id && (i.color || "none") === (color || "none"));
    if (!item) return;
    item.qty += delta;
    if (item.qty < 1) item.qty = 1;
    updateCart();
  }));

  document.querySelectorAll(".remove-btn").forEach(btn => btn.addEventListener("click", () => {
    const id = +btn.dataset.id, color = btn.dataset.color || null;
    cart = cart.filter(i => !(i.id === id && (i.color || "none") === (color || "none")));
    updateCart();
  }));
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
  if (cart.length === 0) { alert("Your cart is empty!"); return; }
  let msg = "🛍️ *My GetNBuy Order:*\n\n";
  cart.forEach(i => { msg += `• ${i.name}${i.color ? ` (${i.color})` : ""} x ${i.qty} = AED ${i.price * i.qty}\n\n`; });
  const total = cart.reduce((sum, i) => sum + i.price*i.qty, 0);
  msg += `*Total:* AED ${total}\n\nName: `;
  window.open(`https://wa.me/971504238543?text=${encodeURIComponent(msg)}`, "_blank");
};

// ======================
// CATEGORY FILTER
// ======================
categoryBtns.forEach(btn => btn.addEventListener("click", () => {
  document.querySelector(".category-btn.active")?.classList.remove("active");
  btn.classList.add("active");
  displayProducts(btn.dataset.category);
}));

// ======================
// GALLERY NAVIGATION
// ======================
closeGallery.onclick = () => galleryViewer.classList.add("hidden");
prevGallery.onclick = () => {
  galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
  galleryImage.src = galleryImages[galleryIndex];
};
nextGallery.onclick = () => {
  galleryIndex = (galleryIndex + 1) % galleryImages.length;
  galleryImage.src = galleryImages[galleryIndex];
};
galleryViewer.addEventListener("click", (e) => {
  if (e.target === galleryViewer) galleryViewer.classList.add("hidden");
});
