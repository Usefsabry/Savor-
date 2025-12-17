// Background Slider Animation
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function changeSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

setInterval(changeSlide, 5000);

// Regular Expressions for Validation
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

// Form Elements
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Create Alert Message Element
function createAlertElement() {
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'alert-message';
    
    const form = document.querySelector('form');
    form.parentNode.insertBefore(alert, form);
    
    return alert;
}

// Show Alert Message
function showAlert(message, type = 'error') {
    const alert = createAlertElement();
    
    const icon = type === 'error' 
        ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';
    
    alert.innerHTML = icon + '<span>' + message + '</span>';
    alert.className = 'alert-message ' + type + ' show';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Hide Alert Message
function hideAlert() {
    const alert = document.querySelector('.alert-message');
    if (alert) {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }
}

// Email Validation Function (Detailed)
function validateEmail(email) {
    if (!email) {
        return 'Email address is required';
    }
    
    if (email.length < 5) {
        return 'Email is too short';
    }
    
    if (email.length > 100) {
        return 'Email is too long';
    }
    
    if (/^[.@]|[.@]$/.test(email)) {
        return 'Email cannot start or end with . or @';
    }
    
    if (!email.includes('@')) {
        return 'Email must contain @ symbol';
    }
    
    if ((email.match(/@/g) || []).length > 1) {
        return 'Email can only contain one @ symbol';
    }
    
    const parts = email.split('@');
    const localPart = parts[0];
    const domainPart = parts[1];
    
    if (!localPart || localPart.length < 1) {
        return 'Email must have characters before @';
    }
    
    if (!domainPart || !domainPart.includes('.')) {
        return 'Email must have a valid domain (e.g., gmail.com)';
    }
    
    const domainExtension = domainPart.split('.').pop();
    if (!domainExtension || domainExtension.length < 2) {
        return 'Email must have a valid extension (e.g., .com, .net)';
    }
    
    if (/\s/.test(email)) {
        return 'Email cannot contain spaces';
    }
    
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address (e.g., user@example.com)';
    }
    
    return '';
}

// Password Validation Function
function validatePassword(password) {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    if (!passwordRegex.test(password)) {
        return 'Password must contain uppercase, lowercase, number and special character';
    }
    return '';
}

// Show Error Function
function showError(input, message) {
    const inputGroup = input.parentElement;
    const errorElement = inputGroup.querySelector('.error-message');
    
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
}

// Show Success Function
function showSuccess(input) {
    const inputGroup = input.parentElement;
    const errorElement = inputGroup.querySelector('.error-message');
    
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
}

// Real-time Validation for Email
emailInput.addEventListener('blur', function() {
    const error = validateEmail(this.value.trim());
    if (error) {
        showError(this, error);
    } else {
        showSuccess(this);
    }
});

emailInput.addEventListener('input', function() {
    if (this.classList.contains('error') || this.classList.contains('success')) {
        const error = validateEmail(this.value.trim());
        if (error) {
            showError(this, error);
        } else {
            showSuccess(this);
        }
    }
});

// Real-time Validation for Password
passwordInput.addEventListener('blur', function() {
    const error = validatePassword(this.value);
    if (error) {
        showError(this, error);
    } else {
        showSuccess(this);
    }
});

passwordInput.addEventListener('input', function() {
    if (this.classList.contains('error') || this.classList.contains('success')) {
        const error = validatePassword(this.value);
        if (error) {
            showError(this, error);
        } else {
            showSuccess(this);
        }
    }
});

// Form Submit Handler
form.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Hide any existing alerts
    hideAlert();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    let isValid = true;
    let errorMessages = [];
    
    // Validate Email
    const emailError = validateEmail(email);
    if (emailError) {
        showError(emailInput, emailError);
        errorMessages.push(emailError);
        isValid = false;
    } else {
        showSuccess(emailInput);
    }
    
    // Validate Password
    const passwordError = validatePassword(password);
    if (passwordError) {
        showError(passwordInput, passwordError);
        errorMessages.push(passwordError);
        isValid = false;
    } else {
        showSuccess(passwordInput);
    }
    
    // Show alert based on validation result
    if (!isValid) {
        // Check if all fields are empty
        if (!email && !password) {
            showAlert('Please fill in all fields to continue', 'error');
        } else {
            showAlert(errorMessages[0], 'error');
        }
        return false; // Stop form submission
    } else {
        showAlert('Login successful! Redirecting...', 'success');
        console.log('Form submitted successfully!');
        console.log('Email:', email);
        
        // Simulate redirect after 2 seconds
        setTimeout(() => {
            // Here you would normally send data to server or redirect
            // window.location.href = 'dashboard.html';
            alert('Redirecting to dashboard...');
        }, 2000);
    }
    
    return false; // Prevent default form submission
});