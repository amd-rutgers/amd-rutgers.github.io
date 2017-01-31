const argv = process.argv.slice(2);
const gulp = require('gulp');
const gulpsmith = require('gulpsmith');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const del = require('del');
const run = require('run-sequence');
const assign = require('node-assign');
const autoprefixer = require('autoprefixer');

// gulp plugins
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const cssimport = require('gulp-cssimport');
const s3 = require('gulp-s3-upload')({ useIAM:true });
const frontmatter = require('gulp-front-matter');
const postcss = require('gulp-postcss');

// metalsmith plugins
const layouts = require('metalsmith-layouts');
const grep = require('metalsmith-grep');
const permalinks = require('metalsmith-permalinks');
const inPlace = require('metalsmith-in-place');

const subs = [
  {
    search: /\/assets\//g,
    replace: "https://s3.amazonaws.com/2b.andydayton.com/"
  }
]

function metalsmith() {
  let gs = gulpsmith();
  
  gs
  .metadata({
    title: "II-B or not II-B",
    timestamp: Date.now()
  })
  .use(grep({ subs: subs }))
  .use(inPlace({
    engineOptions: {
      html: true,
      linkify: true,
      typographer: true
    }
  }))
  .use(layouts({
    engine: 'handlebars',
    partials: 'partials'
  }))
  .use(permalinks())
  
  return gs;
}

gulp.task('assets', function() {
  return gulp.src('./assets/**')
    .pipe(s3({
      Bucket: '2b.andydayton.com',
      ACL: 'public-read'
    }))
    .pipe(connect.reload())
});

gulp.task('css', function() {
  return gulp.src(['./src/styles.scss'])
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(cssimport())
      .pipe(postcss([autoprefixer()]))
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

 return gulp.src([
     'src/**',
     '!src/**/*.js',
     '!src/**/*.scss',
     '!src/**/*.scss'
    ])
    .pipe(frontmatter()).on("data", function(file) {
        if(file.frontMatter) {
          assign(file, file.frontMatter);
        }
    })
    .pipe(metalsmith())
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch([
    './src/**/*.md',
    './src/**/*.html',
    './src/**/*.css',
    './layouts/**/*',
    './partials/**/*'
  ], ['html']);
  gulp.watch(['./src/**/*.scss'], ['css']);
  gulp.watch(['./src/**/*.js'], ['js']);
  gulp.watch(['./assets/**/*'], ['assets']);
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
gulp.task('build', ['assets', 'html', 'css', 'js']);
gulp.task('default', ['build']);