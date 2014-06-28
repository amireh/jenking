/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Console = require('jsx!./inspector/console');
  var Starred = require('jsx!./inspector/starred');
  var Aborted = require('jsx!./inspector/aborted');

  /**
   * @class Inspector
   *
   * Inspects a single patch, showing its build job status and log output.
   */
  var Inspector = React.createClass({
    getInitialState: function() {
      return {
        tab: 'console'
      };
    },

    getDefaultProps: function() {
      return {
        patch: undefined,
        patches: [],
        log: {},
        isLoadingLog: false,
        connected: false,
        starred: [],
        jobs: []
      };
    },

    render: function() {
      var patch = this.props.patch;
      var tab = this.state.tab;

      return(
        <div id="inspector">
          <div className="active-tab">
            {tab === 'console' &&
              <Console
                patch={patch}
                isLoadingLog={this.props.isLoadingLog}
                log={this.props.log} />
            }
            {tab === 'starred' &&
              <Starred starred={this.props.starred} jobs={this.props.jobs} />
            }
            {tab === 'aborted' &&
              <Aborted
                jobs={this.props.jobs.filter(function(job) {
                  return job.status === 'ABORTED';
                })}
                patches={this.props.patches.map(function(patch) {
                  return { id: patch.id, subject: patch.subject };
                })}
              />
            }
          </div>

          <div className="tabs" onClick={this.switchTab}>
            <button
              name="console"
              className={tab === 'console' ? 'active' : null}
              children="Console" />
            <button
              name="starred"
              className={tab === 'starred' ? 'active' : null}
              children="Starred" />
            <button
              name="aborted"
              className={tab === 'aborted' ? 'active' : null}
              children="Aborted" />
          </div>
        </div>
      );
    },

    switchTab: function(e) {
      var tab = e.target.name;
      e.preventDefault();

      if (tab) {
        this.setState({ tab: tab });
      }
    }
  });

  return Inspector;
});