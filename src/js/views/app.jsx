/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var ajax = require('ajax');
  var Login = require('jsx!./login');
  var Status = require('jsx!./status');
  var PatchTree = require('jsx!./patch_tree');
  var Inspector = require('jsx!./inspector');

  var App = React.createClass({
    componentDidMount: function() {
      ajax('GET', '/status').then(function(status) {
        this.setProps({
          connected: status.connected
        });
      }.bind(this));
    },

    getDefaultProps: function() {
      return {
        connected: false,
        status: 'idle',
        error: undefined,
        patches: [{"id":"36559","subject":"Quiz Submission Questions - Bulk-answering","links":["http://jenkins.instructure.com/job/canvas-plugins-core-rails3/2703","http://jenkins.instructure.com/job/canvas-plugins-core/2745","http://jenkins.instructure.com/job/canvas-sel-a-core-rails3/2786","http://jenkins.instructure.com/job/canvas-sel-b-core/2822","http://jenkins.instructure.com/job/canvas-plugins-aux-core/3762","http://jenkins.instructure.com/job/canvas-sel-b-core-rails3/2722","http://jenkins.instructure.com/job/canvas-plugins-aux-core-rails3/2593","http://jenkins.instructure.com/job/canvas-sel-a-core/2969"],"submitRecords":[{"labels":[{"label":"Non-Author-Review","status":"NEED"},{"appliedBy":{"id":1000008},"label":"Verified","status":"REJECT"},{"label":"Code-Review","status":"NEED"},{"label":"QA-Review","status":"NEED"},{"label":"Product-Review","status":"NEED"}],"status":"NOT_READY"}],"mergeable":false,"canSubmit":false},{"id":"36070","subject":"Ember Quiz Stats - a11y/color contrast","links":["http://jenkins.instructure.com/job/canvas-sel-a-core-rails3/1688","http://jenkins.instructure.com/job/canvas-sel-b-core-rails3/1669","http://jenkins.instructure.com/job/canvas-plugins-core/1660","http://jenkins.instructure.com/job/canvas-plugins-core-rails3/1646","http://jenkins.instructure.com/job/canvas-sel-a-core/1831","http://jenkins.instructure.com/job/canvas-sel-b-core/1718","http://jenkins.instructure.com/job/canvas-plugins-aux-core/2805","http://jenkins.instructure.com/job/canvas-plugins-aux-core-rails3/1648"],"submitRecords":[{"labels":[{"appliedBy":{"id":1000221},"label":"Non-Author-Review","status":"OK"},{"appliedBy":{"id":1000008},"label":"Verified","status":"OK"},{"appliedBy":{"id":1000221},"label":"Code-Review","status":"OK"},{"appliedBy":{"id":1000178},"label":"QA-Review","status":"REJECT"},{"label":"Product-Review","status":"NEED"}],"status":"NOT_READY"}],"mergeable":false,"canSubmit":false},{"id":"31605","subject":"QSQ API - Graded question retrieval","links":["http://jenkins.instructure.com/job/canvas-plugins-rails3/3684","http://jenkins.instructure.com/job/canvas-selenium-rails3-b/2138","http://jenkins.instructure.com/job/canvas-aux-rails3/1236","http://jenkins.instructure.com/job/canvas-plugins-aux/17154","http://jenkins.instructure.com/job/canvas-selenium-rails3-a/1997","http://jenkins.instructure.com/job/canvas-plugins/37483","http://jenkins.instructure.com/job/canvas-lms-selenium-aws-xvfb-b-commit/13467","http://jenkins.instructure.com/job/canvas-lms-selenium-aws-xvfb-a-commit/13555"],"submitRecords":[{"labels":[{"label":"Non-Author-Review","status":"NEED"},{"appliedBy":{"id":1000008},"label":"Verified","status":"OK"},{"label":"Code-Review","status":"NEED"},{"appliedBy":{"id":1000178},"label":"QA-Review","status":"REJECT"},{"label":"Product-Review","status":"NEED"}],"status":"NOT_READY"}],"mergeable":false,"canSubmit":false}],
        jobs: [],
        jobsLoading: false,
        log: undefined,
        logLoading: false
      };
    },

    render: function() {
      var activePatchId = this.props.activePatchId;
      var activePatch = this.props.patches.filter(function(patch) {
        return patch.id === activePatchId;
      })[0];

      return (
        <div id="jenking">
          <main id="content">
            <h1>JENKING</h1>

            {!this.props.connected && <Login />}

            <PatchTree
              patches={this.props.patches}
              activePatchId={this.props.activePatchId}
              jobs={this.props.jobs}
              jobsLoading={this.props.jobsLoading}
              connected={this.props.connected} />
          </main>

          <Inspector
            patch={activePatch}
            jobs={this.props.jobs}
            log={this.props.log}
            loading={this.props.logLoading} />

          <Status
            error={this.props.error}
            connected={this.props.connected}
            patchesLoading={this.props.patchesLoading} />
        </div>
      );
    }
  });

  return App;
});