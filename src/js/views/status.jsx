/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions');

  var Status = React.createClass({
    getDefaultProps: function() {
      return {
        connected: false,
        /** Errors get displayed in a nice bar, JSON.stringify() style */
        error: undefined,
        /** Job is needed for retriggering */
        job: undefined,
        isRetriggering: false,
        isLoadingPatches: false
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
              onClick={this.load}
              children={this.props.isLoadingPatches ? 'Loading...' : 'Reload'} />
          }

          {this.props.connected &&
            <button onClick={this.disconnect} children="Disconnect" />
          }
        </footer>
      );
    },

    load: function(e) {
      if (e) {
        e.preventDefault();
      }

      Actions.loadPatches();
    },

    retrigger: function(e) {
      e.preventDefault();

      Actions.retrigger(this.props.job.url);
    },

    disconnect: function(e) {
      e.preventDefault();

      Actions.disconnect();
    },
  });

  return Status;
});