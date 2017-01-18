var argv        = require('minimist')(process.argv.slice(2))
var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var watch       = require('metalsmith-watch');
var sass        = require('metalsmith-sass');
var metallic    = require('metalsmith-metallic');
var browserify  = require('metalsmith-browserify');

var ms = Metalsmith(__dirname)
  .metadata({
    title: "My Static Site & Blog",
    description: "It's about saying »Hello« to the World.",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .source('./src')
  .destination('./build')
  .clean(false)
  .use(sass({
    sourceMap: true,
    sourceMapContents: true   // This will embed all the Sass contents in your source maps.
  }))
  .use(browserify({
    dest: 'bundle.js',
    entries: ['./src/index.js'],
    sourcemaps: true,
    watch: false
  }))
  .use(markdown())
  .use(permalinks())
  .use(layouts({
    engine: 'mustache'
  }));

if(argv.watch) {
  ms.use(
    watch({
      paths: {
        "${source}/**/*": true,
        "templates/**/*": "**/*.md",
      },
      livereload: true,
    })
  )
}


ms.build(function(err, files) {
  if (err) { throw err; }
});