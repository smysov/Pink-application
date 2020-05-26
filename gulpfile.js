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
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const svgo = require("gulp-svgo");
const svgSprite = require("gulp-svg-sprite");
const gulpif = require("gulp-if");

const env = process.env.NODE_ENV;

const { SRC_PATH, DIST_PATH, STYLE_LIBS, JS_LIBS } = require("./gulp.config");

sass.compiler = require("node-sass");

task("clean", () => {
  return src(`${DIST_PATH}/**/*`, { read: false }).pipe(rm());
});

task("copy:html", () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task("fonts", () => {
  return src(`${SRC_PATH}/fonts/*`)
    .pipe(dest(`${DIST_PATH}/fonts`))
    .pipe(reload({ stream: true }));
});

task("copy:pictures", () => {
  return src(`${SRC_PATH}/images/content/*`)
    .pipe(dest(`${DIST_PATH}/img/content`))
    .pipe(reload({ stream: true }));
});

task("copy:decor", () => {
  return src(`${SRC_PATH}/images/decor/*`)
    .pipe(dest(`${DIST_PATH}/img/decor`))
    .pipe(reload({ stream: true }));
});

task("styles", () => {
  return (
    src([...STYLE_LIBS, `${SRC_PATH}/scss/style.scss`])
      .pipe(gulpif(env === "dev", sourcemaps.init()))
      .pipe(sassGlob()) // лучше пеедавать только блоки, чтобы не перебить стили
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
      .pipe(gulpif(env === "prod", cleanCSS()))
      .pipe(gulpif(env === "dev", sourcemaps.write()))
      .pipe(dest(`${DIST_PATH}/css`))
      .pipe(reload({ stream: true }))
  );
});

task("scripts", () => {
  return src([...JS_LIBS, `${SRC_PATH}/scripts/*js`])
    .pipe(gulpif(env === "dev", sourcemaps.init()))
    .pipe(concat("main.min.js", { newLine: ";" }))
    .pipe(gulpif(env === "prod", babel({ presets: ["@babel/env"] })))
    .pipe(gulpif(env === "prod", uglify()))
    .pipe(gulpif(env === "dev", sourcemaps.write()))
    .pipe(dest(`${DIST_PATH}/js`))
    .pipe(reload({ stream: true }));
});

task("icons", () => {
  return src(`${SRC_PATH}/images/icons/*.svg`)
    .pipe(
      svgo({
        plugins: [
          {
            removeAttrs: { attrs: "(fill|data.*)" }
          }
        ]
      })
    )
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: "../sprite.svg"
          }
        }
      })
    )
    .pipe(dest(`${DIST_PATH}/img/icon`));
});

task("server", () => {
  browserSync.init({
    server: {
      baseDir: `${DIST_PATH}`,
    },
    open: false,
  });
});

task("watch", () => {
  watch(`./${SRC_PATH}/scss/**/*.scss`, series("styles"));
  watch(`./${SRC_PATH}/*.html`, series("copy:html"));
  watch(`./${SRC_PATH}/scripts/*.js`, series("scripts"));
});

task(
  "default",
  series(
    "clean",
    parallel(
      "copy:html",
      "copy:pictures",
      "copy:decor",
      "icons"
      "styles",
      "scripts",
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
      "icons",
      "styles",
      "scripts",
      "fonts"
    )
  )
);
