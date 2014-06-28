define(function(require) {
  var seed = require('debug/seed') || {};
  var Actions = require('actions');
  var Registry = require('registry');
  var RSVP = require('rsvp');
  var preferences = require('preferences');
  var DEBUG = this.DEBUG = this.d = {};

  DEBUG.actions = Actions;
  DEBUG.registry = Registry;
  DEBUG.preferences = preferences;

  Object.defineProperty(DEBUG, 'props', {
    get: function() { return DEBUG.app.props; }
  });

  Object.defineProperty(DEBUG, 'patches', {
    get: function() { return DEBUG.props.patches; }
  });

  RSVP.configure('onerror', function(e) {
    console.log('RSVP error:', e);

    if (e && e.message) {
      console.log(e.message);
    }
    if (e && e.stack) {
      console.log(e.stack);
    }
  });

  return function(app) {
    DEBUG.app = app;
    app.setProps(seed);
  }
});