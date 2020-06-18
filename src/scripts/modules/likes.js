(function () {
    let likeButtons = document.querySelectorAll(".photo__like");
    let numberLikes = document.querySelectorAll(".photo__amount");
  
    likeButtons.forEach((item, index) => {
      item.addEventListener("click", () => {
          if (item.classList.contains("added")) {
            numberLikes[index].textContent--;
            item.classList.remove("added");
          } else {
            numberLikes[index].textContent++;
            item.classList.add("added");
          }
      });
    });
  })();
