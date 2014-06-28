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
          retriggerFrequency: 5 * 60
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
      var patch, job;
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

      // Consume any notification as it got handled in the last render pass.
      //
      // This prevents it from "sticking" around past dismissal.
      if (prevProps.notification) {
        updateProps({ notification: undefined });
      }

      if (prevProps.connected !== this.props.connected) {
        this.props.connected ? this.start() : this.stop();
      }
      else if (
        prevPrefs.retriggerFrequency !== thisPrefs.retriggerFrequency ||
        prevPrefs.retriggerAborted !== thisPrefs.retriggerAborted) {
        this.stop();
        this.start();
      }
    },

    start: function() {
      var frequency;

      if (this.props.preferences.retriggerAborted) {
        frequency = Math.max(this.props.preferences.retriggerFrequency, 60);
        this.autoRetrigger = setInterval(this.retrigger, frequency * 1000);

        console.info('Retriggering aborted jobs every', frequency, 'seconds.');
      }
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
      Actions.retriggerAbortedJobs(this.props.patches);
    }
  });

  return Brain;
});