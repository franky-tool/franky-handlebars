'use strict'

let Logger
  , utils
  , hbs
  , exphbs  = require('express-handlebars')
  ;

function processTemplateEngine(server) {
  Logger = this.Logger;
  utils = this.utils;
  let app = server.application
    , templatesFolder = server.templatesFolders[0]
    ;

  hbs = exphbs.create({
    extname:'.html',
    layoutsDir: templatesFolder,
    helpers: {}
  });
  app.engine('.html', hbs.engine);
  app.set('view engine', '.html');
  app.set('views', templatesFolder);
}

function loadTemplateEngineFilters(server) {
   let filters = server.pluginManager.getLoadedFilters()
    , action
    ;
  for(let key in filters){
    action = filters[key].bind(server.scope)();
    Logger.log('info', '\t\t- '+key);
    hbs.helpers[key] = action;
  }
}

function prepareName(name){
  return name.replace('.html','');
}

module.exports = {
  "type": "templateEngine",
  "templateEngineProcessor": processTemplateEngine,
  "loadTemplateEngineFilters": loadTemplateEngineFilters,
  "templateNameProprocessor": prepareName
}
