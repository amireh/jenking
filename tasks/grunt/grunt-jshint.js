module.exports = {
  js: [ 'src/js/**/*.js' ],
  jsx: [ 'tmp/compiled/jsx/**/*.js' ],
  options: {
    force: true,
    jshintrc: '.jshintrc',
    '-W098': true,
    reporter: require('jshint-stylish-ex')
  }
};
