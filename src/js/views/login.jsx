/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions');

  var Login = React.createClass({
    getDefaultProps: function() {
      return {
        isConnecting: false
      };
    },

    render: function() {
      return(
        <form id="login" onSubmit={this.connect}>
          <label>
            Username: <input type="text" ref="username" />
          </label>

          <label>
            Password: <input type="password" ref="password" />
          </label>

          <input
            disabled={this.props.isConnecting}
            className="btn"
            type="submit"
            value={this.props.isConnecting ?
              "Connecting..." :
              "Connect to JENKING"} />
        </form>
      );
    },

    connect: function(e) {
      e.preventDefault();

      Actions.connect(
        this.refs.username.getDOMNode().value,
        this.refs.password.getDOMNode().value);
    },
  });

  return Login;
});