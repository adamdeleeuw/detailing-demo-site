document.addEventListener('DOMContentLoaded', () => {
    const galleryCardContainers = document.querySelectorAll('.gallery-card-container');

    galleryCardContainers.forEach(container => {
        const card = container.querySelector('.gallery-card'); // This is the element that might receive aria-pressed

        // Initialize aria-pressed state on page load
        // Assuming cards start unflipped (not "pressed")
        if (card) { // Ensure card exists
            card.setAttribute('aria-pressed', 'false');
        }

        // Function to toggle the flip state
        const toggleFlip = () => {
            container.classList.toggle('flipped');

            if (card) { // Ensure card exists before setting attribute
                const isFlipped = container.classList.contains('flipped');
                card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
            }
        };

        // Click event listener
        container.addEventListener('click', toggleFlip);

        // Keyboard event listener for accessibility (Enter or Space)
        container.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent default spacebar scroll
                toggleFlip();
            }
        });
    });
});