/** @jsx React.DOM */
define(function(require) {
  var React = require('react');

  /**
   * @class Inspector
   *
   * Inspects a single patch, showing its build job status and log output.
   */
  var Inspector = React.createClass({
    getDefaultProps: function() {
      return {
        patch: undefined,
        log: {},
        isLoadingLog: false,
        connected: false
      };
    },

    render: function() {
      var patch = this.props.patch;

      return(
        <div id="inspector">
          {patch ?
            this.renderPatch(patch) :
            this.props.connected ?
              <p>Choose a patch to inspect.</p> :
              false
          }

          {this.props.isLoadingLog && <p>Loading job console output...</p>}
        </div>
      );
    },


    renderPatch: function(patch) {
      return (
        <div>
          <h2>{patch.subject}</h2>

          {!this.props.log.log && !this.props.isLoadingLog &&
            <p>Choose a Jenkins job to inspect.</p>
          }

          <pre
            className="console"
            children={this.props.log.log} />
        </div>
      );
    }
  });

  return Inspector;
});