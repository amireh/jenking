define(function() {
  // findBy([], 'key', 'value');
  return function findBy(array, key, value) {
    return array.filter(function(object) {
      return object[key] === value;
    })[0];
  }
});