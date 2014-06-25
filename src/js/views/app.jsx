/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
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

    getDefaultProps: function() {
      return {
        connected: false,
        status: 'idle',
        error: undefined,
        patches: [],
        jobs: [],
        log: undefined
      };
    },

    render: function() {
      var activePatchId = this.props.activePatchId;
      var activePatch = this.props.patches.filter(function(patch) {
        return patch.id === activePatchId;
      })[0];

      return (
        <div>
          <h1>JENKING</h1>

          {!this.props.connected && <Login />}

          <PatchTree
            patches={this.props.patches}
            connected={this.props.connected} />

          <Inspector
            patch={activePatch}
            jobs={this.props.jobs}
            log={this.props.log} />

          {this.props.error &&
            <div id="errorBox">
              {JSON.stringify(this.props.error)}
            </div>
          }

          <Status
            message={this.props.status}
            connected={this.props.connected} />
        </div>
      );
    }
  });

  return App;
});