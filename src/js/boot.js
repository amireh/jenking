var GLOBAL = this;

define(function(require) {
  var app;
  var React = require('react');
  var AppView = require('jsx!views/app');
  var preferences = require('preferences');
  var injectPreferences = function() {
    app.setProps({ preferences: preferences.get() });
  };

  app = React.renderComponent(AppView(), document.body);

  preferences.onChange(injectPreferences);
  injectPreferences();

  //>>excludeStart("production", pragmas.production);
  require('debug')(app);
  //>>excludeEnd("production");

  GLOBAL.App = app;
  return app;
});
