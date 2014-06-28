define(function(require) {
  var ajax = require('ajax');
  var updateProps = require('update_props');
  var findBy = require('util/find_by');
  var preferences = require('preferences');
  var Registry = require('registry');
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
        var encodedLink = encodeURIComponent(link);
        return ajax('GET', '/job?link=' + encodedLink).then(function(job) {
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
      var encodedLink = encodeURIComponent(link);

      updateProps({
        log: undefined,
        isLoadingLog: true
      });

      ajax('GET', '/job/log?link=' + encodedLink).then(function(log) {
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
        var encodedLink = encodeURIComponent(link);

        return ajax('GET', '/job?link=' + encodedLink).then(function(job) {
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
            var encodedUrl = encodedLink(job.url);
            return ajax('GET', '/job/retrigger?link=' + encodedUrl).then(function() {
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

    retrigger: function(link) {
      var encodedLink = encodeURIComponent(link);
      updateProps({ isRetriggering: true });

      ajax('GET', '/job/retrigger?link=' + link).then(function(jobStatus) {
        var jobs = Registry.get('jobs');
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
    },

    starJob: function(link) {
      var starredJobs = preferences.get('starred') || [];
      var index, star, job;
      var patch = Registry.get('patches').filter(function(patch) {
        return patch.links.indexOf(link) !== -1;
      })[0];


      if (!patch) {
        debugger
        console.error('No patch found with a job for this url:', link);
        return;
      }

      star = findBy(starredJobs, 'url', link);
      index = starredJobs.indexOf(star);

      if (index === -1) {
        job = findBy(Registry.get('jobs'), 'url', link);

        if (!job) {
          console.error('No job found with a URL:', link);
          return;
        }
        else if (job.success) {
          console.error('Can not star a completed job.');
          return;
        }

        starredJobs.push({
          id: job.id,
          url: link,
          label: job.label,
          patchId: patch.id,
          patchSubject: patch.subject
        });
      }
      else {
        starredJobs.splice(index, 1);
      }

      preferences.save({ starred: starredJobs });
    }
  };
});