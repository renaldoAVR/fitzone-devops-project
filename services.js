/* ==================================
   FITZONE - SERVICES PAGE JAVASCRIPT
   ================================== */

document.addEventListener("DOMContentLoaded", function () {

  const filterButtons = document.querySelectorAll(".services-page .filter-btn");
  const programCards = document.querySelectorAll(".services-page .enhanced-card");

  // Program Filtering

  filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const selectedCategory = button.getAttribute("data-filter");

      // Update active filter button

      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      // Show or hide program cards

      programCards.forEach(function (card) {

        const cardCategory = card.getAttribute("data-category");

        if (
          selectedCategory === "all" ||
          selectedCategory === cardCategory
        ) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }

      });

    });

  });

});