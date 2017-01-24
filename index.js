var argv        = require('minimist')(process.argv.slice(2))
var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var watch       = require('metalsmith-watch');
var sass        = require('metalsmith-sass');
var browserify  = require('metalsmith-browserify');
var date        = require('metalsmith-build-date');
var rootPath    = require('metalsmith-rootpath');
var assets      = require('metalsmith-assets');


var ms = Metalsmith(__dirname)
  .metadata({
    title: "II-B or not II-B",
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(date())
  .use(sass({
    sourceMap: true,
    sourceMapContents: true
  }))
  .use(browserify({
    dest: 'bundle.js',
    entries: ['./src/index.js'],
    sourcemaps: true,
    watch: false
  }))
  .use(markdown({
    gfm: true,
    breaks: true,
    smartypants: true
  }))
  .use(permalinks())
  .use(rootPath())
  .use(layouts({
    engine: 'handlebars',
    partials: 'partials'
  }))
  .use(assets({
    source: './assets', // relative to the working directory
    destination: './assets' // relative to the build directory
  }))

if(argv.watch) {
  ms.use(
    watch({
      paths: {
        "${source}/**/*": "**/*",
        "layouts/**/*": "**/*",
        "partials/**/*": "**/*"
      },
      livereload: true,
    })
  )
}


ms.build(function(err, files) {
  if (err) { throw err; }
});