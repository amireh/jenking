module.exports = {
  options: {
    strictImports: true
  },
  production: {
    options: {
      paths: [ 'src/css' ],
      compress: true
    },
    files: {
      'www/dist/jenking.css': 'src/css/app.less'
    }
  }
};