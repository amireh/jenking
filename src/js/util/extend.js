define(function() {
  // Object.extend(), courtesy of bit.ly/1pMU2zN
  return function extend() {
    var i, key;

    for (i = 1; i < arguments.length; i++) {
      for (key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          arguments[0][key] = arguments[i][key];
        }
      }
    }

    return arguments[0];
  };
});