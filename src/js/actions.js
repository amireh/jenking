define(function(require) {
  var ajax = require('ajax');
  var updateProps = require('update_props');
  var findBy = require('util/find_by');
  var preferences = require('preferences');
  var Registry = require('registry');
  var JobCollection = require('collections/jobs');
  var RSVP = require('rsvp');
  var notify = function(message) {
    updateProps({ notification: message });
  };

  var Jobs = new JobCollection('jobs');

  var Actions = {
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
      var services;

      updateProps({
        isLoadingJobs: links.length > 0,
        activeJobId: null,
        log: undefined // reset any loaded log
      });

      services = links.map(function(link) {
        return Jobs.find(link).then(function(job) {
          Jobs.add(job);
        });
      });

      RSVP.all(services).finally(function() {
        updateProps({ isLoadingJobs: false });
      });
    },

    loadJob: function(link) {
      Jobs.find(link).then(function(job) {
        Jobs.add(job);
      });
    },

    loadJobLog: function(rawLink) {
      var link = encodeURIComponent(rawLink);

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

    loadAllJobs: function() {
      var loads = Registry.get('patches').reduce(function(links, patch) {
        return links.concat(patch.links);
      }, []).map(function(link) {
        return Jobs.find(link).then(function(job) {
          Jobs.add(job);
        });
      });

      return RSVP.all(loads);
    },

    retriggerAbortedJobs: function() {
      notify('Searching for aborted jobs...');

      Actions.loadAllJobs().finally(function() {
        var retriggers, jobCount;
        var abortedJobs = Jobs.getAll().filter(function(job) {
          return job.status === 'ABORTED';
        });

        jobCount = abortedJobs.length;

        if (jobCount) {
          notify(jobCount + ' aborted jobs will be retriggered.');

          retriggers = abortedJobs.map(function(job) {
            Jobs.retrigger(job.url);
          });
        }

        return RSVP.all(retriggers).finally(function() {
          return jobCount;
        });
      }).finally(function(jobCount) {
        var message = jobCount === 0 ?
          'No aborted jobs were found.' :
          jobCount + ' aborted jobs were retriggered.';

        notify(message);
      });
    },

    retriggerStarredJobs: function() {
      preferences.get('starred').forEach(function(star) {
        Jobs.retrigger(star.link);
      });
    },

    retrigger: function(link) {
      updateProps({ isRetriggering: true });

      Jobs.retrigger(link).finally(function() {
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
        console.error('No patch found with a job for this url:', link);
        return;
      }

      star = findBy(starredJobs, 'link', link);
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
          link: link,
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

  return Actions;
});