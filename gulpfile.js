const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

// Compile scss into css
function style() {
  // 1. Where is my scss file
  return (
    gulp
      .src('./src/scss/**/*.scss')
      // 2. pass that file through sass compiler
      .pipe(sass().on('error', sass.logError))
      // 3. where we want to compile it to
      .pipe(gulp.dest('./public/styles'))
      // 4. stream changes to all browser
      .pipe(browserSync.stream())
  );
}

// scripts
var jsFiles = './src/js/**/*.js',
  jsDest = './public/js';

function scripts() {
  return gulp
    .src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(rename('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
  gulp.watch('./src/scss/**/*.scss', style);
  gulp.watch(jsFiles, scripts);
  gulp.watch('./*.html').on('change', browserSync.reload);
  gulp.watch('./public/js/*.js').on('change', browserSync.reload);
}
// What does this do
exports.style = style;
exports.scripts = scripts;
exports.watch = watch;
