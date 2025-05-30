// pg_book/book.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('serviceBookingForm');
    const formMessage = document.getElementById('form-submission-message');
    const submitButton = form.querySelector('.submit-btn');
    const spinner = submitButton.querySelector('.spinner');

    // Input validation and interaction
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        input.addEventListener('invalid', (event) => {
            event.preventDefault(); // Prevent default browser validation popups
            input.classList.add('shake');
            // Remove shake class after animation so it can be re-added on subsequent invalid submissions
            input.addEventListener('animationend', () => {
                input.classList.remove('shake');
            }, { once: true });
        });

        // Optional: Clear custom validity on input if you were setting it
        input.addEventListener('input', () => {
            if (input.validity.valid) {
                input.classList.remove('shake'); // Also remove shake if user starts correcting
            }
        });
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Show spinner and disable button
        spinner.style.display = 'inline-block';
        submitButton.disabled = true;
        submitButton.style.cursor = 'wait';

        // Clear previous messages
        formMessage.textContent = '';
        formMessage.className = ''; // Clears success/error classes

        const formData = new FormData(form);
        // const data = {}; // Not strictly needed if just using FormData for fetch
        // formData.forEach((value, key) => data[key] = value);

        // Basic phone number validation (numeric, 10-15 digits)
        const phoneInput = form.querySelector('#phone');
        if (phoneInput && !/^[0-9]{10,15}$/.test(phoneInput.value)) {
            displayMessage('Please enter a valid phone number (10-15 digits, no dashes or spaces).', 'error');
            phoneInput.classList.add('shake');
            phoneInput.focus();
            resetSubmitButton();
            return;
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset(); // Clear the form
                let summaryHTML = '<h3>Thank you for your booking request!</h3><p>We will get back to you shortly. A confirmation has been sent to your email if provided.</p><h4>Booking Summary:</h4><ul>';
                for (const [key, value] of formData.entries()) {
                    // Create a more readable label from the key
                    let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    if (value && key !== '_subject' && key !== '_replyto') { // Don't show hidden fields or replyto in summary
                        summaryHTML += `<li><strong>${label}:</strong> ${escapeHTML(value.toString())}</li>`;
                    }
                }
                summaryHTML += '</ul>';
                displayMessage(summaryHTML, 'success', true); // Pass true for isHTML

            } else {
                const errorData = await response.json().catch(() => ({})); // Catch if response is not JSON
                const errorMessage = errorData.errors ? errorData.errors.map(err => err.message).join(', ') : 'Oops! There was a problem submitting your form. Please check your details and try again.';
                displayMessage(`Error: ${escapeHTML(errorMessage)}`, 'error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            displayMessage('Network error or unexpected issue. Please try again.', 'error');
        }
        resetSubmitButton();
    });

    function displayMessage(message, type, isHTML = false) {
        if (isHTML) {
            formMessage.innerHTML = message;
        } else {
            formMessage.textContent = message;
        }
        formMessage.className = type; // 'success' or 'error'
        formMessage.setAttribute('role', type === 'error' ? 'alert' : 'status');
    }

    function resetSubmitButton() {
        spinner.style.display = 'none';
        submitButton.disabled = false;
        submitButton.style.cursor = 'pointer';
    }

    // Helper to prevent XSS in summary
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // Call button hover - CSS handles the pulse.
    // Focus highlight - CSS :focus handles this.
    // Invalid input shake - CSS .shake and JS to add/remove class are implemented.
});
