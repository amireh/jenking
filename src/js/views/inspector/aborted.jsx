/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions');
  var findBy = require('util/find_by');

  var Aborted = React.createClass({
    getInitialState: function() {
      return {
        loading: false
      };
    },
    componentDidMount: function() {
      this.setState({
        loading: true
      });

      Actions.loadAllJobs().finally(function() {
        this.setState({ loading: null });
      }.bind(this));
    },

    render: function() {
      return(
        <div id="console-aborted">
          <h2>Aborted Jobs</h2>

          {this.state.loading &&
            <p>
              <strong>
                Downloading latest job data... this may take a while.
              </strong>
            </p>
          }

          {!this.state.loading && this.renderDetails()}
        </div>
      );
    },

    renderDetails: function() {
      // Group them by patch for some hierarchy:
      var patches = this.props.patches;
      var patchJobs = this.props.jobs.reduce(function(hsh, job) {
        if (!hsh[job.patchId]) {
          hsh[job.patchId] = {
            label: findBy(patches, 'id', job.patchId).subject,
            jobs: []
          };
        }

        hsh[job.patchId].jobs.push(job);
        return hsh;
      }, {});

      return (
        <div>
          {this.props.jobs.length ?
            <p>
              You can choose to <a onClick={this.retrigger}>manually
              retrigger</a> these jobs, or have Jenking automatically retrigger them for you
              until they succeed by setting the appropriate option in
              Settings.
            </p> :
            <p>There are no aborted jobs.</p>
          }

          {Object.keys(patchJobs).map(this.renderPatch.bind(null, patchJobs))}
        </div>
      );
    },

    renderPatch: function(patchJobs, patchId) {
      var abortedJobs = patchJobs[patchId];

      return [
        <h3>{abortedJobs.label}</h3>,
        <ul>
          {abortedJobs.jobs.map(this.renderJob)}
        </ul>
      ];
    },

    renderJob: function(job) {
      return (
        <li key={job.id}>
          <a onClick={this.consume} href={job.link}>{job.label}</a>
        </li>
      );
    },

    retrigger: function(e) {
      this.consume(e);

      Actions.retriggerStarredJobs();
    },

    consume: function(e) {
      e.preventDefault();
    }
  });

  return Aborted;
});