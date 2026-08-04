"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initialiseStickyHeader();
    initialiseMobileNavigation();
    initialiseFaqAccordion();
    initialiseSectionNavigation();
    initialiseConsultationFormGuard();
    setMinimumAppointmentDate();
    updateCopyrightYear();
});

/* =========================
   STICKY HEADER
========================= */

function initialiseStickyHeader() {
    const header = document.getElementById("site-header");

    if (!header) {
        return;
    }

    const updateHeaderState = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 20);
    };

    updateHeaderState();

    window.addEventListener("scroll", updateHeaderState, {
        passive: true
    });
}

/* =========================
   MOBILE NAVIGATION
========================= */

function initialiseMobileNavigation() {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.getElementById("primary-navigation");

    if (!menuButton || !navigation) {
        return;
    }

    const closeMenu = () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
        navigation.classList.remove("is-open");
        document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Close navigation menu");
        navigation.classList.add("is-open");
        document.body.classList.add("menu-open");
    };

    menuButton.addEventListener("click", () => {
        const isOpen =
            menuButton.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        const clickedInsideNavigation =
            navigation.contains(event.target);

        const clickedMenuButton =
            menuButton.contains(event.target);

        if (!clickedInsideNavigation && !clickedMenuButton) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            menuButton.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1080) {
            closeMenu();
        }
    });
}

/* =========================
   FAQ ACCORDION
========================= */

function initialiseFaqAccordion() {
    const faqButtons =
        document.querySelectorAll(".faq-question");

    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const answerId =
                button.getAttribute("aria-controls");

            const answer =
                document.getElementById(answerId);

            if (!answer) {
                return;
            }

            const isCurrentlyOpen =
                button.getAttribute("aria-expanded") === "true";

            faqButtons.forEach((otherButton) => {
                const otherAnswerId =
                    otherButton.getAttribute("aria-controls");

                const otherAnswer =
                    document.getElementById(otherAnswerId);

                otherButton.setAttribute("aria-expanded", "false");

                if (otherAnswer) {
                    otherAnswer.hidden = true;
                }
            });

            if (!isCurrentlyOpen) {
                button.setAttribute("aria-expanded", "true");
                answer.hidden = false;
            }
        });
    });
}

/* =========================
   ACTIVE SECTION NAVIGATION
========================= */

function initialiseSectionNavigation() {
    const navLinks = Array.from(
        document.querySelectorAll(
            '#primary-navigation a[href^="#"]'
        )
    );

    if (!navLinks.length || !("IntersectionObserver" in window)) {
        return;
    }

    const sectionMap = new Map();

    navLinks.forEach((link) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#top") {
            return;
        }

        const section = document.querySelector(targetId);

        if (section) {
            sectionMap.set(section, link);
        }
    });

    const setActiveLink = (activeLink) => {
        navLinks.forEach((link) => {
            link.classList.toggle("is-active", link === activeLink);
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            const visibleEntries = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                    (first, second) =>
                        second.intersectionRatio -
                        first.intersectionRatio
                );

            if (visibleEntries.length) {
                setActiveLink(sectionMap.get(visibleEntries[0].target));
            }
        },
        {
            rootMargin: "-30% 0px -55% 0px",
            threshold: [0.05, 0.2, 0.4]
        }
    );

    sectionMap.forEach((link, section) => {
        observer.observe(section);
    });

    window.addEventListener(
        "scroll",
        () => {
            if (window.scrollY < 180) {
                setActiveLink(navLinks[0]);
            }
        },
        {
            passive: true
        }
    );
}

/* =========================
   FORM SETUP GUARD
========================= */

function initialiseConsultationFormGuard() {
    const form = document.getElementById("consultation-form");
    const status = document.getElementById("form-status");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {
        const action = form.getAttribute("action") || "";

        if (!action.includes("YOUR_FORM_ID")) {
            return;
        }

        event.preventDefault();

        if (status) {
            status.textContent =
                "The form is not connected yet. Replace YOUR_FORM_ID with your Formspree form ID before launch.";
        }
    });
}

/* =========================
   APPOINTMENT DATE
========================= */

function setMinimumAppointmentDate() {
    const dateInput = document.getElementById("preferred-date");

    if (!dateInput) {
        return;
    }

    const today = new Date();
    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    )
        .toISOString()
        .split("T")[0];

    dateInput.min = localDate;
}

/* =========================
   COPYRIGHT YEAR
========================= */

function updateCopyrightYear() {
    const yearElement =
        document.getElementById("current-year");

    if (!yearElement) {
        return;
    }

    yearElement.textContent = new Date().getFullYear();
}
