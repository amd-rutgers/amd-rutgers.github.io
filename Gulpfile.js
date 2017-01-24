const gulp = require('gulp');
const metalsmith = require('gulp-metalsmith');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const del = require('del');

// gulp plugins
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const cssimport = require('gulp-cssimport');

// metalsmith plugins
const markdown    = require('metalsmith-markdown');
const layouts     = require('metalsmith-layouts');
const permalinks  = require('metalsmith-permalinks');
const rootPath    = require('metalsmith-rootpath');
const assets      = require('metalsmith-assets');


//var ms = Metalsmith(__dirname)
//  .metadata({
//    title: "II-B or not II-B",
//  })
//  .source('./src')
//  .destination('./build')
//  .clean(true)
//  .use(date())
//  .use(sass({
//    sourceMap: true,
//    sourceMapContents: true
//  }))
//  .use(browserify({
//    dest: 'bundle.js',
//    entries: ['./src/index.js'],
//    sourcemaps: true,
//    watch: false
//  }))
//  .use(markdown({
//    gfm: true,
//    breaks: true,
//    smartypants: true
//  }))
//  .use(permalinks())
//  .use(rootPath())
//  .use(layouts({
//    engine: 'handlebars',
//    partials: 'partials'
//  }))
//  .use(assets({
//    source: './assets', // relative to the working directory
//    destination: './assets' // relative to the build directory
//  }))
//
//if(argv.watch) {
//  ms.use(
//    watch({
//      paths: {
//        "${source}/**/*": "**/*",
//        "layouts/**/*": "**/*",
//        "partials/**/*": "**/*"
//      },
//      livereload: true,
//    })
//  )
//}
//
//
//ms.build(function(err, files) {
//  if (err) { throw err; }
//});

gulp.task('assets', function() {
  
});

gulp.task('css', function() {
  return gulp.src('./src/styles.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(cssimport())
    .pipe(sourcemaps.write('./maps/'))
    .pipe(gulp.dest('./build/'))
});

gulp.task('js', function () {
  const b = browserify({
    entries: ['./src/index.js'],
    debug: true
  });
  
  // add babelify
  b.transform(babelify, { presets: "babel-preset-latest"});
  
  return b.bundle()
      .pipe(plumber())
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
        .pipe(uglify())
      .pipe(sourcemaps.write('./maps/'))
      .pipe(gulp.dest('./build/'));
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
          source: './assets', // relative to the working directory
          destination: './assets' // relative to the build directory
        })
      ],
      metadata: {
        title: "II-B or not II-B",
        timestamp: Date.now()
      }
    })).pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  
});

gulp.task('clean', function() {
  return del([
    './build/*'
  ]);
})

gulp.task('build', ['html', 'css', 'js']);
