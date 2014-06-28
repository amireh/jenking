define(function(require) {
  var extend = require('util/extend');
  var Registry = require('registry');
  var ajax = require('ajax');
  var findBy = require('util/find_by');
  var updateProps = require('update_props');

  var Jobs = function(propKey) {
    this.propKey = propKey || 'jobs';

    Object.defineProperty(this, 'length', {
      get: function() {
        return this.getAll().length;
      }
    });

    return this;
  };

  extend(Jobs.prototype, {
    getAll: function() {
      return Registry.get(this.propKey) || [];
    },

    find: function(rawLink) {
      var link = encodeURIComponent(rawLink);
      return ajax('GET', '/job?link=' + link);
    },

    // Add a job to the set, or update an existing one.
    add: function(job) {
      var props;
      var jobs = this.getAll();
      var existingJob = findBy(jobs, 'id', job.id);

      if (existingJob) {
        jobs[jobs.indexOf(existingJob)] = job;
      }
      else {
        jobs.push(job);
      }

      props = {};
      props[this.propKey] = this.getAll();
      updateProps(props);

      return this.getAll();
    },

    retrigger: function(rawLink) {
      var link = encodeURIComponent(rawLink);

      updateProps({
        notification: 'Retriggering ' + rawLink + '...'
      });

      return ajax('GET', '/job/retrigger?link=' + link).then(function(job) {
        this.add(job);

        updateProps({
          notification: 'Retriggering ' + rawLink + ' done.',
          error: undefined
        });
      }.bind(this), function(payload) {
        updateProps({ error: payload.error });
      });
    }
  });

  return Jobs;
});