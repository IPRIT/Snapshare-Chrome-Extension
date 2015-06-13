function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var temp = new obj.constructor();
    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}
Object.isEmpty = function(self) {
    if (self == null) return false;//
    if (self instanceof Array || typeof self == 'string') return !self.length;
    var empty = new self.constructor();
    for (var key in self) {
        if (!(key in empty) || self[key] !== empty[key]) return false;
    }
    return true;
};
var noop = function(){};

var bgWindow;
document.addEventListener('DOMContentLoaded', function() {
    bgWindow = chrome.extension.getBackgroundPage();

    chrome.storage.sync.get('ss_access_token', function(item) {
        var isAuth = !Object.isEmpty(item);
        if (!isAuth) {
            chrome.tabs.create({url: chrome.extension.getURL("login.html"), selected: true});
            return;
        }
        if (bgWindow && !bgWindow.Server.hasConnect) {
            bgWindow.Server.connect(item.ss_access_token);
        }
        var snapApi = new SnapshareApi({
            access_token: item.ss_access_token
        });
        chrome.storage.local.get('user.friends.vk', function(friends) {
            console.log(friends);
            if (!Object.isEmpty(friends) && !Object.isEmpty(friends['user.friends.vk'])) {
                console.log('[From cache] Friends:', friends['user.friends.vk']);
                showFriendsForChoice(friends['user.friends.vk'])
            } else {
                snapApi.apiCall('friends.get', {}, function(err, res) {
                    if (err) {
                        console.log(err);
                    }
                    var friends = res.friends;
                    App.fillFriends(friends, 'vk');
                    console.log('[From server] Friends:', friends);
                    chrome.storage.local.set({
                        'user.friends.vk': friends
                    }, function() {
                        showFriendsForChoice(friends);
                    });
                })
            }
        });

        function showFriendsForChoice(friends) {
            App.getCurTabUrl(function(curLink) {
                App.showFriendsForChoice(friends, curLink);
            });
        }
    });
});

window.test = function() {
    alert('Works');
};

