/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
  var updateProps = require('update_props');

  /**
   * @class Inspector
   *
   * Inspects a single patch, showing its build job status and log output.
   */
  var Inspector = React.createClass({
    getDefaultProps: function() {
      return {
        patch: undefined,
        jobs: [{
          "startedAt" : 1403676128000,
          "success" : false,
          "status" : "FAILURE",
          "active" : false,
          "duration" : 2893125,
          "url" : "http://jenkins.instructure.com/job/canvas-sel-a-core/2969/",
          "id" : 2969,
          "label" : "canvas-sel-a-core #2969",
          "estimatedDuration" : 2458466
        }],
        log: {
          log: 'Some test log.'
        }
      };
    },

    render: function() {
      var patch = this.props.patch;

      return(
        <div id="inspector">
          {patch ? this.renderPatch(patch) : 'Choose a patch to inspect.'}
        </div>
      );
    },

    componentWillReceiveProps: function(nextProps) {
      if (nextProps.patch !== this.props.patch && nextProps.patch) {
        this.loadJobs(nextProps.patch);
      }
    },

    renderPatch: function(patch) {
      return (
        <div>
          <h2>{patch.subject}</h2>

          <header>Jobs</header>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Job</th>
              </tr>
            </thead>

            {
              this.props.jobs.map(this.renderJob)
            }
          </table>

          <pre
            className="console"
            children={this.props.log.log} />
        </div>
      );
    },

    renderJob: function(job) {
      return (
        <tr
          onClick={this.inspectJob.bind(null, job.url)}
          key={'job-' + job.id}>
          <td>{job.status}</td>
          <td><a>{job.label}</a></td>
        </tr>
      );
    },

    loadJobs: function(patch) {
      var jobs = [];

      // updateProps({ status: 'Loading job details.' });

      patch.links.forEach(function(link) {
        ajax('GET', '/job?link=' + link).then(function(job) {
          jobs.push(job);
          updateProps({ jobs: jobs });
        });
      });
    },

    inspectJob: function(link) {
      ajax('GET', '/job/log?link=' + link).then(function(log) {
        updateProps({ log: log });
      });
    }
  });

  return Inspector;
});