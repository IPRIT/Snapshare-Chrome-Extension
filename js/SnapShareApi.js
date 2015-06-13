var SnapshareApi = function SnapshareApi(params) {
    var access_token = params.access_token;

    function sendGetRequest(url, params, callback, errorCallback) {
        function getEncodedParamsString(params) {
            var pairs = [];
            for (var el in params) {
                pairs.push(el + '=' + encodeURIComponent(params[el]));
            }
            return pairs.join('&');
        }
        var requestUrl = url + '?' + getEncodedParamsString(params);

        var x = new XMLHttpRequest();
        x.open('GET', requestUrl);
        x.responseType = 'json';
        x.onload = function() {
            var response = x.response;
            if (!response) {
                return errorCallback('No response from Snapshare server!');
            }
            if (response.error) {
                return errorCallback('An api error.');
            }
            callback(response);
        };
        x.onerror = function() {
            errorCallback('Network error.');
        };
        x.send();
    }

    function apiCallMethod(method, params, callback) {
        params.access_token = access_token;
        var apiUrl = Config.protocol + '://' + Config.host + '/api/' + method;
        sendGetRequest(apiUrl, params, function(res) {
            callback(false, res.response);
        }, function(err) {
            callback(true);
            console.log(err);
        })
    }

    function accessToken() {
        return access_token;
    }

    this.apiCall = apiCallMethod;
    this.getAccessToken = accessToken;
};