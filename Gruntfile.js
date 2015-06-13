module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      css: {
        src: ['node_modules/bootstrap/dist/css/bootstrap.css', 'public/stylesheets/style.css'],
        dest: 'public/stylesheets/application.css'
      }
    }
  })

  // TODO: ADD Watch Task when Building more js
  grunt.loadNpmTasks('grunt-contrib-concat');
};