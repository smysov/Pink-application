(function () {
  const form = document.querySelector(".form");
  const submitButton = document.querySelector("#sendButton");
  const popupError = document.querySelector(".popup--error");
  const popupSuccess = document.querySelector(".popup--success");
  const popupRefusal = document.querySelector(".popup--refusal");
  const popupClose = document.querySelectorAll(".popup__button");
  const popup = document.querySelectorAll(".popup");

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (form.checkValidity()) {
      form.classList.remove("validation-error");

      const data = new FormData(form);
      data.append("suname", form.elements.surname.value);
      data.append("name", form.elements.name.value);
      data.append("phone", form.elements.phone.value);
      data.append("email", form.elements.email.value);
      data.append("comment", form.elements.comment.value);
      data.append("to", "test@list.ru");

      const xhr = new XMLHttpRequest();
      xhr.responseType = "json";
      xhr.open("POST", "https://webdev-api.loftschool.com/sendmail");
      xhr.send(data);
      xhr.addEventListener("load", () => {
        if (xhr.response.status === 1) {
          popupSuccess.classList.add("popup--show");
          form.reset();
        } else {
          popupRefusal.classList.add("popup--show");
        }
      });
    } else {
      popupError.classList.add("popup--show");
      form.classList.add("validation-error");
    }
  });

  window.addEventListener("keydown", function (event) {
    if (event.keyCode === 27 || event.keyCode === 13) {
      if (
        popupError.classList.contains("popup--show") ||
        popupSuccess.classList.contains("popup--show") ||
        popupRefusal.classList.contains("popup--show")
      ) {
        event.preventDefault();
        popupHide();
      }
    }
  });

  popupClose.forEach((item) => {
    item.addEventListener("click", function (e) {
      popupHide();
    });
  });

  popup.forEach((item) => {
    item.addEventListener("click", function (e) {
      popupHide();
    });
  });

  function popupHide() {
    popupError.classList.remove("popup--show");
    popupSuccess.classList.remove("popup--show");
    popupRefusal.classList.remove("popup--show");
  }
})();
