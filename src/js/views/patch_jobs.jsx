/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var findBy = require('util/find_by');
  var extend = require('util/extend');
  var updateProps = require('update_props');
  var Job = require('jsx!./job');

  var PatchJobs = React.createClass({
    getDefaultProps: function() {
      return {
        isLoadingJobs: false,
        activeJobId: undefined,
        jobs: [],
        starred: []
      };
    },

    render: function() {
      if (this.props.isLoadingJobs) {
        return <p className="jobListing">Loading jobs...</p>;
      }
      else if (!this.props.jobs.length) {
        return (<p className="jobListing">
          Jobs unavailable. Perhaps this is a stale patch, or a very new one?
        </p>);
      }
      else {
        return (
          <ul className="jobListing">
            {
              this.props.jobs.map(this.renderJob)
            }
          </ul>
        );
      }
    },

    renderJob: function(job) {
      var jobProps = extend({}, job, {
        key: 'job-'+job.id,
        selected: this.props.activeJobId === job.id,
        isStarred: findBy(this.props.starred, 'link', job.url),
        onClick: this.inspectJob.bind(null, job.id, job.url)
      });

      return Job(jobProps);
    },

    inspectJob: function(jobId, jobUrl, e) {
      e.preventDefault();

      if (jobId !== this.props.activeJobId) {
        updateProps({
          activeJobId: jobId
        });
      }
    }
  });

  return PatchJobs;
});