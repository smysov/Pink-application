//ОБъявление переменных
const buttonPrev = document.querySelector(".slider__prev");
buttonNext = document.querySelector(".slider__next");
slides = document.querySelectorAll(".slider__item");
dots = document.querySelectorAll(".slider__button");

//Текущий индекс 
let index = 0;

//Функция передаёт активный класс псевдомассиву
const activeSlide = (n) => {
  for (slide of slides) {
    slide.classList.remove("slider__item--active");
  }
  slides[n].classList.add("slider__item--active");
};

//Функция передаёт активный класс псевдомассиву
const activeDots = (n) => {
  for (dot of dots) {
    dot.classList.remove("slider__button--active");
  }
  dots[n].classList.add("slider__button--active");
};

//Функция вызывает две функции
const readyActiveSlide = (ind) => {
  activeSlide(ind);
  activeDots(ind);
};

//Функция запускает проверку(если слайдер находится на последнем слайде, мы индексу присваеваем 0, первый слайд) условие if присваевает индексу ноль и вызывает функцию readyActiveSlide. Иначе мы к индексу прибавляем 1 и вызываем функцию readyActiveSlide
const nextSlide = () => {
  if (index == slides.length - 1) {
    index = 0;
    readyActiveSlide(index);
  } else {
    index++;
    readyActiveSlide(index);
  }
};

//Функция выполняет проверку, если слайдер находится на первом слайде, то мы индексу присваеваем последный индекс, последний слайд, условие if присваевает индексу последний индекс и вызывает функцию readyActiveSlide, иначе мы уменьшаем индекс на 1
const prevSlide = () => {
  if (index == 0) {
    index = slides.length - 1;
    readyActiveSlide(index);
  } else {
    index--;
    readyActiveSlide(index);
  }
};

dots.forEach((item, indexDot) => {
  item.addEventListener('click', () => {
    index = indexDot;
    readyActiveSlide(index);
  })
});

//ОБработчик событий, протсходит по клику, вторым аргуметом передаю функцию
buttonNext.addEventListener("click", nextSlide);
buttonPrev.addEventListener("click", prevSlide);

//Функция автоматического показа слайдов

const automaticDisplaySlides = setInterval(nextSlide, 5000)
