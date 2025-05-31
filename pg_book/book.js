// pg_book/book.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('serviceBookingForm');
    const formMessage = document.getElementById('form-submission-message'); // Make sure this element exists in your book.html
    const submitButton = form.querySelector('button[type="submit"]'); // More specific selector for the submit button
    const spinner = submitButton ? submitButton.querySelector('.spinner') : null; // Ensure spinner is child of button

    // Helper function to create the message element if it doesn't exist
    function ensureFormMessageElement() {
        let messageEl = document.getElementById('form-submission-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'form-submission-message';
            messageEl.className = 'form-message'; // Add a default class for styling
            // Insert it after the form, or a more appropriate place
            form.parentNode.insertBefore(messageEl, form.nextSibling);
        }
        return messageEl;
    }

    // Input validation and interaction
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    const phoneInput = document.getElementById('phone');

    inputs.forEach(input => {
        // Add blur event listener to check validity and add/remove .user-invalid class
        input.addEventListener('blur', function () {
            if (!this.checkValidity()) {
                this.classList.add('user-invalid');
            } else {
                this.classList.remove('user-invalid');
            }
        });

        // Existing invalid event for shake (can be kept or modified)
        input.addEventListener('invalid', (event) => {
            event.preventDefault(); // Prevent default browser validation popups
            input.classList.add('shake');
            input.classList.add('user-invalid'); // Also add user-invalid on this event
            const messageEl = ensureFormMessageElement();
            messageEl.textContent = 'Please fill out all required fields correctly.';
            messageEl.className = 'form-message error';
            setTimeout(() => {
                input.classList.remove('shake');
            }, 400);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('shake')) {
                input.classList.remove('shake');
            }
            // If input becomes valid, remove .user-invalid (optional, blur might be enough)
            if (input.checkValidity()) {
                input.classList.remove('user-invalid');
            }

            const messageEl = document.getElementById('form-submission-message');
            if (messageEl && messageEl.classList.contains('error')) {
                messageEl.textContent = '';
                messageEl.className = 'form-message';
            }
        });
    });

    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
            const maxLength = 10; // Max 10 digits

            if (value.length > maxLength) {
                value = value.slice(0, maxLength); // Truncate to 10 digits
            }

            let formattedValue = '';
            if (value.length > 0) {
                formattedValue = '(' + value.substring(0, 3);
            }
            if (value.length >= 4) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length >= 7) {
                formattedValue += '-' + value.substring(6, 10);
            }

            e.target.value = formattedValue;

            // Visual cue for validity (can be refined)
            const rawDigits = e.target.value.replace(/\D/g, '');
            if (rawDigits.length > 0 && rawDigits.length < 10) {
                e.target.classList.add('user-invalid'); // Mark as invalid if partially filled but not complete
                phoneInput.style.borderColor = 'var(--color-error, #d9534f)'; // Keep visual cue
            } else if (rawDigits.length === 10) {
                e.target.classList.remove('user-invalid');
                phoneInput.style.borderColor = ''; // Reset border or set to valid color
            } else if (rawDigits.length === 0 && e.target.required) {
                // If empty and required, let the blur/submit validation handle it
                e.target.classList.remove('user-invalid');
                phoneInput.style.borderColor = '';
            } else {
                e.target.classList.remove('user-invalid');
                phoneInput.style.borderColor = '';
            }
        });

        // Add blur listener for phone to ensure .user-invalid is set correctly if left incomplete
        phoneInput.addEventListener('blur', function () {
            const rawDigits = this.value.replace(/\D/g, '');
            if (this.required && rawDigits.length === 0) {
                this.classList.add('user-invalid');
            } else if (rawDigits.length > 0 && rawDigits.length < 10) {
                this.classList.add('user-invalid');
            } else if (rawDigits.length === 10) {
                this.classList.remove('user-invalid');
            } else {
                this.classList.remove('user-invalid'); // If not required and empty
            }
        });
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const currentFormMessage = ensureFormMessageElement();
        currentFormMessage.textContent = '';
        currentFormMessage.className = 'form-message';

        let formIsValid = true;
        inputs.forEach(input => {
            // For phone input, specifically check if 10 digits are present after stripping format
            if (input.id === 'phone') {
                const phoneDigits = input.value.replace(/\D/g, '');
                if (input.required && phoneDigits.length !== 10) {
                    input.classList.add('shake');
                    input.classList.add('user-invalid');
                    formIsValid = false;
                } else if (!input.required && phoneDigits.length > 0 && phoneDigits.length !== 10) {
                    // Optional but filled incorrectly
                    input.classList.add('shake');
                    input.classList.add('user-invalid');
                    formIsValid = false;
                }
                else {
                    input.classList.remove('user-invalid');
                }
            } else { // For other inputs
                if (!input.checkValidity()) {
                    input.classList.add('shake');
                    input.classList.add('user-invalid');
                    formIsValid = false;
                } else {
                    input.classList.remove('user-invalid');
                }
            }
        });

        // This specific phone validation block might be redundant if covered above,
        // but ensures the message is specific if only phone is the issue.
        if (phoneInput) {
            const phoneDigits = phoneInput.value.replace(/\D/g, '');
            if (phoneInput.required && phoneDigits.length !== 10) {
                phoneInput.classList.add('shake'); // Ensure shake if not already applied
                phoneInput.classList.add('user-invalid');
                currentFormMessage.textContent = 'Phone number must be 10 digits.';
                currentFormMessage.classList.add('error');
                formIsValid = false; // Ensure formIsValid is false
            } else if (!phoneInput.required && phoneDigits.length > 0 && phoneDigits.length !== 10) {
                phoneInput.classList.add('shake');
                phoneInput.classList.add('user-invalid');
                currentFormMessage.textContent = 'If providing a phone number, it must be 10 digits.';
                currentFormMessage.classList.add('error');
                formIsValid = false;
            }
        }


        if (!formIsValid) {
            if (!currentFormMessage.textContent) { // Add generic message if no specific one set
                currentFormMessage.textContent = 'Please correct the highlighted fields.';
                currentFormMessage.classList.add('error');
            }
            currentFormMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (submitButton) submitButton.disabled = true;
        if (spinner) spinner.style.display = 'inline-block';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        // Ensure phone number sent to backend is just digits, or the formatted one if preferred by backend
        // For now, let's assume backend can handle the formatted one or strip it.
        // If backend expects raw digits: data.phone = data.phone.replace(/\D/g, '');

        try {
            const response = await fetch('/send-booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json(); // Try to parse JSON regardless of status for error messages

            if (response.ok) {
                form.reset();
                currentFormMessage.textContent = result.message || 'Thank you! Your booking request has been sent.';
                currentFormMessage.classList.add('success');
                // Optional: Display a summary (client-side)
                // displaySummary(data);
            } else {
                // Use error message from server if available, otherwise a generic one
                currentFormMessage.textContent = result.message || result.error || 'An error occurred. Please try again.';
                currentFormMessage.classList.add('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            currentFormMessage.textContent = 'A network error occurred. Please check your connection and try again.';
            currentFormMessage.classList.add('error');
        } finally {
            if (submitButton) submitButton.disabled = false;
            if (spinner) spinner.style.display = 'none';
            // Scroll to the message
            currentFormMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Optional: Function to display summary (if you removed it or want to re-add)
    /*
    function displaySummary(data) {
        const summarySection = document.getElementById('booking-summary-section'); // Ensure this ID exists in HTML
        if (summarySection) {
            summarySection.innerHTML = `<h3>Booking Request Summary:</h3>
                <p><strong>Name:</strong> ${escapeHTML(data.name)}</p>
                <p><strong>Email:</strong> ${escapeHTML(data.email)}</p>
                <p><strong>Service:</strong> ${escapeHTML(data.serviceType)}</p>
                <p>We'll be in touch soon!</p>`;
            summarySection.style.display = 'block';
            summarySection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    */

    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
