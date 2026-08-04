"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initialiseFaqAccordion();
    updateCopyrightYear();
});


/* =========================
   FAQ ACCORDION
========================= */

function initialiseFaqAccordion() {
    const faqButtons = document.querySelectorAll(".faq-question");

    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const answerId = button.getAttribute("aria-controls");
            const answer = document.getElementById(answerId);

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
   COPYRIGHT YEAR
========================= */

function updateCopyrightYear() {
    const yearElement = document.getElementById("current-year");

    if (!yearElement) {
        return;
    }

    yearElement.textContent = new Date().getFullYear();
}