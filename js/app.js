var App = {
    curSharingElement: null,
    friends: [],
    getCurTabUrl: function(callback) {
        var queryInfo = {
            active: true,
            currentWindow: true
        };
        chrome.tabs.query(queryInfo, function(tabs) {
            var tab = tabs[0];
            var url = tab.url;
            console.assert(typeof url == 'string', 'tab.url should be a string');
            callback(url);
        });
    },
    showFriendsForChoice: function(friends, link) {
        this.curSharingElement = {
            message_type: 'LINK',
            message_value: link
        };
        this.friends = friends;
        var _this = this;
        this.printFriends({
            friends: friends,
            click: function(e) {
                var elem = e.target,
                    classArr = elem.className.split(' ');
                while (!~classArr.indexOf('friend_item')) {
                    elem = elem.parentNode;
                    classArr = elem.className.split(' ');
                }
                var social_id = elem.id;
                _this.shareWith(social_id, _this.curSharingElement);
            }
        });
    },
    shareWith: function(social_id, shareElement) {
        if (!social_id || !shareElement) {
            return;
        }
        var _this = this;
        chrome.storage.sync.get('ss_access_token', function(token) {
            if (!token) {
                return;
            }
            _this.incrementNumberOfShares(social_id);
            var bgWindow = chrome.extension.getBackgroundPage();
            bgWindow.shareData(shareElement, {
                social_id: social_id,
                access_token: token.ss_access_token
            });
        });
        this.showSuccessMessage('Ссылка успешно отправлена вашему другу', shareElement);
    },
    printFriends: function(params) {
        var items = params.friends;
        var el;
        var layer = document.getElementById('friends_container');
        layer.innerHTML = '';

        var frequentFriends = this.getFrequentFriends(items, 10);
        if (frequentFriends.length) {
            var titleFrequent = document.createElement('div');
            titleFrequent.className = 'friends_list__title frequent_title';
            titleFrequent.innerHTML = 'Частые';
            titleFrequent.addEventListener('click', function(e) {
                var content = $(friends_container_inner_fr);
                if (content.hasClass('block_hidden')) {
                    $(friends_container_inner_fr).stop().slideDown(100).removeClass('block_hidden');
                    $(this).removeClass('block_hidden_title');
                    chrome.storage.local.set({
                        'frequent_block_hidden': false
                    }, noop);
                } else {
                    $(friends_container_inner_fr).stop().slideUp(100).addClass('block_hidden');
                    $(this).addClass('block_hidden_title');
                    chrome.storage.local.set({
                        'frequent_block_hidden': true
                    }, noop);
                }
            });
            layer.appendChild(titleFrequent);

            var friends_container_inner_fr = document.createElement('div');
                friends_container_inner_fr.className = 'friends_list frequent_list';
            layer.appendChild(friends_container_inner_fr);

            for (el in frequentFriends) {
                if (!frequentFriends.hasOwnProperty(el)) continue;
                var friendFr = frequentFriends[el];
                var friend_element_fr = document.createElement('div');
                friend_element_fr.className = 'friend_item';
                friend_element_fr.id = friendFr.social_id;
                var avatarFr = document.createElement('img');
                avatarFr.className = 'friend_item__avatar';
                avatarFr.src = friendFr.photo_max;
                var full_name_fr = document.createElement('div');
                full_name_fr.className = 'friend_item__fullname';
                full_name_fr.innerHTML = friendFr.first_name + ' ' + friendFr.last_name;
                friend_element_fr.appendChild(avatarFr);
                friend_element_fr.appendChild(full_name_fr);
                friend_element_fr.addEventListener('click', params.click);
                friends_container_inner_fr.appendChild(friend_element_fr);
            }

            chrome.storage.local.get('frequent_block_hidden', function(result) {
                var hiddenBlock = !Object.isEmpty(result) && result.frequent_block_hidden;
                if (hiddenBlock) {
                    $('.frequent_title').addClass('block_hidden_title');
                    $('.frequent_list').css({ display: 'none' }).addClass('block_hidden');
                }
            });
        }

        var titleVk = document.createElement('div');
            titleVk.className = 'friends_list__title vk_title';
            titleVk.innerHTML = 'Друзья ВКонтакте';
            titleVk.addEventListener('click', function(e) {
                var content = $(friends_container_inner);
                if (content.hasClass('block_hidden')) {
                    $(friends_container_inner).stop().slideDown(100).removeClass('block_hidden');
                    $(this).removeClass('block_hidden_title');
                    chrome.storage.local.set({
                        'vk_block_hidden': false
                    }, noop);
                } else {
                    $(friends_container_inner).stop().slideUp(100).addClass('block_hidden');
                    $(this).addClass('block_hidden_title');
                    chrome.storage.local.set({
                        'vk_block_hidden': true
                    }, noop);
                }
            });
        layer.appendChild(titleVk);

        var friends_container_inner = document.createElement('div');
            friends_container_inner.className = 'friends_list vk_list';
        layer.appendChild(friends_container_inner);

        for (el in items) {
            if (!items.hasOwnProperty(el)) continue;
            var friend = items[el];
            var friend_element = document.createElement('div');
                friend_element.className = 'friend_item';
                friend_element.id = 'vk_' + friend.id;
            var avatar = document.createElement('img');
                avatar.className = 'friend_item__avatar';
                avatar.src = friend.photo_max;
            var full_name = document.createElement('div');
                full_name.className = 'friend_item__fullname';
                full_name.innerHTML = friend.first_name + ' ' + friend.last_name;
            friend_element.appendChild(avatar);
            friend_element.appendChild(full_name);
            friend_element.addEventListener('click', params.click);
            friends_container_inner.appendChild(friend_element);
        }

        chrome.storage.local.get('vk_block_hidden', function(result) {
            console.log(result);
            var hiddenBlock = !Object.isEmpty(result) && result.vk_block_hidden;
            if (hiddenBlock) {
                $('.vk_title').addClass('block_hidden_title');
                $('.vk_list').css({ display: 'none' }).addClass('block_hidden');
            }
        });
    },
    showSuccessMessage: function(text, shareElement) {
        var layer = document.getElementById('friends_container');
        layer.innerHTML = '';
        var message = document.createElement('div');
            message.className = 'success_message';
            message.innerHTML = text;
            if (shareElement.message_type == 'LINK') {
                message.innerHTML += '<br>' +
                    '<a href="' + shareElement.message_value + '" target="_blank">' + shareElement.message_value + '</a>';
            }
        var space = document.createElement('div');
            space.className = 'space';
        layer.appendChild(message);
        layer.appendChild(space);
        var title = document.getElementById('popup_title');
            title.innerHTML = 'Сообщение отправлено';
    },
    getFrequentFriends: function(items, count) {
        var criteriaItems = [];
        for (var el in items) {
            if (!items.hasOwnProperty(el)) continue;
            if (items[el].numShare !== undefined && items[el].numShare > 0) {
                criteriaItems.push(clone(items[el]));
            }
        }
        criteriaItems.sort(function(first, second) {
            if (!first.numShare && !second.numShare) {
                return 0;
            }
            if (!second.numShare) {
                return -1;
            }
            if (!first.numShare) {
                return 1;
            }
            if (first.numShare > second.numShare) {
                return -1;
            } else if (first.numShare < second.numShare) {
                return 1;
            }
            return 0;
        });
        return criteriaItems.slice(0, count);
    },
    incrementNumberOfShares: function(social_id) {
        var friends = this.friends;
        console.log(friends);
        for (var el in friends) {
            if (!friends.hasOwnProperty(el)) continue;
            if (friends[el].social_id == social_id) {
                friends[el].numShare = friends[el].numShare !== undefined ? friends[el].numShare + 1 : 0;
                console.log(friends[el]);
                break;
            }
        }
        chrome.storage.local.set({
            'user.friends.vk': friends
        }, noop);
    },
    fillFriends: function(friends, social_type) {
        for (var el in friends) {
            friends[el].social_id = social_type + '_' + friends[el].id;
            friends[el].first_name = friends[el].first_name.replace(/^[^a-zA-Z0-9а-яА-ЯёЁ_.-=]$/i, '').replace(/[�]+/gi, '');
            friends[el].last_name = friends[el].last_name.replace(/^[^a-zA-Z0-9а-яА-ЯёЁ_.-=]$/i, '').replace(/[�]+/gi, '');
            if (!friends[el].first_name.length) {
                friends[el].first_name = 'Name'
            }
            if (!friends[el].last_name.length) {
                friends[el].last_name = 'Surname'
            }
            friends[el].numShare = 0;
        }
    }
};