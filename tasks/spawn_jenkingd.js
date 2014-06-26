/* jslint node: true */
var jenkingd;
var path = require('path');
var spawn = require('child_process').spawn;
var bin = path.join(__dirname, '..', 'node_modules', 'jenkingd', 'bin', 'jenkingd');

module.exports = function spawnJenkingd(grunt) {
  'use strict';

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

  jenkingd = spawn(bin, [], {
    env: process.env,
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
};