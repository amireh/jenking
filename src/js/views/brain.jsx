/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
  var findBy = require('util/find_by');
  var updateProps = require('update_props');
  var Actions = require('actions');
  var Brain = React.createClass({
    componentDidMount: function() {
      ajax('GET', '/status').then(function(status) {
        updateProps({
          connected: status.connected
        });
      });
    },

    componentDidUpdate: function(prevProps) {
      var patch, job;

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
    },

    render: function() {
      return <div />;
    }
  });

  return Brain;
});