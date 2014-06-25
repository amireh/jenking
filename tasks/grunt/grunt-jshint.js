var reporter;

try {
  reporter = require('jshint-stylish-ex');
}
catch (e) {
  reporter = undefined;
}

module.exports = {
  js: [ 'src/js/**/*.js' ],
  jsx: [ 'tmp/compiled/jsx/**/*.js' ],
  options: {
    force: true,
    jshintrc: '.jshintrc',
    '-W098': true,
    reporter: reporter
  }
};
