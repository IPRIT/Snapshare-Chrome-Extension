function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var temp = new obj.constructor();
    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
    var authVkButton = document.getElementById('auth_vk_button');
    authVkButton.addEventListener('click', function(e) {
        loginWithVk();
    });
});

function loginWithVk() {
    var params = {
        redirect_uri: Config.redirect_uri,
        client_id: 4952927,
        scope: 'friends,offline',
        response_type: 'code',
        revoke: true
    };
    var pairParts = [];
    for (var el in params) {
        if (!params.hasOwnProperty(el)) continue;
        pairParts.push(el + '=' + params[el]);
    }
    var codeUrl = 'https://oauth.vk.com/authorize?' + pairParts.join('&');
    chrome.tabs.create({url: codeUrl, selected: true}, function(tab) {
        authTabId = tab.id;
        chrome.tabs.onUpdated.addListener(function tabUpdateListener(tabId, changeInfo, curTab) {
            if (tabId == authTabId && changeInfo.status == "complete") {
                if (curTab.url.indexOf('/oauth/vk?code=') > -1) {
                    var port = chrome.tabs.connect(curTab.id);
                    port.postMessage({
                        type: 'GET_ACCESS_TOKEN'
                    });
                    port.onMessage.addListener(function(response) {
                        if (!response.ssAccessToken) {
                            renderStatus('Произошла какая-то ошибка. Попробуйте снова.')
                        }
                        chrome.tabs.remove(curTab.id);
                        var textField = document.getElementById('result_text');
                        textField.innerHTML = 'Вы успешно авторизовались. Нажмите на расширение в браузере для начала работы.';
                        //сохранеяем в localStorage
                        chrome.storage.sync.set({'ss_access_token': response.ssAccessToken}, function() {
                            console.log(response.ssAccessToken, 'Saved');
                            document.querySelector('#auth_vk_button').style.display = 'none';
                            document.querySelector('.auth_block span').style.display = 'none';
                        });
                    });
                }
            }
        });
    });
}