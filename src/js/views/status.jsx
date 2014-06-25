/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
  var findBy = require('util/find_by');
  var updateProps = require('update_props');
  var Actions = require('actions');

  var Status = React.createClass({
    propTypes: {
      connected: React.PropTypes.bool
    },

    getInitialState: function() {
      return {
        loading: false
      };
    },

    getDefaultProps: function() {
      return {
        connected: false,
        jobs: [],
        activeJobId: undefined,
        isRetriggering: false
      };
    },

    render: function() {
      var job = this.props.job;
      var canRetrigger = job && !job.success && !job.active && !this.props.isRetriggering;

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
              disabled={this.props.patchesLoading}
              onClick={this.load}
              children={this.props.patchesLoading ? 'Loading...' : 'Reload'} />
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