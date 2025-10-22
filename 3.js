const PRODUCTS = [
  { id: 1, name: "18k Saudi Gold Vca/Onyx Necklace", price: 215, category: "accessories", description: "18 inches Chain/15mm pendant", images: ["onyx.jpg","onyx.jpg","images/necklace3.jpg"], video: "onyx.mp4", colors: [] },
  { id: 2, name: "Sling Bag", price: 200, category: "bags", description: "Charles & Keith sling bag in stylish design.", images: ["charles & keith.jpg","charles & keith black.jpg","images/sunglass3.jpg"], video: "charles & keith.mp4", colors: ["#000000", "#d2b48c", "#8b4513"] },
  { id: 3, name: "Escrow earrings by Chanel", price: 215, category: "accessories", description: "Chanel earrings embody timeless elegance.", images: ["chanel earrings.jpg","chanel earrings1.jpg","chanel earrings1.jpg"], video: "chanel.mp4", colors: [] },
  { id: 4, name: "Michael Kors Women Watches", price: 500, category: "accessories", description: "Durable and stylish tote bag for everyday use.", images: ["michelle korks.jpg","michelle korks1.jpg","michelle korks2.jpg"], video: "videos/totebag.mp4", colors: ["#ffd700", "#c0c0c0"] },
  { id: 5, name: "M88 Kogen Triple Action Kojic Soap", price: 40, category: "Beuty product", description: "M88 Kogen Triple Action Kojic Soap, 135g.", images: ["kogen.jpg","images/handbag2.jpg","images/handbag3.jpg"], video: "videos/handbag.mp4", colors: [] },
  { id: 6, name: "Max diet", price: 300, category: "Beuty product", description: "Revolutionize your health regimen.", images: ["Max diet.jpg","images/backpack2.jpg","images/backpack3.jpg"], video: "videos/backpack.mp4", colors: [] }
];

let cart = [];
let selectedColor = null;

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

// Unlock audio on mobile
document.body.addEventListener('click', () => { 
  bgMusic.play().catch(()=>{}); 
}, {once:true});

function displayProducts(category = "all") {
  productsContainer.innerHTML = "";
  const filtered = category === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
  filtered.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>AED ${p.price}</p>
      <button class="view-btn" data-id="${p.id}">View</button>
      <button class="add-btn" data-id="${p.id}" data-color="">Add to Cart</button>
    `;
    productsContainer.appendChild(div);
  });

  document.querySelectorAll(".view-btn").forEach(btn => btn.onclick = () => viewProduct(Number(btn.dataset.id)));
  document.querySelectorAll(".add-btn").forEach(btn => btn.onclick = () => {
    const id = Number(btn.dataset.id);
    const color = btn.dataset.color || null;
    const product = PRODUCTS.find(p => p.id === id);
    addToCart(id, color, product.images[0]);
  });
}

function viewProduct(id) {
  const product = PRODUCTS.find(p => p.id === id);
  document.getElementById("product-view").classList.remove("hidden");
  document.getElementById("view-title").textContent = product.name;
  document.getElementById("view-description").textContent = product.description;
  document.getElementById("view-price").textContent = "AED " + product.price;
  document.getElementById("view-image1").src = product.images[0];
  document.getElementById("view-image2").src = product.images[1];
  document.getElementById("view-image3").src = product.images[2];
  document.getElementById("view-video").src = product.video;

  colorOptions.innerHTML = "";
  selectedColor = null;

  if (product.colors.length > 0) {
    colorSection.classList.remove("hidden");
    product.colors.forEach(color => {
      const circle = document.createElement("div");
      circle.classList.add("color-circle");
      circle.style.background = color;
      circle.onclick = () => {
        document.querySelectorAll(".color-circle").forEach(c => c.classList.remove("selected"));
        circle.classList.add("selected");
        selectedColor = color;
      };
      colorOptions.appendChild(circle);
    });
  } else colorSection.classList.add("hidden");

  document.getElementById("add-to-cart-view").onclick = () => addToCart(product.id, selectedColor, product.images[0]);
}

document.getElementById("close-view").onclick = () => document.getElementById("product-view").classList.add("hidden");

function addToCart(id, color, image) {
  const product = PRODUCTS.find(p => p.id === id);
  const key = (color || "null");
  const existing = cart.find(item => item.id === id && (item.color || "null") === key);

  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1, color: color });

  updateCart();
  animateFly(image);

  addCartSound.currentTime = 0;
  addCartSound.play().catch(()=>{});
}

function animateFly(imageSrc) {
  const cartRect = cartBtn.getBoundingClientRect();
  const img = document.createElement("img");
  img.src = imageSrc;
  flyAnimation.appendChild(img);

  const startX = window.event ? window.event.clientX - 30 : 50;
  const startY = window.event ? window.event.clientY - 30 : 200;
  img.style.left = startX + 'px';
  img.style.top = startY + 'px';
  img.style.position = 'fixed';

  setTimeout(() => {
    img.style.transition = 'all 0.8s cubic-bezier(0.65,-0.25,0.35,1.25)';
    img.style.left = cartRect.left + 'px';
    img.style.top = cartRect.top + 'px';
    img.style.transform = 'scale(0.2)';
    img.style.opacity = '0';
  }, 10);

  setTimeout(() => img.remove(), 800);

  cartCount.style.animation = 'popBadge 0.3s';
  cartCount.addEventListener('animationend', () => cartCount.style.animation = '');
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${item.images[0]}" alt="${item.name}">
        <span>${item.name} ${item.color ? `<span style="background:${item.color};border:1px solid #fff;padding:3px 8px;border-radius:5px;"></span>` : ''} - AED ${item.price * item.qty}</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" data-id="${item.id}" data-color="${item.color || ''}" data-delta="-1">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-id="${item.id}" data-color="${item.color || ''}" data-delta="1">+</button>
        <button class="remove-btn" data-id="${item.id}" data-color="${item.color || ''}">Remove</button>
      </div>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Total: AED ${total}`;
  const totalQty = cart.reduce((sum,item)=>sum+item.qty,0);
  cartCount.textContent = totalQty;

  document.querySelectorAll(".qty-btn").forEach(btn => btn.onclick = () => {
    const id = Number(btn.dataset.id);
    const color = btn.dataset.color || null;
    const delta = Number(btn.dataset.delta);
    changeQty(id, delta, color);
  });

  document.querySelectorAll(".remove-btn").forEach(btn => btn.onclick = () => {
    const id = Number(btn.dataset.id);
    const color = btn.dataset.color || null;
    removeFromCart(id, color);
  });
}

function removeFromCart(id,color){
  const key = color || "null";
  cart = cart.filter(item => !(item.id===id && (item.color||"null")===key));
  updateCart();
}

function changeQty(id, delta, color){
  const item = cart.find(i=>i.id===id && (i.color||"null")=== (color||"null"));
  if(!item) return;
  item.qty += delta;
  if(item.qty < 1) item.qty = 1;
  updateCart();
}

cartBtn.onclick = () => cartSidebar.classList.add("show");
closeCart.onclick = () => cartSidebar.classList.remove("show");

checkoutBtn.onclick = () => {
  if(cart.length===0){ alert("Your cart is empty!"); return; }
  let msg="Hello, my order:\n\n";
  cart.forEach(item => msg+=`${item.name} ${item.color ? `(Color: ${item.color})` : ''} x ${item.qty} = AED ${item.price*item.qty}\n${window.location.origin}/${item.images[0]}\n\n`);
  const total = cart.reduce((sum,i)=>sum+i.price*i.qty,0);
  msg+=`Total: AED ${total}\n\nName: `;
  window.open(`https://wa.me/971504238543?text=${encodeURIComponent(msg)}`,"_blank");
};

categoryBtns.forEach(btn => btn.addEventListener("click", () => {
  document.querySelector(".category-btn.active").classList.remove("active");
  btn.classList.add("active");
  displayProducts(btn.dataset.category);
}));

displayProducts();
