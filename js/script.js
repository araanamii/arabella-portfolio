/* ==============================
   FLIP DIGITAL BUSINESS CARD
============================== */

const businessCard = document.getElementById("business-card");

if (businessCard) {
    function flipBusinessCard() {
        const isFlipped = businessCard.classList.toggle("is-flipped");

        businessCard.setAttribute(
            "aria-label",
            isFlipped
                ? "Back of business card. Press Enter or Space to flip back."
                : "Front of business card. Press Enter or Space to flip."
        );
    }

    businessCard.addEventListener("click", function (event) {
        // Keep links on the back clickable without flipping the card.
        if (event.target.closest("a")) {
            return;
        }

        flipBusinessCard();
    });

    businessCard.addEventListener("keydown", function (event) {
        if (
            (event.key === "Enter" || event.key === " ") &&
            event.target === businessCard
        ) {
            event.preventDefault();
            flipBusinessCard();
        }
    });
}


/* ==============================
   MOBILE NAVIGATION
============================== */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
    function closeMenu() {
        navLinks.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    menuToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("is-open");

        menuToggle.classList.toggle("is-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    // Close the menu after selecting a navigation link.
    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", function (event) {
        if (
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // Close the menu with Escape.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
}


/* ==============================
   ACTIVE NAVIGATION LINK
============================== */

const sections = document.querySelectorAll(
    "#about, #experience, #certifications, #skills, #contact"
);

const sectionLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
);

if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    sectionLinks.forEach(function (link) {
                        const isActive =
                            link.getAttribute("href") ===
                            "#" + entry.target.id;

                        link.classList.toggle("active", isActive);

                        if (isActive) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                }
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px"
        }
    );

    sections.forEach(function (section) {
        sectionObserver.observe(section);
    });
}


/* ==============================
   SCROLL-REVEAL ANIMATIONS
============================== */

const revealElements = document.querySelectorAll(
    ".section-heading, .about-container, .journey-card, " +
    ".certification-card, .skill-card, .business-card-wrapper"
);

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    revealElements.forEach(function (element) {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });
}

/* ==============================
   PORTFOLIO QR CODE
============================== */

const portfolioQR = document.getElementById("portfolio-qr");

if (portfolioQR) {
    // Replace this with your actual Vercel deployment URL.
    const portfolioURL = "https://YOUR-PORTFOLIO.vercel.app";

    const qrAPI =
        "https://api.qrserver.com/v1/create-qr-code/" +
        "?size=300x300&data=" +
        encodeURIComponent(portfolioURL);

    portfolioQR.src = qrAPI;
}