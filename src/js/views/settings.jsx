/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions');

  var Settings = React.createClass({
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

          <label>
            <input
              onChange={this.toggleRetriggerAborted}
              checked={this.props.preferences.retriggerAborted}
              type="checkbox" />
            Retrigger aborted jobs automatically
          </label>

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
      this.props.onClose();
    }
  });

  return Settings;
});