var GLOBAL = this;

define(function(require) {
  var React = require('react');
  var AppView = require('jsx!views/app');

  GLOBAL.App = React.renderComponent(AppView(), document.body);

  return GLOBAL.App;
});
