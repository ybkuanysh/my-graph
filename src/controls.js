(() => {
  const toggleBtn = document.getElementById("toggle-sidebar-btn");
  const pageContainer = document.querySelector(".page-container");

  // Обработчик нажатия на кнопку
  toggleBtn.addEventListener("click", () => {
    pageContainer.classList.toggle("is-open");
  });

  const button = document.getElementById("toggle-sidebar-btn");
  const initialIcon = document.querySelector(".initial-icon");
  const hiddenIcon = document.querySelector(".hidden-icon");

  button.addEventListener("click", () => {
    initialIcon.classList.toggle("hidden-icon");
    hiddenIcon.classList.toggle("hidden-icon");
  });
})();
