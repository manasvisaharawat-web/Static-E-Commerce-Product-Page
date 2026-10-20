
/* ---------- SHOPPING CART ---------- */

// Each cart item will be stored using its product ID.
const cart = new Map();

// Select HTML elements.
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartItemsLabel = document.getElementById("cart-items-label");
const summaryCount = document.getElementById("summary-count");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("demo-checkout");

// Format numbers as Indian Rupees.
function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

// Calculate the total quantity of products in the cart.
function getTotalItems() {
    let count = 0;

    for (const item of cart.values()) {
        count += item.quantity;
    }

    return count;
}

// Add a product to the cart.
function addToCart(product) {
    const id = product.id;

    if (cart.has(id)) {
        // If the product already exists, increase its quantity.
        const item = cart.get(id);
        item.quantity++;
    } else {
        // Otherwise, add it as a new cart item.
        cart.set(id, {
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

// Remove a product completely from the cart.
function removeFromCart(id) {
    cart.delete(id);
    updateCart();
}

// Change the quantity of a product.
function changeQuantity(id, change) {
    if (!cart.has(id)) {
        return;
    }

    const item = cart.get(id);
    item.quantity += change;

    // Remove the item if its quantity reaches zero.
    if (item.quantity <= 0) {
        cart.delete(id);
    }

    updateCart();
}

// Update the cart display, badge and total.
function updateCart() {
    const totalItems = getTotalItems();
    let totalPrice = 0;

    // Update the cart badge.
    cartCount.textContent = totalItems;

    // Update item counts.
    cartItemsLabel.textContent =
        `${totalItems} ${totalItems === 1 ? "item" : "items"}`;

    summaryCount.textContent = totalItems;

    // Calculate the total price.
    for (const item of cart.values()) {
        totalPrice += item.price * item.quantity;
    }

    cartTotal.textContent = formatPrice(totalPrice);

    // Display the empty-cart message when there are no items.
    if (cart.size === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛍️</div>
                <h3>Your cart is empty</h3>
                <p>Add something you love from our products.</p>
                <a href="#products" class="continue-btn">
                    Explore Products
                </a>
            </div>
        `;

        return;
    }

    // Display all products currently in the cart.
    cartItems.innerHTML = Array.from(cart.values()).map(item => `
        <div class="cart-item">

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-details">
                <h4>${item.name}</h4>

                <p>${formatPrice(item.price)} each</p>

                <div class="quantity-controls">
                    <button
                        type="button"
                        data-action="decrease"
                        data-id="${item.id}"
                        aria-label="Decrease ${item.name} quantity"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        data-action="increase"
                        data-id="${item.id}"
                        aria-label="Increase ${item.name} quantity"
                    >+</button>
                </div>
            </div>

            <div class="cart-item-end">
                <span class="line-price">
                    ${formatPrice(item.price * item.quantity)}
                </span>

                <button
                    type="button"
                    class="remove-btn"
                    data-action="remove"
                    data-id="${item.id}"
                >Remove</button>
            </div>

        </div>
    `).join("");
}

// Handle all Add buttons.
document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", function () {
        const product = {
            id: this.dataset.id,
            name: this.dataset.name,
            price: Number(this.dataset.price),
            image: this.dataset.image
        };

        addToCart(product);

        // Give feedback when a product is added.
        const originalText = this.textContent;
        this.textContent = "Added ✓";
        this.classList.add("added");

        this.disabled = true;

        setTimeout(() => {
            this.textContent = originalText;
            this.classList.remove("added");
            this.disabled = false;
        }, 600);
    });
});

// Handle quantity controls and Remove buttons.
cartItems.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "increase") {
        changeQuantity(id, 1);
    } else if (action === "decrease") {
        changeQuantity(id, -1);
    } else if (action === "remove") {
        removeFromCart(id);
    }
});

// Checkout is only a demonstration, not a real payment system.
checkoutButton.addEventListener("click", function () {
    if (cart.size === 0) {
        alert("Your cart is empty! Please add a product first.");
        return;
    }

    alert(
        "This is a demo checkout.\n\n" +
        "Total items: " + getTotalItems() + "\n" +
        "Total price: " + cartTotal.textContent + "\n\n" +
        "No real payment has been made."
    );
});

// Set the initial cart display.
updateCart();
