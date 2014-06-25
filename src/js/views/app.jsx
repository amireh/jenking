/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
  var Actions = require('actions');
  var findBy = require('util/find_by');
  var Login = require('jsx!./login');
  var Status = require('jsx!./status');
  var PatchTree = require('jsx!./patch_tree');
  var Inspector = require('jsx!./inspector');

  var App = React.createClass({
    componentDidMount: function() {
      ajax('GET', '/status').then(function(status) {
        this.setProps({
          connected: status.connected
        });
      }.bind(this));
    },

    componentDidUpdate: function(prevProps, prevState) {
      if (!prevProps.connected && this.props.connected) {
        Actions.loadPatches();
      }
    },

    getDefaultProps: function() {
      return {
        activePatchId: undefined,
        activeJobId: undefined,

        connected: false,
        status: 'idle',
        error: undefined,
        patches: [],
        jobs: [],
        jobsLoading: false,
        log: undefined,
        logLoading: false,

        isRetriggering: false,
        isConnecting: false,
      };
    },

    render: function() {
      var activePatch = findBy(this.props.patches, 'id', this.props.activePatchId);
      var activeJob = findBy(this.props.jobs, 'id', this.props.activeJobId);

      return (
        <div id="jenking">
          <main id="content">
            <h1 key="heading">JENKING</h1>

            {!this.props.connected && <Login
              key="login"
              isConnecting={this.props.isConnecting} />
            }

            {this.props.connected && <PatchTree
              key="patch-tree"
              patches={this.props.patches}
              activePatchId={this.props.activePatchId}
              jobs={this.props.jobs}
              jobsLoading={this.props.jobsLoading}
              activeJobId={this.props.activeJobId} />
            }
          </main>

          <Inspector
            key="inspector"
            patch={activePatch}
            log={this.props.log}
            loading={this.props.logLoading} />

          <Status
            key="status"
            error={this.props.error}
            connected={this.props.connected}
            patchesLoading={this.props.patchesLoading}
            job={activeJob}
            isRetriggering={this.props.isRetriggering} />
        </div>
      );
    }
  });

  return App;
});