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
    ".certification-card, .skill-card, .business-card-wrapper, " +
    ".project-card"
);

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {

    revealElements.forEach(function (element) {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                } else {
                    entry.target.classList.remove("revealed");
                }
            });
        },
        {
            threshold: 0.05,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });

} else {
    revealElements.forEach(function (element) {
        element.classList.add("revealed");
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

/* ==============================
   PROJECT GALLERY LIGHTBOX
============================== */

const projectGalleries = {
    sentry: {
        title: "SENTRY",
        images: [
            {
                src: "assets/images/sentry/sentry_login.png",
                caption: "Login Interface"
            },
            {
                src: "assets/images/sentry/sentry_prof-dash.png",
                caption: "Instructor Dashboard"
            },
            {
                src: "assets/images/sentry/sentry_prof-classes.png",
                caption: "Instructor Classes Overview"
            },
            {
                src: "assets/images/sentry/sentry_prof-indiv-class.png",
                caption: "Instructor Individual Class View"
            },
            {
                src: "assets/images/sentry/sentry_prof-sessions.png",
                caption: "Instructor Sessions"
            },
            {
                src: "assets/images/sentry/sentry_stud-dash.png",
                caption: "Student Dashboard"
            },
            {
                src: "assets/images/sentry/sentry_stud-classes.png",
                caption: "Student Classes Overview"
            },
            {
                src: "assets/images/sentry/sentry_stud-indiv-class.png",
                caption: "Student Individual Class View"
            }
        ]
    },

    "student-records": {
        title: "Student Records Management System",
        images: [
            {
                src: "assets/images/student_records/studrec_dash-1.png",
                caption: "Main Dashboard"
            },
            {
                src: "assets/images/student_records/studrec_dash-2.png",
                caption: "Main Dashboard (Continued)"
            },
            {
                src: "assets/images/student_records/studrec_add-1.png",
                caption: "Add Student Record"
            },
            {
                src: "assets/images/student_records/studrec_add-2.png",
                caption: "Add Student Record (Continued)"
            },
            {
                src: "assets/images/student_records/studrec-data.png",
                caption: "Student Database Overview"
            }
        ]
    },

    assettrack: {
        title: "AssetTrack",
        images: [
            {
                src: "assets/images/assettrack/assettrack_scan-1.jpg",
                caption: "Asset Scanning Interface"
            },
            {
                src: "assets/images/assettrack/assettrack_scan-2.jpg",
                caption: "Asset Scanning Interface (Continued)"
            },
            {
                src: "assets/images/assettrack/assettrack_dash-1.jpg",
                caption: "AssetTrack Dashboard"
            },
            {
                src: "assets/images/assettrack/assettrack_dash-2.jpg",
                caption: "AssetTrack Dashboard (Continued)"
            },
            {
                src: "assets/images/assettrack/assettrack_dash-3.jpg",
                caption: "AssetTrack Dashboard (Continued)"
            }
        ]
    },

    blottersystem: {
        title: "Barangay Comembo Blotter System",
        images: [
            {
                src: "assets/images/blottersystem/blottersystem_docu.png",
                caption: "Barangay Comembo Blotter System Documentation"
            },
            {
                src: "assets/images/blottersystem/blottersystem_login.png",
                caption: "Barangay Comembo Blotter System Login Interface"
            },
            {
                src: "assets/images/blottersystem/blottersystem_dash.png",
                caption: "Barangay Comembo Blotter System Dashboard"
            },
            {
                src: "assets/images/blottersystem/blottersystem_incidents.png",
                caption: "Barangay Comembo Blotter System Incidents"
            },
            {
                src: "assets/images/blottersystem/blottersystem_persons-db.png",
                caption: "Barangay Comembo Blotter System Persons Database"
            },
            {
                src: "assets/images/blottersystem/blottersystem_system-logs.png",
                caption: "Barangay Comembo Blotter System System Logs"
            },
            {
                src: "assets/images/blottersystem/blottersystem_log-new-incident-1.png",
                caption: "Barangay Comembo Blotter System New Incident Log"
            },
            {
                src: "assets/images/blottersystem/blottersystem_log-new-incident-2.png",
                caption: "Barangay Comembo Blotter System New Incident Log (Continued)"
            },
            {
                src: "assets/images/blottersystem/blottersystem_attatch-person.png",
                caption: "Barangay Comembo Blotter System Attach Person to Incident Interface"
            },
            {
                src: "assets/images/blottersystem/blottersystem_regis-person-1.png",
                caption: "Barangay Comembo Blotter System Register Person Interface"
            },
            {
                src: "assets/images/blottersystem/blottersystem_regis-person-2.png",
                caption: "Barangay Comembo Blotter System Register Person Interface (Continued)"
            },
            {
                src: "assets/images/blottersystem/blottersystem_regis-person-3.png",
                caption: "Barangay Comembo Blotter System Register Person Interface (Continued)"
            },
            {
                src: "assets/images/blottersystem/blottersystem_entry-deets-1.png",
                caption: "Barangay Comembo Blotter System Entry Details"
            },
            {
                src: "assets/images/blottersystem/blottersystem_entry-deets-2.png",
                caption: "Barangay Comembo Blotter System Entry Details (Continued)"
            },
            {
                src: "assets/images/blottersystem/blottersystem_export.png",
                caption: "Barangay Comembo Blotter System Export Entry Details"
            },
            {
                src: "assets/images/blottersystem/blottersystem_person-profile-1.png",
                caption: "Barangay Comembo Blotter System Person Profile Interface"
            },
            {
                src: "assets/images/blottersystem/blottersystem_person-profile-2.png",
                caption: "Barangay Comembo Blotter System Person Profile Interface (Continued)"
            },
            {
                src: "assets/images/blottersystem/blottersystem_view-entry.png",
                caption: "Barangay Comembo Blotter System View Entry Interface"
            }
        ]
    },

    pypulse: {
        title: "PyPulse",
        images: [
            {
                src: "assets/images/pypulse/pypulse_docu.png",
                caption: "PyPulse Documentation"
            },
            {
                src: "assets/images/pypulse/pypulse_data.png",
                caption: "PyPulse Data Center Interface"
            },
            {
                src: "assets/images/pypulse/pypulse_analytics-stakeholder.png",
                caption: "PyPulse Analytics Dashboard, Stakeholder Insights"
            },
            {
                src: "assets/images/pypulse/pypulse_analytics-descriptive.png",
                caption: "PyPulse Analytics Dashboard, Descriptive Statistics"
            },
            {
                src: "assets/images/pypulse/pypulse_analytics-health.png",
                caption: "PyPulse Analytics Dashboard, Health Benchmarks"
            },
            {
                src: "assets/images/pypulse/pypulse_analytics-correlation.png",
                caption: "PyPulse Analytics Dashboard, Correlation Analysis"
            },
            {
                src: "assets/images/pypulse/pypulse_analytics-summary-avg.png",
                caption: "PyPulse Analytics Dashboard, Summary by Avg Calories"
            },
            {
                src: "assets/images/pypulse/pypulse_analytics-summary-efficiency.png",
                caption: "PyPulse Analytics Dashboard, Summary by Efficiency"
            },
            {
                src: "assets/images/pypulse/pypulse_analytics-summary-gender.png",
                caption: "PyPulse Analytics Dashboard, Summary by Gender"
            },
            {
                src: "assets/images/pypulse/pypulse_analytics-at-risk.png",
                caption: "PyPulse Analytics Dashboard, At-Risk Participants"
            },
            {
                src: "assets/images/pypulse/pypulse_visualization-calories.png",
                caption: "PyPulse Visualization Hub, Calories by Activity"
            },
            {
                src: "assets/images/pypulse/pypulse_visualization-monthly.png",
                caption: "PyPulse Visualization Hub, Monthly Trend"
            },
            {
                src: "assets/images/pypulse/pypulse_visualization-activity.png",
                caption: "PyPulse Visualization Hub, Activity Share"
            },
            {
                src: "assets/images/pypulse/pypulse_visualization-sleep.png",
                caption: "PyPulse Visualization Hub, Sleep Distribution"
            },
            {
                src: "assets/images/pypulse/pypulse_visualization-step.png",
                caption: "PyPulse Visualization Hub, Steps vs Calories"
            },
            {
                src: "assets/images/pypulse/pypulse_export.png",
                caption: "PyPulse Summary and Export Interface"
            }
        ]
    },

    tamac: {
        title: "TAMAC",
        images: [
            {
                src: "assets/images/tamac/tamac_docu.png",
                caption: "TAMAC Documentation"
            },
            {
                src: "assets/images/tamac/tamac_floor-plan.jpg",
                caption: "TAMAC Floor Plan"
            },
            {
                src: "assets/images/tamac/tamac-1.jpg"
            },
            {
                src: "assets/images/tamac/tamac-2.jpg"
            },
            {
                src: "assets/images/tamac/tamac-3.jpg"
            }
        ]
    },

    voluntrack: {
        title: "VolunTrack",
        images: [
            {
                src: "assets/images/voluntrack/voluntrack_docu.png",
                caption: "VolunTrack Documentation"
            },
            {
                src: "assets/images/voluntrack/voluntrack_login.png",
                caption: "VolunTrack Login Interface"
            },
            {
                src: "assets/images/voluntrack/voluntrack_dash.png",
                caption: "VolunTrack Dashboard"
            },
            {
                src: "assets/images/voluntrack/voluntrack_volunteers.png",
                caption: "VolunTrack Volunteers Management"
            },
            {
                src: "assets/images/voluntrack/voluntrack_shifts.png",
                caption: "VolunTrack Shifts Management"
            },
            {
                src: "assets/images/voluntrack/voluntrack_assignments.png",
                caption: "VolunTrack Assignments Management"
            },
            {
                src: "assets/images/voluntrack/voluntrack_role-leads.png",
                caption: "VolunTrack Role Leads Management"
            },
            {
                src: "assets/images/voluntrack/voluntrack_reports.png",
                caption: "VolunTrack Reports"
            }
        ]
    },
};

const gallery = document.getElementById("project-gallery");
const galleryTitle = document.getElementById("gallery-title");
const galleryImage = document.getElementById("gallery-image");
const galleryCaption = document.getElementById("gallery-caption");
const galleryCounter = document.getElementById("gallery-counter");

const galleryClose = document.getElementById("gallery-close");
const galleryPrev = document.getElementById("gallery-prev");
const galleryNext = document.getElementById("gallery-next");

let currentGallery = [];
let currentImageIndex = 0;
let previousFocus = null;

function showGalleryImage() {
    const image = currentGallery[currentImageIndex];

    galleryImage.src = image.src;
    galleryImage.alt = image.caption;
    galleryCaption.textContent = image.caption;

    galleryCounter.textContent =
        `${currentImageIndex + 1} / ${currentGallery.length}`;

    galleryPrev.hidden = currentGallery.length <= 1;
    galleryNext.hidden = currentGallery.length <= 1;
}

function openProjectGallery(projectName, button) {
    const selectedGallery = projectGalleries[projectName];

    if (!selectedGallery || !selectedGallery.images.length) {
        return;
    }

    previousFocus = button;
    currentGallery = selectedGallery.images;
    currentImageIndex = 0;

    galleryTitle.textContent = selectedGallery.title;
    showGalleryImage();

    gallery.classList.add("active");
    gallery.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    galleryClose.focus();
}

function closeProjectGallery() {
    gallery.classList.remove("active");
    gallery.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    galleryImage.src = "";
    currentGallery = [];

    if (previousFocus) {
        previousFocus.focus();
    }
}

function showNextImage() {
    if (!currentGallery.length) return;

    currentImageIndex =
        (currentImageIndex + 1) % currentGallery.length;

    showGalleryImage();
}

function showPreviousImage() {
    if (!currentGallery.length) return;

    currentImageIndex =
        (currentImageIndex - 1 + currentGallery.length) %
        currentGallery.length;

    showGalleryImage();
}

// Open the selected project gallery
document.querySelectorAll(".project-gallery-btn").forEach(button => {
    button.addEventListener("click", () => {
        openProjectGallery(button.dataset.gallery, button);
    });
});

// Gallery controls
galleryClose.addEventListener("click", closeProjectGallery);
galleryNext.addEventListener("click", showNextImage);
galleryPrev.addEventListener("click", showPreviousImage);

// Close when clicking the dark background
gallery.addEventListener("click", event => {
    if (event.target === gallery) {
        closeProjectGallery();
    }
});

// Keyboard controls
document.addEventListener("keydown", event => {
    if (!gallery.classList.contains("active")) return;

    if (event.key === "Escape") {
        closeProjectGallery();
    }

    if (event.key === "ArrowRight") {
        showNextImage();
    }

    if (event.key === "ArrowLeft") {
        showPreviousImage();
    }
});

/* ==============================
   CONTACT FORM SUCCESS POPUP
============================== */

const contactForm = document.getElementById("contact-form");
const successPopup = document.getElementById("success-popup");
const successClose = document.getElementById("success-close");

if (contactForm && successPopup && successClose) {

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        successPopup.classList.add("active");
        successPopup.setAttribute("aria-hidden", "false");

        contactForm.reset();

        successClose.focus();
    });

    function closeSuccessPopup() {
        successPopup.classList.remove("active");
        successPopup.setAttribute("aria-hidden", "true");
    }

    successClose.addEventListener("click", closeSuccessPopup);

    successPopup.addEventListener("click", function(event) {
        if (event.target === successPopup) {
            closeSuccessPopup();
        }
    });

    document.addEventListener("keydown", function(event) {
        if (
            event.key === "Escape" &&
            successPopup.classList.contains("active")
        ) {
            closeSuccessPopup();
        }
    });
}

/* ========================================
   DARK MODE TOGGLE
======================================== */

const themeToggle = document.getElementById("theme-toggle");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const rootElement = document.documentElement;

function applyTheme(theme) {
    const isDark = theme === "dark";

    rootElement.setAttribute("data-theme", isDark ? "dark" : "light");

    if (themeToggle && themeToggleIcon) {
        themeToggleIcon.textContent = isDark ? "☀" : "☾";

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );

        themeToggle.setAttribute("aria-pressed", String(isDark));

        themeToggle.setAttribute(
            "title",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    }
}

// Restore the previously selected theme.
// Light mode is the default for first-time visitors.
let savedTheme = "light";

try {
    const storedTheme = localStorage.getItem("portfolio-theme");

    if (storedTheme === "dark" || storedTheme === "light") {
        savedTheme = storedTheme;
    }
} catch (error) {
    console.warn("Unable to access saved theme preference.");
}

applyTheme(savedTheme);

// Switch themes when the toggle is clicked.
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = rootElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        applyTheme(newTheme);

        try {
            localStorage.setItem("portfolio-theme", newTheme);
        } catch (error) {
            console.warn("Unable to save theme preference.");
        }
    });
}