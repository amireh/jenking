define(function(require) {
  var seed = require('debug/seed') || {};
  var Actions = require('actions');
  var DEBUG = this.DEBUG = this.d = {};

  DEBUG.actions = Actions;

  Object.defineProperty(DEBUG, 'props', {
    get: function() { return DEBUG.app.props; }
  });

  Object.defineProperty(DEBUG, 'patches', {
    get: function() { return DEBUG.props.patches; }
  });

  return function(app) {
    DEBUG.app = app;
    app.setProps(seed);
  }
});