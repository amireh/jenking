module.exports = function(grunt) {
  'use strict';

  var shell = require('shelljs');
  var exec = require('child_process').exec;
  var spawn = require('child_process').spawn;
  var config;
  var jenkingd;

  function readPackage() {
    return grunt.file.readJSON('package.json');
  }

  function loadFrom(path, config) {
    var glob = require('glob'),
    object = {};

    glob.sync('*', {cwd: path}).forEach(function(option) {
      var key = option.replace(/\.js$/,'').replace(/^grunt\-/, '');
      config[key] = require(path + option);
    });
  }

  config = {
    pkg: readPackage(),
    env: process.env
  };

  loadFrom('./tasks/grunt/', config);

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-tagrelease');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-connect-proxy');

  grunt.registerTask('compile:js', [
    'symlink:compiled',
    'requirejs:compile',
    'clean:compiled_symlink'
  ]);

  grunt.registerTask('compile:jsx', [ 'clean:compiled', 'react' ]);
  grunt.registerTask('compile:css', [ 'less' ]);

  grunt.registerTask('updatePkg', function () {
    grunt.config.set('pkg', readPackage());
  });

  grunt.registerTask('build', [
    'clean:compiled',
    'react',
    'compile:js',
    'compile:css'
  ]);

  grunt.registerTask('version', [ 'string-replace:version' ]);
  grunt.registerTask('default', [
    'spawn-jenkingd', 'configureProxies:www', 'connect:www'
  ]);

  // Release alias task
  grunt.registerTask('release', function (type) {
    grunt.task.run('bumpup:' + ( type || 'patch' ));
    grunt.task.run('updatePkg');
    grunt.task.run('version');
    grunt.task.run('build');
    grunt.task.run('tagrelease');
    // grunt.task.run('development');
  });

  grunt.registerTask('development', function() {
    shell.exec('rm www/dist/jenking.js &> /dev/null');
    shell.exec('cd www/dist; ln -s ../../src/js/main.js ./jenking.js');
    shell.exec('cd www/; ln -s ../src ./');
    shell.exec('cd www/; ln -s ../vendor ./');

    grunt.task.run('compile:css');
  });

  grunt.registerTask('spawn-jenkingd', function() {
    var cleanedUp;
    var cleanup = function() {
      if (cleanedUp) {
        return;
      }

      cleanedUp = true;

      if (jenkingd) {
        grunt.log.writeln('killing jenkingd...');
        jenkingd.kill();
      }

      // give it some time to cleanup
      setTimeout(function() { process.exit(0); }, 100);
    };

    jenkingd = spawn('jenkingd', [], {
      stdio: [ 'ignore', 'pipe', process.stderr ],
      killSignal: 'SIGINT'
    });

    jenkingd.stdout.on('data', function(message) {
      if (/unable to bind/.test(message)) {
        grunt.fatal(''+message);
      }
      else {
        grunt.log.write(message);
      }
    });

    process.on('exit', cleanup).on('SIGTERM', cleanup).on('SIGINT', cleanup);
  });
};
