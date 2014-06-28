define(function(require) {
  var app;
  var React = require('react');
  var AppView = require('jsx!views/app');
  var preferences = require('preferences');
  var Registry = require('registry');
  var injectPreferences = function() {
    app.setProps({ preferences: preferences.get() });
  };

  app = React.renderComponent(AppView(), document.body);

  preferences.onChange(injectPreferences);
  injectPreferences();

  Registry.get = function(key) {
    return app.props[key];
  };

  window.App = app;
  return app;
});
