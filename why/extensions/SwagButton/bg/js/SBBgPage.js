// This is the background page of the extension

//window.alert("STARTING SBExtension.BgPage !!!");

SBExtension.BgPage = function() {
	// Returned by the timeout() call -- to check uninstallation of the toolbar...
	this.toCheckTbUID = null;
	// TODO : Once all toolbars are gone - remove the line below as well as reportLiveState() call that it controls
	this.rptLiveDelay = 30000;
	this.timeDifference = 0;
	this.imageFilter = [ 'bmp', 'jpg', 'jpeg', 'png', 'ico', 'gif', 'svg', 'raw', 'psd' ];
};

SBExtension.BgPage.prototype.addTab = function(windowId) {
	//if (windowId > -1){
		SBExtension.browser.executeForSelectedTab(windowId, function(tab) {
			var curTabID = SBExtension.browser.getTabID(tab);
			if (console.log && SBExtension.config.debugIsEnabled)
				console.log(curTabID);
			SBExtension.tabStateHandler.getStateByTabId(curTabID); //tab.id);
		});
	//}
};

SBExtension.BgPage.prototype.onTabActivated = function(activeInfo) {
	// Compare: chrome.tabs.onActivated.addListener(function(activeInfo) {
	var curTabID = SBExtension.browser.getActivatedTabID(activeInfo);
	SBExtension.bgPage.reActivateTabByID(curTabID);
}

SBExtension.BgPage.prototype.reActivateTabByID = function(curTabID) {
	SBExtension.actionHandler.onUserAction("AnimateReActive", curTabID);
};

SBExtension.BgPage.prototype.onTabRemoved = function(tabId, removeInfo) {
	if (SBExtension.browser.onTabRemoved) {
		SBExtension.browser.onTabRemoved(tabId, removeInfo);
	}
	// Compare: chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	var pos = -1;
	var currentPopup = SBExtension.popup.currentPopup;
	if(currentPopup){
		pos = (currentPopup.getMenuPosition) ? currentPopup.getMenuPosition() : -1;
	}
	if (pos!=-1) {
	try{
		for(var i = 0; i < 8; i++){
			var pop = SBExtension.browser.getPopoutByIndex(i); //getPopoutByID(i); //popout[i];
			if(pop && pop.tabs && pop.tabs.length > 0 && pop.tabs[0].id == tabId){
				//popout.splice(i,1);
				SBExtension.popup.popout[i] = null;
				if(i == pos && currentPopup){
					currentPopup.resetFromPopout(pos);
				}
				break;
			}
		}
		for(var pop in SBExtension.popup.popoutsById){
			var p = null;
				try{
					p = SBExtension.popup.popoutsById[pop];
				} catch(e) {
					 p = null;
				}
			if(p && p.tabs && p.tabs.length > 0 && p.tabs[0].id == tabId){
				delete SBExtension.popup.popoutsById[pop.id];
				break;
			}
		}
	} catch(e) {
		SBExtension.alert_debug('tabs_onRemoved: ' + e.message, e);
	}	
	}	
	SBExtension.tabStateHandler.removeTabId(tabId);
};

SBExtension.BgPage.prototype.onTabCreated = function(event) {
	// This method is actually a NO-OP for Chrome, but contains important functionality for Firefox...
	SBExtension.browser.onTabCreated(event);
};

SBExtension.BgPage.prototype.onTabUpdated = function(id, info, tabs) {
	//SBExtension.browser.executeForSelectedTab(null, function(tab) {
	//	if (!tab || (typeof tab.id == "undefined")) {
	//		SBExtension.alert_debug('!!! SBExtension.BgPage.prototype.onTabUpdated : tab = ' + tab);
	//		return;
	//	}
	//	var thisTabID = SBExtension.browser.getTabID(tab); //tab.id;
	//	if (tab.id == thisTabID && SBExtension.tabStateHandler) {
	//		SBExtension.tabStateHandler.getStateByTabId(thisTabID,false,SBExtension.globalState.loginState);
	//	}
	//});
};

/**/

SBExtension.BgPage.prototype.onTabMoved = function(event) {
	// This method is actually a NO-OP for Chrome, but contains important functionality for Firefox...
	SBExtension.browser.onTabMoved(event);
};

SBExtension.BgPage.prototype.onCookiesChanged = function (changeInfo) {
    if (changeInfo.removed && changeInfo.cookie.name == "__urqm") {
        ///*BB*/window.alert("SBExtension.BgPage.prototype.onCookiesChanged!!! __urqm REMOVED => WILL CHECK!!!");
        //SBExtension.globalState.loginState = "0";
        SBExtension.network.checkState(SBExtension.updateController.intervalEvent);
        SBExtension.browser.executeForSelectedTab(null, function (tab) {
            var tbId = SBExtension.browser.getTabID(tab); //this_.getTabID(tab);
            SBExtension.tabStateHandler.getStateByTabId(tbId);
        });
    }
    else {
        if (changeInfo.cookie.name == "SETime") {
            SBExtension.bgPage.timeDifference = changeInfo.cookie.value;
        } else
            if (changeInfo.cookie.name == "SEFinishTutorial") {
                SBExtension.actionHandler.OnTutorialFinished(undefined, undefined, changeInfo.cookie.value);
            } else
            if (changeInfo.cookie.name == "SESwitchTutorialURL") {
                if (changeInfo.cause !== "expired") {
                    SBExtension.actionHandler.OnTutorialUrlSwitched(unescape(changeInfo.cookie.value));
                } else {
                    SBExtension.actionHandler.OnTutorialFinished();
                    delete SBExtension.shouldOpenTutorial;
                }
            } else
            if (changeInfo.cookie.name == "SEUID") {
                var tbid = changeInfo.cookie.value;
                // The call below will ensure we will NEGATE "SSE_TBUID" key value
                SBExtension.store.setTbUID(tbid);
                // The call below will ensure we will spot when the toolbar is removed and act accordingly
                SBExtension.bgPage.checkToolbarPresence();
            } else
                if (changeInfo.cookie.name == "SEUninstallTB") {
                    SBExtension.browser.onUpdatePerformed(changeInfo.cookie.value);
                } else
                    if (changeInfo.cookie.name == "__urqm" && !SBExtension.globalState.loginState) {
                        ///*BB*/window.alert("SBExtension.BgPage.prototype.onCookiesChanged!!! __urqm ADDED => WILL CHECK!!!");
                        var myCheckStateTimeout;
                        var myCheckState = function () {
                            clearTimeout(myCheckStateTimeout);
                            if (SBExtension.globalState.loginState) {
                                return;
                            }
                            if (!SBExtension.initialized) {
                                myCheckStateTimeout = window.setTimeout(function(){myCheckState()}, 250);
                                return;
                            }
                            SBExtension.network.checkState(SBExtension.updateController.intervalEvent);
                            SBExtension.browser.executeForSelectedTab(null, function (tab) {
                                var tbId = SBExtension.browser.getTabID(tab); //this_.getTabID(tab);
                                SBExtension.tabStateHandler.getStateByTabId(tbId);
                            });
                        };
                        myCheckStateTimeout = window.setTimeout(myCheckState, 250);
                    }
    }
};

/**/
SBExtension.BgPage.prototype.doCheckToolbarPresence = function() {
	//window.alert("In SBExtension.BgPage.prototype.doCheckToolbarPresence");
	if (! SBExtension.browser.isMaster())
		return;
	var tbUID = SBExtension.store.getTbUID();
	if (tbUID < 0) {
		// When toolbar is alive, it is sending us "SEUID" message every minue.
		// So, if we ever received UID from toolbar, but then haven't received "SEUID" message for 5 min, then the toolbar is gone and we will generate a new TBUID
		SBExtension.store.setForceTbUID();
		// 2 events will be sent with flag 16 IN A ROW -- for old TBUID and for new one - so we know what was uninstalled and what was installed...
		new SBExtension.Stats().getState().checkState(tbUID)
	}
};

SBExtension.BgPage.prototype.checkToolbarPresence = function() {
	clearTimeout(this.toCheckTbUID);
	var this_ = this;
	// Repeat the check every 5 minutes - in case the toolbar is [suddenly] installed/uninstalled - e.g., manually
	this.toCheckTbUID = setTimeout(
		function() {
			this_.doCheckToolbarPresence()
		}, 60000 * 5);
};

// EVENT LISTENER
// - Handles messages from extension front-end (Injected Content).
SBExtension.BgPage.prototype.onMessage = function(request, sender, responseCallback) {
	///*BB*/window.alert("SBExtension.BgPage.prototype.onMessage: responseCallback = " + responseCallback);
	SBExtension.actionHandler.onUserAction(request.name, request.tabId, request, sender, responseCallback);
};

SBExtension.BgPage.prototype.reportLiveState = function(callback) {
  try {
  	SBExtension.alert_debug('!!! SBExtension.BgPage.prototype.reportLiveState - STARTED!!! SBExtension.tabStateHandler = ' + SBExtension.tabStateHandler);
  	//window.alert('!!! SBExtension.BgPage.prototype.reportLiveState - STARTED!!! SBExtension.initializedForReporting=' + SBExtension.initializedForReporting + '; SBExtension.tabStateHandler = ' + SBExtension.tabStateHandler);
	if (! SBExtension.initializedForReporting) {
		return;
	}
	if(SBExtension.tabStateHandler){
		var this_ = this;
		SBExtension.tabStateHandler.reportLiveState(
			function(cookie) {
				SBExtension.store.storeGlobalKey("SE_LAST_MERCHANT_COUNT", SBExtension.tabStateHandler.merchantCount);
				SBExtension.store.storeGlobalKey("SE_LAST_MERCHANT_ASSIGN_TS", SBExtension.tabStateHandler.lastMerchantAssigned);
				this_.storeSEVersionInfo();
				if (callback) {
					callback(cookie);
				}
		});
	} else {
		this.storeSEVersionInfo();
	}
  } catch(err) {
  	SBExtension.alert_debug('!!! SBExtension.BgPage.prototype.reportLiveState - Error: ' + err);
  }
};

SBExtension.BgPage.prototype.storeSEVersionInfo = function() {
	try {
		var this_ = this;
		this.getSEVersionInfo(function(curVersion){
			this_.doStoreSEVersionInfo(curVersion);
		});
	} catch(err) {
		SBExtension.alert_debug('storeSEVersionInfo - Error: ' + err);
	}
};

SBExtension.BgPage.prototype.doStoreSEVersionInfo = function(curVersion) {
	try {
		SBExtension.alert_debug('doStoreSEVersionInfo - CALLED; curVersion : ' + curVersion + "; SBExtension.browser.curVersionID = " + SBExtension.browser.curVersionID);
		var currentVersionID = SBExtension.store.retrieveGlobalKey("SSE_LAST_VERSION_ID");
		if (SBExtension.browser.curVersionID  && SBExtension.browser.curVersionID < currentVersionID) {
			// Refuse to store this (obsolete) version info -- could be caused by multiple windows with one window unaware of the version update yet...
			return;
		}
		var curVersionID = SBExtension.browser.curVersionID;
		SBExtension.store.storeGlobalKey("SSE_LAST_VERSION_ID", curVersionID);
		SBExtension.store.storeGlobalKey("SSE_UPDATE_URL", SBExtension.browser.curUpdateURL);
	} catch(err) {
		SBExtension.alert_debug('doStoreSEVersionInfo - Error: ' + err);
	}
};

SBExtension.BgPage.prototype.getSEVersionInfo = function(callback) {
  try {
	SBExtension.browser.curVersionID = SBExtension.store.retrieveGlobalKey("SSE_LAST_VERSION_ID");
	SBExtension.browser.curUpdateURL = SBExtension.store.retrieveGlobalKey("SSE_UPDATE_URL");
	if (!SBExtension.browser.curUpdateURL)
		SBExtension.browser.curUpdateURL = "";
	SBExtension.browser.getSEVersionInfo( function(curVersion) {
		SBExtension.browser.checkVersionNumber();
		if (callback)
			callback(curVersion);
	});
	return SBExtension.browser.curVersionID;
  } catch(err) {
  	SBExtension.alert_debug("!!! ERROR in SBExtension.BgPage.prototype.getSEVersionInfo: SBExtension.browser.curVersionID=" + SBExtension.browser.curVersionID, err);
	if (callback)
		callback(SBExtension.browser.curVersionID);
	return SBExtension.browser.curVersionID;
  }
};

/**/

SBExtension.BgPage.prototype.onWebRequestCompleted = function(details, req) {
  try {
	if (!details.type || 0 <= [ 'unknown', 'sub_frame', 'main_frame', 'xmlhttprequest', 'image' ].indexOf( details.type ) ) {
	    req = SBExtension.browser.getRequestUponCompletion(details, req);
		// Image - Filtering Out...
		if (req.startURL) {
			var blocks = req.startURL.split('.');
			if (details.type == 'image' && SBExtension.bgPage.imageFilter.indexOf(blocks[blocks.length - 1] >= 0)) {
				var req = SBExtension.tabStateHandler.getRequest(details.requestId);
				if (req) {
					req.remove();
				}
				return;
			}
		}

		var finalURL = details.url;
		if (finalURL == req.startURL) {
		    var reqRedirect = req.redirect;
		    if (reqRedirect && reqRedirect.length)
		        finalURL = reqRedirect[reqRedirect.length - 1];
		}
		
		var domain = SBExtension.tabStateHandler.getDomainname(finalURL);
		    if (domain == "conduit.com") {
		        return;
		}


		req.finalURLdomain = domain;
		req.finalURLhost = SBExtension.tabStateHandler.getHostname(finalURL);
		req.finalURL = finalURL;

		SBExtension.browser.saveRequestUponCompletion(req);

		SBExtension.tabStateHandler.calculateState(req);

		// Next line - to test merchants when in the testing mode...
		if(details.type == 'main_frame' && SBExtension.MTester!==undefined && SBExtension.MTester.isTestEnabled()) {
			SBExtension.MTester.callback(req);
		}
		SBExtension.browser.finalizeRequestUponCompletion(req);
	} else {
		var req = SBExtension.tabStateHandler.getRequest(details.requestId);
		if (req) {
			req.remove();
		}
	}
  } catch(err) {
  	SBExtension.alert_debug("!!! ERROR in SBExtension.BgPage.prototype.onWebRequestCompleted: details = " + JSON.stringify(details), err);
  }
};

SBExtension.BgPage.prototype.onWebRequestErrorOccurred = function(details) {
	if(!details.type || details.type == 'unknown' || details.type == 'sub_frame' || details.type == 'main_frame' || details.type == 'xmlhttprequest'){
		var req = SBExtension.tabStateHandler.getRequest(details.requestId);
		if (req) {
		    if (details.altTabId && !req.altTabId) {
		        req.altTabId = details.altTabId;
		    }
			if (details.type == 'sub_frame' && details.error == "net::ERR_ABORTED" && details.tabId) {
				var tab = SBExtension.tabStateHandler.getTabByTabId(req.tabId);
				if (tab && tab.merchantID) {
					var domObj = SBExtension.tabStateHandler.getObjectByHost(tab.domain, tab.url, tab, tab.host, tab.matchedBy);
					// TODO : getFrame requires processId but it is only available on experimental channel... Mocve to chrome browser and use a different API (getAllFrames) if we want to be sure about the origin of the request...
					//var frame;
					//chrome.webNavigation.getFrame({tabId:details.tabId, frameId:details.frameId}, function(details) {frame = details;})
					if (domObj.state=="2"  &&  req.startURL && req.startURL.indexOf("/shopredir?merchant="+tab.merchantID)>=0) { // && frame && frame.url && frame.url.indexOf("/shopredir?merchant="+tab.merchantID)>=0) {
						var req = SBExtension.browser.getRequestUponCompletion(details);
						var domain =  SBExtension.tabStateHandler.getDomainname(details.url);
						req.finalURLdomain = domain;
						req.finalURLhost = SBExtension.tabStateHandler.getHostname(details.url);
						req.finalURL = details.url;
						SBExtension.browser.saveRequestUponCompletion(req);
						SBExtension.tabStateHandler.calculateState(req);
						SBExtension.browser.finalizeRequestUponCompletion(req);
						return;
					}
				}
			}
			req.remove();
		}
	} else {
		var req = SBExtension.tabStateHandler.getRequest(details.requestId);
		if (req) {
			req.remove();
		}
	}
};

/**/
SBExtension.BgPage.prototype.checkTBRequestCancel = function(details) {
	var tabId = details.tabId;
	var url = details.url;
	var position = url.indexOf("tbf-id.png&instanceID=");
	if (position > -1) {
		SBExtension.browser.checkExtensionUpdate(url);
		var tab = SBExtension.tabStateHandler.getTabByTabId(tabId, "");
		if(tab){
			tab.instanceID = url.split('=')[2];
			tab.save();
			SBExtension.tabStateHandler.getStateByTabId(tab.tabId);
		}
		return {cancel:true};
	} else {
		position = url.indexOf("null.swagbucks.com/?cmd=UninstallExtn");
		if (position > -1  &&  SBExtension.browser.uninstallConduitToolbar) {
			SBExtension.browser.uninstallConduitToolbar();
			return {};
		}
	}
	var testURL = details.url.indexOf("tbf-test-url-mid.png&mID=");
	if (testURL > -1) {
		if(SBExtension.MTester===undefined || !SBExtension.MTester.isTestEnabled()) {
			return;
		}
		var testId = details.url.split('mID=')[1];
		setTimeout(function() {
			SBExtension.MTester.startTest(testId, details.tabId);
		});
		return {};
	}
}

SBExtension.BgPage.prototype.onBeforeWebRequest = function(details) {
	var cancelledTBRequest = SBExtension.bgPage.checkTBRequestCancel(details);
	if (cancelledTBRequest) {
		return cancelledTBRequest;
	}
	SBExtension.browser.onBeforeWebRequest(details);
};

SBExtension.BgPage.prototype.onBeforeNavigate = function(details) {
	SBExtension.tabStateHandler.getNewTab(details.tabId, details.url, details.frameId);
};

SBExtension.BgPage.prototype.onBeforeRedirect = function(details, req) {
	SBExtension.tabStateHandler.setAffToTab(details.tabId, details.redirectUrl);
	if (!req) {
	    req = SBExtension.tabStateHandler.getRequest(details.requestId);
	    if (details.altTabId && !req.altTabId) {
	        req.altTabId = details.altTabId;
	    }
	}
	if (!req) {
		return;
	}
	if(!details.type || details.type == 'unknown' || details.type == 'sub_frame' || details.type == 'main_frame' || details.type == 'xmlhttprequest' || details.type == 'image'){
		req.addRedirect(details.redirectUrl);
	}
};

SBExtension.BgPage.prototype.getServerDate = function() {
	var o = new Date();
	var severTime = o.getTime() + this.timeDifference * 1;
	return new Date(severTime);
}
/**/

//window.alert("BEFORE SBExtension.BgPage.prototype.init !!!");

/**/
SBExtension.BgPage.prototype.init = function(callback) {
  try {
	delete SBExtension.merchantsReloadInProgress;
	delete SBExtension.totalMerchantsReloadInProgress;
	if (SBExtension.browser.isUpdateWithoutRestartSupported()) {
		SBExtension.browser.executeForSelectedTab(null, function(tab) {
			if (!tab) {
				return;
			}
			var tabId = SBExtension.browser.getTabID(tab);
			var tabURL = (tab.url) ? tab.url : SBExtension.browser.getUrlByTabID(tabId);
			if (tabURL && tabURL.indexOf(SBExtension.config.sbDomainName+"/extension")>0) {
				SBExtension.browser.reloadCurrentTab();
			}
		});
	}
	SBExtension.browser.getSEVersionInfo(function(curVersion){
		SBExtension.alert_debug("!!! SBExtension.BgPage.prototype.init INSIDE CALLBACK; curVersion = " + curVersion);
		SBExtension.bgPage.doInit(curVersion);
		if (SBExtension.browser.initLocales) {
			SBExtension.browser.initLocales(callback);
		} else {
			if (callback) {
				callback();
			}
		}
	});
  } catch(err) {
        SBExtension.alert_debug("!!!!! ERROR IN SBExtension.BgPage.prototype.init !!!!!", err);
  }
}

SBExtension.BgPage.prototype.onBeforeUninstall = function() {
	var newStateRecord = SBExtension.network.getStateToSend(512);
	if (SBExtension.browser.confirmUninstall) {
		var uninstallConfirmed = SBExtension.browser.confirmUninstall();
		if (!uninstallConfirmed) {
			// Would be nice to stop uninstall, but Firefox cannot do it...
		}
	}
	SBExtension.network.reportExtnStateChange(newStateRecord);
}

SBExtension.BgPage.prototype.onBeforeDisable = function() {
	var newStateRecord = SBExtension.network.getStateToSend(256);
	SBExtension.network.reportExtnStateChange(newStateRecord);
}

SBExtension.BgPage.prototype.doInit = function (curVersion) {
    //window.alert("STARTING SBExtension.BgPage.prototype.doInit");
    try {
        // (WINDOW) FOCUS LISTENER
        SBExtension.browser.addOnFocusChangedListener(function () { this.onFocusChanged; });

        // MESSAGE LISTENERS
        SBExtension.browser.addOnMessageListener(this.onMessage);

        // TAB LISTENERS
        SBExtension.browser.addOnTabActivatedListener(this.onTabActivated);
        //window.alert("INSIDE SBExtension.BgPage.prototype.doInit - BEFORE addOnTabCreatedListener");
        SBExtension.browser.addOnTabCreatedListener(this.onTabCreated);
        SBExtension.browser.addOnTabRemovedListener(this.onTabRemoved);
        SBExtension.browser.addOnTabMovedListener(this.onTabMoved);
        SBExtension.browser.addOnTabUpdatedListener(this.onTabUpdated);

        // COOKIE LISTENERS
        SBExtension.browser.addOnCookiesChangedListener(this.onCookiesChanged);

        // We will start checkToolbarPresence() after toolbar is uninstalled, but if the browser is killed before 5 minutes is over, we need to make sure we start checking again upon restart...
        //SBExtension.alert_debug('BEFORE checkToolbarPresence !!!');

        this.checkToolbarPresence();

        //SBExtension.alert_debug('AFTER checkToolbarPresence !!!');

        // WEB REQUESTS
        SBExtension.browser.addOnBeforeRequestListener(this.onBeforeWebRequest);
        SBExtension.browser.addOnBeforeNavigateListener(this.onBeforeNavigate);
        SBExtension.browser.addOnBeforeRedirectListener(this.onBeforeRedirect);
        SBExtension.browser.addOnCompletedRequestListener(this.onWebRequestCompleted);
        SBExtension.browser.addOnRequestErrorOccurredListener(this.onWebRequestErrorOccurred);

        //SBExtension.alert_debug('BEFORE setInterval !!!');

        // UNINSTALL/DISABLE LISTENERS
        SBExtension.browser.addOnBeforeUninstallListener(this.onBeforeUninstall);
        SBExtension.browser.addOnBeforeDisableListener(this.onBeforeDisable);

        //debugger;
        SBExtension.updateController.createDesktopNotification();

	SBExtension.tabStateHandler.setMerchants(false, null);

        SBExtension.initializedForReporting = true;

        var isNewTabSearch = SBExtension.isNewTabPageSetToSB();
        var isSBSearch = SBExtension.isSearchSetToSB();
        SBExtension.loadSettings(false, isNewTabSearch, isSBSearch);

        var this_ = this;
        setInterval(function () {
            this_.reportLiveState();
        }, this.rptLiveDelay);

        var shouldOpenTutorial = false;
        var tutorialWasOpened = SBExtension.browser.wasTutorialOpened();
        var tbUID = SBExtension.store.getTbUID();
        if (!tutorialWasOpened) {
            if (SBExtension.store.lastTbUIDModifiedInSession) {
                SBExtension.store.lastTbUIDModified = false;
                if (SBExtension.browser.setHomeToSwagbucks) {
                    if (SBExtension.popupUI && SBExtension.popupUI[SBExtension.POPUP_ID_SETTING]) {
                        SBExtension.popupUI[SBExtension.POPUP_ID_SETTING].initSetting(undefined, true, true, true);
                    } else {
                        SBExtension.loadSettings(false, true, true, true);
                    }
                    SBExtension.browser.setHomeToSwagbucks(true);
                }
                shouldOpenTutorial = {newInstall:true};
            }
            var firstPageLoaded = true; //SBExtension.store.retrieveGlobalKey("SSE_FIRST_PAGE_LOADED");
            if (SBExtension.store.firstPageLoadAfterInstallBeforeInit || SBExtension.browser.noSettingsInSession) {
                firstPageLoaded = false;
                if (!shouldOpenTutorial) {
                    shouldOpenTutorial = {newInstall:false};
                }
            }
        }
        SBExtension.initializedForTutorial = true;
        delete SBExtension.store.firstPageLoadAfterInstallBeforeInit;
        SBExtension.shouldOpenTutorial = shouldOpenTutorial;
        this_.reportLiveState(SBExtension.bgPage.reportLiveStateInitializedTimeout());

        if (SBExtension.isSearchEngineKnown()) {
            SBExtension.config.isNewTabSearch = SBExtension.isNewTabPageSetToSB() && SBExtension.isHomePageSetToSB();
            SBExtension.config.isSBSearch = SBExtension.isSearchSetToSB();
        }

        SBExtension.loadSettings();

        if (SBExtension.browser.isMainWindow) {
            var curSettings = SBExtension.browser.getSettings();
            if (curSettings && curSettings.isNewTabSearch) {
                SBExtension.browser.setNewTabHomepage();
            }
        }

        if (shouldOpenTutorial && (shouldOpenTutorial.newInstall || !firstPageLoaded)) {
            setTimeout(function() {
                SBExtension.store.storeGlobalKey('SETutorialStarted', 'true');
                SBExtension.browser.setTutorialOpened();
                SBExtension.actionHandler.OpenTutorial();
            }, 500);
        }

        //SBExtension.initialized = true;

        SBExtension.alert_debug('AFTER setInterval !!!');
    } catch (err) {
        SBExtension.alert_debug("!!!!! ERROR IN SBExtension.BgPage.prototype.init !!!!!", err);
    }
};

SBExtension.BgPage.prototype.reportLiveStateInitializedTimeout = function () {
	setTimeout(function () {
		SBExtension.bgPage.reportLiveStateInitialized();
	}, 500);
};

SBExtension.BgPage.prototype.reportLiveStateInitialized = function () {
	SBExtension.updateController.initEventModel();
	SBExtension.initialized = true;
	if (SBExtension.browser.seqNumber) {
		SBExtension.store.storeGlobalKey("popUpSE_BrowserInitialized" + SBExtension.browser.seqNumber, true);
	}
	if (SBExtension.browser.setUninstallURL) {
		SBExtension.browser.setUninstallURL();
	}
	SBExtension.browser.startHeartbeatChecker();
};

SBExtension.bgPage = new SBExtension.BgPage();

//window.addEventListener("load", function() {
//	SBExtension.browser.onWindowLoad();
//}, true);

//SBExtension.bgPage.init();
/**/

