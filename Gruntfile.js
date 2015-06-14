module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    jshint: {
      files: ['*.js', 'lib/*.js']
    },

    jscs: {
      src: ['*.js', 'lib/*.js'],
      options: {
        config: '.jscsrc'
      }
    }

  });

  grunt.registerTask('default', ['jshint', 'jscs']);

};
