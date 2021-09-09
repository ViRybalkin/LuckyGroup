const { src, dest, task, series, watch, parallel } = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
// const px2rem = require("gulp-smile-px2rem");
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const env = process.env.NODE_ENV;

sass.compiler = require('node-sass');

task('clean', () => {
  console.log(env);
  return src('dist/**/*', { read: false }).pipe(rm());
});

task('copy:html', () => {
  return src('src/*.html')
    .pipe(dest('dist'))
    .pipe(reload({ stream: true }));
});

task('copy:content', () => {
  return src('src/img/**/*')
    .pipe(dest('dist/img'))
    .pipe(reload({ stream: true }));
});
task('copy:fonts', () => {
  return src('src/fonts/*')
    .pipe(dest('dist/fonts'))
    .pipe(reload({ stream: true }));
});

const styles = ['src/styles/layout/main.scss'];
const libs = ['src/scripts/*.js'];

task('styles', () => {
  return (
    src(styles)
      .pipe(gulpif(env === 'dev', sourcemaps.init()))
      .pipe(concat('main.scss'))
      .pipe(sassGlob())
      .pipe(sass().on('error', sass.logError))
      // .pipe(px2rem())
      .pipe(
        gulpif(
          env === 'prod',
          autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
          })
        )
      )
      .pipe(gulpif(env === 'prod', gcmq()))
      .pipe(gulpif(env === 'prod', cleanCSS()))
      .pipe(gulpif(env === 'dev', sourcemaps.write()))
      .pipe(dest('dist'))
      .pipe(reload({ stream: true }))
  );
});

task('scripts', () => {
  return src(libs)
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.min.js', { newLine: ';' }))
    .pipe(
      gulpif(
        env === 'prod',
        babel({
          presets: ['@babel/env'],
        })
      )
    )
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest('dist'))
    .pipe(reload({ stream: true }));
});

task('server', () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    open: false,
  });
});

task('watch', () => {
  watch('src/styles/**/*.scss', series('styles'));
  watch('src/*.html', series('copy:html'));
  watch('src/*.html', series('copy:content'));
  watch('src/*.html', series('copy:fonts'));
  watch('src/scripts/*.js', series('scripts'));
});

task(
  'default',
  series(
    'clean',
    parallel('copy:html', 'copy:content', 'copy:fonts', 'styles', 'scripts'),
    parallel('watch', 'server'),
    'server'
  )
);
