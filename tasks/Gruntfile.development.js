/* jslint node: true */
var shell = require('shelljs');

module.exports = function(grunt, readPackage) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-tagrelease');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-clean');

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
};