const Handlebars = require('handlebars');
module.exports = {
  "codeColumns": function(options) {
    return new Handlebars.SafeString(
        '<div class="code-columns">'
        + options.fn(this)
        + '</div>');
  }
}