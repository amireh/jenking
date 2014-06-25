/* global App: false */
define(function() {
  return function updateProps(props, replace) {
    if (replace) {
      App.replaceProps(props);
    } else {
      App.setProps(props);
    }
  };
});