/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Star = require('jsx!../components/star');
  var Job = require('jsx!../job');
  var Actions = require('actions');
  var extend = require('util/extend');
  var findBy = require('util/find_by');

  var Starred = React.createClass({
    render: function() {
      // Group them by patch for some hierarchy:
      var stars = this.props.starred.reduce(function(hsh, star) {
        if (!hsh[star.patchId]) {
          hsh[star.patchId] = {
            label: star.patchSubject,
            jobs: []
          };
        }

        hsh[star.patchId].jobs.push(star);
        return hsh;
      }, {});

      return(
        <div id="console-starred">
          <h2>Starred Jobs</h2>

          {this.props.starred.length ?
            <p>
              The following jobs will be automatically retriggered until they
              succeeed.
              You can choose to <a onClick={this.retrigger}>manually retrigger
              them</a> as well.
            </p> :
            [
              <p>You have not starred any jobs.</p>,
              <p>Starred jobs will be automatically retriggered for you until
              they succeed, or you un-star them.</p>
            ]
          }

          {Object.keys(stars).map(this.renderPatchStars.bind(null, stars))}
        </div>
      );
    },

    renderPatchStars: function(allStars, patchId) {
      var stars = allStars[patchId];

      return [
        <header>{stars.label}</header>,
        <ul className="jobListing">
          {stars.jobs.map(this.renderStarredJob)}
        </ul>
      ];
    },

    renderStarredJob: function(star) {
      var jobProps = extend({
        onClick: this.consume,
      }, findBy(this.props.jobs, 'id', star.id));

      return Job(jobProps);
    },

    retrigger: function(e) {
      this.consume(e);

      Actions.retriggerStarredJobs();
    },

    consume: function(e) {
      e.preventDefault();
    }
  });

  return Starred;
});