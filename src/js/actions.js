define(function(require) {
  var ajax = require('ajax');
  var updateProps = require('update_props');

  return {
    loadPatches: function() {
      updateProps({ patchesLoading: true });

      ajax('GET', '/patches').then(function(patches) {
        updateProps({ patches: patches, patchesLoading: false });
      }, function(error) {
        updateProps({ error: error, patchesLoading: false });
      });
    }
  }
});