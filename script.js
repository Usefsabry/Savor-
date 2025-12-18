document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS Animation Library
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Mobile Menu Styling & Auth Injection
    // Move Auth buttons inside Nav Menu for Mobile to ensure visibility and reliable layout
    const navMenu = document.querySelector('.nav-menu');
    const navAuth = document.querySelector('.nav-auth');

    // Check if we haven't already injected them
    if (navMenu && navAuth && !document.querySelector('.mobile-auth-container')) {
        const mobileAuthDiv = document.createElement('div');
        mobileAuthDiv.className = 'mobile-auth-container';
        // Clone the LI items from navAuth
        Array.from(navAuth.children).forEach(li => {
            mobileAuthDiv.appendChild(li.cloneNode(true));
        });
        navMenu.appendChild(mobileAuthDiv);
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        // Disable scroll effect on Order Page if requested
        if (document.body.classList.contains('order-page')) {
            return;
        }

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const mobileMenuBtn = document.getElementById('mobile-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            toggleMenu();
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    function toggleMenu() {
        navMenu.classList.toggle('active');
        // navAuth.classList.toggle('active'); // Removed: Auth is now Inside menu
        mobileMenuBtn.classList.toggle('active');

        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Hero Background Slider
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroImages = [
            'images/background2.jpg',
            'images/steak.jpg',
            'images/pizza.jpg'
        ];

        let currentImageIndex = 0;

        // Preload images
        heroImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % heroImages.length;
            const nextImage = heroImages[currentImageIndex];
            // Set the CSS variable on the hero section
            heroSection.style.setProperty('--hero-bg', `url('${nextImage}')`);
        }, 5000); // Change every 5 seconds
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navMenu.style.display = '';
                }
            }
        });
    });
    // Cart Logic for Home Page
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
});
