// Shared JavaScript for FitZone pages.
document.addEventListener("DOMContentLoaded", () => {
  // Keep the footer year current.
  document.querySelectorAll(".year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Mobile navigation toggle.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav-links");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "✕" : "☰";
    });
  }

  // Demo-only forms: no information is sent or stored.
  document.querySelectorAll(".demo-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      if (!status) return;

      if (form.dataset.formType === "login") {
        status.textContent =
          "Demo only: authentication is not configured. No account was accessed.";
      } else {
        status.textContent =
          "Demo only: your message was not sent or stored. Thanks for testing the form!";
        form.reset();
      }
    });
  });
});
