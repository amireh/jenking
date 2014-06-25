/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
  var updateProps = require('update_props');

  var Status = React.createClass({
    propTypes: {
      connected: React.PropTypes.bool
    },

    getDefaultProps: function() {
      return {
        connected: false
      };
    },
    render: function() {
      return(
        <footer id="status">
          {this.props.message &&
            <div>{this.props.message}</div>
          }

          {this.props.connected ? "Connected" : "Disconnected"}
          {this.props.connected && this.renderDisconnect()}
        </footer>
      );
    },

    renderDisconnect: function() {
      return <button onClick={this.disconnect} children="Disconnect" />;
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