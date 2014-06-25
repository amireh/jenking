/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var updateProps = require('update_props');
  var extend = require('util/extend');
  var Patch = require('jsx!./patch');
  var PatchJobs = require('jsx!./patch_jobs');

  var PatchTree = React.createClass({
    getInitialState: function() {
      return {
      };
    },

    getDefaultProps: function() {
      return {
        patches: [],
        activePatchId: undefined,
        activeJobId: undefined,
        jobs: [],
        isLoadingJobs: false
      };
    },

    render: function() {
      return(
        <div id="patchTree">
          {
            this.props.patches.length ?
              this.renderPatches() :
              <p>No patches available.</p>
          }

        </div>
      );
    },

    renderPatches: function() {
      return (
        <table>
          <thead>
            <tr>
              <th title="Ready for merging">R</th>
              <th>Patch</th>
              <th title="Verified by Jenkins">J</th>
              <th title="Code-Review">C</th>
              <th title="QA">Q</th>
            </tr>
          </thead>

          <tbody children={this.props.patches.map(this.renderPatch)} />
        </table>
      );
    },

    renderPatch: function(patch) {
      var patchProps = extend({}, patch, {
        active: this.props.activePatchId === patch.id,
        onClick: this.inspectPatch.bind(null, patch.id)
      });

      return [
        Patch(patchProps),
        patchProps.active && (
          <tr>
            <td />
            <td colSpan={4}>
              <PatchJobs
                activeJobId={this.props.activeJobId}
                jobs={this.props.jobs}
                isLoadingJobs={this.props.isLoadingJobs} />
            </td>
          </tr>
        )
      ];
    },

    inspectPatch: function(patchId) {
      if (patchId !== this.props.activePatchId) {
        updateProps({
          activePatchId: patchId
        });
      }
    },
  });

  return PatchTree;
});