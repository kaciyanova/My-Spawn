var props_defs = {
  proxy_server : 'random',
  url_encrypt : 'encoded',
  proxy_ssl : 0,
  incognito : 0,
  new_tab : 0,
  always_popup : 0,
  context_menu : 1
};

var context_menu_id = 0,
  svc_url_path = '/includes/process.php?action=update&idx=0&u=%url&obfuscation=%hash';

function init() {
  checkConfig();
  onTabSelected();
  chrome.tabs.onSelectionChanged.addListener(onTabSelected);
  chrome.tabs.onUpdated.addListener(onTabUpdated);
  chrome.browserAction.onClicked.addListener(onBrowserActionClick);
  chrome.extension.onRequest.addListener(onRequest);
  if ('omnibox' in chrome) {
    chrome.omnibox.onInputEntered.addListener(onKeywordEntered);
  }
  toggleContextMenuItem();
  onFirstRun();
}

function toggleContextMenuItem() {
  if (+localStorage.context_menu) {
    if (!context_menu_id) {
      context_menu_id = chrome.contextMenus.create({
        type : 'normal',
        title : 'Open via HMA Proxy',
        contexts : ['link'],
        onclick : function (ev, tab) {
          navigate(tab, ev.linkUrl, 'link');
        },
        targetUrlPatterns : ['http://*/*', 'https://*/*']
      });
    }
  } else {
    if (context_menu_id) {
      chrome.contextMenus.remove(context_menu_id);
      context_menu_id = 0;
    }
  }
}

function onRequest(url, sender, sendResponse) {
  url = protocolifyURL(url);
  chrome.tabs.getSelected(null, function (tab) {
    navigate(tab, url, 'action_button');
  });
}

function onTabSelected(tab_id, select_info) {
  chrome.tabs.getSelected(null, togglePopupSetting);
}

function onTabUpdated(tab_id, change_info, tab_updated) {
  chrome.tabs.getSelected(null, function (tab_selected) {
    if (tab_updated.id == tab_selected.id) {
      togglePopupSetting(tab_selected);
    }
  })
}

function togglePopupSetting(tab) {  
  var show_popup = (+localStorage.always_popup || !checkURLCredibility(tab.url));
  chrome.browserAction.setPopup({ popup: show_popup ? 'popup.html' : '' });
}

function onKeywordEntered(text) {
  chrome.tabs.getSelected(null, function (tab) {
    var url = protocolifyURL(text);
    navigate(tab, url, 'keyword');
  });
}

function onBrowserActionClick(tab) {
  navigate(tab, tab.url, 'action_button');
}

function protocolifyURL(url) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return 'http://' + url;
}

function navigate(tab, url_to_hide, action) {
  var encoded_url,
      i,
      j,
      svc_url;
      
  if (!checkURLCredibility(url_to_hide)) {
    return;
  }
  encoded_url = encodeURIComponent(url_to_hide);
  var server = (localStorage.proxy_server == 'random') ? Math.ceil(5 * Math.random()) : localStorage.proxy_server;
  svc_url = 'http' + (+localStorage.proxy_ssl ? 's' : '') + '://' + server + '.hidemyass.com' + svc_url_path.replace('%url', encoded_url).replace('%hash', (localStorage.url_encrypt == 'encoded') ? 1 : 2);
  
  if (+localStorage.incognito && !tab.incognito) {
    chrome.windows.getAll(null, function (windows) {
      for (i = 0, j = windows.length; i < j; i++) {
        if (windows[i].incognito) {
          chrome.tabs.create({
            windowId: windows[i].id,
            url: svc_url,
            selected: true
          });
          return;
        }
      }
      chrome.windows.create({
        url: svc_url,
        incognito: true
      });
    });
    return;
  }
  if (+localStorage.new_tab && action != 'keyword') {      
    chrome.tabs.create({
      url: svc_url,
      selected: true
    });
    return;
  }
  chrome.tabs.update(tab.id, {
    url: svc_url
  });
}

function checkURLCredibility(url) {
  var i, reg;
  if (!/^https?:/.test(url) || /^https?:\/\/[^\/]*hidemyass\.com/.test(url)) {
    return false;
  }
  return true;
}

function checkConfig() {
  for (var i in props_defs) {
    if (!(i in localStorage)) {
      localStorage[i] = props_defs[i];
    }
  }
}

function onFirstRun() {
  if ('first_run' in localStorage) {
    return;
  }
  localStorage.first_run = 1;
  chrome.tabs.create({
    url: 'options.html',
    selected: true
  });
}

document.addEventListener('DOMContentLoaded', init);