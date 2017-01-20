var argv        = require('minimist')(process.argv.slice(2))
var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var watch       = require('metalsmith-watch');
var sass        = require('metalsmith-sass');
var metallic    = require('metalsmith-metallic');
var browserify  = require('metalsmith-browserify');
var date        = require('metalsmith-build-date');

var ms = Metalsmith(__dirname)
  .metadata({
    title: "My Static Site & Blog",
    description: "It's about saying »Hello« to the World.",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .use(date())
  .source('./src')
  .destination('./build')
  .clean(false)
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
    breaks: true
  }))
  .use(permalinks())
  .use(layouts({
    engine: 'handlebars',
    partials: 'partials'
  }));

if(argv.watch) {
  ms.use(
    watch({
      paths: {
        "${source}/**/*": true,
        "layouts/**/*": true,
        "partials/**/*": true
      },
      livereload: true,
    })
  )
}


ms.build(function(err, files) {
  if (err) { throw err; }
});