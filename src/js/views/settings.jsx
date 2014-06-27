/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var Actions = require('actions');

  var Settings = React.createClass({
    getDefaultProps: function() {
      return {
        preferences: {
          retriggerAborted: false
        }
      };
    },

    render: function() {
      console.log('Settings rendering:', this.props.preferences);

      return(
        <form onSubmit={this.save} className="eb-dialog" id="settings">
          <header>
            <span>Settings</span>
          </header>

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

    toggleRetriggerAborted: function(e) {
      Actions.savePreferences({
        retriggerAborted: e.target.checked
      });
    },

    save: function(e) {
      e.preventDefault();
      this.props.onClose();
    }
  });

  return Settings;
});