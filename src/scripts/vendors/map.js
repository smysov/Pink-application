(function () {
  ymaps.ready(function () {
    let map = new ymaps.Map("map", {
      center: [53.1880376186109, 50.0894190217094],
      zoom: 18,
      controls: ["zoomControl"],
      behaviors: ["drag"],
    });

    let placemark = new ymaps.Placemark(
      [53.188095616143556, 50.08957727204131],
      {
        hintContent: "Здесь мы трудимся над нашим приложением!",
        balloonContent:
          "<h3>Мы рады, любым Вашим предложениям!</h3><b>Мы работаем с 8:00 до 20:00, ежедневно.<b>",
      },
      {
        iconLayout: "default#image",
        iconImageHref: "../img/decor/icon-map-marker.svg",
        iconImageSize: [35, 35],
        iconImageOffset: [7, -15],
      }
    );

    map.geoObjects.add(placemark);
  });
})();
