/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
  var updateProps = require('update_props');

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

          <input type="submit" value="Login to Gerrit" />
        </form>
      );
    },

    login: function(e) {
      e.preventDefault();

      ajax('POST', '/connect', {
        username: this.refs.username.getDOMNode().value,
        password: this.refs.password.getDOMNode().value
      }).then(function() {
        updateProps({ connected: true });
      }, function(error) {
        updateProps({ error: error });
      });
    },
  });

  return Login;
});