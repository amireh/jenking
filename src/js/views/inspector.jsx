/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
  var updateProps = require('update_props');
  var Checkmark = require('jsx!./components/checkmark');
  var Cross = require('jsx!./components/cross');

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
        loading: false
      };
    },

    render: function() {
      var patch = this.props.patch;

      return(
        <div id="inspector">
          {patch ?
            this.renderPatch(patch) :
            <p>Choose a patch to inspect.</p>
          }

          {this.props.loading && <p>Loading job console output...</p>}
        </div>
      );
    },


    renderPatch: function(patch) {
      return (
        <div>
          <h2>{patch.subject}</h2>

          <pre
            className="console"
            children={this.props.log.log} />
        </div>
      );
    }
  });

  return Inspector;
});