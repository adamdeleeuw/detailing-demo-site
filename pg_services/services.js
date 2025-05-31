document.addEventListener('DOMContentLoaded', () => {
    // --- Learn More Button Functionality ---
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');

    learnMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const detailsId = button.getAttribute('aria-controls');
            const detailsElement = document.getElementById(detailsId);
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            if (detailsElement) {
                if (isExpanded) {
                    // Collapse
                    button.setAttribute('aria-expanded', 'false');
                    detailsElement.classList.remove('expanded');
                } else {
                    // Expand
                    button.setAttribute('aria-expanded', 'true');
                    detailsElement.classList.add('expanded');
                }
            }
        });
    });

    // --- Scroll-in Animation for Service Cards ---
    const serviceCards = document.querySelectorAll('.service-card');

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    };

    const cardObserver = new IntersectionObserver(observerCallback, observerOptions);

    serviceCards.forEach(card => {
        cardObserver.observe(card);
    });

    // --- Optional: Smooth scroll to section if linked from footer ---
    // This handles cases where a link like "services.html#details-exterior" is clicked
    if (window.location.hash) {
        const hash = window.location.hash;
        const targetElement = document.querySelector(hash);
        if (targetElement && targetElement.classList.contains('service-details')) {
            // Find the corresponding button to expand the section
            const button = document.querySelector(`.learn-more-btn[aria-controls="${targetElement.id}"]`);
            if (button) {
                // Expand the section
                button.setAttribute('aria-expanded', 'true');
                targetElement.classList.add('expanded');

                // Scroll to the card containing these details, not the details div itself
                const card = targetElement.closest('.service-card');
                if (card) {
                    setTimeout(() => { // Timeout to allow for expansion animation
                        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50); // Adjust timeout if needed based on CSS transition duration
                }
            }
        } else if (targetElement) { // For other general hashes
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }
    }
});