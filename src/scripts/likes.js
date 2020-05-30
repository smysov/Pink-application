let heart = document.querySelectorAll(".photo__like");
let numberLikes = document.querySelectorAll(".photo__amount");

for (let i = 0; i < heart.length; i++) {
  for (let j = 0; j < numberLikes.length; j++) {
    heart[i].addEventListener("click", function (event) {
      if (heart[i].classList.contains("added")) {
        numberLikes[j].textContent--;
        heart[i].classList.remove("added");
      } else {
        numberLikes[j].textContent++;
        heart[i].classList.add("added");
      }
    });
  }
}
