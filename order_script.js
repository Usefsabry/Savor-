document.addEventListener('DOMContentLoaded', () => {
    // --- Shared Logic ---

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // Mobile Menu & Auth Injection
    const navMenu = document.querySelector('.nav-menu');
    const navAuth = document.querySelector('.nav-auth');
    if (navMenu && navAuth && !document.querySelector('.mobile-auth-container')) {
        const mobileAuthDiv = document.createElement('div');
        mobileAuthDiv.className = 'mobile-auth-container';
        // Clone the LI items from navAuth
        Array.from(navAuth.children).forEach(li => {
            mobileAuthDiv.appendChild(li.cloneNode(true));
        });
        navMenu.appendChild(mobileAuthDiv);
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            toggleMenu();
        });
    }

    function toggleMenu() {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');

        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Note: Scroll Listener Omitted for Order Page as per user preference (disabled in original script.js)

    // --- Order Page Specific Logic ---
    let cart = JSON.parse(localStorage.getItem('savorCart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const grandTotalEl = document.getElementById('grandTotal');
    const itemCountEl = document.getElementById('itemCount');

    function renderCart() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Your plate is empty. Go add some delicious food!</div>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                count += item.quantity;

                const el = document.createElement('div');
                el.className = 'cart-item';
                el.style.animationDelay = `${index * 0.1}s`;
                el.innerHTML = `
                        <img src="${item.image}" alt="${item.title}">
                        <div class="item-details">
                            <h3>${item.title}</h3>
                            <div class="price">$${item.price.toFixed(2)}</div>
                        </div>
                        <div class="item-controls">
                            <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeItem(${index})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    `;
                cartItemsContainer.appendChild(el);
            });
        }

        if (grandTotalEl) grandTotalEl.textContent = '$' + total.toFixed(2);
        if (itemCountEl) itemCountEl.textContent = count + (count === 1 ? ' item' : ' items');
    }

    // Expose functions to window since they are called from HTML onclick attributes
    window.updateQty = (index, change) => {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
        } else if (change === -1) {
            // If reducing to 0, ask to confirm removal
            if (confirm("Remove this item?")) {
                cart.splice(index, 1);
            } else {
                return;
            }
        }
        saveCart();
    };

    window.removeItem = (index) => {
        cart.splice(index, 1);
        saveCart();
    };

    function saveCart() {
        localStorage.setItem('savorCart', JSON.stringify(cart));
        renderCart();
    }

    // Checkout 
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            // Mock submission
            localStorage.removeItem('savorCart');
            cart = [];
            renderCart();

            // Redirect to premium welcome page
            window.location.href = 'welcome.html';
        });
    }

    renderCart();
});
