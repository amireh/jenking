var GLOBAL = this;
var seed = {
  patches: [{"id":"36841","subject":"It's broken, I don't get it...","links":["http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-plugins-aux-core%2F3764","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-plugins-core-rails3%2F2714","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-plugins-core%2F2757","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-sel-a-core-rails3%2F2789","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-sel-b-core%2F2824","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-sel-b-core-rails3%2F2724","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-plugins-aux-core-rails3%2F2595","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-sel-a-core%2F3003"],"submitRecords":[{"labels":[{"label":"Non-Author-Review","status":"NEED"},{"appliedBy":{"id":1000008},"label":"Verified","status":"REJECT"},{"label":"Code-Review","status":"NEED"},{"label":"QA-Review","status":"NEED"},{"label":"Product-Review","status":"NEED"}],"status":"NOT_READY"}],"mergeable":false,"canSubmit":false},{"id":"36070","subject":"Ember Quiz Stats - a11y/color contrast","links":["http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-sel-a-core-rails3%2F1688","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-sel-b-core-rails3%2F1669","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-plugins-core%2F1660","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-plugins-core-rails3%2F1646","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-sel-a-core%2F1831","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-sel-b-core%2F1718","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-plugins-aux-core%2F2805","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-plugins-aux-core-rails3%2F1648"],"submitRecords":[{"labels":[{"appliedBy":{"id":1000221},"label":"Non-Author-Review","status":"OK"},{"appliedBy":{"id":1000008},"label":"Verified","status":"OK"},{"appliedBy":{"id":1000221},"label":"Code-Review","status":"OK"},{"appliedBy":{"id":1000178},"label":"QA-Review","status":"REJECT"},{"label":"Product-Review","status":"NEED"}],"status":"NOT_READY"}],"mergeable":false,"canSubmit":false},{"id":"31605","subject":"QSQ API - Graded question retrieval","links":["http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-plugins-rails3%2F3684","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-selenium-rails3-b%2F2138","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-aux-rails3%2F1236","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-plugins-aux%2F17154","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-selenium-rails3-a%2F1997","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-plugins%2F37483","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-lms-selenium-aws-xvfb-b-commit%2F13467","http%3A%2F%2Fjenkins.instructure.com%2Fjob%2Fcanvas-lms-selenium-aws-xvfb-a-commit%2F13555"],"submitRecords":[{"labels":[{"label":"Non-Author-Review","status":"NEED"},{"appliedBy":{"id":1000008},"label":"Verified","status":"OK"},{"label":"Code-Review","status":"NEED"},{"appliedBy":{"id":1000178},"label":"QA-Review","status":"REJECT"},{"label":"Product-Review","status":"NEED"}],"status":"NOT_READY"}],"mergeable":false,"canSubmit":false}]
};

define(function(require) {
  var React = require('react');
  var AppView = require('jsx!views/app');
  var preferences = require('preferences');

  var app = React.renderComponent(AppView(), document.body);
  var injectPreferences = function(prefs) {
    app.setProps({ preferences: preferences.get() });
  };

  app.setProps(seed);

  preferences.onChange(injectPreferences);
  injectPreferences();

  GLOBAL.App = app;
  return app;
});
