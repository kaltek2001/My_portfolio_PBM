// ===== contact.js =====
// IMPROVED: Form validation with user feedback and demo submission

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    
    // Create containers for dynamic messages
    const formContainer = document.querySelector('.contact-form');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.style.display = 'none';
    formContainer.insertBefore(messageDiv, form);

    // Helper function to show error
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        // Remove any existing error
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();

        input.classList.add('error');
        const error = document.createElement('span');
        error.className = 'error-message';
        error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        formGroup.appendChild(error);
    }

    // Helper function to clear error
    function clearError(input) {
        input.classList.remove('error');
        const formGroup = input.closest('.form-group');
        const error = formGroup.querySelector('.error-message');
        if (error) error.remove();
    }

    // Helper function to show success message
    function showSuccessMessage(message) {
        messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        messageDiv.style.display = 'flex';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    // Validate email format
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Form submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        // Clear all previous errors
        [name, email, subject, message].forEach(field => {
            if (field) clearError(field);
        });

        // Validate Name (required)
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        }

        // Validate Email (required + format)
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Message (required)
        if (!message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        }

        // If form is valid
        if (isValid) {
            // Collect form data
            const formData = {
                name: name.value.trim(),
                email: email.value.trim(),
                subject: subject.value.trim() || '(No subject)',
                message: message.value.trim(),
                timestamp: new Date().toLocaleString()
            };

            // Console log for demo
            console.log('Form submitted successfully:', formData);

            // Show success message
            showSuccessMessage('Your message has been sent! (Demo)');

            // Reset form
            form.reset();

            // Optional: You could add actual AJAX submission here
            // For demo, we just simulate success
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Real-time validation on blur for better UX
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.id === 'email' && input.value.trim()) {
                if (!isValidEmail(input.value.trim())) {
                    showError(input, 'Invalid email format');
                } else {
                    clearError(input);
                }
            } else if (input.hasAttribute('required') && !input.value.trim()) {
                showError(input, `${input.previousElementSibling.textContent.replace('*', '').trim()} is required`);
            } else {
                clearError(input);
            }
        });

        // Clear error on input
        input.addEventListener('input', () => {
            clearError(input);
        });
    });
});