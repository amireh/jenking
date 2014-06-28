/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var updateProps = require('update_props');
  var Statusbar = React.createClass({
    getDefaultProps: function() {
      return {
        error: undefined,
        notification: undefined
      };
    },

    render: function() {
      var hasNotification = !this.props.error && this.props.notification;
      return(
        <div id="statusbar" className={hasNotification ? 'notification' : null}>
          {this.props.error &&
            JSON.stringify(this.props.error)
          }

          {hasNotification &&
            [
              <span key="message">{this.props.notification}</span>,
              <a key="dismiss" onClick={this.dismissNotification}>Dismiss</a>
            ]
          }
        </div>
      );
    },

    dismissNotification: function() {
      updateProps({ notification: undefined });
    }
  });

  return Statusbar;
});