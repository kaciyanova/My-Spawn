var settings = new Store('settings', {
    'block_chat_seen': true,
    'block_chat_receipts': true,
    'block_typing_indicator': true,
    'fbunseen_messenger': false,
    'block_chat_indicator': false,
    'show_mark_as_read': false
});

if (!settings.get('block_chat_seen')) {
  chrome.browserAction.setIcon({path: 'icon48.disabled.png'})
}

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  return {
    cancel: settings.get('block_chat_seen')
  }
}, { urls: ['*://*.facebook.com/*change_read_status*',
            '*://*.messenger.com/*change_read_status*'] }, ['blocking'])



chrome.webRequest.onBeforeRequest.addListener(function(details) {
  return {
    cancel: settings.get('block_chat_receipts')
  }
}, { urls: ['*://*.facebook.com/*delivery_receipts*',
            '*://*.messenger.com/*delivery_receipts*',
            '*://*.facebook.com/*unread_threads*',
            '*://*.messenger.com/*unread_threads*'
           ] }, ['blocking'])



chrome.webRequest.onBeforeRequest.addListener(function(details) {
  return {
    cancel: settings.get('block_typing_indicator')
  }
}, { urls: ['*://*.facebook.com/*typ.php*',
            '*://*.messenger.com/*typ.php*'] }, ['blocking'])


chrome.webRequest.onBeforeRequest.addListener(function(details) {
  return {
    cancel: settings.get('block_chat_indicator')
  }
}, { urls: ['*://edge-chat.facebook.com/*',
			'*://0-edge-chat.facebook.com/*',
			'*://1-edge-chat.facebook.com/*',
			'*://2-edge-chat.facebook.com/*',
			'*://3-edge-chat.facebook.com/*',
			'*://4-edge-chat.facebook.com/*',
			'*://5-edge-chat.facebook.com/*',
			'*://6-edge-chat.facebook.com/*',
			'*://7-edge-chat.facebook.com/*',
			'*://8-edge-chat.facebook.com/*',
			'*://9-edge-chat.facebook.com/*',
			'*://www.facebook.com/ajax/chat/*',
			'*://www.facebook.com/chat/*',
			'*://www.facebook.com/ajax/presence/*',
            '*://edge-chat.messenger.com/*',
			'*://0-edge-chat.messenger.com/*',
			'*://1-edge-chat.messenger.com/*',
			'*://2-edge-chat.messenger.com/*',
			'*://3-edge-chat.messenger.com/*',
			'*://4-edge-chat.messenger.com/*',
			'*://5-edge-chat.messenger.com/*',
			'*://6-edge-chat.messenger.com/*',
			'*://7-edge-chat.messenger.com/*',
			'*://8-edge-chat.messenger.com/*',
			'*://9-edge-chat.messenger.com/*',
			'*://www.messenger.com/ajax/chat/*',
			'*://www.messenger.com/chat/*',
			'*://www.messenger.com/ajax/presence/*'] }, ['blocking'])


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action == 'getSettings') {
        sendResponse(settings.toObject())
    }
    else if (message.action == 'getDisableButton') {
        sendResponse(localStorage['force_disable_button'])
    }
    
    else if (message.action == 'quickDisable') {
        chrome.browserAction.setIcon({path: 'icon48.disabled.png'})
    }
    
    else if (message.action == 'quickEnable') {
        chrome.browserAction.setIcon({path: 'icon48.png'})
    }
    
    else if (message.action == 'addMessenger') {
        chrome.permissions.request({ origins: ["*://*.messenger.com/*"] }, function(granted) {
            if(!granted) {
                settings.set("fbunseen_messenger", false);
            }
        });
    }
    
    else if (message.action == 'trackMarkAsRead') {
    }
});

if (!localStorage['firstInstall']) {
    window.open('http://smarturl.it/fbunseen-install');
    localStorage['firstInstall'] = 'false';
}
if(chrome.runtime.setUninstallURL) {
  chrome.runtime.setUninstallURL('http://smarturl.it/fbunseen-uninstall');
}