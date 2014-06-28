/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Console = require('jsx!./inspector/console');
  var Stars = require('jsx!./inspector/stars');

  /**
   * @class Inspector
   *
   * Inspects a single patch, showing its build job status and log output.
   */
  var Inspector = React.createClass({
    getInitialState: function() {
      return {
        tab: 'console'
      };
    },

    getDefaultProps: function() {
      return {
        patch: undefined,
        log: {},
        isLoadingLog: false,
        connected: false,
        starred: []
      };
    },

    render: function() {
      var patch = this.props.patch;
      var tab = this.state.tab;

      return(
        <div id="inspector">
          <div className="active-tab">
            {tab === 'console' &&
              <Console
                patch={patch}
                isLoadingLog={this.props.isLoadingLog}
                log={this.props.log} />
            }
            {tab === 'starred' &&
              <Stars starred={this.props.starred} />
            }
          </div>

          <div className="tabs" onClick={this.switchTab}>
            <button
              name="console"
              className={tab === 'console' ? 'active' : null}
              children="Console" />
            <button
              name="starred"
              className={tab === 'starred' ? 'active' : null}
              children="Starred" />
          </div>
        </div>
      );
    },

    switchTab: function(e) {
      var tab = e.target.name;
      e.preventDefault();

      if (tab) {
        this.setState({ tab: tab });
      }
    }
  });

  return Inspector;
});