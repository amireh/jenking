/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions');
  var Settings = require('jsx!./settings');
  var findBy = require('util/find_by');
  var updateProps = require('update_props');

  var Status = React.createClass({
    getInitialState: function() {
      return {
        showingSettings: false
      };
    },

    getDefaultProps: function() {
      return {
        connected: false,
        /** Errors get displayed in a nice bar, JSON.stringify() style */
        error: undefined,
        /** Patch is needed for reloading its jobs */
        patch: undefined,
        job: undefined,
        isRetriggering: false,
        isLoadingPatches: false,
        preferences: {}
      };
    },

    render: function() {
      var job = this.props.job;
      var canRetrigger = this.props.connected &&
        job &&
        !job.success &&
        !job.active &&
        !this.props.isRetriggering;

      return(
        <footer id="status">
          {this.state.showingSettings &&
            <Settings
              onClose={this.hideSettings}
              preferences={this.props.preferences} />
          }

          {this.props.error &&
            <div id="errorBox">
              {JSON.stringify(this.props.error)}
            </div>
          }

          {canRetrigger &&
            <button
              onClick={this.retrigger}
              children={this.props.isRetriggering ? 'Retriggering...' : 'Retrigger'}
              />
          }

          {this.props.connected &&
            <button
              disabled={this.props.isLoadingPatches}
              onClick={this.reload}
              children={this.props.isLoadingPatches ? 'Loading...' : 'Reload'} />
          }

          {this.props.connected &&
            <button onClick={this.disconnect} children="Disconnect" />
          }

          <button onClick={this.showSettings} children="Settings" />
        </footer>
      );
    },

    reload: function(e) {
      if (e) {
        e.preventDefault();
      }

      Actions.loadPatches();

      if (this.props.patch) {
        Actions.loadJobs(this.props.patch.links);
      }
    },

    retrigger: function(e) {
      e.preventDefault();

      Actions.retrigger(this.props.job.url);
    },

    disconnect: function(e) {
      e.preventDefault();

      Actions.disconnect();
    },

    showSettings: function() {
      this.setState({
        showingSettings: true
      });
    },

    hideSettings: function() {
      this.setState({
        showingSettings: false
      });
    }
  });

  return Status;
});