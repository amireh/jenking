/* global App: false */
define(function(require) {
  var ajax = require('ajax');
  var updateProps = require('update_props');
  var findBy = require('util/find_by');

  return {
    connect: function(username, password) {
      updateProps({ isConnecting: true });
      ajax.authenticate(username, password);
      ajax('GET', '/connect').then(function() {
        updateProps({
          connected: true,
          isConnecting: false,
          error: undefined
        });
      }, function(error) {
        updateProps({
          error: error,
          isConnecting: false
        });
      });
    },

    disconnect: function() {
      ajax('GET', '/disconnect').then(function() {
        updateProps({}, true);
      });
    },

    loadPatches: function() {
      updateProps({ isLoadingPatches: true });

      ajax('GET', '/patches').then(function(patches) {
        updateProps({
          patches: patches,
          isLoadingPatches: false,
          error: undefined
        });
      }, function(error) {
        updateProps({ error: error, isLoadingPatches: false });
      });
    },

    loadJobs: function(links) {
      var jobs = [];
      var loaded = 0;
      var linkCount = links.length;
      var isDone = function() {
        return linkCount === loaded;
      };

      updateProps({
        isLoadingJobs: linkCount > 0,
        jobs: [],
        log: undefined // reset any loaded log
      });

      links.forEach(function(link) {
        ajax('GET', '/job?link=' + link).then(function(job) {
          jobs.push(job);

          ++loaded;

          updateProps({ jobs: jobs, isLoadingJobs: !isDone() });
        }, function() {
          ++loaded;

          updateProps({ isLoadingJobs: !isDone() });
        });
      });
    },

    retrigger: function(jobLink) {
      updateProps({ isRetriggering: true });

      ajax('GET', '/job/retrigger?link=' + jobLink).then(function(jobStatus) {
        var jobs = App.props.jobs;
        var job = findBy(jobs, 'id', jobStatus.id);
        var jobIndex = jobs.indexOf(job);

        jobs[jobIndex] = jobStatus;

        updateProps({
          isRetriggering: false,
          error: undefined,
          jobs: jobs
        });
      }, function(error) {
        updateProps({
          error: error,
          isRetriggering: false
        });
      });
    }
  };
});