/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Checkmark = require('jsx!./components/checkmark');
  var Cross = require('jsx!./components/cross');
  var Loading = require('jsx!./components/loading');
  var Star = require('jsx!./components/star');
  var updateProps = require('update_props');
  var findBy = require('util/find_by');

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
      var className = this.props.activeJobId === job.id ? 'active' : null;
      var star = findBy(this.props.starred, 'url', job.url);
      var statusIndicator;

      if (job.active) {
        statusIndicator = <Loading />;
      }
      else {
        statusIndicator = job.status === 'SUCCESS' ? <Checkmark /> : <Cross />;
      }

      return (
        <li key={'job-' + job.id}>
          {statusIndicator}

          <a
            className={className}
            href={job.url}
            onClick={this.inspectJob.bind(null, job.id, job.url)}
            children={job.label} />

          {!job.success && <Star isStarred={!!star} link={job.url} />}
        </li>
      );
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