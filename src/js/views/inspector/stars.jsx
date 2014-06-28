/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Star = require('jsx!../components/star');

  var Stars = React.createClass({
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
        <h3>{stars.label}</h3>,
        <ul>
          {stars.jobs.map(this.renderStarredJob)}
        </ul>
      ];
    },

    renderStarredJob: function(star) {
      return (
        <li key={star.id}>
          <a onClick={this.consume} href={star.url}>{star.label}</a>
          <Star isStarred link={star.url} />
        </li>
      );
    },

    consume: function(e) {
      e.preventDefault();
    }
  });

  return Stars;
});