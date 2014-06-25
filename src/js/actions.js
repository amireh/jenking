define(function(require) {
  var ajax = require('ajax');
  var updateProps = require('update_props');

  return {
    connect: function(username, password) {
      ajax.authenticate(username, password);
      ajax('GET', '/connect').then(function() {
        updateProps({ connected: true, error: undefined });
      }, function(error) {
        updateProps({ error: error });
      });
    },

    loadPatches: function() {
      updateProps({ patchesLoading: true });

      ajax('GET', '/patches').then(function(patches) {
        updateProps({
          patches: patches,
          patchesLoading: false,
          error: undefined
        });
      }, function(error) {
        updateProps({ error: error, patchesLoading: false });
      });
    }
  }
});