// To make it foolproof and easy to test -- this file will be ignored on IE !!!

if (!SBExtension.getIEVersion()) {

try {

SBExtension.bg = chrome.extension.getBackgroundPage();

SBExtension.network = SBExtension.bg.SBExtension.network;
SBExtension.networkPopup = SBExtension.network;
SBExtension.actionHandler = SBExtension.bg.SBExtension.actionHandler;
SBExtension.popup = SBExtension.bg.SBExtension.popup;
SBExtension.store = SBExtension.bg.SBExtension.store;
SBExtension.updateController = SBExtension.bg.SBExtension.updateController;
SBExtension.actionHandler = SBExtension.bg.SBExtension.actionHandler;
SBExtension.tabStateHandler = SBExtension.bg.SBExtension.tabStateHandler;

/**
 * Default SBBrowserPopupChrome ctor.
 * Creates instance of SBBrowserPopupChrome class that contains ALL Chrome browser-specific implementation  
 *         of the core browser functionality required for the rest of the code.
 *
 * @param {String} siteDomain The domain name of the site.
 */
function SBBrowserPopupChrome(siteHost) {
	this.initSBBrowserPopupChrome(siteHost);
}
	
$.extend(SBBrowserPopupChrome.prototype, SBBrowserPopup.prototype);

SBBrowserPopupChrome.prototype.initSBBrowserPopupChrome = function(siteHost) {
	// Call parent class implementation first
	this.initSBBrowserPopup(siteHost);
	// Initializing chrome-specific functionality here...
	this.isLocalStoragePreset = (SBExtension.bg.SBExtension.browser) ? SBExtension.bg.SBExtension.browser.isLocalStoragePreset : null;
};

SBBrowserPopupChrome.prototype.createTag = function(doc, tagName) {
	return $("<" + tagName + " />", doc);
};

SBBrowserPopupChrome.prototype.setAttribute = function(elem, attrName, attrValue) {
	elem.attr(attrName, attrValue);
};

SBBrowserPopupChrome.prototype.setText = function(elem, textValue) {
	elem.text(textValue);
};

SBBrowserPopupChrome.prototype.openNewTab = function(url) {
	chrome.tabs.create({url:url});
	//window.open(url,'_blank');
};

SBBrowserPopupChrome.prototype.setNewTabURLOnClick = function(elem, url) {
	this.setAttribute(elem, "target", "_blank");
	this.setAttribute(elem, "href", url);
};

SBBrowserPopupChrome.prototype.isSearchChangeSupported = function(always) {
	return (always || !SBExtension.popupUIMain || !SBExtension.popupUIMain.globalState) ? false : SBExtension.popupUIMain.globalState.swagSearchExtensionExists;
};

SBBrowserPopupChrome.prototype.isPopoutSupported = function() {
	return true;
};

SBBrowserPopupChrome.prototype.isSearchEngineKnown = function(always){
	return (always || !SBExtension.popupUIMain || !SBExtension.popupUIMain.globalState) ? false : SBExtension.popupUIMain.globalState.swagSearchExtensionExists;
}

SBBrowserPopupChrome.prototype.getSearchEngineName = function(){
	return (SBExtension.popupUIMain && SBExtension.popupUIMain.globalState && SBExtension.popupUIMain.globalState.swagSearchExtensionEnabled) ? SBExtension.config.searchName : undefined;
}

SBBrowserPopupChrome.prototype.focusOnPopout = function(windowId) {
	chrome.windows.update(windowId, { "focused": true });
};

SBBrowserPopupChrome.prototype.clickEventListen = function(element) {
	$(element, document).unbind('click');
	var this_ = this;
	$(element, document).bind('click', function(){
		this_.openNewTab(SBExtension.preprocessLink($(this).data('url')));
	});
};

SBBrowserPopupChrome.prototype.getPopupSearchType = function() {
	return "105";
};

SBBrowserPopupChrome.prototype.getNativeLocalStorage = function() {
	return null;
};

SBBrowserPopupChrome.prototype.addSecurityFieldsToAjaxCall = function(ajaxCall, fields) {
        for (var fld in fields) {
                ajaxCall[fld] = fields[fld];
        }
};

SBBrowserPopupChrome.prototype.finishPopupLoading = function() {
	$( document ).ready(function(){
		SBExtension.popupUI[SBExtension.POPUP_ID_SCDE].initSC();
		SBExtension.popupUIMain.initResizeCommon();
		//SBExtension.popupUIMain.translate();
	});
	// CLOSE POPUP
	addEventListener("unload", function (event) {
		try{
			var watchPos;
			if ($('#menu_watch').hasClass('watch_selected') && SBExtension.popupUIMain.popOutID == -1) {
				watchPos = SBExtension.popupUIMain.getMenuTypePosition('watch');
			}
			SBExtension.popup.onPopupUnload(watchPos);
		} catch(e) {
			SBExtension.bg.console.log('popup.unload: ' + e, e);
		}
	}, true);
	var popupMustBeClosedImmediately = SBExtension.store.retrieveGlobalKey("popUpSE_MustBeClosed");
	if (popupMustBeClosedImmediately) {
		SBExtension.store.clearKey("popUpSE_MustBeClosed", true);
		window.close();
	}
};

SBBrowserPopupChrome.prototype.onGlobalStateChanged = function() {
	// No OP for Firefox!!!
};

SBBrowserPopupChrome.prototype.isPopoutLinked = function() {
	return true;
}

SBBrowserPopupChrome.prototype.getBrowserStatsFlag = function() {
	return 64;
};

SBBrowserPopupChrome.prototype.initPopUp = function() {
	SBExtension.popup.initPopUp(
		function() {
			SBExtension.popupUIMain.callbackBG.apply(SBExtension.popupUIMain, arguments);
		},
		SBExtension.popupUIMain);
};

SBBrowserPopupChrome.prototype.openHelpPopUp = function(closingPopup) {
	var helpPopupId = SBExtension.bg.SBExtension.helpPopupId;
	if (helpPopupId) {
		chrome.windows.getAll({}, function(window_list) {
			for (var winIdx in window_list) {
				var chromeWindow = window_list[winIdx];
				if (chromeWindow.id == helpPopupId) {
					chrome.windows.update(helpPopupId, {focused: true});
					if (closingPopup) {
						setTimeout(function() {
							window.close();
						});
					}
					return;
				}
			}
			SBExtension.browserPopup.openNewHelpPopUp(closingPopup);
		});
		return;
	}
	SBExtension.browserPopup.openNewHelpPopUp(closingPopup);
};

SBBrowserPopupChrome.prototype.openNewHelpPopUp = function(closingPopup) {
	var hostName = SBExtension.config.sbHostName;
	SBExtension.browserPopup.openNewWindow(441, 596, "http://" + hostName + "/?cmd=gn-search-instructions&rnd="+Math.random(), "Help", closingPopup, 'panel', //true,
		function(win) {
			SBExtension.bg.SBExtension.helpPopupId = win.id;
			//win.alwaysOnTop = true;
	});
	if (closingPopup) {
		setTimeout(function() {
			window.close();
		});
	}
};

SBBrowserPopupChrome.prototype.isWindowsPlatform = function() {
    return (["Win32","Win64"].indexOf(window.navigator.platform)>-1 || navigator.userAgent.indexOf('WOW64')>-1);
};

SBBrowserPopupChrome.prototype.openNewWindow = function(width, height, url, title, focused, type, callback) { //alwaysOnTop, callback) {
    var left = parseInt((screen.width/2)-(width/2));
    var top = parseInt((screen.height/2)-(height/2)); 
    var winParams = {'url': ((url.indexOf("//")>=0) ? url : 'popup/' + url), 'type': 'popup', 'width': width, 'height': height, 'left': left, 'top': top};
    if (type)
    	winParams.type = type;
    //if (alwaysOnTop)
    //	winParams.alwaysOnTop = alwaysOnTop;
    winParams.focused = (typeof focused == "undefined") ? true : focused;
    var winId = chrome.windows.create(winParams, callback);
    return winId;
};

SBBrowserPopupChrome.prototype.onRemoteCallSuccess = function(network, responseData, callState, callInfo) {
	network.onRemoteCallSuccess(responseData, undefined, undefined, callInfo);
};

SBBrowserPopupChrome.prototype.onRemoteCallError = function(network, responseData, callState, callInfo) {
	network.onRemoteCallError(responseData, callInfo);
};

SBBrowserPopupChrome.prototype.broadcastStateChange = function(fields) {
};

SBBrowserPopupChrome.prototype.getBrowserStatsFlag = function() {
	return 64;
};

SBBrowserPopupChrome.prototype.getURL = function(filePath) {
	return 'popup/' + filePath;
};

SBBrowserPopupChrome.prototype.setPopupBeingOpened = function(openFlag) {
	if (SBExtension.popup) {
		if (openFlag)
			SBExtension.popup.popupIsBeingOpened = true;
		else
			delete SBExtension.popup.popupIsBeingOpened;
	}
};

SBBrowserPopupChrome.prototype.getLocalStorage = function() {
	return SBExtension.store.localStorage;
};

SBBrowserPopupChrome.prototype.onUpdateConfirmed = function(updateIsCritical) {
	SBExtension.alert_debug("We should never be here in the first place! Not for Chrome!", new Error());
};

SBBrowserPopupChrome.prototype.doConfirmUpdate = function(updateIsCritical, prompt) {
	// TODO : This code is for debugging only. Turn into NO-OP before going "live"...
	var updateConfirmed = confirm(prompt);
	if (updateConfirmed) {
		this.onUpdateConfirmed(false);
	}
};

SBBrowserPopupChrome.prototype.getSettings = function() {
	return SBExtension.bg.SBExtension.browser.getSettings();
};

SBBrowserPopupChrome.prototype.setSettings = function(settings) {
	var isSBSearch = settings.isSBSearch;
	settings.isNewTabSearch = isSBSearch;
	SBExtension.bg.SBExtension.browser.setSettings(settings);
	if (SBExtension.popupUIMain.globalState.swagSearchExtensionExists) {
		SBExtension.popupUIMain.globalState.swagSearchExtensionEnabled = isSBSearch;
	}
}

SBBrowserPopupChrome.prototype.getLocalizedString = function(name) {
	var lastLocaleUsed = this.lastLocaleUsed;
	if (!lastLocaleUsed) {
		lastLocaleUsed = this.getCurrentLocale();
		var lastLocaleUsedBG = SBExtension.bg.SBExtension.browser.lastLocaleUsed;
		if (lastLocaleUsedBG && lastLocaleUsedBG!=lastLocaleUsed) {
			lastLocaleUsed = null;
		}
	}
	if (SBExtension.getCurrentLocale() != this.lastLocaleUsed) {
		this.resetLocale();
	}
	return SBExtension.bg.SBExtension.browser.getLocalizedString(name).trim();
}

SBBrowserPopupChrome.prototype.getLocalizedDtdString = function(name) {
	return this.getLocalizedString(name);
}

SBBrowserPopupChrome.prototype.getCurrentLocale = function() {
	return SBExtension.bg.SBExtension.browser.getCurrentLocale();
}

SBBrowserPopupChrome.prototype.isUsingLongLocale = function(name) {
	return false;
}

SBBrowserPopupChrome.prototype.isTranslationRequired = function(suffix) {
	if (!suffix) {
		suffix = "";
	}
	return SBExtension.getCurrentLocale() != this["lastLocaleTranslatedTo"+suffix];
}

SBBrowserPopupChrome.prototype.onTranslationFinished = function(suffix) {
	if (!suffix) {
		suffix = "";
	}
	this["lastLocaleTranslatedTo"+suffix] = SBExtension.getCurrentLocale();
}

SBBrowserPopupChrome.prototype.resetLocale = function(fromInit, callback) {
	SBExtension.bg.SBExtension.browser.resetLocale(fromInit, function() {
		SBExtension.browserPopup.lastLocaleUsed = SBExtension.getCurrentLocale();
		if (callback) {
			callback();
		}
	});
}

SBBrowserPopupChrome.prototype.OpenTutorial = function() {
	SBExtension.bg.SBExtension.actionHandler.OpenTutorial();
}

SBBrowserPopupChrome.prototype.onNewTabSearchClicked = function(isNewTabSearch) {
	this.onSBSearchClicked(isNewTabSearch);
};

SBBrowserPopupChrome.prototype.onSBSearchClicked = function(isSBSearch) {
	SBExtension.bg.SBExtension.browser.setSwagSearch(isSBSearch);
};

SBBrowserPopupChrome.prototype.setInnerHTML = function(divSE, innerHTML) {
	divSE.innerHTML = innerHTML;
};

SBExtension.browserPopup = new SBBrowserPopupChrome(SBExtension.config.sbHostName);

} catch(critErr) {SBExtension.alert_debug("Critical error initializing SBBrowserPopupChrome!", critErr);}

}
