/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
  var findBy = require('util/find_by');
  var updateProps = require('update_props');
  var Actions = require('actions');
  var Brain = React.createClass({
    getDefaultProps: function() {
      return {
        preferences: {
          retriggerFrequency: 5 * 60,
          starred: []
        }
      };
    },

    componentDidMount: function() {
      ajax('GET', '/status').then(function(status) {
        updateProps({
          connected: status.connected
        });
      });
    },

    componentDidUpdate: function(prevProps) {
      var patch, job, jobs;
      var prevPrefs = prevProps.preferences;
      var thisPrefs = this.props.preferences;

      // Load available patches once we're connected:
      if (!prevProps.connected && this.props.connected) {
        Actions.loadPatches();
      }

      // Load a patch's jobs once it is activated:
      if (prevProps.activePatchId !== this.props.activePatchId) {
        if (this.props.activePatchId) {
          patch = findBy(this.props.patches, 'id', this.props.activePatchId);
          Actions.loadJobs(patch.links);
        }
      }

      // Load the job's log once it is activated:
      if (prevProps.activeJobId !== this.props.activeJobId) {
        if (this.props.activeJobId) {
          job = findBy(this.props.jobs, 'id', this.props.activeJobId);
          Actions.loadJobLog(job.url);
        }
      }

      if (prevProps.connected !== this.props.connected) {
        if (this.props.connected) {
          this.start();
        }
        else {
          this.stop();
        }
      }
      else if (prevPrefs.retriggerFrequency !== thisPrefs.retriggerFrequency) {
        this.stop();
        this.start();
      }

      if (prevPrefs.starred !== thisPrefs.starred) {
        jobs = this.props.jobs;

        thisPrefs.starred.forEach(function(star) {
          if (!findBy(jobs, 'id', star.id)) {
            Actions.loadJob(star.link);
          }
        });
      }
    },

    start: function() {
      var frequency;

      frequency = Math.max(this.props.preferences.retriggerFrequency, 60);
      this.autoRetrigger = setInterval(this.retrigger, frequency * 1000);

      console.info('Retriggering jobs every', frequency, 'seconds.');
    },

    stop: function() {
      if (this.autoRetrigger) {
        clearInterval(this.autoRetrigger);
        this.autoRetrigger = undefined;
      }
    },

    render: function() {
      return <div />;
    },

    retrigger: function() {
      if (this.preferences.retriggerAborted) {
        Actions.retriggerAbortedJobs(this.props.patches);
      }

      if (this.preferences.starred.length) {
        Actions.retriggerStarredJobs(this.preferences.starred);
      }
    }
  });

  return Brain;
});