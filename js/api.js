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
            throw new Error(result.error || 'Request failed');
        }

        return result;
    } catch (error) {
        console.error('API Request Error:', error);
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
    return await apiRequest('/payments/my-payments', 'GET', null, true);
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