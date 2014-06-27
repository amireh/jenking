define(function(require) {
  var extend = require('util/extend');
  var onChange = [];

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
      return JSON.parse(localStorage.preferences || '{}');
    }
  };

  return preferences;
});