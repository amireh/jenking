/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions');

  var Settings = React.createClass({
    mixins: [ React.addons.LinkedStateMixin ],

    getInitialState: function() {
      return {
        retriggerFrequency: this.props.preferences.retriggerFrequency,
      };
    },
    getDefaultProps: function() {
      return {
        preferences: {
        }
      };
    },

    render: function() {
      return(
        <form onSubmit={this.save} className="eb-dialog" id="settings">
          <header>
            <span>Settings</span>
          </header>

          <label>
            <span className="block">
              Query to use for retrieving patches from Gerrit
            </span>

            <input
              onChange={this.updateQuery}
              value={this.props.preferences.query}
              type="text"
              />
          </label>

          <hr />

          <label>
            <input
              onChange={this.toggleRetriggerAborted}
              checked={this.props.preferences.retriggerAborted}
              type="checkbox" />
            Retrigger aborted jobs automatically
          </label>

          {this.props.preferences.retriggerAborted &&
            <label>
              <span className="block">
                Frequency to check for aborted jobs (seconds)
              </span>

              <input
                valueLink={this.linkState('retriggerFrequency')}
                type="text" />
            </label>
          }

          <footer>
            <button onClick={this.save}>Close</button>
          </footer>
        </form>
      );
    },

    updateQuery: function(e) {
      Actions.savePreferences({ query: e.target.value });
    },

    toggleRetriggerAborted: function(e) {
      Actions.savePreferences({ retriggerAborted: e.target.checked });
    },

    save: function(e) {
      e.preventDefault();

      Actions.savePreferences({
        retriggerFrequency: Math.max(parseInt(this.state.retriggerFrequency, 10), 60)
      });

      this.props.onClose();
    }
  });

  return Settings;
});