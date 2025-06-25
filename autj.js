// Handle login form submission
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('netflix_token', data.token);
            window.location.href = 'home.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('Login failed. Please try again.');
    }
});

// Handle signup form submission
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('netflix_token', data.token);
            window.location.href = 'home.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (err) {
        console.error('Registration error:', err);
        alert('Registration failed. Please try again.');
    }
});

// Check authentication on home page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('home.html')) {
        const token = localStorage.getItem('netflix_token');
        if (!token) window.location.href = 'login.html';
    }
});

// Sign out
document.getElementById('signout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('netflix_token');
    window.location.href = 'login.html';
});