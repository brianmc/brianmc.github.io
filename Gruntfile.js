module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-compile-handlebars');
  grunt.initConfig({
  'compile-handlebars': {
       dynamicTemplate: {
        template: 'doctemplate.html',
        templateData: 'docdata.json',
        output: 'static.html',
        helpers:'idFromTitle.js'
      }
    }
    
  });

  grunt.registerTask('default', [
    'compile-handlebars'
    ]);

};
