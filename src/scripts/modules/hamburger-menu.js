(function () {
  const hamburger = document.querySelector(".hamburger-menu");
  const icon = document.querySelector(".hamburger-menu__icon");
  const navigation = document.querySelector(".main-navigation");
  const header = document.querySelector(".header");

  function hideNav() {
    icon.classList.add("hamburger-menu__icon--burger");
    icon.classList.remove("hamburger-menu__icon--cross");
    header.classList.remove("header--background");
    navigation.classList.remove("main-navigation--active");
  }

  function showNav() {
    icon.classList.remove("hamburger-menu__icon--burger");
    icon.classList.add("hamburger-menu__icon--cross");
    header.classList.add("header--background");
    navigation.classList.add("main-navigation--active");
  }

  hamburger.addEventListener("click", (e) => {
    if (icon.classList.contains("hamburger-menu__icon--cross")) {
      hideNav();
    } else {
      showNav();
    }
  });
})()
