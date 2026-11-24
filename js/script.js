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
    "#home, #about, #experience, #certifications, #skills, #projects, #contact"
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
   PINNED ABOUT STORY
============================== */

const aboutStory = document.getElementById("about");
const aboutTrack = aboutStory?.querySelector(".about-track");
const aboutViewport = aboutStory?.querySelector(".about-horizontal-viewport");
const aboutColorPanel = aboutStory?.querySelector(".about-color-panel");
const aboutScrollSpacer = aboutStory?.querySelector(".about-scroll-spacer");
const aboutSteps = Array.from(aboutStory?.querySelectorAll("[data-about-step]") || []);
const aboutStepCount = document.getElementById("about-step-count");
const isMobileLayout = () => window.matchMedia("(max-width: 700px)").matches;
let aboutFramePending = false;

function setAboutStep(index) {
    const step = Math.max(0, Math.min(aboutSteps.length - 1, index));
    aboutSteps.forEach((button, buttonIndex) => {
        const active = buttonIndex === step;
        button.classList.toggle("is-active", active);
        if (active) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
    });
    if (aboutStepCount) aboutStepCount.textContent = String(step + 1).padStart(2, "0");
}

function updateAboutStory() {
    if (!aboutStory || !aboutTrack || !aboutViewport || !aboutColorPanel) return;
    if (isMobileLayout()) {
        aboutTrack.style.transform = "";
        aboutColorPanel.style.removeProperty("--panel-scale");
        aboutColorPanel.style.removeProperty("opacity");
        aboutColorPanel.style.removeProperty("border-radius");
        const mobilePanels = Array.from(aboutStory.querySelectorAll("[data-about-panel]"));
        const anchor = window.innerHeight * 0.48;
        const activeIndex = mobilePanels.findIndex((panel) => {
            const bounds = panel.getBoundingClientRect();
            return bounds.top <= anchor && bounds.bottom >= anchor;
        });
        if (activeIndex >= 0) setAboutStep(activeIndex);
        return;
    }

    const scrollDistance = Math.max(1, aboutStory.offsetHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -aboutStory.getBoundingClientRect().top / scrollDistance));
    const introProgress = Math.min(1, progress / 0.07);
    const lateralProgress = Math.max(0, Math.min(1, (progress - 0.07) / 0.84));
    const outroProgress = Math.max(0, Math.min(1, (progress - 0.91) / 0.09));
    const travel = Math.max(0, aboutTrack.scrollWidth - aboutViewport.clientWidth);

    aboutTrack.style.transform = `translate3d(${-travel * lateralProgress}px, 0, 0)`;
    aboutColorPanel.style.setProperty("--panel-scale", (0.93 + 0.07 * introProgress - 0.15 * outroProgress).toFixed(3));
    aboutColorPanel.style.opacity = String((1 - 0.18 * outroProgress).toFixed(3));
    aboutColorPanel.style.borderRadius = `${28 + 20 * outroProgress}px`;
    setAboutStep(Math.min(2, Math.floor(lateralProgress * 3)));
}

function scheduleAboutStoryUpdate() {
    if (aboutFramePending) return;
    aboutFramePending = true;
    window.requestAnimationFrame(() => {
        updateAboutStory();
        aboutFramePending = false;
    });
}

function sizeAboutStory() {
    if (!aboutStory || !aboutTrack || !aboutViewport || !aboutScrollSpacer) return;
    if (isMobileLayout()) {
        aboutScrollSpacer.style.height = "";
        aboutTrack.style.removeProperty("--about-panel-width");
        return;
    }
    const panelWidth = aboutViewport.clientWidth;
    if (panelWidth > 0) aboutTrack.style.setProperty("--about-panel-width", `${panelWidth}px`);
    const travel = Math.max(0, aboutTrack.scrollWidth - aboutViewport.clientWidth);
    aboutScrollSpacer.style.height = `${window.innerHeight + travel / 0.84}px`;
}

if (aboutStory) {
    window.addEventListener("scroll", scheduleAboutStoryUpdate, { passive: true });
    window.addEventListener("resize", () => {
        sizeAboutStory();
        scheduleAboutStoryUpdate();
    });
    sizeAboutStory();
    scheduleAboutStoryUpdate();

    aboutSteps.forEach((button) => {
        button.addEventListener("click", () => {
            const targetStep = Number(button.dataset.aboutStep);
            if (isMobileLayout()) {
                aboutStory.querySelector(`[data-about-panel="${targetStep}"]`)?.scrollIntoView({
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                    block: "center"
                });
                setAboutStep(targetStep);
                return;
            }

            const storyRange = Math.max(1, aboutStory.offsetHeight - window.innerHeight);
            const targetProgress = [0.02, 0.50, 0.92][targetStep] || 0.02;
            const targetY = aboutStory.getBoundingClientRect().top + window.scrollY + storyRange * targetProgress;
            window.scrollTo({
                top: targetY,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
            });
        });
    });

    aboutViewport?.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const current = Number(aboutStepCount?.textContent || "01") - 1;
        aboutSteps[Math.max(0, Math.min(aboutSteps.length - 1, current + (event.key === "ArrowRight" ? 1 : -1)))]?.click();
    });
}

/* ==============================
   STACKED EXPERIENCE CARDS
============================== */

document.querySelectorAll("#experience .journey-card").forEach((card, index) => {
    card.style.setProperty("--stack-index", String(index));
    card.style.setProperty("--stack-tilt", `${index % 2 === 0 ? -0.35 : 0.35}deg`);
});

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
        const sectionId = element.closest("section")?.id || "default";
        element.dataset.motion = sectionId;
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
const galleryFilmstrip = document.getElementById("gallery-filmstrip");

const galleryClose = document.getElementById("gallery-close");
const galleryPrev = document.getElementById("gallery-prev");
const galleryNext = document.getElementById("gallery-next");

let currentGallery = [];
let currentImageIndex = 0;
let previousFocus = null;

function showGalleryImage() {
    const image = currentGallery[currentImageIndex];

    galleryImage.classList.remove("is-changing");
    void galleryImage.offsetWidth;
    galleryImage.src = image.src;
    galleryImage.alt = image.caption;
    galleryCaption.textContent = image.caption;
    galleryImage.classList.add("is-changing");
    window.setTimeout(() => galleryImage.classList.remove("is-changing"), 40);

    galleryCounter.textContent =
        `${currentImageIndex + 1} / ${currentGallery.length}`;

    galleryFilmstrip?.querySelectorAll(".gallery-thumb").forEach((thumbnail, index) => {
        const active = index === currentImageIndex;
        thumbnail.classList.toggle("is-active", active);
        thumbnail.setAttribute("aria-current", active ? "true" : "false");
    });

    galleryPrev.hidden = currentGallery.length <= 1;
    galleryNext.hidden = currentGallery.length <= 1;
}

function buildGalleryFilmstrip() {
    if (!galleryFilmstrip) return;
    galleryFilmstrip.replaceChildren();
    currentGallery.forEach((image, index) => {
        const thumbnail = document.createElement("button");
        const preview = document.createElement("img");
        thumbnail.type = "button";
        thumbnail.className = "gallery-thumb";
        thumbnail.setAttribute("aria-label", `Show image ${index + 1}: ${image.caption}`);
        preview.src = image.src;
        preview.alt = "";
        preview.loading = "lazy";
        thumbnail.appendChild(preview);
        thumbnail.addEventListener("click", () => {
            currentImageIndex = index;
            showGalleryImage();
        });
        galleryFilmstrip.appendChild(thumbnail);
    });
    galleryFilmstrip.hidden = currentGallery.length <= 1;
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
    buildGalleryFilmstrip();
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
    galleryFilmstrip?.replaceChildren();

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

let galleryTouchStartX = null;
document.querySelector(".gallery-viewer")?.addEventListener("pointerdown", (event) => {
    galleryTouchStartX = event.clientX;
});
document.querySelector(".gallery-viewer")?.addEventListener("pointerup", (event) => {
    if (galleryTouchStartX === null) return;
    const distance = event.clientX - galleryTouchStartX;
    if (Math.abs(distance) > 42) (distance < 0 ? showNextImage : showPreviousImage)();
    galleryTouchStartX = null;
});
document.querySelector(".gallery-viewer")?.addEventListener("pointercancel", () => { galleryTouchStartX = null; });

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
   CONTACT FORM HANDLING - FORMSPREE
============================== */

const contactForm = document.getElementById("contact-form");
const successPopup = document.getElementById("success-popup");
const successClose = document.getElementById("success-close");
const formStatus = document.getElementById("form-status");

if (contactForm && successPopup && successClose) {

    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );

    const originalButtonContent = submitButton.innerHTML;

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (submitButton.disabled) return;

        // Clear previous messages.
        if (formStatus) {
            formStatus.textContent = "";
        }

        // Show loading state.
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Message submission failed.");
            }

            // Only show success after Formspree confirms submission.
            contactForm.reset();

            successPopup.classList.add("active");
            successPopup.setAttribute("aria-hidden", "false");

            successClose.focus();

        } catch (error) {
            if (formStatus) {
                formStatus.textContent =
                    "Sorry, your message couldn't be sent. Please try again.";
            }
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonContent;
        }
    });

    function closeSuccessPopup() {
        successPopup.classList.remove("active");
        successPopup.setAttribute("aria-hidden", "true");
    }

    successClose.addEventListener("click", closeSuccessPopup);

    successPopup.addEventListener("click", function (event) {
        if (event.target === successPopup) {
            closeSuccessPopup();
        }
    });

    document.addEventListener("keydown", function (event) {
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

        rootElement.classList.add("theme-transitioning");
        applyTheme(newTheme);
        window.setTimeout(() => rootElement.classList.remove("theme-transitioning"), 520);

        try {
            localStorage.setItem("portfolio-theme", newTheme);
        } catch (error) {
            console.warn("Unable to save theme preference.");
        }
    });
}

/* ==============================
   BROWSABLE PROJECT AND CERTIFICATE DECKS
============================== */

let certificateDeckWasShuffled = false;

function createDeckController(deckId, countId, kind) {
    const deck = document.getElementById(deckId);
    const counter = document.getElementById(countId);
    if (!deck || !counter) return null;

    const cards = () => Array.from(deck.querySelectorAll(kind === "projects" ? ".project-card" : ".certification-card"))
        .filter((card) => !card.classList.contains("is-filtered-out"));

    const starts = (visibleCards) => {
        const deckRect = deck.getBoundingClientRect();
        const paddingLeft = parseFloat(getComputedStyle(deck).paddingLeft) || 0;
        const contentLeft = deckRect.left + paddingLeft;
        return visibleCards.map((card) => card.getBoundingClientRect().left - contentLeft + deck.scrollLeft);
    };

    let activeCertificateIndex = 0;

    function setCertificateDeck(index) {
        const visible = cards();
        if (!visible.length) return;
        activeCertificateIndex = (index + visible.length) % visible.length;
        const cardWidth = visible[0].offsetWidth || 430;
        const spread = Math.min(cardWidth * .62, deck.clientWidth * .28);
        visible.forEach((card, cardIndex) => {
            const depth = (cardIndex - activeCertificateIndex + visible.length) % visible.length;
            const placements = [
                { x:0, y:0, turn:0 },
                { x:spread, y:8, turn:7 },
                { x:-spread, y:18, turn:-7 }
            ];
            const placement = placements[depth] || { x:(depth % 2 ? 1 : -1) * spread, y:depth * 10, turn:0 };
            const active = depth === 0;
            card.style.setProperty("--deck-x", `${placement.x}px`);
            card.style.setProperty("--deck-y", `${placement.y}px`);
            card.style.setProperty("--deck-turn", `${placement.turn}deg`);
            card.style.setProperty("--deck-layer", String(visible.length - depth));
            card.classList.toggle("is-selected", active);
            card.setAttribute("aria-hidden", String(!active));
            const title = card.querySelector(".certification-info h3")?.textContent.trim() || "certificate";
            card.setAttribute("aria-label", active ? `Open details for ${title}` : `Bring ${title} to the top of the deck`);
            if (active) card.setAttribute("aria-haspopup", "dialog");
            else card.removeAttribute("aria-haspopup");
            card.tabIndex = active ? 0 : -1;
        });
        counter.textContent = `${String(activeCertificateIndex + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;
    }

    function updateCounter(preferredCard) {
        const visible = cards();
        if (!visible.length) {
            counter.textContent = "00 / 00";
            return;
        }

        if (kind === "certifications") {
            setCertificateDeck(preferredCard ? visible.indexOf(preferredCard) : activeCertificateIndex);
            return;
        }

        const anchors = starts(visible);
        const index = preferredCard ? Math.max(0, visible.indexOf(preferredCard))
            : anchors.reduce((best, anchor, anchorIndex) =>
                Math.abs(anchor - deck.scrollLeft) < Math.abs(anchors[best] - deck.scrollLeft) ? anchorIndex : best, 0);
        if (kind === "certifications") visible.forEach((card, cardIndex) => card.classList.toggle("is-selected", cardIndex === index));
        counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;
    }

    function go(direction) {
        const visible = cards();
        if (!visible.length) return;
        if (kind === "certifications") {
            setCertificateDeck(activeCertificateIndex + direction);
            return;
        }
        const anchors = starts(visible);
        const current = anchors.reduce((best, anchor, anchorIndex) =>
            Math.abs(anchor - deck.scrollLeft) < Math.abs(anchors[best] - deck.scrollLeft) ? anchorIndex : best, 0);
        const next = kind === "certifications"
            ? (current + direction + visible.length) % visible.length
            : Math.max(0, Math.min(visible.length - 1, current + direction));
        deck.scrollTo({ left: Math.max(0, anchors[next]), behavior: prefersReducedMotion ? "auto" : "smooth" });
        updateCounter(visible[next]);
    }

    if (kind !== "certifications") deck.addEventListener("scroll", () => updateCounter(), { passive: true });
    deck.addEventListener("keydown", (event) => {
        if (event.target !== deck || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
        event.preventDefault();
        go(event.key === "ArrowRight" ? 1 : -1);
    });

    if (kind === "certifications") {
        setCertificateDeck(0);
        let pointerStartX = null;
        deck.addEventListener("pointerdown", (event) => { pointerStartX = event.clientX; });
        window.addEventListener("pointerup", (event) => {
            if (pointerStartX === null) return;
            const delta = event.clientX - pointerStartX;
            if (Math.abs(delta) > 42) {
                certificateDeckWasShuffled = true;
                go(delta < 0 ? 1 : -1);
                window.setTimeout(() => { certificateDeckWasShuffled = false; }, 120);
            }
            pointerStartX = null;
        });
        deck.addEventListener("pointercancel", () => { pointerStartX = null; });
        deck.addEventListener("wheel", (event) => {
            if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 18) return;
            event.preventDefault();
            go(event.deltaX > 0 ? 1 : -1);
        }, { passive:false });
    }

    return { go, updateCounter, reset: () => {
        if (kind === "certifications") {
            setCertificateDeck(0);
            return;
        }
        deck.scrollTo({ left: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        window.setTimeout(() => updateCounter(), prefersReducedMotion ? 0 : 300);
    }, select:kind === "certifications" ? setCertificateDeck : undefined };
}

const projectDeckController = createDeckController("project-deck", "project-index-count", "projects");
const certificationDeckController = createDeckController("certification-deck", "certification-index-count", "certifications");

const certificateDialog = document.getElementById("certificate-dialog");
const certificateDialogImage = document.getElementById("certificate-dialog-image");
const certificateDialogCategory = document.getElementById("certificate-dialog-category");
const certificateDialogTitle = document.getElementById("certificate-dialog-title");
const certificateDialogIssuer = document.getElementById("certificate-dialog-issuer");
const certificateDialogDescription = document.getElementById("certificate-dialog-description");
const certificateDialogDate = document.getElementById("certificate-dialog-date");
const certificateDialogPdf = document.getElementById("certificate-dialog-pdf");
let certificateDialogOpener = null;

function openCertificateDetails(card) {
    if (!certificateDialog || !card) return;
    const image = card.querySelector(".certification-preview img");
    certificateDialogImage.src = image?.getAttribute("src") || "";
    certificateDialogImage.alt = image?.alt || "Certificate preview";
    certificateDialogCategory.textContent = card.querySelector(".certification-category")?.textContent.trim() || "CERTIFICATION";
    certificateDialogTitle.textContent = card.querySelector(".certification-info h3")?.textContent.trim() || "Certificate";
    certificateDialogIssuer.textContent = card.querySelector(".certification-issuer")?.textContent.trim() || "";
    certificateDialogDescription.textContent = card.querySelector(".certification-description")?.textContent.trim() || "";
    certificateDialogDate.textContent = card.querySelector(".certification-date")?.textContent.trim() || "";
    certificateDialogPdf.href = card.dataset.certificationPdf || "#";
    certificateDialogOpener = card;
    certificateDialog.showModal();
    document.getElementById("certificate-dialog-close")?.focus();
}

document.querySelectorAll("#certifications .certification-card").forEach((card) => {
    const title = card.querySelector(".certification-info h3")?.textContent.trim() || "certificate";
    card.tabIndex = card.classList.contains("is-selected") ? 0 : -1;
    card.setAttribute("role", "button");
    if (card.classList.contains("is-selected")) card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", card.classList.contains("is-selected") ? `Open details for ${title}` : `Bring ${title} to the top of the deck`);
    card.addEventListener("click", (event) => {
        event.preventDefault();
        if (certificateDeckWasShuffled) return;
        if (!card.classList.contains("is-selected")) {
            certificationDeckController?.select(Array.from(document.querySelectorAll("#certifications .certification-card")).indexOf(card));
            return;
        }
        openCertificateDetails(card);
    });
    card.addEventListener("keydown", (event) => {
        if (event.target !== card) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            certificationDeckController?.go(event.key === "ArrowRight" ? 1 : -1);
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCertificateDetails(card);
        }
    });
});

document.getElementById("certificate-dialog-close")?.addEventListener("click", () => certificateDialog?.close());
certificateDialog?.addEventListener("click", (event) => {
    if (event.target === certificateDialog) certificateDialog.close();
});
certificateDialog?.addEventListener("close", () => certificateDialogOpener?.focus({ preventScroll: true }));

document.querySelectorAll(".deck-arrow[data-deck][data-direction]").forEach((button) => {
    button.addEventListener("click", () => {
        const controller = button.dataset.deck === "projects" ? projectDeckController : certificationDeckController;
        controller?.go(Number(button.dataset.direction));
    });
});

window.addEventListener("resize", () => {
    projectDeckController?.updateCounter();
    certificationDeckController?.updateCounter();
});

/* ==============================
   PROJECT TYPE FILTERS
============================== */

const projectFilterButtons = document.querySelectorAll(".filter-chip[data-filter]");
const filterableProjects = document.querySelectorAll("#projects .project-card");

if (projectFilterButtons.length && filterableProjects.length) {
    projectFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            projectFilterButtons.forEach((item) => {
                const active = item === button;
                item.classList.toggle("is-active", active);
                item.setAttribute("aria-pressed", String(active));
            });

            let firstVisibleProject = true;
            filterableProjects.forEach((card) => {
                const projectType = card.querySelector(".project-type")?.textContent || "";
                const isIndividual = projectType.toLowerCase().includes("individual");
                const visible = filter === "all" ||
                    (filter === "individual" && isIndividual) ||
                    (filter === "collaborative" && !isIndividual);

                card.classList.toggle("is-filtered-out", !visible);
                card.classList.toggle("is-filter-first", visible && firstVisibleProject);
                card.setAttribute("aria-hidden", String(!visible));
                if (visible) firstVisibleProject = false;
            });
            projectDeckController?.reset();
        });
    });
}

/* ==============================
   READING PROGRESS INDICATOR
============================== */

const readingProgress = document.createElement("div");
readingProgress.className = "reading-progress";
readingProgress.setAttribute("aria-hidden", "true");
document.body.appendChild(readingProgress);

let progressTicking = false;
function updateReadingProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    readingProgress.style.transform = `scaleX(${Math.min(100, Math.max(0, progress)) / 100})`;
    progressTicking = false;
}

window.addEventListener("scroll", () => {
    if (!progressTicking) {
        window.requestAnimationFrame(updateReadingProgress);
        progressTicking = true;
    }
}, { passive: true });
updateReadingProgress();

/* ==============================
   QUICK NAVIGATION PALETTE
============================== */

const commandTrigger = document.getElementById("command-trigger");
const commandPalette = document.getElementById("command-palette");
const commandWindow = commandPalette?.querySelector(".command-window");
const commandLinks = Array.from(commandPalette?.querySelectorAll(".command-options a") || []);
let selectedCommand = 0;

function closeCommandPalette() {
    if (!commandPalette) return;
    commandPalette.classList.remove("is-open");
    commandPalette.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("command-active");
    commandTrigger?.focus();
}

function openCommandPalette() {
    if (!commandPalette) return;
    commandPalette.classList.add("is-open");
    commandPalette.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("command-active");
    selectedCommand = 0;
    updateSelectedCommand();
    commandLinks[0]?.focus();
}

function updateSelectedCommand() {
    commandLinks.forEach((link, index) => {
        const selected = index === selectedCommand;
        link.classList.toggle("is-selected", selected);
        link.setAttribute("aria-current", selected ? "true" : "false");
    });
}

commandTrigger?.addEventListener("click", openCommandPalette);
commandPalette?.querySelectorAll("[data-command-close]").forEach((element) => {
    element.addEventListener("click", closeCommandPalette);
});
commandLinks.forEach((link) => link.addEventListener("click", () => {
    commandPalette?.classList.remove("is-open");
    commandPalette?.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("command-active");
}));

document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        commandPalette?.classList.contains("is-open") ? closeCommandPalette() : openCommandPalette();
        return;
    }

    if (!commandPalette?.classList.contains("is-open")) return;
    if (event.key === "Escape") {
        event.preventDefault();
        closeCommandPalette();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        selectedCommand = (selectedCommand + direction + commandLinks.length) % commandLinks.length;
        updateSelectedCommand();
        commandLinks[selectedCommand]?.focus();
    } else if (event.key === "Enter" && commandWindow?.contains(document.activeElement)) {
        event.preventDefault();
        commandLinks[selectedCommand]?.click();
    }
});

/* ==============================
   PORTFOLIO STARTUP SEQUENCE
============================== */

const bootScreen = document.getElementById("boot-screen");
const bootLog = document.getElementById("boot-log");
const bootBinaryField = document.getElementById("boot-binary-field");
const bootProgress = document.querySelector("#boot-progress span");
const bootProgressBar = document.getElementById("boot-progress");
const bootPercent = document.getElementById("boot-percent");
const bootState = document.getElementById("boot-state");
const bootEnter = document.getElementById("boot-enter");
const bootShortcut = document.getElementById("boot-shortcut");
const pageShellElements = [
    document.querySelector(".site-header"),
    document.querySelector("main"),
    document.querySelector(".site-footer")
].filter(Boolean);

let portfolioReady = false;

if (bootScreen && bootLog && bootProgress && bootProgressBar && bootPercent && bootState && bootEnter) {
    document.documentElement.classList.add("booting");
    pageShellElements.forEach((element) => { element.inert = true; });
    bootScreen.focus();
    if (bootBinaryField) {
        for (let columnIndex = 0; columnIndex < 30; columnIndex += 1) {
            const stream = document.createElement("span");
            const bits = Array.from({ length: 54 }, (_, bitIndex) => ((columnIndex * 5 + bitIndex * 3 + columnIndex * bitIndex) % 7 < 3 ? "1" : "0"));
            stream.className = "binary-stream";
            stream.style.setProperty("--stream-delay", `${-((columnIndex * 13) % 42) / 10}s`);
            stream.style.setProperty("--stream-opacity", `${.13 + (columnIndex % 4) * .035}`);
            stream.textContent = bits.join("\n");
            bootBinaryField.appendChild(stream);
        }
    }
    const bootLines = [
        "mounting core interface modules",
        "indexing portfolio assets",
        "validating navigation routes",
        "starting interaction engine"
    ];
    const reducedMotionBoot = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bootDelays = reducedMotionBoot ? [0, 90, 180, 270] : [100, 360, 690, 1010];

    bootLines.forEach((line, index) => {
        window.setTimeout(() => {
            const entry = document.createElement("p");
            entry.textContent = line;
            bootLog.appendChild(entry);
            const percent = Math.round(((index + 1) / bootLines.length) * 100);
            bootProgress.style.width = `${percent}%`;
            bootProgressBar.setAttribute("aria-valuenow", String(percent));
            bootPercent.textContent = `${String(percent).padStart(2, "0")}%`;
        }, bootDelays[index]);
    });

    window.setTimeout(() => {
        portfolioReady = true;
        bootState.textContent = "PORTFOLIO READY";
        bootShortcut.textContent = "PORTFOLIO READY / PRESS START";
        bootScreen.classList.add("is-loaded");
        bootEnter.disabled = false;
        bootEnter.classList.add("is-ready");
        bootEnter.focus();
    }, (bootDelays[bootDelays.length - 1] || 0) + (reducedMotionBoot ? 120 : 340));

    function enterPortfolio() {
        if (!portfolioReady) return;
        document.documentElement.classList.add("portfolio-entering");
        bootScreen.classList.add("is-closing");
        bootScreen.setAttribute("aria-hidden", "true");
        pageShellElements.forEach((element) => { element.inert = false; });
        window.setTimeout(() => {
            bootScreen.hidden = true;
            document.documentElement.classList.remove("booting");
            document.querySelector(".nav-links a[href='#about']")?.focus({ preventScroll: true });
            window.setTimeout(() => document.documentElement.classList.remove("portfolio-entering"), reducedMotionBoot ? 0 : 120);
        }, reducedMotionBoot ? 0 : 560);
    }

    bootEnter.addEventListener("click", enterPortfolio);
    bootScreen.addEventListener("keydown", (event) => {
        if ((event.key === "Enter" || event.key === " ") && portfolioReady && event.target !== bootEnter) {
            event.preventDefault();
            enterPortfolio();
        }
    });
}

/* ==============================
   LABELED CURSOR AND SOFT SHADOW
============================== */

const customCursor = document.getElementById("custom-cursor");
const cursorLabel = document.getElementById("cursor-label");
const cursorShadow = customCursor?.querySelector(".cursor-shadow");
let cursorLastX = 0;
let cursorLastY = 0;
let cursorHasPosition = false;
let cursorShadowTimer = 0;

document.querySelectorAll("#projects .project-card").forEach((card) => {
    card.dataset.cursorLabel = "PROJECT";
});
document.querySelectorAll("#certifications .certification-card").forEach((card) => {
    card.dataset.cursorLabel = "CERTIFICATE";
});

function setCursorLabelFor(target) {
    if (!cursorLabel || !customCursor) return;
    const textControl = target.closest("input, textarea, select, [contenteditable='true']");
    document.body.classList.toggle("cursor-editing", Boolean(textControl));
    if (textControl) return;

    const labeled = target.closest("[data-cursor-label]");
    const button = target.closest("button");
    const link = target.closest("a");
    const label = labeled?.dataset.cursorLabel || (button ? "SELECT" : link ? "OPEN" : "YOU");
    cursorLabel.textContent = label;
    customCursor.classList.toggle("is-hovering", Boolean(labeled || button || link));
}

document.addEventListener("pointermove", (event) => {
    if (!customCursor || event.pointerType !== "mouse") return;
    document.body.classList.add("cursor-active");
    document.body.classList.remove("cursor-keyboard");
    customCursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    if (cursorShadow) {
        const lagX = Math.max(-13, Math.min(13, (cursorLastX - event.clientX) * .18));
        const lagY = Math.max(-13, Math.min(13, (cursorLastY - event.clientY) * .18));
        cursorShadow.style.setProperty("--shadow-lag-x", `${lagX}px`);
        cursorShadow.style.setProperty("--shadow-lag-y", `${lagY}px`);
        window.clearTimeout(cursorShadowTimer);
        cursorShadowTimer = window.setTimeout(() => {
            cursorShadow.style.setProperty("--shadow-lag-x", "0px");
            cursorShadow.style.setProperty("--shadow-lag-y", "0px");
        }, 90);
    }
    cursorLastX = event.clientX;
    cursorLastY = event.clientY;
    cursorHasPosition = true;
    setCursorLabelFor(event.target instanceof Element ? event.target : document.body);
});

document.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && cursorHasPosition) customCursor?.classList.add("is-pressed");
});
document.addEventListener("pointerup", () => customCursor?.classList.remove("is-pressed"));
document.addEventListener("pointercancel", () => customCursor?.classList.remove("is-pressed"));
document.addEventListener("pointerleave", (event) => {
    if (event.target === document) document.body.classList.remove("cursor-active", "cursor-editing");
}, true);
document.addEventListener("focusin", (event) => {
    if (event.target.matches("input, textarea, select, [contenteditable='true']")) document.body.classList.add("cursor-editing");
});
document.addEventListener("focusout", (event) => {
    if (event.target.matches("input, textarea, select, [contenteditable='true']")) document.body.classList.remove("cursor-editing");
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") document.body.classList.add("cursor-keyboard");
});

/* Certifications zoom in as a pinned chapter, like the About story. */
const certificationStory = document.getElementById("certifications");
const certificationSpacer = certificationStory?.querySelector(".certifications-scroll-spacer");
const certificationPanel = certificationStory?.querySelector(".certifications-color-panel");
let certificationFramePending = false;

function updateCertificationStory() {
    if (!certificationStory || !certificationPanel) return;
    if (isMobileLayout()) {
        certificationPanel.style.removeProperty("--cert-panel-scale");
        certificationPanel.style.removeProperty("--cert-panel-opacity");
        certificationPanel.style.removeProperty("--cert-panel-radius");
        return;
    }

    const distance = Math.max(1, certificationStory.offsetHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -certificationStory.getBoundingClientRect().top / distance));
    const intro = Math.max(0, Math.min(1, progress / .19));
    const outro = Math.max(0, Math.min(1, (progress - .88) / .12));
    const easedIntro = intro * intro * (3 - 2 * intro);
    certificationPanel.style.setProperty("--cert-panel-scale", (0.78 + .22 * easedIntro - .025 * outro).toFixed(3));
    certificationPanel.style.setProperty("--cert-panel-opacity", (.56 + .44 * easedIntro - .08 * outro).toFixed(3));
    certificationPanel.style.setProperty("--cert-panel-radius", `${54 - 24 * easedIntro + 10 * outro}px`);
}

function scheduleCertificationStoryUpdate() {
    if (certificationFramePending) return;
    certificationFramePending = true;
    window.requestAnimationFrame(() => {
        updateCertificationStory();
        certificationFramePending = false;
    });
}

function sizeCertificationStory() {
    if (!certificationStory || !certificationSpacer) return;
    certificationSpacer.style.height = isMobileLayout() ? "" : `${window.innerHeight * 1.9}px`;
}

if (certificationStory) {
    window.addEventListener("scroll", scheduleCertificationStoryUpdate, { passive: true });
    window.addEventListener("resize", () => {
        sizeCertificationStory();
        scheduleCertificationStoryUpdate();
    });
    sizeCertificationStory();
    scheduleCertificationStoryUpdate();
}

/* Keep Contact in normal page flow while its content zooms in with page scroll. */
const contactSection = document.getElementById("contact");
const contactReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let contactZoomFramePending = false;

function updateContactZoom() {
    if (!contactSection) return;
    if (contactReducedMotion) {
        contactSection.style.removeProperty("--contact-zoom-progress");
        contactSection.style.removeProperty("--contact-zoom-scale");
        contactSection.style.removeProperty("--contact-zoom-opacity");
        return;
    }
    const sectionTop = contactSection.getBoundingClientRect().top;
    const approachDistance = Math.max(1, window.innerHeight * .86);
    const progress = Math.max(0, Math.min(1, (window.innerHeight - sectionTop) / approachDistance));
    contactSection.style.setProperty("--contact-zoom-progress", progress.toFixed(3));
    contactSection.style.setProperty("--contact-zoom-scale", (.92 + .08 * progress).toFixed(3));
    contactSection.style.setProperty("--contact-zoom-opacity", (.58 + .42 * progress).toFixed(3));
}

function scheduleContactZoom() {
    if (contactZoomFramePending) return;
    contactZoomFramePending = true;
    window.requestAnimationFrame(() => {
        updateContactZoom();
        contactZoomFramePending = false;
    });
}

if (contactSection) {
    window.addEventListener("scroll", scheduleContactZoom, { passive: true });
    window.addEventListener("resize", scheduleContactZoom);
    scheduleContactZoom();
}
