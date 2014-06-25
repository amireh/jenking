/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
  var updateProps = require('update_props');
  var findBy = require('util/find_by');
  var Checkmark = require('jsx!./components/checkmark');
  var Cross = require('jsx!./components/cross');

  var PatchTree = React.createClass({
    getInitialState: function() {
      return {
      };
    },

    getDefaultProps: function() {
      return {
        patches: [],
        activePatchId: null,
        jobs: []
      };
    },

    render: function() {
      return(
        <div id="patchTree">
          {
            this.props.patches.length ?
              this.renderPatches() :
              <p>No patches available.</p>
          }

        </div>
      );
    },

    renderPatches: function() {
      return (
        <table>
          <thead>
            <tr>
              <th>V</th>
              <th>Patch</th>
              <th>J</th>
              <th>C</th>
              <th>Q</th>
            </tr>
          </thead>

          <tbody>
            {
              this.props.patches.map(this.renderPatch)
            }
          </tbody>
        </table>
      );
    },

    renderPatch: function(patch) {
      var isActive = patch.id === this.props.activePatchId;
      var record = patch.submitRecords[0].labels;
      var crRecord = findBy(record, 'label', 'Code-Review') || {};
      var qaRecord = findBy(record, 'label', 'QA-Review') || {};
      var jenkinsRecord = findBy(record, 'label', 'Verified') || {};
      var renderStatus = function(status) {
        if (status === 'REJECT') {
          return <Cross />;
        }
        else if (status === 'OK') {
          return <Checkmark />;
        }
        else {
          return <span />
        }
      };

      var className = React.addons.classSet({
        'patch': true,
        'active': isActive
      });

      return(
        [
          <tr
            key={'patch-' + patch.id}
            className={className}
            onClick={!isActive && this.inspectPatch.bind(null, patch.id)}>
            <td>{patch.mergeable ? <Checkmark /> : <Cross />}</td>
            <td><button className="a11y-btn">{patch.subject}</button></td>
            <td>{renderStatus(jenkinsRecord.status)}</td>
            <td>{renderStatus(crRecord.status)}</td>
            <td>{renderStatus(qaRecord.status)}</td>
          </tr>,
          isActive &&
            <tr>
              <td />
              <td colSpan={4}>{this.renderJobs()}</td>
            </tr>
        ]
      );
    },

    inspectPatch: function(patchId) {
      if (patchId !== this.props.activePatchId) {
        var jobs = [];
        var patch = findBy(this.props.patches, 'id', patchId);
        var loaded = 0;

        updateProps({
          activePatchId: patchId,
          jobs: [],
          jobsLoading: patch.links.length > 0,
          log: undefined
        });

        patch.links.forEach(function(link) {
          ajax('GET', '/job?link=' + link).then(function(job) {
            var props = {};

            jobs.push(job);

            props.jobs = jobs;

            if (++loaded === patch.links.length) {
              props.jobsLoading = false;
            }

            updateProps(props);
          }, function(error) {
            if (++loaded === patch.links.length) {
              updateProps({ jobsLoading: false });
            }
          });
        });
      }
    },

    renderJobs: function() {
      if (this.props.jobsLoading) {
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
      var statusIndicator;
      if (job.active) {
        statusIndicator = <span className="loading">☀</span>;
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
            onClick={this.inspectJob.bind(null, job)}
            children={job.label} />
        </li>
      );
    },

    inspectJob: function(job, e) {
      e.preventDefault();

      if (job.id === this.props.activeJobId) {
        // noop
        return;
      }

      updateProps({
        log: undefined,
        logLoading: true,
        activeJobId: job.id
      });

      ajax('GET', '/job/log?link=' + job.url).then(function(log) {
        updateProps({
          log: log,
          logLoading: false
        });
      });
    }
  });

  return PatchTree;
});