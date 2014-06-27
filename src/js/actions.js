/* global App: false */
define(function(require) {
  var ajax = require('ajax');
  var updateProps = require('update_props');
  var findBy = require('util/find_by');
  var preferences = require('preferences');
  var RSVP = require('rsvp');

  return {
    connect: function(username, password) {
      updateProps({ isConnecting: true });

      ajax.authenticate(username, password);
      ajax('GET', '/connect').then(function() {
        updateProps({
          connected: true,
          error: undefined
        });
      }, function(payload) {
        updateProps({
          error: payload.error
        });
      }).finally(function() {
        updateProps({ isConnecting: false });
      });
    },

    disconnect: function() {
      ajax('GET', '/disconnect').then(function() {
        updateProps({}, true);
      });
    },

    loadPatches: function() {
      var query = encodeURIComponent(preferences.get().query);

      updateProps({ isLoadingPatches: true });

      ajax('GET', '/patches?query=' + query).then(function(patches) {
        updateProps({
          patches: patches,
          error: undefined
        });
      }, function(payload) {
        updateProps({ error: payload.error });
      }).finally(function() {
        updateProps({ isLoadingPatches: false });
      });
    },

    loadJobs: function(links) {
      var jobs = [];
      var services;

      updateProps({
        isLoadingJobs: links.length > 0,
        jobs: [],
        activeJobId: null,
        log: undefined // reset any loaded log
      });

      services = links.map(function(link) {
        return ajax('GET', '/job?link=' + link).then(function(job) {
          jobs.push(job);

          updateProps({ jobs: jobs });
        }, function(payload) {
          if (payload.xhr.status === 404) {
            updateProps({
              error: {
                message: 'Build could no longer be retrieved from Jenkins. ' +
                'This probably means it is too old.'
              }
            });
          }

        });
      });

      RSVP.all(services).then(function() {
        updateProps({ isLoadingJobs: false });
      });
    },

    loadJobLog: function(link) {
      updateProps({
        log: undefined,
        isLoadingLog: true
      });

      ajax('GET', '/job/log?link=' + link).then(function(log) {
        updateProps({
          log: log,
          isLoadingLog: false
        });
      });
    },

    loadAbortedJobs: function(patches) {
      var jobs = [];
      var services = patches.reduce(function(links, patch) {
        return links.concat(patch.links);
      }, []).map(function(link) {
        return ajax('GET', '/job?link=' + link).then(function(job) {
          if (job.status === 'ABORTED') {
            jobs.push(job);
          }
        });
      });

      RSVP.all(services).finally(function() {
        updateProps({ abortedJobs: jobs });
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
          error: undefined,
          jobs: jobs
        });
      }, function(payload) {
        updateProps({ error: payload.error });
      }).finally(function() {
        updateProps({ isRetriggering: false });
      });
    },

    savePreferences: function(prefs) {
      preferences.save(prefs);
    }
  };
});