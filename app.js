document.addEventListener('DOMContentLoaded', function () {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 50;

    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > scrollThreshold) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // Hamburger Menu Toggle
    const hamburgerButton = document.querySelector('.hamburger-menu');
    const navbarMenuContent = document.querySelector('.navbar-menu-content');

    if (hamburgerButton && navbarMenuContent) {
        hamburgerButton.addEventListener('click', () => {
            navbarMenuContent.classList.toggle('is-open');
            hamburgerButton.classList.toggle('is-active');
            const isExpanded = navbarMenuContent.classList.contains('is-open');
            hamburgerButton.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 780) {
            if (navbarMenuContent && navbarMenuContent.classList.contains('is-open')) {
                navbarMenuContent.classList.remove('is-open');
                if (hamburgerButton) {
                    hamburgerButton.classList.remove('is-active');
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                }
            }
        }
        // The updateButtonText function will also run on resize due to its own event listener
    });

    // Intersection Observer for "What We Do" columns slide-in
    const whatWeDoColumns = document.querySelectorAll('#whatWeDo .column');
    const observerOptions = { // General observer options, can be reused
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Default threshold
    };

    const whatWeDoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    whatWeDoColumns.forEach(column => {
        whatWeDoObserver.observe(column);
    });

    // Intersection Observer for "Why Us" section columns slide-in (staggered)
    const whyUsSection = document.querySelector('#whyUs');
    let whyUsTopRowColumns = [];
    let whyUsBottomRowColumns = [];

    if (whyUsSection) {
        const directRowsInWhyUs = whyUsSection.querySelectorAll(':scope > .row');
        // The first .row contains sectionHead, the second .row is the top row of columns.
        if (directRowsInWhyUs.length > 1 && directRowsInWhyUs[1]) {
            whyUsTopRowColumns = directRowsInWhyUs[1].querySelectorAll('.column');
        }
        // The .row with class .bottom contains the bottom columns.
        // This selector is more specific and robust for the bottom row.
        whyUsBottomRowColumns = whyUsSection.querySelectorAll('.row.bottom .column');
    }

    const whyUsSectionObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.25 // Trigger when 25% of the #whyUs section is visible
    };

    const whyUsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate top row columns immediately
                whyUsTopRowColumns.forEach(column => {
                    column.classList.add('is-visible');
                });

                // Animate bottom row columns after a delay
                setTimeout(() => {
                    whyUsBottomRowColumns.forEach(column => {
                        column.classList.add('is-visible');
                    });
                }, 500); // 500 milliseconds = 0.5 seconds

                observer.unobserve(entry.target); // Stop observing the #whyUs section itself
            }
        });
    }, whyUsSectionObserverOptions);

    if (whyUsSection && (whyUsTopRowColumns.length > 0 || whyUsBottomRowColumns.length > 0)) {
        whyUsObserver.observe(whyUsSection);
    }

    // Change navbar button text on specific viewport width
    const navbarBookButton = document.querySelector('.navbar-book-btn'); // Updated selector
    if (navbarBookButton) {
        const originalButtonText = "Book Appointment Now"; // Store the original text
        const mobileButtonText = "Book";
        const breakpoint = 929; // Viewport width in pixels

        const updateButtonText = () => {
            if (window.innerWidth <= breakpoint) {
                if (navbarBookButton.textContent !== mobileButtonText) {
                    navbarBookButton.textContent = mobileButtonText;
                }
            } else {
                if (navbarBookButton.textContent !== originalButtonText) {
                    navbarBookButton.textContent = originalButtonText;
                }
            }
        };

        // Initial check on page load
        updateButtonText();

        // Update text on window resize
        window.addEventListener('resize', updateButtonText);
    }
});