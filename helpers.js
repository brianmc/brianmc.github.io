Handlebars.registerHelper('idFromTitle', function(title) {
  return title.toLowerCase().replace(/ /g,"-");
});