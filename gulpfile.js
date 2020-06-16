const { src, dest, task, series, watch, parallel } = require("gulp");
const rm = require("gulp-rm");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const px2rem = require("gulp-smile-px2rem");
const gcmq = require("gulp-group-css-media-queries");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const svgo = require("gulp-svgo");
const svgSprite = require("gulp-svg-sprite");
const gulpif = require("gulp-if");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const htmlmin = require("gulp-htmlmin");
const csso = require("gulp-csso");

const env = process.env.NODE_ENV;

const { SRC_PATH, DIST_PATH, STYLE_LIBS, JS_LIBS } = require("./gulp.config");

sass.compiler = require("node-sass");

//ОЧИСТКА ПАПКИ DIST

task("clean", () => {
  return src(`${DIST_PATH}/**/*`, { read: false }).pipe(rm());
});

//КОПИРОВАНИЕ HTML

task("copy:html", () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

//КОПИРОВАНИЕ ШРИФТОВ

task("fonts", () => {
  return src(`${SRC_PATH}/fonts/*`)
    .pipe(dest(`${DIST_PATH}/fonts`))
    .pipe(reload({ stream: true }));
});

//КОПИРОВАНИЕ КОНТЕНТНЫХ ИЗОБРАЖЕНИЙ

task("copy:pictures", () => {
  return src(`${SRC_PATH}/images/content/*`)
    .pipe(dest(`${DIST_PATH}/img/content`))
    .pipe(reload({ stream: true }));
});

//КОПИРОВАНИЕ ДЕКОРАТИВНЫХ ИЗОБРАЖЕНИЙ

task("copy:decor", () => {
  return src(`${SRC_PATH}/images/decor/*`)
    .pipe(dest(`${DIST_PATH}/img/decor`))
    .pipe(reload({ stream: true }));
});

//Оптимизация изображений

task("images:content", () => {
  return src(`${SRC_PATH}/images/content/*.{png,jpg}`)
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.svgo(),
      ])
    )
    .pipe(dest(`${DIST_PATH}/img/content/`));
});

task("images:decor", () => {
  return src(`${SRC_PATH}/images/decor/*.{png,jpg,svg}`)
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.svgo(),
      ])
    )
    .pipe(dest(`${DIST_PATH}/img/decor/`));
});

//КОНВЕРТАЦИЯ ИЗОБРАЖЕНИЙ

task("webp:content", () => {
  return src(`${SRC_PATH}/images/content/*.{jpg,png}`)
    .pipe(webp({ quality: 80 }))
    .pipe(dest(`${DIST_PATH}/img/content/`));
});

//СТИЛИ

task("styles", () => {
  return (
    src([...STYLE_LIBS, `${SRC_PATH}/scss/main.scss`])
      .pipe(gulpif(env === "dev", sourcemaps.init()))
      .pipe(sassGlob())
      .pipe(concat("main.min.scss"))
      .pipe(sass().on("error", sass.logError))
      //.pipe(px2rem())
      .pipe(
        gulpif(
          env === "dev",
          autoprefixer({
            cascade: false,
          })
        )
      )
      .pipe(gulpif(env === "prod", gcmq()))
      .pipe(gulpif(env === "prod", csso()))
      .pipe(gulpif(env === "dev", sourcemaps.write()))
      .pipe(dest(`${DIST_PATH}/css`))
      .pipe(reload({ stream: true }))
  );
});

//ОСНОВНЫЕ СКРИПТЫ

task("scripts:modules", () => {
  return src(`${SRC_PATH}/scripts/modules/*js`)
    .pipe(gulpif(env === "dev", sourcemaps.init()))
    .pipe(concat("main.min.js", { newLine: ";" }))
    .pipe(gulpif(env === "prod", babel({ presets: ["@babel/env"] })))
    .pipe(gulpif(env === "prod", uglify()))
    .pipe(gulpif(env === "dev", sourcemaps.write()))
    .pipe(dest(`${DIST_PATH}/js`))
    .pipe(reload({ stream: true }));
});

//СТОРОННИЕ СКРИПТЫ БИБЛИОТЕКИ

task("scripts:vendors", () => {
  return (
    src(`${SRC_PATH}/scripts/vendors/*js`)
      .pipe(gulpif(env === "dev", sourcemaps.init()))
      .pipe(gulpif(env === "prod", babel({ presets: ["@babel/env"] })))
      .pipe(gulpif(env === "prod", uglify()))
      .pipe(gulpif(env === "dev", sourcemaps.write()))
      .pipe(dest(`${DIST_PATH}/js`))
      .pipe(reload({ stream: true }))
  );
});

//СПРАЙТ

task("icons", () => {
  return src(`${SRC_PATH}/images/icons/*.svg`)
    .pipe(
      svgo({
        plugins: [
          {
            removeAttrs: { attrs: "(data.*)" },
          },
        ],
      })
    )
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest(`${DIST_PATH}/img/icons`));
});

//СЕРВЕР

task("server", () => {
  browserSync.init({
    server: {
      baseDir: `${DIST_PATH}`,
    },
    open: true,
  });
});

//СЛЕЖКА ФАЙЛОВ

task("watch", () => {
  watch(`./${SRC_PATH}/scss/**/*.scss`, series("styles"));
  watch(`./${SRC_PATH}/*.html`, series("copy:html"));
  watch(`./${SRC_PATH}/scripts/*.js`, series("scripts:modules"));
  watch(`./${SRC_PATH}/scripts/*.js`, series("scripts:vendors"));
});

//ТАСКИ

task(
  "default",
  series(
    "clean",
    parallel(
      "copy:html",
      "copy:pictures",
      "copy:decor",
      "images:content",
      "images:decor",
      "webp:content",
      "icons",
      "styles",
      "scripts:modules",
      "scripts:vendors",
      "fonts"
    ),
    parallel("watch", "server")
  )
);

task(
  "build",
  series(
    "clean",
    parallel(
      "copy:html",
      "copy:pictures",
      "copy:decor",
      "images:content",
      "images:decor",
      "webp:content",
      "icons",
      "styles",
      "scripts:modules",
      "scripts:vendors",
      "fonts"
    )
  )
);
