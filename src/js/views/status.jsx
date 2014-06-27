/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions');
  var Settings = require('jsx!./settings');
  var Messages = require('jsx!./messages');

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
        isRetriggeringAbortedJobs: false,
        preferences: {}
      };
    },

    render: function() {
      return(
        <footer id="status">
          {this.state.showingSettings &&
            <Settings
              onClose={this.hideSettings}
              preferences={this.props.preferences} />
          }

          {(this.props.error || this.props.notification) &&
            <Messages
              error={this.props.error}
              notification={this.props.notification}
              />
          }

          {this.props.connected && this.renderConnectedButtons()}

          <button onClick={this.showSettings} children="Settings" />
        </footer>
      );
    },

    renderConnectedButtons: function() {
      var job = this.props.job;
      var canRetrigger = job &&
        !job.success &&
        !job.active &&
        !this.props.isRetriggering;

      return [
        canRetrigger &&
          <button
            key="retrigger"
            onClick={this.retrigger}
            children={this.props.isRetriggering ? 'Retriggering...' : 'Retrigger'}
            />
        ,
        <button
          key="reload"
          disabled={this.props.isLoadingPatches}
          onClick={this.reload}
          children={this.props.isLoadingPatches ? 'Loading...' : 'Reload'}
          />
        ,

        <button
          key="retrigger-aborted"
          disabled={this.isRetriggeringAbortedJobs}
          onClick={this.retriggerAbortedJobs}
          children={
            this.isRetriggeringAbortedJobs ?
              'Retriggering aborted...' :
              'Retrigger Aborted'
          }
          />
        ,
        <button
          key="disconnect"
          onClick={this.disconnect}
          children="Disconnect" />
      ];
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