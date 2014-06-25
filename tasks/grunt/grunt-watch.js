module.exports = {
  options: {
    nospawn: true,
    spawn: false
  },

  css: {
    files: '{src,vendor}/css/**/*.{less,css}',
    tasks: [ 'compile:css' ]
  },

  lint_js: {
    files: 'src/js/**/*.js',
    tasks: [ 'jshint:js' ]
  },

  lint_jsx: {
    files: 'src/js/**/*.jsx',
    tasks: [ 'compile:jsx', 'jshint:jsx' ]
  }
};
