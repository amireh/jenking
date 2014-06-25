/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Loading = React.createClass({
    render: function() {
      return(
        <span className="loading">☀</span>
      );
    }
  });

  return Loading;
});