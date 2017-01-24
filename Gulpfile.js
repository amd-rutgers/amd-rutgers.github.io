const gulp = require('gulp');
const metalsmith = require('gulp-metalsmith');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const del = require('del');
const run = require('run-sequence');

// gulp plugins
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const cssimport = require('gulp-cssimport');

// metalsmith plugins
const markdown    = require('metalsmith-markdown');
const layouts     = require('metalsmith-layouts');
const permalinks  = require('metalsmith-permalinks');
const rootPath    = require('metalsmith-rootpath');
const assets      = require('metalsmith-assets');


gulp.task('assets', function() {
  
});

gulp.task('css', function() {
  return gulp.src('./src/styles.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(cssimport())
    .pipe(sourcemaps.write('./maps/'))
    .pipe(gulp.dest('./build/'))
    .pipe(connect.reload())

});

gulp.task('js', function () {
  const b = browserify({
    entries: ['./src/index.js'],
    debug: true
  });
  
  // add babelify
  b.transform(babelify, { presets: "babel-preset-latest"});
  
  return b.bundle()
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
        .pipe(uglify())
      .pipe(sourcemaps.write('./maps/'))
      .pipe(gulp.dest('./build/'))
      .pipe(connect.reload());
});

gulp.task('html', function() {
  return gulp.src('src/**')
    .pipe(metalsmith({
      root: __dirname,
      fontmatter: true,
      ignore: ['src/**/*.js', 'src/**/*.sass', 'src/**/*.scss'],
      use: [
        markdown({
          gfm: true,
          breaks: true,
          smartypants: true
        }),
        permalinks(),
        rootPath(),
        layouts({
          engine: 'handlebars',
          partials: 'partials'
        }),
        assets({
          source: './assets',
          destination: './assets'
        })
      ],
      metadata: {
        title: "II-B or not II-B",
        timestamp: Date.now()
      }
    }))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch([
    './src/**/*.md',
    './src/**/*.html',
    './layouts/**/*',
    './partials/**/*'
  ], ['html']);
  gulp.watch(['/src/**/*.scss'], ['css']);
  gulp.watch(['/src/**/*.js'], ['js']);
});

gulp.task('connect', function() {
  connect.server({
    root: './build',
    livereload: true
  });
});


gulp.task('clobber', function() {
  return del([
    './build/*'
  ]);
});

gulp.task('dev', ['connect', 'watch']);

gulp.task('build', ['html', 'css', 'js']);
