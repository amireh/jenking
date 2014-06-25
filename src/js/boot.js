var GLOBAL = this;

require([ 'react', 'jsx!views/app' ], function(React, AppView) {
  GLOBAL.App = React.renderComponent(AppView(), document.body);
});