/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Messages = React.createClass({
    getInitialState: function() {
      return {
        notification: null
      };
    },

    getDefaultProps: function() {
      return {
        error: undefined,
        notification: undefined
      };
    },

    componentWillReceiveProps: function(nextProps) {
      if (nextProps.error) {
        this.setState({ notification: null });
      }
      else if (nextProps.notification) {
        this.setState({ notification: nextProps.notification });
      }
    },

    render: function() {
      return(
        <div>
          {this.props.error &&
            <div id="errorBox">
              {JSON.stringify(this.props.error)}
            </div>
          }
          {!this.props.error && this.state.notification &&
            <div id="errorBox" className="notification">
              {this.state.notification}
              <a onClick={this.dismissNotification}>Dismiss</a>
            </div>
          }
        </div>
      );
    },

    dismissNotification: function() {
      this.setState({ notification: null });
    }
  });

  return Messages;
});