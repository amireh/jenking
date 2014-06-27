define(function(require) {
  var DEBUG = this.DEBUG = this.d = {};
  DEBUG.actions = require('actions');

  Object.defineProperty(DEBUG, 'props', {
    get: function() { return window.App.props; }
  });

  Object.defineProperty(DEBUG, 'patches', {
    get: function() { return DEBUG.props.patches; }
  });

});