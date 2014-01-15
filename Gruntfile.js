module.exports = function(grunt) {
  grunt.initConfig({
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'app/server.js'
        }
      },
      prod: {
        options: {
          script: 'app/server.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'app/server.js'
        }
      }
    },
    watch: {
      files:  [ '**/*.js' ],
      tasks:  [ 'express:dev', 'watch'],
      options: {
        nospawn: true //Without this option specified express won't be reloaded
      }  
    }
  });

  
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('server', [ 'express:dev', 'watch' ])
  grunt.registerTask('default', ['server']);
};