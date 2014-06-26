/* jslint node: true */
var config;
var glob = require('glob');
var path = require('path');

module.exports = function(grunt) {
  'use strict';

  function readPackage() {
    return grunt.file.readJSON(path.join(__dirname, 'package.json'));
  }

  function loadOptions(path, config) {
    glob.sync('*', { cwd: path }).forEach(function(option) {
      var key = option.replace(/^grunt\-|\.js$/g,'');
      config[key] = require(path + option);
    });
  }

  config = {
    pkg: readPackage(),
    env: process.env
  };

  loadOptions('./tasks/options/', config);

  grunt.initConfig(config);
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-connect-proxy');

  if (!process.env.production) {
    require('./tasks/Gruntfile.development')(grunt, readPackage);
  }

  grunt.registerTask('spawn-jenkingd',
    require('./tasks/spawn_jenkingd').bind(null, grunt));

  grunt.registerTask('default', [
    'spawn-jenkingd',
    'configureProxies:www',
    'connect:www'
  ]);
};
