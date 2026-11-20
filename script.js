
// NovaMart - Static E-Commerce Product Page
// Product listing, search, category filter, cart, quantity and total price.

const products = [
    { id: 1, name: "Wireless Bluetooth Headphones", category: "Electronics", price: 1499, rating: "★★★★☆", description: "Comfortable wireless headphones with clear sound.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700" },
    { id: 2, name: "Smart Fitness Watch", category: "Electronics", price: 2199, rating: "★★★★☆", description: "Track your activity and daily fitness goals.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700" },
    { id: 3, name: "Wireless Gaming Mouse", category: "Electronics", price: 899, rating: "★★★★★", description: "Responsive mouse for work and gaming.", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=700" },
    { id: 4, name: "Running Shoes", category: "Fashion", price: 1899, rating: "★★★★★", description: "Lightweight shoes for everyday comfort.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700" },
    { id: 5, name: "Classic Backpack", category: "Fashion", price: 999, rating: "★★★★☆", description: "A practical backpack for college and travel.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700" },
    { id: 6, name: "Casual Sunglasses", category: "Fashion", price: 699, rating: "★★★★☆", description: "A simple style for sunny days.", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700" },
    { id: 7, name: "Minimal Table Lamp", category: "Home", price: 799, rating: "★★★★☆", description: "A modern lamp for your study table.", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700" },
    { id: 8, name: "Ceramic Coffee Mug", category: "Home", price: 349, rating: "★★★★★", description: "A stylish mug for your coffee breaks.", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=700" },
    { id: 9, name: "Decorative Cushion", category: "Home", price: 599, rating: "★★★★☆", description: "Add a cosy touch to your living space.", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=700" },
    { id: 10, name: "Daily Skincare Set", category: "Beauty", price: 699, rating: "★★★★☆", description: "Everyday skincare essentials.", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700" },
    { id: 11, name: "Classic Wrist Watch", category: "Accessories", price: 1299, rating: "★★★★☆", description: "A timeless accessory for every outfit.", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700" },
    { id: 12, name: "Travel Water Bottle", category: "Accessories", price: 499, rating: "★★★★★", description: "A reusable bottle for everyday use.", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700" }
];

// Cart stores products added by the user and their quantities.
let cart = [];

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartBadge = document.getElementById("cartBadge");
const totalPrice = document.getElementById("totalPrice");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.querySelector(".search-select");
const sortSelect = document.getElementById("sortSelect");
const noProducts = document.getElementById("noProducts");

// Convert number into Indian Rupee format.
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// Display all products or the filtered product list.
function displayProducts(productList = products) {
    productGrid.innerHTML = "";

    if (noProducts) {
        noProducts.hidden = productList.length !== 0;
    }

    productList.forEach(function (product) {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <p class="product-category">${product.category}</p>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="product-rating">${product.rating}</p>
            <p class="product-price">${formatPrice(product.price)}</p>
            <button class="add-cart-btn" data-add="${product.id}" type="button">
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
        `;

        productGrid.appendChild(productCard);
    });
}

// Add a product to the cart. If it already exists, increase its quantity.
function addToCart(productId) {
    const selectedProduct = products.find(function (product) {
        return product.id === productId;
    });

    const existingItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...selectedProduct, quantity: 1 });
    }

    displayCart();
}

// Remove a product completely from the cart.
function removeFromCart(productId) {
    cart = cart.filter(function (item) {
        return item.id !== productId;
    });

    displayCart();
}

// Increase or decrease the quantity of a cart item.
function changeQuantity(productId, change) {
    const selectedItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (!selectedItem) return;

    selectedItem.quantity += change;

    if (selectedItem.quantity <= 0) {
        removeFromCart(productId);
    } else {
        displayCart();
    }
}

// Update cart items, cart badge and total price on the webpage.
function displayCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    }

    cart.forEach(function (item) {
        total += item.price * item.quantity;
        totalItems += item.quantity;

        const cartRow = document.createElement("div");
        cartRow.className = "cart-item";

        cartRow.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)} each</p>
                <button class="quantity-btn" data-minus="${item.id}" type="button">−</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-plus="${item.id}" type="button">+</button>
                <button class="remove-btn" data-remove="${item.id}" type="button">Remove</button>
            </div>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
        `;

        cartItems.appendChild(cartRow);
    });

    cartBadge.textContent = totalItems;
    totalPrice.textContent = formatPrice(total);
}

// Search products and apply the selected category and sorting option.
function filterAndSortProducts() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    let filteredProducts = products.filter(function (product) {
        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (sortSelect && sortSelect.value === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortSelect && sortSelect.value === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

// Product Add to Cart button click.
productGrid.addEventListener("click", function (event) {
    const addButton = event.target.closest("[data-add]");

    if (addButton) {
        addToCart(Number(addButton.dataset.add));
    }
});

// Cart plus, minus and remove button clicks.
cartItems.addEventListener("click", function (event) {
    const plusButton = event.target.closest("[data-plus]");
    const minusButton = event.target.closest("[data-minus]");
    const removeButton = event.target.closest("[data-remove]");

    if (plusButton) {
        changeQuantity(Number(plusButton.dataset.plus), 1);
    } else if (minusButton) {
        changeQuantity(Number(minusButton.dataset.minus), -1);
    } else if (removeButton) {
        removeFromCart(Number(removeButton.dataset.remove));
    }
});

// Search when typing or clicking the search icon.
searchInput.addEventListener("input", filterAndSortProducts);
document.getElementById("searchButton").addEventListener("click", filterAndSortProducts);
categoryFilter.addEventListener("change", filterAndSortProducts);

if (sortSelect) {
    sortSelect.addEventListener("change", filterAndSortProducts);
}

// Show all products and an empty cart when the page first loads.
displayProducts();
displayCart();
