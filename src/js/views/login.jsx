/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions');

  var Login = React.createClass({
    render: function() {
      return(
        <form onSubmit={this.login}>
          <label>
            Username: <input type="text" ref="username" />
          </label>

          <label>
            Password: <input type="password" ref="password" />
          </label>

          <input className="btn" type="submit" value="Login to Gerrit" />
        </form>
      );
    },

    login: function(e) {
      e.preventDefault();

      Actions.connect(
        this.refs.username.getDOMNode().value,
        this.refs.password.getDOMNode().value);
    },
  });

  return Login;
});