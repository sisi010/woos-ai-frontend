// API Configuration
const API_BASE_URL = 'https://woosai-backend-production.up.railway.app/api';
// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('woosai_token');
}

// Set auth token
function setAuthToken(token) {
    localStorage.setItem('woosai_token', token);
}

// Remove auth token
function removeAuthToken() {
    localStorage.removeItem('woosai_token');
}

// Get user data from localStorage
function getUserData() {
    const userData = localStorage.getItem('woosai_user');
    return userData ? JSON.parse(userData) : null;
}

// Set user data
function setUserData(user) {
    localStorage.setItem('woosai_user', JSON.stringify(user));
}

// Remove user data
function removeUserData() {
    localStorage.removeItem('woosai_user');
}

// API Request Helper
async function apiRequest(endpoint, method = 'GET', data = null, requireAuth = false) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // Add authorization header if required
    if (requireAuth) {
        const token = getAuthToken();
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
    }

    // Add body for POST/PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            const error = new Error(result.detail || result.error || 'Request failed');
            error.status = response.status;
            throw error;
        }

        return result;
    } catch (error) {
        // Only log unexpected errors (not 401)
        if (!error.status || error.status !== 401) {
            console.error('API Request Error:', error);
        }
        throw error;
    }
}

// Auth APIs
async function register(email, password, name) {
    const result = await apiRequest('/auth/register', 'POST', {
        email,
        password,
        name
    });
    
    // Save token and user data
    setAuthToken(result.token);
    setUserData(result.user);
    
    return result;
}

async function login(email, password) {
    const result = await apiRequest('/auth/login', 'POST', {
        email,
        password
    });
    
    // Save token and user data
    setAuthToken(result.token);
    setUserData(result.user);
    
    return result;
}

async function logout() {
    try {
        await apiRequest('/auth/logout', 'POST', null, true);
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Always clear local storage
        removeAuthToken();
        removeUserData();
        window.location.href = '/index.html';
    }
}

async function getCurrentUser() {
    return await apiRequest('/auth/me', 'GET', null, true);
}

// License APIs
async function generateLicense(plan, duration_days = 30) {
    return await apiRequest('/licenses/generate', 'POST', {
        plan,
        duration_days
    }, true);
}

async function verifyLicense(license_key) {
    return await apiRequest('/licenses/verify', 'POST', {
        license_key
    });
}

async function getMyLicenses() {
    return await apiRequest('/licenses/my-licenses', 'GET', null, true);
}

// Payment APIs
async function createCheckoutSession(plan) {
    return await apiRequest('/payments/create-checkout-session', 'POST', {
        plan
    }, true);
}

async function verifyPaymentSession(session_id) {
    return await apiRequest('/payments/verify-session', 'POST', {
        session_id
    }, true);
}

async function getMyPayments() {
    try {
        return await apiRequest('/payments/my-payments', 'GET', null, true);
    } catch (error) {
        // If 401 (not authenticated), return empty payments instead of throwing error
        if (error.status === 401 || error.message.includes('Unauthorized')) {
            console.log('User not authenticated - returning empty payments');
            return { payments: [], total: 0 };
        }
        // For other errors, throw as normal
        throw error;
    }
}

// Check if user is logged in
function isLoggedIn() {
    return getAuthToken() !== null;
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// Show loading spinner
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="spinner">Loading...</div>';
    }
}

// Hide loading spinner
function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
    }
}

// Show error message
function showError(message, elementId = 'error-message') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="error">${message}</div>`;
        element.style.display = 'block';
    } else {
        alert(message);
    }
}

// Show success message
function showSuccess(message, elementId = 'success-message') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="success">${message}</div>`;
        element.style.display = 'block';
    }
}

// Clear messages
function clearMessages() {
    const errorElement = document.getElementById('error-message');
    const successElement = document.getElementById('success-message');
    
    if (errorElement) errorElement.style.display = 'none';
    if (successElement) successElement.style.display = 'none';
}

// ============================================
// LEMON SQUEEZY PAYMENT INTEGRATION
// ============================================

const BACKEND_URL = 'https://woosai-backend-production.up.railway.app';

/**
 * Upgrade to Premium via Lemon Squeezy
 */
async function upgradeToPremium(email, licenseKey) {
    try {
        // Show loading
        showPaymentLoading('Creating checkout session...');
        
        // Call backend
        const response = await fetch(`${BACKEND_URL}/api/payment/create-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                license_key: licenseKey
            })
        });
        
        const data = await response.json();
        
        if (data.success && data.url) {
            // Redirect to Lemon Squeezy
            window.location.href = data.url;
        } else {
            throw new Error(data.detail || 'Failed to create checkout');
        }
        
    } catch (error) {
        hidePaymentLoading();
        alert('Payment Error: ' + error.message);
        console.error('Payment error:', error);
    }
}

/**
 * Handle Premium Plan button click
 */
async function handlePremiumPlan() {
    // Get email
    const email = prompt('Enter your email address for Premium upgrade:');
    
    if (!email) {
        alert('Email is required');
        return;
    }
    
    // Validate email
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Get or create license key
    const licenseKey = localStorage.getItem('woosai_license_key') || 'WOOSAI-FREE-TEMP';
    
    // Save email
    localStorage.setItem('woosai_email', email);
    
    // Upgrade
    await upgradeToPremium(email, licenseKey);
}

/**
 * Validate email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show payment loading
 */
function showPaymentLoading(message = 'Processing...') {
    const overlay = document.createElement('div');
    overlay.id = 'payment-loading';
    overlay.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            backdrop-filter: blur(5px);
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                max-width: 400px;
            ">
                <div style="
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #667eea;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 1.5em;">
                    ${message}
                </h3>
                <p style="margin: 0; color: #666;">
                    Redirecting to Lemon Squeezy...
                </p>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(overlay);
}

/**
 * Hide payment loading
 */
function hidePaymentLoading() {
    const overlay = document.getElementById('payment-loading');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * Get Premium price
 */
async function getPremiumPrice() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/payment/get-price`);
        const data = await response.json();
        
        if (data.success) {
            return data;
        }
        
        return { price: 9.0, currency: 'USD', interval: 'month' };
        
    } catch (error) {
        console.error('Failed to get price:', error);
        return { price: 9.0, currency: 'USD', interval: 'month' };
    }
}

// Initialize pricing on page load
if (window.location.pathname.includes('pricing.html')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const priceInfo = await getPremiumPrice();
        
        // Update price displays
        const priceElements = document.querySelectorAll('.plan-price.premium-price, .premium-price');
        priceElements.forEach(el => {
            if (el.textContent.includes('$')) {
                el.innerHTML = `$${priceInfo.price}<small>/${priceInfo.interval}</small>`;
            }
        });
    });
}

console.log('✅ Payment integration loaded');