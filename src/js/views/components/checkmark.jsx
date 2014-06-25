/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Checkmark = React.createClass({
    render: function() {
      return(
        <span>✓</span>
      );
    }
  });

  return Checkmark;
});