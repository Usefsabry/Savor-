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

    // Navbar Scroll Effect (Included for Menu Page)
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
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

    // --- Menu Page Specific Logic ---

    // Simple background slider rotation
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.food-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter.toLowerCase();

            cards.forEach(card => {
                const category = card.querySelector('.card-category').textContent.toLowerCase();
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Search Logic
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();

            cards.forEach(card => {
                const title = card.querySelector('.food-title').textContent.toLowerCase();
                if (title.includes(term)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Cart Logic
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('savorCart')) || [];
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        const cartFloat = document.getElementById('cartFloat');
        const cartCount = document.getElementById('cartCount');

        if (cartCount) cartCount.textContent = count;

        if (cartFloat) {
            if (count > 0) {
                cartFloat.classList.add('visible');
            } else {
                cartFloat.classList.remove('visible');
            }
        }
    }

    // Initialize cart count on load
    updateCartCount();

    function showToast(message) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    const orderBtns = document.querySelectorAll('.order-btn');
    orderBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.food-card');
            const title = card.querySelector('.food-title').textContent;
            const priceStr = card.querySelector('.food-price').textContent;
            const price = parseFloat(priceStr.replace('$', ''));
            const imageSrc = card.querySelector('img').src;

            const item = {
                title: title,
                price: price,
                image: imageSrc,
                quantity: 1
            };

            let cart = JSON.parse(localStorage.getItem('savorCart')) || [];

            // Check if item exists
            const existingItem = cart.find(i => i.title === item.title);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(item);
            }

            localStorage.setItem('savorCart', JSON.stringify(cart));
            updateCartCount();
            showToast(`Added ${title} to order`);

            // Animation effect on button
            btn.textContent = "Added!";
            btn.style.background = "#22c55e";
            setTimeout(() => {
                btn.textContent = "Order";
                btn.style.background = ""; // Reset to CSS default
            }, 2000);
        });
    });
});
