/* global App: false */
define(function(require) {
  var ajax = require('ajax');
  var updateProps = require('update_props');
  var findBy = require('util/find_by');
  var preferences = require('preferences');
  var RSVP = require('rsvp');
  var notify = function(message) {
    updateProps({ notification: message });
  };

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

    retriggerAbortedJobs: function(patches) {
      var jobs = [];
      var nrJobs;
      var loads;

      updateProps({
        isRetriggeringAbortedJobs: true,
        notification: 'Searching for aborted jobs...'
      });

      loads = patches.reduce(function(links, patch) {
        return links.concat(patch.links);
      }, []).map(function(link) {
        return ajax('GET', '/job?link=' + link).then(function(job) {
          if (job.status === 'ABORTED') {
            jobs.push(job);
          }
        });
      });

      RSVP.all(loads).finally(function() {
        var retriggers;

        nrJobs = jobs.length;

        if (nrJobs) {
          notify(nrJobs + ' aborted jobs will be retriggered.');

          retriggers = jobs.map(function(job) {
            return ajax('GET', '/job/retrigger?link=' + job.url).then(function() {
              jobs.splice(jobs.indexOf(job), 1);

              notify((nrJobs - jobs.length) + ' aborted jobs were retriggered, ' +
                jobs.length + ' job(s) remain.');
            });
          });
        }

        return RSVP.all(retriggers);
      }).finally(function() {
        updateProps({
          isRetriggeringAbortedJobs: false,
          notification: nrJobs === 0 ?
            'No aborted jobs were found.' :
            nrJobs + ' aborted jobs were retriggered.'
        });

        return nrJobs > 0;
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