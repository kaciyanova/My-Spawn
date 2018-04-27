/**
 * Default SBBrowserChrome ctor.
 * Creates instance of SBBrowserChrome class that contains ALL Chrome browser-specific implementation  
 *         of the core browser functionality required for the rest of the code.
 *
 * @param {String} siteDomain The domain name of the site.
 */
function SBBrowserChrome(siteHost) {
	this.initSBBrowserChrome(siteHost);
}
	
SBBrowserChrome.prototype = SBExtension.extend(SBBrowser.prototype, SBBrowserChrome);

////////////////////////////////////////////////////////////////////////////////////
//                      "API" METHODS
////////////////////////////////////////////////////////////////////////////////////

SBBrowserChrome.prototype.executeForSelectedTab = function(windowId, tabFunction) { //function(tab)
	if (!windowId || windowId > -1)
		chrome.tabs.getSelected(null, tabFunction);
}

SBBrowserChrome.prototype.addOnFocusChangedListener = function(onFocusChangedListener) {
	chrome.windows.onFocusChanged.addListener(onFocusChangedListener);
	this.initCheckSwagSearchExtension();
}

SBBrowserChrome.prototype.addOnTabActivatedListener = function(onTabActivatedListener) {
	chrome.tabs.onActivated.addListener(onTabActivatedListener);
}

SBBrowserChrome.prototype.addOnTabCreatedListener = function(onTabCreatedListener) {
	chrome.tabs.onCreated.addListener(onTabCreatedListener);
}

SBBrowserChrome.prototype.addOnTabUpdatedListener = function(onTabUpdatedListener) {
	chrome.tabs.onUpdated.addListener(onTabUpdatedListener);
}

SBBrowserChrome.prototype.addOnTabMovedListener = function(onTabMovedListener) {
	chrome.tabs.onMoved.addListener(onTabMovedListener);
}

SBBrowserChrome.prototype.addOnTabRemovedListener = function(onTabRemovedListener) {
	chrome.tabs.onRemoved.addListener(onTabRemovedListener);
}

SBBrowserChrome.prototype.addOnBeforeRequestListener = function(onBeforeRequestListener) {
	chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestListener, {urls : ["<all_urls>"]});
}

SBBrowserChrome.prototype.addOnBeforeNavigateListener = function(onBeforeNavigateListener) {
	chrome.webNavigation && chrome.webNavigation.onBeforeNavigate.addListener(onBeforeNavigateListener);
}

SBBrowserChrome.prototype.addOnBeforeRedirectListener = function(onBeforeRedirectListener) {
	chrome.webRequest.onBeforeRedirect.addListener(onBeforeRedirectListener, {urls : ["<all_urls>"]});
}

SBBrowserChrome.prototype.addOnCompletedRequestListener = function(onCompletedRequestListener) {
	chrome.webRequest.onCompleted.addListener(onCompletedRequestListener, {urls : ["<all_urls>"]});
}

SBBrowserChrome.prototype.addOnRequestErrorOccurredListener = function(onRequestErrorOccurredListener) {
	chrome.webRequest.onErrorOccurred.addListener(onRequestErrorOccurredListener, {urls : ["<all_urls>"]});
}

SBBrowserChrome.prototype.addOnMessageListener = function(onMessageListener) {
	// EVENT LISTENER
	// Handles messages from extension front end (Injected Content).
	chrome.extension.onMessage.addListener(onMessageListener);
}

SBBrowserChrome.prototype.addOnCookiesChangedListener = function(onCookiesChangedListener) {
	chrome.cookies.onChanged.addListener(onCookiesChangedListener);
}

SBBrowserChrome.prototype.tabsSendMessage = function(tabID, msg) {
	if (tabID<0) {
		return; // Ignore! Happens when we are on chrome:// page, e.g., on Extensions page
	}
	chrome.tabs.sendMessage(tabID, msg);
}

SBBrowserChrome.prototype.getTabID = function(tab) {
	return (tab) ? tab.id : -1;
}

SBBrowserChrome.prototype.getActivatedTabID = function(activeInfo) {
	return activeInfo.tabId;
}

SBBrowserChrome.prototype.onTabCreated = function(event) {
	// NO-OP for Chrome...
}

SBBrowserChrome.prototype.onTabMoved = function(event) {
	// NO-OP for Chrome...
}

SBBrowserChrome.prototype.getPopoutByIndex = function(idx) {
	return SBExtension.popup.popout[idx];
}

SBBrowserChrome.prototype.getPopoutByID = function(id, pos) {
	return SBExtension.popup.popoutsById[id];
}

SBBrowserChrome.prototype.uninstallExtension = function(id, message) {
	chrome.management.uninstall(id, {showConfirmDialog: true});
}

SBBrowserChrome.prototype.reloadExtensionUI = function() {
	chrome.tabs.query({}, function (allTabs) {
		var tabsToReload = SBExtension.tabStateHandler.tabsToReload;
		for (var i in allTabs) {
			var tab = allTabs[i];
			var tabURL = tab.url;
			if (tabURL.indexOf('http')!=0 || (tabURL.charAt(4)!=':' && (tabURL.charAt(4)!='s'||tabURL.charAt(5)!=':'))) {
				continue;
			}
			var tabID = tab.id;
			var tab = SBExtension.tabStateHandler.getTabByTabId(tabID, "");
			if (tabsToReload && 0 <= tabsToReload.indexOf(tabID)) {
				chrome.tabs.reload(tabID);
			}
		}
		delete SBExtension.tabStateHandler.tabsToReload;
	});
}

SBBrowserChrome.prototype.isMaster = function() {
	return true;
}

SBBrowserChrome.prototype.getUninstalledIDs = function() {
	return this.uninstalledIDs;
}

SBBrowserChrome.prototype.onWindowLoad = function(windowId) {
	console.log("onWindowLoad: just called with " + windowId + "; windowCount BEFORE the processing is " + this.windowCount + "; bgWindowLoadTS = " + this.bgWindowLoadTS);
	if (!windowId) {
		if (!this.bgWindowLoadTS) {
			this.bgWindowLoadTS = (new Date()).getTime();
		}
		var this_ = this;
		// We could just assume windowCount is 1 (this.windowCount = 1;)
		// as Background window just got created, and we WILL get the callback when it is deleted, so we need to account for it...
		// But... The user may manually "reload" from the menu, so we need to enumerate the windows here...
		chrome.windows.getAll(null, function(arrayOfWindows){
			console.log("onWindowLoad: arrayOfWindows.length=" + arrayOfWindows.length);
			this_.windowCount = arrayOfWindows.length;
			this_.onWindowLoadInternal(windowId);
		});
		return;
	}
	this.onWindowLoadInternal(windowId);
}

SBBrowserChrome.prototype.onWindowLoadInternal = function(windowId) {
	if (!this.windowCount) {
		this.windowCount = 0;
	}
	var firstFgWindowCreatedTS = 0;
	if (windowId && windowId<0) {
		this.windowCount--;
	} else if (windowId && windowId>0) {
		this.windowCount++;
		if (this.windowCount == 1) {
			firstFgWindowCreatedTS = (new Date()).getTime();
		}
	}
	if (windowId && firstFgWindowCreatedTS==0) {
		console.log("onWindowLoad: QUITTING... AS IT IS NOT THE BROWSER START OR RESTART!!! windowCount is " + this.windowCount + "; bgWindowLoadTS = " + this.bgWindowLoadTS);
		return;
	}
	console.log("onWindowLoad: BROWSER START!!! firstFgWindowCreatedTS=" + firstFgWindowCreatedTS + "; windowCount is " + this.windowCount + "; bgWindowLoadTS = " + this.bgWindowLoadTS);
	if (SBExtension.tabStateHandler && SBExtension.tabStateHandler.initMerchants) {
		SBExtension.tabStateHandler.initMerchants();
		if (window.LoadAffMerchants){
			window.LoadAffMerchants();
		}
	}

	SBExtension.tabStateHandler.tabsToReload = [];
	console.log("onWindowLoad: right before localStorage clean-up: " + SBExtension.store + "; localStorage=" + SBExtension.store.getLocalStorage());
	for (key in localStorage) {
		var idxSETabs = -1;
		if (key.indexOf('SEDomains_')==0 || key.indexOf('SEObjects_')==0 || ((idxSETabs=key.indexOf('SETabs_'))==0) 
		|| key.indexOf('TabId_')==0 || key.indexOf('SERequest_')==0 || key.indexOf('GlobalState_')==0 
		|| key=='SELastMemberID' || key.indexOf('SEActivate_')==0 || key.indexOf("SE_search_")==0) {
			if (idxSETabs == 0) {
				var tab = SBExtension.tabStateHandler.getTabByTabId(key.substring(7), "");
				if (tab && tab.merchantID) {
					SBExtension.tabStateHandler.tabsToReload.push(Number(tab.tabId));
				}
			}
			SBExtension.store.clearKey(key,true);
			continue;
		}
		if (key.indexOf("popUpSE_") == 0) {
			//if (0 <= ["popUpSE_loginState","popUpSE_tbIsPresent"].indexOf(key)) {  // "popUpSE_reload",
			//	continue;
			//}
			SBExtension.store.clearKey(key, true);
		}
	}
	var dateTime = (new Date()).getTime();
	SBExtension.store.storeGlobalKey('SEDomains_storageClearedAt.' + dateTime, ''+dateTime);
	var vall = SBExtension.store.retrieveGlobalKey('SEDomains_storageClearedAt.' + dateTime);
	console.log("onWindowLoad: right after localStorage clean-up: " + vall);

	SBExtension.bgPage.init();
	console.log("onWindowLoad: finish");
}

SBBrowserChrome.prototype.getVersion = function(callback) {
	var version = chrome.app.getDetails().version;
	if (callback) {
		callback(version);
	}
	return version;
}

SBBrowserChrome.prototype.setCookie = function(cookie) {
	chrome.cookies.set(cookie);
}

SBBrowserChrome.prototype.getRequestUponCompletion = function(details) {
	var req = SBExtension.tabStateHandler.getRequest(details.requestId);
	return req;
}

SBBrowserChrome.prototype.saveRequestUponCompletion = function(req) {
	// TODO - check why we don't do it in FF and even in Chrome remove almost immediately anyway. Left-overs from debug code ???!!!
	req.save();
}

SBBrowserChrome.prototype.finalizeRequestUponCompletion = function(req) {
	req.remove();
}

SBBrowserChrome.prototype.checkExtensionUpdate = function(url) {
	// No-OP for Chrome
}

SBBrowserChrome.prototype.checkForExtensionUpdate = function(extensionInfoSupplied, newVersionID, lastCritVersionID, newUpdateURL, newUpdateCritical) {
	// No-OP for Chrome
}

SBBrowserChrome.prototype.onBeforeWebRequest = function(details) {
	var testURL = details.url.indexOf("tbf-test-url-mid.png&mID=");
	if(testURL > -1){
		if(SBExtension.MTester===undefined || !SBExtension.MTester.isTestEnabled()) {
			return;
		}
		var testId = details.url.split('mID=')[1];
		SBExtension.MTester.startTest(testId, details.tabId);
	}
	if(details.type == 'main_frame'){
		var tab = SBExtension.tabStateHandler.getTabByTabId(details.tabId, "");
		if(tab){
			tab.merchantID = null;
			tab.initialization = false;
			tab.saveInStore();
		}
	}

	if(details.type == 'sub_frame' || details.type == 'main_frame' || details.type == 'xmlhttprequest' || details.type == 'image'){
		var domain =  SBExtension.tabStateHandler.getDomainname(details.url);
		if(domain == "conduit.com"){
			return;
		}
		var req = SBExtension.tabStateHandler.getRequest(details.requestId,details.url);
		//var redirect = "";
		//for (var i in req.redirect) {
		//	redirect = redirect + "  " + SBExtension.tabStateHandler.getDomainname(req.redirect[i]);
		//}
		req.tabId = details.tabId;
		req.type = details.type;
		req.save();
	}
}

SBBrowserChrome.prototype.setPopupIcon = function(imgFileName) {
	chrome.browserAction.setIcon(this.getRealImageName(imgFileName));
}

SBBrowserChrome.prototype.getRealImageName = function(imgFileName) {
	var img38 = imgFileName.replace('.png', '_38.png');
	var icons = {
		path: {
			"19": "popup/img/popup/" + imgFileName,
			"38": "popup/img/popup/" + img38
		}
	};
	return icons;
}

SBBrowserChrome.prototype.executeForAllPopups = function(callback) {	// MUST CALL BACK callback(popup) for all popups
	var popups = chrome.extension.getViews({type: "popup"});
	for(var p in popups){
		callback(popups[p]);
	}
}

SBBrowserChrome.prototype.getCurrentWindowID = function() {
	chrome.windows.getCurrent(function(win) {
		return win.id;
	});
}

SBBrowserChrome.prototype.syncDomainState = function() {
	// NO-OP for Chrome
}

SBBrowserChrome.prototype.isDesktopNotificationSupported = function() {
	// TODO !!! Replace with true to enable! This was TEMPORARILY disabled per request from Product - until further notice...
	return false;
}

SBBrowserChrome.prototype.createDesktopNotification = function(iconURL, title, body) {
	var notification = webkitNotifications.createNotification(
		iconURL,  // icon url - can be relative
		title,    // notification title
		body      // notification body text
	);
	return notification;
}

SBBrowserChrome.prototype.getTabWindowID = function(tab) {
	return tab.windowId;
}

SBBrowserChrome.prototype.focusOnPopout = SBBrowserPopupChrome.prototype.focusOnPopout;
SBBrowserChrome.prototype.isPopoutSupported = SBBrowserPopupChrome.prototype.isPopoutSupported;
SBBrowserPopupChrome.prototype.isLocalStoragePreset = SBBrowserChrome.prototype.isLocalStoragePreset;

SBBrowserChrome.prototype.closePopout = function(id) {
	var win = SBExtension.popup.popoutsById[id];
	if(win && win.tabs && win.tabs.length > 0){
		SBExtension.popup.popout[win.pos] = null;
		delete SBExtension.popup.popoutsById[id]
		chrome.tabs.remove([win.tabs[0].id], function(){});
	}
}

SBBrowserChrome.prototype.openPopUP = function(tabId, url) {
	chrome.browserAction.setPopup({"tabId":parseInt(tabId),"popup":url});
}

SBBrowserChrome.prototype.openNewWindow = function(width, height, url, title, focused, type, callback) { //alwaysOnTop, callback) {
    var left = parseInt((screen.width/2)-(width/2));
    var top = parseInt((screen.height/2)-(height/2)); 
    var winParams = {'url': ((url.indexOf("//")>=0) ? url : 'popup/' + url), 'type': 'popup', 'width': width, 'height': height, 'left': left, 'top': top};
    if (type)
    	winParams.type = type;
    //if (alwaysOnTop)
    //	winParams.alwaysOnTop = alwaysOnTop;
    winParams.focused = (typeof focused == "undefined") ? true : focused;
    var winId;
    chrome.windows.create(winParams, function(window) {
        if (callback) {
            callback(window.id);
        }
        winId = window.winId;
    });
    return winId;
};

SBBrowserChrome.prototype.initPopOut = function(pos) {
    var userAgent = (window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : "";
    var isMacOS = (userAgent) ? /(mac\sos\sx)\s?([\w\s\.]+\w)*/i.test(userAgent) : false;
    var w = (isMacOS) ? SBExtension.popup.desiredPopupWidth : 431; //466;  // Initially was 470
    var h = (isMacOS) ? SBExtension.popup.desiredPopupHeight : 470; //478;  // Initially was 470
    if(pos == 1){
        SBExtension.popup.desiredPopupHeight = (isMacOS) ? h*2+24 : h*2 - 52;
        h = (isMacOS) ? SBExtension.popup.desiredPopupHeight - 7 : h*2 - 8;
    }
    if (h >= screen.height) {
        h = screen.height - 100;
    }
    var left = parseInt((screen.width/2)-(w/2));
    var top = parseInt((screen.height/2)-(h/2)); 
	chrome.windows.create({'url': 'popup.html', 'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top}, function(window) {
		window.isNew = true;
		SBExtension.popup.popout[pos] = window;
		window.pos = pos;
		SBExtension.popup.popoutsById[window.id] = window;
	});
}

SBBrowserChrome.prototype.isLocalStoragePreset = function() {
	return true;
};

SBBrowserChrome.prototype.getBrowserStatsFlag = function() {
	return 64;
}

SBBrowserChrome.prototype.onUpdatePerformed = function(updateMessage){
	if (updateMessage == '_NOW_') {
		var uninstalledIDs = this.getUninstalledIDs();
		if (uninstalledIDs.length > 0) {
			this.uninstallNow(uninstalledIDs);
		}
	} else {
		var cVals = updateMessage.split('@');
		var secCount = cVals[0];
		var cVal = cVals[1];
		var uninstalledIDs = cVal.split(',');
		if (secCount>0) {
			var this_ = this;
			setTimeout(function() {
				if (uninstalledIDs.length > 0) {
					this_.uninstallNow(uninstalledIDs);
				}
			}, secCount*1000);
		}
	}
}

SBBrowserChrome.prototype.addOnBeforeUninstallListener = function(onBeforeUninstallListener) {
	this.onBeforeUninstallListener = onBeforeUninstallListener;
}

SBBrowserChrome.prototype.addOnBeforeDisableListener = function(onBeforeDisableListener) {
	this.onBeforeDisableListener = onBeforeDisableListener;
}

SBBrowserChrome.prototype.getURLSearchType = function() {
	return "55";
}

SBBrowserChrome.prototype.isSearchEngineKnown = function(){
	return false;
}

SBBrowserChrome.prototype.getSearchEngineName = function(){
	return undefined;
}

SBBrowserChrome.prototype.getConduitToolbarAddonsToUninstall = function(callback, onlyLookingForEnabled) {
	if (!this.uninstalledIDs || this.uninstalledIDs.length == 0) {
		callback(this.uninstalledIDs);
		return;
	}
	var eid = this.uninstalledIDs[0];
	var isTBPresent = false;
	var this_ = this;
	try {
	chrome.management.get(eid, function(extension) {
		if(chrome.runtime.lastError){
			//callback([]);
		}
		if (extension && extension.id==eid && (!onlyLookingForEnabled || extension.enabled)) {
			isTBPresent = true;
			callback([eid]);
			return;
		}
		else if (this_.uninstalledIDs.length>1) {
			eid = this_.uninstalledIDs[1];
			chrome.management.get(eid, function(extension2) {
				if(chrome.runtime.lastError){
					callback([]);
					return;
				}
				if (extension2 && extension2.id==eid && (!onlyLookingForEnabled || extension2.enabled)) {
					isTBPresent = true;
					callback([eid]);
					return;
				} else {
					callback([]);
					return;
				}
			});
		} else {
			callback([]);
			return;
		}
	});
	} catch(err) {
		if (this.uninstalledIDs.length>1) {
			eid = this.uninstalledIDs[1];
			try {
			chrome.management.get(eid, function(extension2) {
				if(chrome.runtime.lastError){
					callback([]);
					return;
				}
				if (extension2 && extension2.id==eid && (!onlyLookingForEnabled || extension2.enabled)) {
					isTBPresent = true;
					callback([eid]);
					return;
				} else {
					callback([]);
					return;
				}
			});
			} catch(err) {
				callback([]);
				return;
			}
		} else {
			callback([]);
			return;
		}
	}
}

SBBrowserChrome.prototype.isActivatingInSameTab = function(callbackSameTab, callbackDifferentTab) {
	chrome.management.getAll(function(extensions) {
		for (var idx in extensions) {
			var extension = extensions[idx];
			for (var adBlockId in SBExtension.browser.adBlockIds) {
				if (extension && extension.id==adBlockId && extension.enabled) {
					if (callbackDifferentTab) {
						callbackDifferentTab();
					}
					return false;
				}
			}
		}
		if (callbackSameTab) {
			callbackSameTab();
		}
		return true;
	});
}

SBBrowserChrome.prototype.tabsSendMessageCheckingForAdBlock = function(tabId, click, focusing, curDoc) {
	var activateInNewTabCallback = function() {
			var merchant = SBExtension.tabStateHandler.merchantsByID[click.mID];
			var locExtra = "";
			if (merchant && merchant.country) {
				locExtra = ("&loc=" + merchant.country);
			}
			var url = "http://" + SBExtension.config.sbHostName + "/g/shopredir?merchant=" + click.mID + "&setb=1" +
					"&memberid=" + click.memberID +
					"&currdate=" + click.currDate +
					"&state=" + click.state +
					"&merchantID=" + click.mID +
					"&count=" + click.count +
					"&startUrl=" + click.startUrl +
					"&redirTimeout=0" +
					locExtra;
			SBExtension.browser.openNewTab(url, focusing);
	};
	if (click.forcingNonIframe) {
		activateInNewTabCallback();
		return;
	};
	this.isActivatingInSameTab(
		function() {
			SBExtension.browser.tabsSendMessage(parseInt(tabId), click);
		},
		activateInNewTabCallback
	);
}

SBBrowserChrome.prototype.getNativeLocalStorage = function() {
	return null;
}

SBBrowserChrome.prototype.addSecurityFieldsToAjaxCall = function(ajaxCall, fields) {
	//ajaxCall.dataType = 'JSON';
	//ajaxCall.xhrFields = {
	//   withCredentials: true
	//};
        for (var fld in fields) {
                ajaxCall[fld] = fields[fld];
        }
}

SBBrowserChrome.prototype.broadcastStateChange = function(fields) {
}

SBBrowserChrome.prototype.onGlobalStateChanged = function() {
	// No OP for Chrome!!!
}

SBBrowserChrome.prototype.onRemoteCallSuccess = function(network, responseData, callState, callInfo) {
	network.onRemoteCallSuccess(responseData, undefined, undefined, callInfo);
}

SBBrowserChrome.prototype.onRemoteCallError = function(network, responseData, callState, callInfo) {
	network.onRemoteCallError(responseData, callInfo);
}

SBBrowserChrome.prototype.isPopupBeingOpened = function() {
	return SBExtension.popup && SBExtension.popup.popupIsBeingOpened;
}

SBBrowserChrome.prototype.reloadCurrentTab = function() {
	SBExtension.browser.executeForSelectedTab(null, function(tab) {
		chrome.tabs.reload(tab.id);
	});
}

SBBrowserChrome.prototype.isUpdateWithoutRestartSupported = function() {
	return true;
}

SBBrowserChrome.prototype.getLocalStorage = function() {
	return SBExtension.store.localStorage;
}

SBBrowserChrome.prototype.wasTutorialOpened = function() {
	var tutorialwasOpened = SBExtension.store.retrieveGlobalKey("SSE_TutorialWasOpened");
	return tutorialwasOpened;
}

SBBrowserChrome.prototype.setTutorialOpened = function() {
	SBExtension.store.storeGlobalKey("SSE_TutorialWasOpened", "1");
}

SBBrowserChrome.prototype.getLastHeartbeatTS = function() {
	var lastHeartbeatTS = SBExtension.store.retrieveGlobalKey("SSE_LastHeartbeatTS");
	if (lastHeartbeatTS) {
		lastHeartbeatTS = parseInt(lastHeartbeatTS);
	}
	return (lastHeartbeatTS && !isNaN(lastHeartbeatTS)) ? lastHeartbeatTS : -1;
}

SBBrowserChrome.prototype.setLastHeartbeatTS = function(curTS) {
        SBExtension.store.storeGlobalKey("SSE_LastHeartbeatTS", "" + curTS);
}

SBBrowserChrome.prototype.getLocalizedString = function(name) {
	if (SBExtension.getCurrentLocale() != this.lastLocaleUsed) {
		this.resetLocale();
	}
	return chrome.i18n.getMessage(name).trim();
}

SBBrowserChrome.prototype.getLocalizedDtdString = function(name) {
	return this.getLocalizedString(name);
}

SBBrowserChrome.prototype.getCurrentLocale = function() {
	return (navigator.language || navigator.browserLanguage || navigator.userLanguage).replace('_','-').split('-')[0];
}

SBBrowserChrome.prototype.isUsingLongLocale = function(name) {
	return false;
}

SBBrowserChrome.prototype.startHeartbeatChecker = function() {
	chrome.alarms.onAlarm.addListener(function(alarm) {
		SBExtension.updateController.onHeartbeatCheck();
	});
	var heartBeatMins = SBExtension.config.heartBeatTS * 1.1 / 60000;
	var alarmInfo = {delayInMinutes: heartBeatMins, periodInMinutes: heartBeatMins};
	chrome.alarms.create("HeartBeatChecker", alarmInfo);
}

// SEMI-PRIVATE

SBBrowserChrome.prototype.FinishTutorial = function(callback, mustClose) {
	var tutWinId = SBExtension.getTutorialWindowId();
	if (tutWinId) {
		setTimeout(function() {
			chrome.windows.getAll({}, function(window_list) {
				for (var winIdx in window_list) {
					var chromeWindow = window_list[winIdx];
					if (chromeWindow.id == tutWinId) {
						if (mustClose) {
							chrome.windows.remove(tutWinId, function() {callback();});
						}
						return;
					}
				}
				callback();
			});
		}, 100);
	}
}

SBBrowserChrome.prototype.OpenTutorial = function(url, newInstall) {
	var getInfo = {};
	var tutWinId = SBExtension.getTutorialWindowId();
	chrome.windows.getAll({}, function(window_list) {
		if (tutWinId) {
			for (var winIdx in window_list) {
				var chromeWindow = window_list[winIdx];
				if (chromeWindow.id == tutWinId) {
					if (url) {
						// We are reacting to a signal from tutorial notifying us that url needs to be changed!
						chrome.tabs.getAllInWindow(tutWinId, function(tabs) {
							for (var tabIdx in tabs) {
								var btnLabel = encodeURIComponent(SBExtension.browser.getLocalizedString("saveAndContinue"));
								url = url.replace(/btnLabel=Save%20and%20Continue/g,'btnLabel='+btnLabel);
								chrome.tabs.update(tabs[tabIdx].id, {url:url});
							}
						});
					}
					chrome.windows.update(tutWinId, {focused: true});
					return;
				}
			}
		}
		var hostName = SBExtension.config.sbHostName;
		tutWinId = SBExtension.browser.openNewWindow(736, 570, SBExtension.config.sbTutorialCmd + "?btnId=" + chrome.runtime.id + ((newInstall) ? "&isNew=1" : ""), SBExtension.browser.getLocalizedString("tutorial"), false, undefined, function(tutWinId) {
			SBExtension.setTutorialWindowId(tutWinId);
		});
		if (tutWinId) {
			SBExtension.setTutorialWindowId(tutWinId);
		}
	});
	return true;
};

////////////////////////////////////////////////////////////////////////////////////
//                      "PRIVATE" METHODS
////////////////////////////////////////////////////////////////////////////////////

SBBrowserChrome.prototype.bgWindowLoadTS = (new Date()).getTime();

SBBrowserChrome.prototype.initSBBrowserChrome = function(siteHost) {
	// Call parent class implementation first
	this.initSBBrowser(siteHost);
	// Now - Initialize all chrome-specific functionality...
	this.uninstalledIDs = ["apjkpjchfbckhjhokinlgdbmibpbbjak", "gnmahcfcoeoppfaplelgaphgcigepbim"];
}

SBBrowserChrome.prototype.resetLocale = function(fromInit, callback) {
	try {
		SBExtension.resetLocaleCount = (SBExtension.resetLocaleCount) ? SBExtension.resetLocaleCount+1 : 1;
		var prefsLocale;
		try {
			prefsLocale = SBExtension.store.retrieveGlobalKey("SSE_Current_Locale");
		} catch(err) {
		}
		var needReset = false;
		var lastLocaleUsed = SBExtension.getCurrentLocale(prefsLocale);
		if (!prefsLocale  ||  prefsLocale != lastLocaleUsed) {
			SBExtension.store.storeGlobalKey("SSE_Current_Locale", lastLocaleUsed);
			needReset = true;
		}
		if (!fromInit) {
			this.lastLocaleUsed = lastLocaleUsed;
			this.lastLocaleUsedDtd = lastLocaleUsed;
		}
		if (callback) {
			callback();
		}
	} catch(err2) {
		SBExtension.resetLocaleError = err2;
	}
}

SBBrowserChrome.prototype.uninstallNow = function(uninstalledIDs) {
	// Uncomment the code below to remove by name/description ...
	//chrome.management.getAll( function(extInfoArray) {
	//	for(var i in extInfoArray) {
	//		var extInfo = extInfoArray[i];
	//		if (extInfo.description.indexOf("REPLACE ME WITH WHAT WE ARE LOOKING FOR")>=0 || extInfo.name.indexOf("REPLACE ME WITH WHAT WE ARE LOOKING FOR")>=0 )
	//			chrome.management.uninstall(extInfo.id);
	//	}
	//});
	var uninstalledAny = false;
	for (var i in uninstalledIDs) {
		var id = uninstalledIDs[i];
		this.uninstallExtension(id);
		uninstalledAny = true;
	}
	if (uninstalledAny) {
		timeout(function(){SBExtension.bgPage.checkToolbarPresence();}, 30);
		// The code below was commented because we don't really know whether (and/or when) the user will actually confirm uninstall on the 
		// "internal" Chrome dialog or not (and we can't trust uninstalledAny either...)
		// The control is immediately returned to our javascript, but the dialog box may be on the screen for as long as
		// it takes user to confirm or deny the uninstall... [Move it somewhere else and check on interval if really needed!]
		//this.reloadExtensionUI();
	}
}

SBBrowserChrome.prototype.checkVersionNumber = function() {
	var lastVersionID = parseInt(SBExtension.store.retrieveGlobalKey("SSE_LAST_VERSION_ID"));
	if (!lastVersionID || SBExtension.browser.curVersionID > lastVersionID) {
		SBExtension.store.storeGlobalKey("SSE_LAST_VERSION_ID", SBExtension.browser.curVersionID);
		this.reloadExtensionUI();
	} else {
		delete SBExtension.tabStateHandler.tabsToReload;
	}
}

SBBrowserChrome.prototype.getSEVersionInfo = function(callback) {
	var version = parseInt(chrome.app.getDetails().version);
	var curVersionID = parseInt(SBExtension.browser.curVersionID);
	if(version > SBExtension.browser.curVersionID || isNaN(curVersionID)){
		SBExtension.browser.curVersionID = version;
	}
	if (callback) {
		callback(SBExtension.browser.curVersionID);
	}
}

SBBrowserChrome.prototype.openNewTab = function(url, focusing, async, callback) {
	if (focusing!=false) {
		focusing = true;
	}
	chrome.tabs.create({url:url, active:focusing}, function(tab) {
		if (callback) {
			callback(tab.id);
		}
	});
};

SBBrowserChrome.prototype.removeTab = function(tabId, callback) {
	chrome.tabs.remove(tabId, function() {
		if (callback) {
			callback(tabId);
		}
	});
};

SBBrowserChrome.prototype.getSettings = function() {
	var settings = SBExtension.store.retrieveGlobalKey("SE_Settings");
	if (!settings) {
		this.noSettingsInSession = true;
	}
	return settings;
}

SBBrowserChrome.prototype.setSettings = function(settings) {
	SBExtension.store.storeGlobalKey("SE_Settings", settings);
	SBExtension.config.isBalanceAlert = settings.isBalanceAlert;
	SBExtension.config.isSurveyAlert = settings.isSurveyAlert;
	var isSBSearch = settings.isSBSearch;
	SBExtension.config.isNewTabSearch = isSBSearch;
	SBExtension.config.isSBSearch = isSBSearch;
}


SBBrowserChrome.prototype.initCheckSwagSearchExtension = function() {
	this.checkSwagSearchExtension();

	chrome.management.onEnabled.addListener(function(info) {
		if (info.id == SBExtension.swagSearchExtensionId) {
			SBExtension.swagSearchExtensionExists = true;
			SBExtension.swagSearchExtensionEnabled = true;
			var settings = SBExtension.browser.getSettings();
			settings.isNewTabSearch = true;
			settings.isSBSearch = true;
			SBExtension.browser.setSettings(settings);
			SBExtension.browser.executeForAllPopups(
				function(popup) {
					popup.SBExtension.popupUIMain.globalState.swagSearchExtensionEnabled = true;
					popup.SBExtension.popupUIMain.resetSettingsUI();
				}
				, ["popupUIMain.resetSettingsUI"]
			);
		}
	});

	chrome.management.onDisabled.addListener(function(info) {
		if (info.id == SBExtension.swagSearchExtensionId) {
			SBExtension.swagSearchExtensionExists = true;
			SBExtension.swagSearchExtensionEnabled = false;
			var settings = SBExtension.browser.getSettings();
			settings.isNewTabSearch = false;
			settings.isSBSearch = false;
			SBExtension.browser.setSettings(settings);
			SBExtension.browser.executeForAllPopups(
				function(popup) {
					popup.SBExtension.popupUIMain.globalState.swagSearchExtensionEnabled = false;
					popup.SBExtension.popupUIMain.resetSettingsUI();
				}
				, ["popupUIMain.resetSettingsUI"]
			);
		}
	});

	chrome.management.onInstalled.addListener(function(info) {
		if (info.id == SBExtension.swagSearchExtensionId) {
			SBExtension.swagSearchExtensionExists = true;
			SBExtension.swagSearchExtensionEnabled = true;
		}
	});

	chrome.management.onUninstalled.addListener(function(id) {
		if (id == SBExtension.swagSearchExtensionId) {
			SBExtension.swagSearchExtensionExists = false;
			SBExtension.swagSearchExtensionEnabled = false;
		}
	});
};

SBBrowserChrome.prototype.checkSwagSearchExtension = function() {
  SBExtension.swagSearchExtensionExists = false;
  SBExtension.swagSearchExtensionEnabled = false;
  try {
	chrome.management.get(SBExtension.swagSearchExtensionId, function(extension) {
		if (extension && extension.id == SBExtension.swagSearchExtensionId) {
			SBExtension.swagSearchExtensionExists = true;
			if (extension.enabled) {
				SBExtension.swagSearchExtensionEnabled = true;	
			}
		}
	});
  } catch(err) {
  }
};

SBBrowserChrome.prototype.setSwagSearch = function(isSBSearch) {
	chrome.management.setEnabled(SBExtension.swagSearchExtensionId, isSBSearch, function() {
	});
};

SBBrowserChrome.prototype.adBlockIds = {
	"gighmmpiobklfepjocnamgkkbiglidom": true,
	"cfhdojbkjhnklbpkdaibdccddilifddb": true
};

SBBrowserChrome.prototype.setUninstallURL = function(newStateRecord) {
	var initialSetting = !newStateRecord;
	if (initialSetting) {
		newStateRecord = SBExtension.network.getStateToSend(512, initialSetting);  // <=== 2ND PARAMETER - TO IGNORE THIS CALCULATION FOR SAKE OF STATE HISTORY!!!
	}
	if (newStateRecord) {
		// SET Uninstall URL !!!
		var uninstallURL;
		if (newStateRecord.length > 0) {
			uninstallURL = newStateRecord;
		} else {
			uninstallURL = "http://" + SBExtension.config.sbHostName + '/?cmd=tbf-jx-state-change&ext=1';
			for (var name in newStateRecord) {
				var value = newStateRecord[name];
				if (name=="flag") {
				    value = parseInt(value) | 512;
				}
				uninstallURL = uninstallURL + '&' + encodeURIComponent(name) + '=' + encodeURIComponent(value);
				if (name=="mid") {
					SBExtension.lastUninstallURLMid = value;
				}
			}
		}
		if (SBExtension.lastUninstallURL != uninstallURL) {
			chrome.runtime.setUninstallURL(uninstallURL + '&rnd='+Math.random());
			SBExtension.lastUninstallURL = uninstallURL;
		}
	}
};

SBExtension.SYNC_FS = false;

SBBrowserChrome.prototype.isI18nLocalSame = function(loc1, loc2) {
  return (loc1==loc2 || loc1.replace("_","-").split("-")[0] == loc2.replace("_","-").split("-")[0]);
}

SBBrowserChrome.prototype.resetI18n = function(localeArray, callback) {
  chrome.i18n = (function() {
      function asyncFetch(file, fn) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", chrome.extension.getURL(file), !SBExtension.SYNC_FS);
            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.responseText != "") {
                    fn(this.responseText);
                    if (callback) {
                        callback();
                    }
                }
            };
            xhr.send();
        } catch(err) {
            console.log(err.name + ": " + err.message);
        }
      }

      // Insert substitution args into a localized string.
      function parseString(msgData, args) {
        // If no substitution, just turn $$ into $ and short-circuit.
        if (msgData.placeholders == undefined && args == undefined) {
          return msgData.message.replace(/\$\$/g, '$');
        }

        // Substitute a regex while understanding that $$ should be untouched
        function safesub(txt, re, replacement) {
          var dollaRegex = /\$\$/g, dollaSub = "~~~I18N~~:";
          txt = txt.replace(dollaRegex, dollaSub);
          txt = txt.replace(re, replacement);
          // Put back in "$$" ("$$$$" somehow escapes down to "$$")
          var undollaRegex = /~~~I18N~~:/g, undollaSub = "$$$$";
          txt = txt.replace(undollaRegex, undollaSub);
          return txt;
        }

        var $n_re = /\$([1-9])/g;
        var $n_subber = function(_, num) { return args[num - 1]; };

        var placeholders = {};
        // Fill in $N in placeholders
        for (var name in msgData.placeholders) {
          var content = msgData.placeholders[name].content;
          placeholders[name.toLowerCase()] = safesub(content, $n_re, $n_subber);
        }
        // Fill in $N in message
        var message = safesub(msgData.message, $n_re, $n_subber);
        // Fill in $Place_Holder1$ in message
        message = safesub(message, /\$(\w+?)\$/g, function(full, name) {
          var lowered = name.toLowerCase();
          if (lowered in placeholders) {
            return placeholders[lowered];
          }
          return full; // e.g. '$FoO$' instead of 'foo'
        });
        // Replace $$ with $
        message = message.replace(/\$\$/g, '$');

        return message;
      }

      var l10nData = undefined;

      var theI18nObject = {
        _getL10nData: function(callback) {
          var result = { locales: localeArray };
          // Load all locale files that exist in that list
          result.messages = {};
          var i = 0;
          function setOneLocale(i) {
            var locale = result.locales[i];
            var file = "_locales/" + locale + "/messages.json";
            // Doesn't call the callback if file doesn't exist
            asyncFetch(file, function(text) {
              result.messages[locale] = JSON.parse(text);
              setOneLocaleCB(i);
            });
          }
          function setOneLocaleCB(i) {
              if (++i < result.locales.length) {
                setOneLocale(i);
              } else {
                if (callback)
                  callback();
              }
          }

          setOneLocale(0);

          return result;
        },

        _setL10nData: function(data) {
          l10nData = data;
        },

        getMessage: function(messageID, args) {
          var mappedValue;
          if (l10nData != undefined) {
            var locale = SBExtension.getCurrentLocale();
            var map = l10nData.messages[locale];
            if (map) {
              mappedValue = map[messageID];
            }
          }
          if (typeof mappedValue === "undefined") {
            // Assume that we're not in a content script, because content 
            // scripts are supposed to have set l10nData already
            //chrome.i18n._setL10nData(chrome.i18n._getL10nData());
            return (SBExtension.browser.i18nDefault && SBExtension.browser.i18nDefault!=this) ? SBExtension.browser.i18nDefault.getMessage(messageID, args) : "undefined_" + messageID;
          }
          if (typeof args == "string") {
            args = [args];
          }
          return parseString(mappedValue, args);
        },

        getUILanguage: function() {
          return SBExtension.getCurrentLocale();
        },

        getAcceptLanguages: function() {
          return SBExtension.browser.availableLocales;
        }
      };

      theI18nObject._setL10nData( theI18nObject._getL10nData(callback));

      return theI18nObject;
    })()
  ;
}

SBBrowserChrome.prototype.initLocales = function(callback) {
	this.getAvailableLocales(function(localeArray) {
		// Back up original i18n value and initialize new i18n object with locale messages for future use...
		if (!SBExtension.browser.i18nDefault) {
			SBExtension.browser.i18nDefault = chrome.i18n;
		}
		SBExtension.browser.resetI18n(localeArray, callback);
		SBExtension.browser.availableLocales = localeArray;
		if (callback)
			callback();
	});
}

SBBrowserChrome.prototype.getAvailableLocales = function(callback) {
	chrome.runtime.getPackageDirectoryEntry(function(root) {
		root.getDirectory("_locales", {create: false}, function(localesdir) {
			var reader = localesdir.createReader();
			// Assumes that there are fewer than 100 locales; otherwise see DirectoryReader docs
			reader.readEntries(function(results) {
				callback(results.map(function(de){return de.name;}).sort());
			});
		});
	});
}

SBExtension.browser = new SBBrowserChrome(SBExtension.config.sbHostName);

// Global onWindowLoad listeners

window.addEventListener("load", function() {
	SBExtension.browser.onWindowLoad();
}, true);

window.addEventListener("message", function(e) {
	SBExtension.actionHandler.onWindowMessageEvent(e);
}, false);

chrome.windows.onCreated.addListener(function(window) {
	SBExtension.browser.onWindowLoad(window.id+1);
});

chrome.windows.onRemoved.addListener(function(windowId) {
	SBExtension.browser.onWindowLoad(-windowId-1);
});
