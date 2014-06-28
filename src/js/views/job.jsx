/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Checkmark = require('jsx!./components/checkmark');
  var Cross = require('jsx!./components/cross');
  var Loading = require('jsx!./components/loading');
  var Star = require('jsx!./components/star');
  var Nuke = require('jsx!./components/nuke');

  var Job = React.createClass({
    render: function() {
      var job = this.props;
      var statusIndicator;
      var className = React.addons.classSet({
        'active': this.props.selected
      });

      if (job.active) {
        statusIndicator = <Loading />;
      }
      else {
        statusIndicator = job.status === 'SUCCESS' ?
          <Checkmark /> :
          job.status === 'ABORTED' ?
            <Nuke /> :
            <Cross />;
      }

      return (
        <li className="job" key={'job-' + job.id}>
          <div className="status-indicator">
            {statusIndicator}
          </div>

          <a
            className={className}
            href={job.url}
            onClick={this.props.onClick}
            children={job.label} />

          {!job.success &&
            <Star isStarred={this.props.isStarred} link={job.url} />
          }
        </li>
      );
    }
  });

  return Job;
});