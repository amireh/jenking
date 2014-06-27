define(function(require) {
  var extend = require('util/extend');
  var onChange = [];
  var defaults = {
    query: 'status:open owner:self',
    retriggerAborted: true
  };

  var preferences = {
    save: function(prefs) {
      var newPrefs = extend({}, preferences.get(), prefs);

      localStorage.setItem('preferences', JSON.stringify(newPrefs));

      onChange.forEach(function(callback) {
        callback(newPrefs);
      });
    },

    onChange: function(handler) {
      onChange.push(handler);
    },

    get: function() {
      return extend({}, defaults, JSON.parse(localStorage.preferences || '{}'));
    }
  };

  return preferences;
});