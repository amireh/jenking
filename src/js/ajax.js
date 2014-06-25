define(function() {
  var JENKINGD_URL = '/api';
  var authToken;
  var ajax = function(method, url, data) {
    var xhr;
    var onError = [];
    var onSuccess = [];

    var promise = {
      then: function(success, error) {
        if (success) {
          onSuccess.push(success);
        }

        if (error) {
          onError.push(error);
        }
      }
    };

    xhr = new XMLHttpRequest();
    xhr.open(method, JENKINGD_URL + url, true);
    xhr.onreadystatechange = function() {
      var payload;

      if (xhr.readyState === 4) {
        try {
          payload = JSON.parse(xhr.responseText);
        } catch(e) {
          payload = {
            message: 'unable to parse payload'
          };
        }

        if (xhr.status === 200) {
          onSuccess.forEach(function(callback) {
            callback(payload, xhr);
          });
        }
        else {
          onError.forEach(function(callback) {
            callback(payload, xhr);
          });
        }
      }
    };

    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    if (authToken) {
      xhr.setRequestHeader('Authorization', authToken);
    }

    xhr.send(data ? JSON.stringify(data) : undefined);

    return promise;
  };

  ajax.authenticate = function(username, password) {
    authToken = 'Basic ' + btoa(username + ':' + password);
  };

  return ajax;
});