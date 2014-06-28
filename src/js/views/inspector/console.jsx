/** @jsx React.DOM */
define(function(require) {
  var React = require('react');

  /**
   * @class Console
   *
   * Shows build job status and log output.
   */
  var Console = React.createClass({
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
      var log = this.props.log.log;

      return(
        <div id="inspector-console">
          {patch && <h2>{patch.subject}</h2>}

          {this.props.isLoadingLog &&
            <p>Loading job console output...</p>
          }

          {!log && !this.props.isLoadingLog &&
            <p>Choose a Jenkins job to inspect.</p>
          }

          {log &&
            <pre
              className="console"
              children={log} />
          }
        </div>
      );
    }
  });

  return Console;
});