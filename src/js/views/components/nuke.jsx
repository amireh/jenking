/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Nuke = React.createClass({
    render: function() {
      return(
        <span className="status-indicator aborted">☢</span>
      );
    }
  });

  return Nuke;
});