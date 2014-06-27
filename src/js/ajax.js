define(function(require) {
  var RSVP = require('rsvp');
  var JENKINGD_URL = '/api';
  var authToken;
  var ajax = function(method, url, data) {
    return new RSVP.Promise(function(resolve, reject) {
      var xhr;

      xhr = new XMLHttpRequest();
      xhr.open(method, JENKINGD_URL + url, true);
      xhr.onreadystatechange = function() {
        var payload;

        if (xhr.readyState === 4) {
          try {
            payload = JSON.parse(xhr.responseText);
          } catch(e) {
            console.warn(xhr.status, xhr.responseText);

            payload = {
              message: 'unable to parse payload, see console'
            };
          }

          if (xhr.status === 200) {
            resolve(payload);
          }
          else {
            if (xhr.status === 500 && xhr.responseText.match('"code":"ECONNREFUSED"')) {
              payload = {
                message: 'jenkingd could not be reached'
              };
            }

            reject({
              error: payload,
              xhr: xhr
            }, 'ajax: [' + method + '] to "' + url + '"');
          }
        }
      };

      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', 'application/json');

      if (authToken) {
        xhr.setRequestHeader('Authorization', authToken);
      }

      xhr.send(data ? JSON.stringify(data) : undefined);
    });
  };

  ajax.authenticate = function(username, password) {
    authToken = 'Basic ' + btoa(username + ':' + password);
  };

  return ajax;
});