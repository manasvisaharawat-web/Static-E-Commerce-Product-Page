
"use strict";

// ============================================
// 1. PRODUCT DATA
// ============================================

const products = [
    {
        id: 1, name: "Air Motion Sneakers", category: "Fashion",
        price: 2499, oldPrice: 3299, rating: 4.8, badge: "BESTSELLER",
        description: "Comfort meets street-style energy.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2, name: "Cloud Wireless Headphones", category: "Technology",
        price: 1899, oldPrice: 2499, rating: 4.9, badge: "SALE",
        description: "Your music, your own little world.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3, name: "Everyday Smart Watch", category: "Technology",
        price: 2799, oldPrice: 3499, rating: 4.7, badge: "TRENDING",
        description: "Keep your day moving in style.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4, name: "Classic Carry Tote", category: "Fashion",
        price: 899, oldPrice: 1199, rating: 4.6, badge: "SALE",
        description: "Room for all your everyday essentials.",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5, name: "Minimal Ceramic Mug", category: "Lifestyle",
        price: 399, oldPrice: null, rating: 4.8, badge: "POPULAR",
        description: "Make your coffee moments special.",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6, name: "Urban Classic Sunglasses", category: "Accessories",
        price: 699, oldPrice: 999, rating: 4.5, badge: "SALE",
        description: "A little sunshine, a lot of style.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7, name: "Soft Knit Hoodie", category: "Fashion",
        price: 1499, oldPrice: null, rating: 4.7, badge: "NEW",
        description: "Your new favourite comfort layer.",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8, name: "Studio Desk Lamp", category: "Lifestyle",
        price: 1099, oldPrice: 1399, rating: 4.6, badge: "SALE",
        description: "Bring a warm glow to your workspace.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 9, name: "Everyday Backpack", category: "Accessories",
        price: 1299, oldPrice: null, rating: 4.8, badge: "POPULAR",
        description: "Carry your plans wherever you go.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 10, name: "Instant Camera", category: "Technology",
        price: 3599, oldPrice: 4199, rating: 4.9, badge: "TRENDING",
        description: "Keep your favourite memories close.",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 11, name: "Silver Everyday Watch", category: "Accessories",
        price: 1599, oldPrice: 1999, rating: 4.5, badge: "SALE",
        description: "A timeless detail for any outfit.",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 12, name: "Essential Water Bottle", category: "Lifestyle",
        price: 549, oldPrice: null, rating: 4.7, badge: "ECO PICK",
        description: "Stay refreshed wherever life takes you.",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80"
    }
];

// ============================================
// 2. APPLICATION STATE
// ============================================

const cart = new Map();
const wishlist = new Set();

let activeCategory = "All";
let searchText = "";
let sortBy = "featured";
let saleOnly = false;
let wishlistOnly = false;

const $ = (selector) => document.querySelector(selector);

const productGrid = $("#product-grid");
const cartItems = $("#cart-items");
const cartDrawer = $("#cart-drawer");
const overlay = $("#overlay");

const money = (amount) =>
    "₹" + amount.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });

function getProduct(id) {
    return products.find(product => product.id === Number(id));
}

// ============================================
// 3. DISPLAY PRODUCTS
// ============================================

function renderProducts() {
    let filteredProducts = products.filter(product => {
        const searchMatch = (
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText)
        );

        const categoryMatch =
            activeCategory === "All" ||
            product.category === activeCategory;

        const saleMatch = !saleOnly || product.oldPrice !== null;
        const wishlistMatch = !wishlistOnly || wishlist.has(product.id);

        return searchMatch && categoryMatch && saleMatch && wishlistMatch;
    });

    if (sortBy === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    $("#product-total").textContent =
        `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`;

    $("#empty-state").classList.toggle("hidden", filteredProducts.length > 0);

    productGrid.innerHTML = filteredProducts.map((product, index) => {
        const isWishlisted = wishlist.has(product.id);
        const isSale = product.oldPrice !== null;
        const inCart = cart.has(product.id);

        return `
            <article class="product-card" style="animation-delay:${index * 35}ms">
                <div class="product-image">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='https://placehold.co/600x600/f0ebff/7355df?text=NovaMart';"
                    >

                    <span class="product-badge ${isSale ? "sale" : ""}">
                        ${isSale ? "−" + Math.round((1 - product.price / product.oldPrice) * 100) + "% OFF" : product.badge}
                    </span>

                    <button
                        class="wishlist-button ${isWishlisted ? "active" : ""}"
                        data-action="wishlist"
                        data-id="${product.id}"
                        aria-label="${isWishlisted ? "Remove from" : "Add to"} wishlist"
                        aria-pressed="${isWishlisted}"
                    >${isWishlisted ? "♥" : "♡"}</button>

                    <button class="quick-add" data-action="add" data-id="${product.id}">
                        ${inCart ? "Add another + " : "＋ Quick add"}
                    </button>
                </div>

                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">★ ${product.rating.toFixed(1)} <span>· Demo rating</span></div>

                    <div class="product-bottom">
                        <div class="price-group">
                            <span class="current-price">${money(product.price)}</span>
                            ${isSale ? `<span class="old-price">${money(product.oldPrice)}</span>` : ""}
                        </div>
                        <button
                            class="add-button"
                            data-action="add"
                            data-id="${product.id}"
                            aria-label="Add ${product.name} to cart"
                        >+</button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

// ============================================
// 4. SEARCH, CATEGORY AND SORTING
// ============================================

$("#search-input").addEventListener("input", event => {
    searchText = event.target.value.trim().toLowerCase();
    renderProducts();
});

$("#sort-select").addEventListener("change", event => {
    sortBy = event.target.value;
    renderProducts();
});

$("#sale-filter").addEventListener("change", event => {
    saleOnly = event.target.checked;
    renderProducts();
});

function setCategory(category) {
    activeCategory = category;
    wishlistOnly = false;
    updateCategoryButtons();
    renderProducts();
}

function updateCategoryButtons() {
    document.querySelectorAll("[data-category]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === activeCategory &&
            !wishlistOnly
        );
    });
}

document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
        setCategory(button.dataset.category);
    });
});

$("#search-focus").addEventListener("click", () => {
    $("#search-input").focus();
    $("#shop").scrollIntoView({ behavior: "smooth" });
});

$("#wishlist-nav").addEventListener("click", () => {
    wishlistOnly = !wishlistOnly;
    activeCategory = "All";
    updateCategoryButtons();
    renderProducts();

    $("#shop").scrollIntoView({ behavior: "smooth" });

    if (wishlistOnly) {
        showToast("Showing your wishlist ♡");
    }
});

$("#reset-filters").addEventListener("click", resetFilters);

function resetFilters() {
    searchText = "";
    activeCategory = "All";
    sortBy = "featured";
    saleOnly = false;
    wishlistOnly = false;

    $("#search-input").value = "";
    $("#sort-select").value = "featured";
    $("#sale-filter").checked = false;

    updateCategoryButtons();
    renderProducts();
}

// ============================================
// 5. WISHLIST
// ============================================

function toggleWishlist(id) {
    const product = getProduct(id);
    if (!product) return;

    if (wishlist.has(product.id)) {
        wishlist.delete(product.id);
        showToast(`${product.name} removed from wishlist`);
    } else {
        wishlist.add(product.id);
        showToast(`${product.name} saved to wishlist ♥`);
    }

    $("#wishlist-count").textContent = wishlist.size;
    renderProducts();
}

productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.dataset.action === "add") {
        addToCart(id);
    }

    if (button.dataset.action === "wishlist") {
        toggleWishlist(id);
    }
});

// ============================================
// 6. ADD AND REMOVE CART ITEMS
// ============================================

function addToCart(id) {
    const product = getProduct(id);
    if (!product) return;

    const currentItem = cart.get(product.id);

    if (currentItem) {
        currentItem.quantity += 1;
    } else {
        cart.set(product.id, {
            productId: product.id,
            quantity: 1
        });
    }

    updateCart();
    renderProducts();
    showToast(`${product.name} added to cart ✓`);
}

function changeQuantity(id, change) {
    const item = cart.get(Number(id));
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart.delete(Number(id));
        showToast("Item removed from cart");
    }

    updateCart();
    renderProducts();
}

function removeFromCart(id) {
    const item = cart.get(Number(id));
    if (!item) return;

    const product = getProduct(id);
    cart.delete(Number(id));

    updateCart();
    renderProducts();
    showToast(`${product.name} removed from cart`);
}

function clearCart() {
    if (cart.size === 0) {
        showToast("Your cart is already empty");
        return;
    }

    cart.clear();
    updateCart();
    renderProducts();
    showToast("Cart cleared");
}

// ============================================
// 7. CART DISPLAY AND TOTAL CALCULATIONS
// ============================================

function getCartCount() {
    let count = 0;

    cart.forEach(item => {
        count += item.quantity;
    });

    return count;
}

function getSubtotal() {
    let subtotal = 0;

    cart.forEach(item => {
        const product = getProduct(item.productId);

        if (product) {
            subtotal += product.price * item.quantity;
        }
    });

    return subtotal;
}

function getOrderTotals() {
    const subtotal = getSubtotal();

    // Free delivery for orders of ₹999 or more.
    const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 49;

    // Demo discount: 5% on the product subtotal.
    const discount = Math.round(subtotal * 0.05);
    const total = subtotal + delivery - discount;

    return { subtotal, delivery, discount, total };
}

function renderCartItems() {
    cartItems.innerHTML = Array.from(cart.values()).map(item => {
        const product = getProduct(item.productId);
        if (!product) return "";

        return `
            <article class="cart-item">
                <img src="${product.image}" alt="${product.name}"
                     onerror="this.onerror=null;this.src='https://placehold.co/150x150/f0ebff/7355df?text=Item';">

                <div>
                    <div class="item-category">${product.category}</div>
                    <h4>${product.name}</h4>
                    <div class="item-price">${money(product.price * item.quantity)}</div>

                    <div class="quantity-control">
                        <button data-cart-action="decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
                        <span>${item.quantity}</span>
                        <button data-cart-action="increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
                    </div>
                </div>

                <button class="remove-item" data-cart-action="remove" data-id="${product.id}">Remove</button>
            </article>
        `;
    }).join("");
}

function updateCart() {
    const count = getCartCount();
    const { subtotal, delivery, discount, total } = getOrderTotals();
    const empty = count === 0;

    $("#cart-count").textContent = count;
    $("#drawer-count").textContent = `(${count})`;

    $("#cart-subtotal").textContent = money(subtotal);
    $("#delivery-cost").textContent = delivery === 0 && subtotal > 0 ? "FREE" : money(delivery);
    $("#discount-amount").textContent = "−" + money(discount);
    $("#cart-total").textContent = money(total);

    $("#shipping-note").textContent =
        empty ? "Add products to see your order summary."
        : subtotal >= 999 ? "🎉 You unlocked free delivery!"
        : `Add ${money(999 - subtotal)} more for free delivery.`;

    $("#cart-summary").classList.toggle("hidden", empty);
    $("#cart-empty").classList.toggle("visible", empty);
    cartItems.classList.toggle("hidden", empty);

    renderCartItems();
}

// Cart quantity controls use event delegation.
cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.cartAction;

    if (action === "increase") changeQuantity(id, 1);
    if (action === "decrease") changeQuantity(id, -1);
    if (action === "remove") removeFromCart(id);
});

$("#clear-cart").addEventListener("click", clearCart);

// ============================================
// 8. OPEN AND CLOSE THE CART
// ============================================

function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("active");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#close-cart").focus();
}

function closeCart() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("active");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    $("#open-cart").focus();
}

$("#open-cart").addEventListener("click", openCart);
$("#close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

$("#continue-shopping").addEventListener("click", () => {
    closeCart();
    $("#shop").scrollIntoView({ behavior: "smooth" });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        closeCheckout();
    }
});

// ============================================
// 9. DEMO CHECKOUT
// ============================================

$("#checkout-button").addEventListener("click", () => {
    if (cart.size === 0) {
        showToast("Add an item before checkout", "error");
        return;
    }

    $("#modal-total").textContent = money(getOrderTotals().total);
    closeCart();

    $("#checkout-modal").classList.add("open");
    $("#close-checkout").focus();
});

function closeCheckout() {
    $("#checkout-modal").classList.remove("open");
}

$("#close-checkout").addEventListener("click", closeCheckout);

$("#checkout-modal").addEventListener("click", event => {
    if (event.target === $("#checkout-modal")) {
        closeCheckout();
    }
});

$("#finish-checkout").addEventListener("click", () => {
    closeCheckout();
    showToast("Thanks for exploring NovaMart! ✨");
});

// ============================================
// 10. TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    $("#toast-container").appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2800);
}

// ============================================
// 11. BACK-TO-TOP BUTTON
// ============================================

window.addEventListener("scroll", () => {
    $("#back-to-top").classList.toggle("visible", window.scrollY > 450);
});

$("#back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ============================================
// 12. START THE WEBSITE
// ============================================

updateCategoryButtons();
renderProducts();
updateCart();

console.log("NovaMart loaded successfully!");
console.log("Products available:", products.length);
