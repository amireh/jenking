/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
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
        connected: false
      };
    },
    render: function() {
      return(
        <footer id="status">
          {this.props.error &&
            <div id="errorBox">
              {JSON.stringify(this.props.error)}
            </div>
          }

          <button
            disabled={!this.props.connected || this.props.patchesLoading}
            onClick={this.load}
            children={this.props.patchesLoading ? 'Loading...' : 'Reload'} />

          {this.props.connected ?
            <button onClick={this.disconnect} children="Disconnect" /> :
            <button onClick={this.connect} children="Connect" />
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

    disconnect: function(e) {
      e.preventDefault();

      ajax('GET', '/disconnect').then(function() {
        updateProps({
          connected: false
        });
      });
    },
  });

  return Status;
});