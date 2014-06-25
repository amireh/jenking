/** @jsx React.DOM */
define(function(require) {
  var React = require('react');
  var findBy = require('util/find_by');
  var Checkmark = require('jsx!./components/checkmark');
  var Cross = require('jsx!./components/cross');

  var Patch = React.createClass({
    render: function() {
      var record = this.props.submitRecords[0].labels;
      var crRecord = findBy(record, 'label', 'Code-Review') || {};
      var qaRecord = findBy(record, 'label', 'QA-Review') || {};
      var jenkinsRecord = findBy(record, 'label', 'Verified') || {};
      var renderStatus = function(status) {
        if (status === 'REJECT') {
          return <Cross />;
        }
        else if (status === 'OK') {
          return <Checkmark />;
        }
        else {
          return <span />;
        }
      };

      var className = React.addons.classSet({
        'patch': true,
        'active': this.props.active
      });

      return (
        <tr
          key={'patch-' + this.props.id}
          className={className}
          onClick={this.props.onClick}>
          <td>{this.props.mergeable ? <Checkmark /> : <Cross />}</td>
          <td><button className="a11y-btn">{this.props.subject}</button></td>
          <td>{renderStatus(jenkinsRecord.status)}</td>
          <td>{renderStatus(crRecord.status)}</td>
          <td>{renderStatus(qaRecord.status)}</td>
        </tr>
      );
    }
  });

  return Patch;
});