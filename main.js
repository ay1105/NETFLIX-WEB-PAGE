// Toggle login page
const signInBtn = document.getElementById('signInBtn');
const loginPage = document.getElementById('loginPage');
const closeLogin = document.getElementById('closeLogin');

signInBtn.addEventListener('click', () => {
    loginPage.style.display = 'flex';
});

closeLogin.addEventListener('click', () => {
    loginPage.style.display = 'none';
});

// Accordion functionality
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        accordionItem.classList.toggle('active');
        
        // Change the plus to minus and vice versa
        const icon = header.querySelector('span:last-child');
        icon.textContent = icon.textContent === '+' ? '×' : '+';
    });
});

// Floating label effect for login inputs
const loginInputs = document.querySelectorAll('.login-input');

loginInputs.forEach(input => {
    input.addEventListener('focus', () => {
        const label = input.nextElementSibling;
        label.style.top = '7px';
        label.style.fontSize = '11px';
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            const label = input.nextElementSibling;
            label.style.top = '15px';
            label.style.fontSize = '16px';
        }
    });
});