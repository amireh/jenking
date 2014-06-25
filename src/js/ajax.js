define(function() {
  // var JENKINGD_URL = 'http://192.168.1.101:8777';
  var JENKINGD_URL = '/api';
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
    xhr.send(data ? JSON.stringify(data) : undefined);

    return promise;
  };

  return ajax;
});