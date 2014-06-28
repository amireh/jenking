/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions');

  var Star = React.createClass({
    getDefaultProps: function() {
      return {
        isStarred: undefined,
        link: undefined
      };
    },

    render: function() {
      var className = React.addons.classSet({
        'a11y-btn': true,
        'star-btn': true,
        'active': this.props.isStarred
      });

      return(
        <button
          onClick={this.toggleStar}
          className={className}
          children="★"
          />
      );
    },

    toggleStar: function(e) {
      var link;

      e.preventDefault();
      link = this.props.link;

      Actions.starJob(link);
    }
  });

  return Star;
});