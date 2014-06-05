module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-compile-handlebars');
  grunt.initConfig({
  'compile-handlebars': {
       dynamicTemplate: {
        template: 'doctemplate.html',
        templateData: ['data/aim.json','data/arb.json','data/cim-charge.json','data/cim.json','data/reporting.json'],
        output: 'static.html',
        helpers:'idFromTitle.js'
      }
    }
    
  });

  grunt.registerTask('default', [
    'compile-handlebars'
    ]);

};
