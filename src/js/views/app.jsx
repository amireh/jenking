/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var findBy = require('util/find_by');
  var Brain = require('jsx!./brain');
  var Login = require('jsx!./login');
  var Status = require('jsx!./status');
  var PatchTree = require('jsx!./patch_tree');
  var Inspector = require('jsx!./inspector');

  var getActivePatch = function(props) {
    return findBy(props.patches, 'id', props.activePatchId);
  };

  var App = React.createClass({
    propTypes: {
      activePatchId: React.PropTypes.string,
      activeJobId: React.PropTypes.string,

      connected: React.PropTypes.bool,
      error: React.PropTypes.object,
      patches: React.PropTypes.array,
      jobs: React.PropTypes.array,

      log: React.PropTypes.shape({
        log: React.PropTypes.string
      })
    },

    getDefaultProps: function() {
      return {
        activePatchId: undefined,
        activeJobId: undefined,

        connected: false,
        error: undefined,
        patches: [],
        jobs: [],
        log: undefined,

        isConnecting: false,
        isLoadingPatches: false,
        isLoadingJobs: false,
        isLoadingLog: false,
        isRetriggering: false,
      };
    },

    render: function() {
      var activePatch = getActivePatch(this.props);
      var activeJob = findBy(this.props.jobs, 'id', this.props.activeJobId);


      return (
        <div id="jenking">
          {this.transferPropsTo(Brain())}

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
              isLoadingJobs={this.props.isLoadingJobs}
              activeJobId={this.props.activeJobId} />
            }
          </main>

          <Inspector
            key="inspector"
            patch={activePatch}
            log={this.props.log}
            isLoadingLog={this.props.isLoadingLog}
            connected={this.props.connected} />

          <Status
            key="status"
            error={this.props.error}
            connected={this.props.connected}
            isLoadingPatches={this.props.isLoadingPatches}
            patch={activePatch}
            job={activeJob}
            isRetriggering={this.props.isRetriggering}
            preferences={this.props.preferences}
            />
        </div>
      );
    }
  });

  return App;
});