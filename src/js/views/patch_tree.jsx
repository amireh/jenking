/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
  var updateProps = require('update_props');
  var extend = require('util/extend');
  var findBy = require('util/find_by');

  var PatchTree = React.createClass({
    getInitialState: function() {
      return {
        loading: false
      };
    },

    getDefaultProps: function() {
      return {
        connected: false,
        patches: []
      };
    },

    componentDidUpdate: function(prevProps, prevState) {
      if (!prevProps.connected && this.props.connected) {
        this.load();
      }
    },

    render: function() {
      return(
        <div id="patchTree">
          {
            this.props.patches.length ?
              this.renderPatches() :
              <p>No patches available.</p>
          }

          <button
            disabled={!this.props.connected || this.state.loading}
            onClick={this.load}
            children={this.state.loading ? 'Loading...' : 'Reload'} />
        </div>
      );
    },

    renderPatches: function() {
      return (
        <table>
          <thead>
            <tr>
              <th>Verified</th>
              <th>ID</th>
              <th>Name</th>
              <th>Jenkins</th>
              <th>CR</th>
              <th>QA</th>
            </tr>
          </thead>

          <tbody onClick={this.inspectPatch}>
            {
              this.props.patches.map(this.renderPatch)
            }
          </tbody>
        </table>
      );
    },

    componentWillReceiveProps: function(nextProps) {
      this.setState({ loading: false });
    },

    renderPatch: function(patch) {
      var record = patch.submitRecords[0].labels;
      var crRecord = findBy(record, 'label', 'Code-Review') || {};
      var qaRecord = findBy(record, 'label', 'QA-Review') || {};
      var jenkinsRecord = findBy(record, 'label', 'Verified') || {};

      return(
        <tr
          key={'patch-' + patch.id}
          onClick={this.activate.bind(null, patch.id)}>
          <td>{patch.mergeable}</td>
          <td>{patch.id}</td>
          <td>{patch.subject}</td>
          <td>{jenkinsRecord.status}</td>
          <td>{crRecord.status}</td>
          <td>{qaRecord.status}</td>
        </tr>
      );
    },

    load: function(e) {
      if (e) {
        e.preventDefault();
      }

      if (this.props.connected) {
        this.setState({
          loading: true
        });

        ajax('GET', '/patches').then(function(patches) {
          updateProps({ patches: patches });
        }, function(error) {
          updateProps({ error: error });
        });
      }
    },

    activate: function(patchId) {
      updateProps({ activePatchId: patchId });
    }
  });

  return PatchTree;
});