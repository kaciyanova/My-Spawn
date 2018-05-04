// Handling Various Click/Navigation Actions and visual effects from them (blinking etc.)

/*USER ACTION*/
SBExtension.ActionHandler = function() {
	this.curMsgID = 0;
	this.actionTransition = "TBClick";
};

SBExtension.ActionHandler.prototype.onUserAction = function(eventName, tabId, request, sender, callBack){
  try {
	if (SBExtension.globalState.loginState == "0"  ||  SBExtension.isCriticalUpdateAvailable()) {
		this.onLogoutIcon(tabId);
		if (eventName.indexOf("Animate")==0 || eventName=="BlinkIcon") {
			return;
		}
	}
	switch(eventName){
		case "SEClickBtn":
			this.onSEClickBtn(tabId);
			break;
		case "DocumentComplete":
			this.onDocumentComplete(request, sender, callBack);
			break;
		case "AnimateTrans":
			this.onAnimateIcon(tabId, (request) ? request.param : null);
			break;
		case "AnimateTransActive":
			// Ensure popup icon shows orange notification dot...
			this.onAnimateActiveIcon(tabId);
			break;
		case "AnimateTransActiveM":
			this.onAnimateActiveMIcon(tabId, (request) ? request.param : null);
			break;	
		case "AnimateTransNonActive":
			this.onAnimateTransNonActive(tabId);
			break;
		case "AnimateEmpty":
			this.onAnimateEmpty(tabId);
			break;
		case "AnimateMerchant":
			this.onAnimateMerchant(tabId, (request) ? request.param : null);
			break; 
		case "AnimateReActive":
			this.AnimateReActive(tabId, (request) ? request.param : null);
			break;
		case "BlinkIcon":
			this.onBlinkIcon();
			break; 
		case "UninstallExtn":
			SBExtension.browser.onUpdatePerformed("_NOW_");
			break; 
		case "CheckMerchants":
			this.onCheckMerchants(request.param, callBack);
			break;
		case "StoreClear":
			SBExtension.store.getLocalStorage().clear();
			break;
		case "StoreGet":
			var value = SBExtension.store.getLocalStorage().getItem(request.param);
			callBack(value);
			break;
		case "StoreRemove":
			var res = SBExtension.store.getLocalStorage().removeItem(request.param.key, request.param.deleting);
			if (callBack)
				callBack(res);
			break;
		case "StoreSet":
			SBExtension.store.getLocalStorage().setItem(request.param.key, request.param.value);
			break;
		case "GetAvailableLocales":
			var res = SBExtension.browser.availableLocales;
			if (callBack)
				callBack(res);
			break;
		case "GetVersion":
			var res = SBExtension.browser.getVersion(function(res) {
				if (callBack)
					callBack(res);
			});
			break;
		case "SpecialStatistics":
			this.SpecialStatistics(tabId, request.param);
			break;
		case "ChangeState":
			this.OnChangeState(tabId, request.param);
			break;
		case "DefaultSBBtnSearch":
			this.onDefaultSBBtnSearch(tabId, request.param);
			break;
		case "OpenTutorial":
			SBExtension.store.storeGlobalKey('SETutorialStarted', 'true');
			this.OpenTutorial();
			break;
		case "TutorialFinished":
			this.OnTutorialFinished();
			break;
		case "TutorialUrlSwitched":
			this.OnTutorialUrlSwitched(request.param);
			break;
		case "CheckSurveyNotification":
			this.onCheckSurveyNotification(request.param, tabId);
			break;
		case "CheckSurveyValidity":
			this.onCheckSurveyValidity(request.param, tabId);
			break;
		case "CheckFulcrumSurveyValidity":
			this.onCheckFulcrumSurveyValidity(request.param, tabId);
			break;
		case "ResetLocale":
			this.onResetLocale(request.param, callBack);
			break;
	}
  } catch(err) {
  	SBExtension.alert_debug("ERROR in ActionHandler.onUserAction: err=" + err, err);
  }
};

SBExtension.ActionHandler.prototype.SpecialStatistics = function(tabId, request){
	var memberID = SBExtension.network.memberInfo.memberID;
	if (SBExtension.globalState.loginState == "0" || memberID <= 0) {
		return;
	}
	
	var obj = SBExtension.store.retrieveGlobalKey("SpecialStatusSE");
	if (!obj) { obj = {}; }
	if (!obj[memberID]) { obj[memberID] = {}; }
	if (!obj[memberID][request.domain]) { obj[memberID][request.domain] = {}; }
	if (!obj[memberID][request.domain][request.mId]) { obj[memberID][request.domain][request.mId] = { 'clickCount':0, 'imprCount':0 }; }
	if (request.isClick) {
		obj[memberID][request.domain][request.mId]['clickCount']++;
	} else {
		obj[memberID][request.domain][request.mId]['imprCount']++;
	}
	
	SBExtension.store.storeGlobalKey("SpecialStatusSE", obj);
};

SBExtension.ActionHandler.prototype.onWindowMessageEvent = function(e){
	//window.alert("actionHandler.prototype.onWindowMessageEvent: " + JSON.stringify(e));
};

SBExtension.ActionHandler.prototype.onDefaultSBBtnSearch = function(tabId, defaultParams){
	if (SBExtension.browser.setHomeToSwagbucks) {
		SBExtension.config.isSBSearch = true;
		SBExtension.setSettings();
	}
};

SBExtension.ActionHandler.prototype.onSEClickBtn = function(tabId){
	var tab = SBExtension.tabStateHandler.getTabByTabId(tabId, "");
	if(!tab){
		return;
	}
	var obj = SBExtension.tabStateHandler.getObjectByHost(tab.domain, tab.url, tab, tab.host,tab.matchedBy);
	switch(obj.state + ''){
		case '1':
			this.clickRedBtn(tabId);
			break;
		case '2':
			this.clickBlueBtn(tabId);
			break;
		case '5':
			this.clickPreGreenTransition(tabId);
			break;
		case '7':
			this.clickGreenBtn(tabId);
			break;
	}
};

SBExtension.ActionHandler.prototype.clickRedBtn = function(tabId){ // TRANSITION FROM RED STATE
	var click = {};
	click.name = this.actionTransition;
	click.state = SBExtension.tabStateHandler.getClickStateByTabId(tabId);
	click.mID = SBExtension.tabStateHandler.getMid(tabId);
	click.startUrl = SBExtension.tabStateHandler.getStartUrl(tabId);
	click.mUrl = SBExtension.tabStateHandler.getMUrl(tabId);
	click.tabId = tabId;
	var isAff = SBExtension.tabStateHandler.getClickAffByTabId(tabId);
	var stateObj = new SBExtension.MerchantStats().getState();
	stateObj.addActivation(click.state, null, isAff, null, null, null, click.mID, click.startUrl);
	if (click.mID){
		SBExtension.browser.tabsSendMessage(parseInt(tabId), click);
	}
	SBExtension.tabStateHandler.getStateByTabId(tabId,false,SBExtension.globalState.loginState);
	SBExtension.tabStateHandler.getStateByTabId(tabId);
};

SBExtension.ActionHandler.prototype.clickBlueBtn = function(tabId){ // TRANSITION FROM BLUE STATE
	var click = {};
	click.name = this.actionTransition;
	click.state = SBExtension.tabStateHandler.getClickStateByTabId(tabId);
	click.mID = SBExtension.tabStateHandler.getMid(tabId);
	click.mUrl = SBExtension.tabStateHandler.getMUrl(tabId);
	click.startUrl = SBExtension.tabStateHandler.getStartUrl(tabId);
	var stateObj = new SBExtension.MerchantStats().getState();
	click.memberID = stateObj.mID;
	click.currDate = stateObj.currDate;
	click.tabId = tabId;
	if (click.mID){
		var merchant = SBExtension.tabStateHandler.merchantsByID[click.mID];
		if (merchant.checkURL=="#NOIFRAME#") {
			click.forcingNonIframe = true;
		}
		var curDoc = (SBExtension.browser.getDocumentByTabID) ? SBExtension.browser.getDocumentByTabID(tabId) : undefined;
		var restore = SBExtension.tabStateHandler.getClickRestoreByTabId(tabId);
		var stateStroe = 2;
		if(restore == 1 && click.state==2){
			stateStroe = -2;
			click.state = -2;
		}
		// The code below is here to ensure that we remember the YELLOW->GREEN state transition started - BEFORE "red" affiliates take over...
		if (SBExtension.config.forcingNonIFrameActivation) {
			SBExtension.browser.tabsSendMessage(parseInt(tabId), click);
		} else {
			SBExtension.browser.tabsSendMessageCheckingForAdBlock(tabId, click, false, curDoc);
		}
		
		var tabObj = SBExtension.tabStateHandler.getTabByTabId(tabId, "");
		if (tabObj && tabObj.host) {
			var mer = stateObj.activation[tabObj.host];
			if(mer){
				var data = mer[state];
				if(data){
					click.count = data.count;
					click.redCount = data.redCount;
				}
			}
			tabObj.forceGreenState = true;
			tabObj.referrer = undefined;
			tabObj.saveInStore();
			SBExtension.tabStateHandler.getStateByTabId(tabId, false, SBExtension.globalState.loginState, undefined, curDoc, click);
		}
	}
};

SBExtension.ActionHandler.prototype.clickPreGreenTransition = function(tabId){ // PRE TRANSITION GREEN STATE
	var click = {};
	click.name = "TBPresence";
	click.tabId = tabId;
	SBExtension.browser.tabsSendMessage(parseInt(tabId), click);
	var stateObj = new SBExtension.MerchantStats().getState();
	var click = {};
	click.name = this.actionTransition;
	click.memberID = stateObj.mID;
	click.currDate = stateObj.currDate;
	click.state = SBExtension.tabStateHandler.getClickStateByTabId(tabId);
	click.startUrl = SBExtension.tabStateHandler.getStartUrl(tabId);
	click.mUrl = SBExtension.tabStateHandler.getMUrl(tabId);
	click.tabId = tabId;
	var tabObj = SBExtension.tabStateHandler.getTabByTabId(tabId, "");
	if(tabObj.merchantID){
		click.mID = tabObj.merchantID;
	}else{
		click.mID = SBExtension.tabStateHandler.getMid(tabId);
	}
	
	var curMsgID = ++this.curMsgID;
	
	var obj = SBExtension.tabStateHandler.getObjectByHost(tabObj.host,tabObj.url);
	if (click.state == 5){
		var merchant = SBExtension.tabStateHandler.merchantsByID[click.mID];
		if (merchant.checkURL=="#NOIFRAME#") {
			click.forcingNonIframe = true;
		}
		var curDoc = (SBExtension.browser.getDocumentByTabID) ? SBExtension.browser.getDocumentByTabID(tabId) : undefined;
		obj.cookie = true;
		obj.save();
		var restore = SBExtension.tabStateHandler.getClickRestoreByTabId(tabId);
		stateObj.addActivation(click.state, 7, null, null, restore, null, click.mID, null);
		
		// The code below is here to ensure that we remember the YELLOW->GREEN state transition started - BEFORE "red" affiliates take over...
		if (tabObj && tabObj.host) {
				var mer = stateObj.activation[tabObj.host];
				if(mer){
					var data = mer[click.state];
					if(data){
						click.count = data.count;
						click.redCount = data.redCount;
					}
				}
			SBExtension.tabStateHandler.getStateByTabId(tabId, undefined, undefined, curMsgID, curDoc, click);
		}
		if (SBExtension.config.forcingNonIFrameActivation) {
			SBExtension.browser.tabsSendMessage(parseInt(tabId), click);
		} else {
			SBExtension.browser.tabsSendMessageCheckingForAdBlock(tabId, click, false, curDoc);
		}
	}
};

SBExtension.ActionHandler.prototype.clickGreenBtn = function(tabId){ // CLICK GREEN BUTTON
	var click = {};
	click.name = this.actionTransition;
	click.state = SBExtension.tabStateHandler.getClickStateByTabId(tabId);
	click.tabId = tabId;
	SBExtension.browser.tabsSendMessage(parseInt(tabId), click);
	// The code below is here to ensure that we remember the YELLOW->GREEN state transition started - BEFORE "red" affiliates take over...
	var tabObj = SBExtension.tabStateHandler.getTabByTabId(tabId, "");
	if (tabObj && tabObj.host) {
		SBExtension.tabStateHandler.getStateByTabId(tabId,false,SBExtension.globalState.loginState);
		SBExtension.tabStateHandler.getStateByTabId(tabId);
	}
	SBExtension.popup.openPopUP(tabId, 'popup.html');
};

SBExtension.ActionHandler.prototype.onDocumentComplete = function(request, sender, callback){
	if (request.name == "DocumentComplete") {
		var senderTab = sender.tab;
		var tabId;
		var tabUrl;
		if (senderTab) {
			tabId = senderTab.id;
			tabUrl = senderTab.url;
			SBExtension.Encrave.handleEncravePageLoad(request, tabId, callback);
		}
		if (!senderTab || request.url != tabUrl || !request.isTop) { // this is correct logic!!!
			return;
		}
		SBExtension.tabStateHandler.setTabToObj(tabId, tabUrl);
		var tab = SBExtension.tabStateHandler.getTabByTabId(tabId, "");
		if(tab){
			tab.initialization = true;
			tab.saveInStore();
		}
		
		SBExtension.bannerComponent.checkSpecialCases(tabUrl, tab);
		SBExtension.bannerComponent.checkBannerCategory(tabUrl, tab);
		SBExtension.popupComponent.checkSearchPopup(tabUrl, tab);
		
		SBExtension.tabStateHandler.getStateByTabId(tabId);
	}
};

SBExtension.ActionHandler.prototype.executeForSelectedTab = function(callback) {
	try {
		SBExtension.browser.executeForSelectedTab(null, function(tab) {
			callback(tab);
		});
	} catch (err) {
		callback(null);
	}
}

SBExtension.ActionHandler.prototype.setPopupIcon = function(iconName, intermediateStep) {
	SBExtension.browser.setPopupIcon(iconName);
	if (intermediateStep || iconName=="sb_logged_out.png" || !SBExtension.isCriticalUpdateAvailable()) {
		// Nothing extra to do...
		return;
	}
	setTimeout(function() {
		// Wait a bit, then - set the icon to the "disable state"...
		this.executeForSelectedTab(function(tab) {
			SBExtension.browser.setPopupIcon("sb_logged_out.png");
		});
	}, 1000);
};

SBExtension.ActionHandler.prototype.onAnimateEmpty = function(tabId){ 
	this.executeForSelectedTab(function(tab) {
		var tbId = (tab) ? SBExtension.browser.getTabID(tab) : 0;
		if (tab && tbId != tabId){
			return;
		}
		SBExtension.actionHandler.setPopupIcon("sb.png");
	});
};

SBExtension.ActionHandler.prototype.AnimateReActive = function(curTabID, hostState) {
	var isActive = false;
	SBExtension.tabStateHandler.getStateByTabId(curTabID, true);
	var isActive = SBExtension.store.isActiveNotificationState();
	var mid = SBExtension.tabStateHandler.getMid(curTabID);
	if (mid > 0) {
		var curMerState = hostState;
		if (!curMerState) {
			curMerState = -1;
			var tab = SBExtension.tabStateHandler.getTabByTabId(curTabID, "");
			if (tab && tab.host) {
				var domObj = SBExtension.tabStateHandler.getObjectByHost(tab.domain, tab.url, tab, tab.host, tab.matchedBy);
				curMerState = parseInt(domObj.state);
			}
		}
		if (curMerState < 2) {
			var merchant = SBExtension.tabStateHandler.getMerchantByID(mid);
			if (!merchant || parseInt(merchant.aFlag)>parseInt(curMerState)) {
				mid = 0;
			}
		}
	}
	if (mid > 0) {
		if (isActive) {
			SBExtension.actionHandler.onUserAction("AnimateTransActiveM", curTabID, {param: mid});
		} else {
			SBExtension.actionHandler.onUserAction("AnimateMerchant", curTabID, {param: mid});
		}
		
	} else {
		if (isActive) {
			SBExtension.actionHandler.onUserAction("AnimateTransActive", curTabID);
		} else {
			SBExtension.actionHandler.onUserAction("AnimateEmpty", curTabID);
		}
	}
};

SBExtension.ActionHandler.prototype.onAnimateMerchant = function(tabId, merID){ 
	this.executeForSelectedTab(function(tab) {
		var tbId = (tab) ? SBExtension.browser.getTabID(tab) : 0;
		if (tab && tbId != tabId){
			return;
		}
		var flagActivate = (merID) ? SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixActivate + merID) : false;
		if (SBExtension.browser.doBlinkIcon) {
			SBExtension.actionHandler.setPopupIcon("sb1.png");
		} else {
			SBExtension.actionHandler.setPopupIcon((flagActivate && flagActivate!="0") ? "sb_activated_m.png" : (merID? "sb1.png" : "sb.png"));
		}
	});
};

SBExtension.ActionHandler.prototype.onAnimateIcon = function(tabId, merID) {
	var this_ = this;
	this.executeForSelectedTab(function(tab) {
		var tbId = (tab) ? SBExtension.browser.getTabID(tab) : 0;
		if (tab && tbId != tabId) {
			return;
		}
		var isActive = SBExtension.store.isActiveNotificationState();
		this_.doBlinkIcon(0, isActive, merID, 11);
	});
};

SBExtension.ActionHandler.prototype.onAnimateActiveIcon = function(tabId) {
	this.executeForSelectedTab(function(tab) {
		var tbId = (tab) ? SBExtension.browser.getTabID(tab) : 0;
		if (tab && tbId != tabId) {
			return;
		}
		SBExtension.actionHandler.setPopupIcon("sb_active.png");
	});
};

SBExtension.ActionHandler.prototype.onAnimateActiveMIcon = function(tabId, merID) {
	this.executeForSelectedTab(function(tab) {
		var tbId = (tab) ? SBExtension.browser.getTabID(tab) : 0;
		if (tab && tbId != tabId) {
			return;
		}
		var isActive = SBExtension.store.isActiveNotificationState();
		var flagActivate = (merID) ? SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixActivate + merID) : false;
		
		if (SBExtension.browser.doBlinkIcon) {
			SBExtension.actionHandler.setPopupIcon("sb_active_m.png");
		} else {
			if (!isActive) {
				SBExtension.actionHandler.setPopupIcon((flagActivate && flagActivate!="0") ? "sb_activated_m.png" : (merID? "sb1.png" : "sb.png"), false); //maxInterval!=SBExtension.config.maxBlink);
			} else {
				SBExtension.actionHandler.setPopupIcon((flagActivate && flagActivate!="0") ? "sb_activated_m2.png" : (merID? "sb_active_m.png" : "sb_active.png"), false); //maxInterval!=SBExtension.config.maxBlink);
			}
		}
	});
};

SBExtension.ActionHandler.prototype.onAnimateTransNonActive = function(tabId) {
	this.executeForSelectedTab(function(tab) {
		var tbId = (tab) ? SBExtension.browser.getTabID(tab) : 0;
		if (tab && tbId != tabId) {
			return;
		}
		SBExtension.actionHandler.setPopupIcon("sb.png");
	});
};

SBExtension.ActionHandler.prototype.doBlinkIcon = function(maxInterval, activating, merID, intervalCount) {
	if (SBExtension.browser.doBlinkIcon) {
		setTimeout(function () {
			if (SBExtension.isCriticalUpdateAvailable()) {
				// Signal to set disabled state icon...
				intervalCount = -intervalCount;
			}
			SBExtension.browser.doBlinkIcon(intervalCount, activating); //, merID);
		});
		return;
	}
	/*
	if (intervalCount==0) {
		SBExtension.actionHandler.setPopupIcon("sb2.png", intervalCount!=maxInterval-1);
	}
	var this_ = this;
	setTimeout(function() {
		if (intervalCount >= maxInterval) {
			return;
		}
		if (!activating || intervalCount != maxInterval-1) {
			SBExtension.actionHandler.setPopupIcon("sb" + (intervalCount % 2 + 1) + ".png", intervalCount!=maxInterval-1);
		} else {
			SBExtension.actionHandler.setPopupIcon("sb_active.png", intervalCount!=maxInterval-1);
		}
		intervalCount++;
		this_.doBlinkIcon(maxInterval,activating, merID, intervalCount);
	}, 500);
	*/
	var this_ = this;
	var config = SBExtension.config;
	if (maxInterval < config.maxBlink) {
		SBExtension.actionHandler.setPopupIcon("sb1.png", maxInterval!=config.maxBlink-1);
		setTimeout(function() {
			this_.doStepBlinkIconPlus(maxInterval, 1, activating, merID);
		}, config.blinkTime);
		return;
	}
	var flagActivate = (merID) ? SBExtension.store.retrieveGlobalKey(config.keyPrefixActivate + merID) : false;
	if (!activating) {
		SBExtension.actionHandler.setPopupIcon((flagActivate && flagActivate!="0") ? "sb_activated_m.png" : (merID? "sb1.png" : "sb.png"), false);
	} else {
		SBExtension.actionHandler.setPopupIcon((flagActivate && flagActivate!="0") ? "sb_activated_m2.png" : (merID? "sb_active_m.png" : "sb_active.png"), false);
	}
};

SBExtension.ActionHandler.prototype.doStepBlinkIconPlus = function(maxInterval, intervalCount, activating, merID) {
	var this_ = this;
	var config = SBExtension.config;
	if (intervalCount >= config.blinkArray.length) {
		intervalCount = config.blinkArray.length;
		this_.doStepBlinkIconMinus(maxInterval, intervalCount, activating, merID);
		return;
	}
	SBExtension.actionHandler.setPopupIcon(config.blinkArray[intervalCount], intervalCount!=maxInterval-1);
	intervalCount++;
	setTimeout(function() {
		this_.doStepBlinkIconPlus(maxInterval, intervalCount, activating, merID);
	}, config.blinkTime);
};

SBExtension.ActionHandler.prototype.doStepBlinkIconMinus = function(maxInterval, intervalCount, activating, merID){
	var this_ = this;
	if (intervalCount <= 0) {
		maxInterval++;
		intervalCount = 0;
		this_.doBlinkIcon(maxInterval, activating, merID, intervalCount);
		return;
	}
	intervalCount--;
	var config = SBExtension.config;
	SBExtension.actionHandler.setPopupIcon(config.blinkArray[intervalCount], intervalCount!=maxInterval-1);
	setTimeout(function() {
		this_.doStepBlinkIconMinus(maxInterval, intervalCount, activating, merID);
	}, config.blinkTime);
};

SBExtension.ActionHandler.prototype.onBlinkIcon = function() {
	if (SBExtension.updateController.desktopNotification) {
		SBExtension.updateController.desktopNotification.cancel();
	}
	this.doBlinkIcon(0, true, 0, 11);
};

SBExtension.ActionHandler.prototype.onLogoutIcon = function(tabId) {
	this.executeForSelectedTab(function(tab) {
		var tbId = (tab) ? SBExtension.browser.getTabID(tab) : 0;
		if (tab && tbId != tabId) {
			return;
		}
		SBExtension.actionHandler.setPopupIcon("sb_logged_out.png");
	});
};

SBExtension.ActionHandler.prototype.onCheckMerchants = function(param, callback){
	var urls = JSON.parse(param);
	var result = {};
	for(var ind in urls){
		var url = urls[ind];
		var merchant = SBExtension.tabStateHandler.getMerchantByUrl(url)
		if (merchant && merchant.showSearchHint) {
			result[url] = merchant;
		}
	}
	var memberInfo = SBExtension.globalState.memberInfo;
	result['country'] = (memberInfo && memberInfo.country) ? memberInfo.country : 0;
	callback(result);
};

SBExtension.ActionHandler.prototype.OnChangeState = function(tabId, param) {
	var activatingInSameTab = 
	  SBExtension.browser.isActivatingInSameTab(
		function() {
			var tab = SBExtension.tabStateHandler.getTabByTabId(tabId, "");
			if (!tab || !tab.merchantID || param.mID!=tab.merchantID){
				return;
			}
			var obj = SBExtension.tabStateHandler.getObjectByHost(tab.domain, tab.url, tab, tab.host, tab.matchedBy);
			var isFirstGreenAcked = (obj) ? obj.isFirstGreenAcked : null;
			if (obj && isFirstGreenAcked) {
				isFirstGreenAcked = isFirstGreenAcked[tabId];
				if (isFirstGreenAcked && isFirstGreenAcked.mID==-tab.merchantID) {
					if (isFirstGreenAcked.tabURL == tab.url) {
						isFirstGreenAcked.mID = tab.merchantID;
						obj.save();
					}
				}
			}
		},
		function() {}
	);
};

SBExtension.ActionHandler.prototype.OpenTutorial = function() {
	// We shall ONLY store it upon install...
	//SBExtension.store.storeGlobalKey('SETutorialStarted', 'true');
	var newInstall = (SBExtension.shouldOpenTutorial && SBExtension.shouldOpenTutorial.newInstall);
	var sbTutorialCmd = SBExtension.config.sbTutorialCmd;
	if (newInstall) {
		sbTutorialCmd = sbTutorialCmd + "?isNew=1";
	}
	if (SBExtension.browser.OpenTutorial) {
		var opened = SBExtension.browser.OpenTutorial(undefined, newInstall);
		if (opened) {
			return;
		}
	}
	var w = 736;
	var h = 570;
	var sw = screen.width;  //window.innerWidth;
	var sh = screen.height; //window.innerHeight;
	var tutWin = window.open(sbTutorialCmd, "SBTutorial", "toolbar=no, scrollbars=no, resizable=no, top="+(sh-h)/2+", left="+(sw-w)/2+", width="+w+", height="+h);
	var tutWinId = (SBExtension.browser.getIdForWindow) ? SBExtension.browser.getIdForWindow(tutWin) : tutWin;
	SBExtension.setTutorialWindowId(tutWinId);
	tutWin.focus();
};

SBExtension.ActionHandler.prototype.OnTutorialFinished = function(noCheckRequired, cbFunction, mustClose) {
	SBExtension.lastWindowId = SBExtension.getTutorialWindowId();
	delete SBExtension.shouldOpenTutorial;
	var callback = function() {
		SBExtension.store.clearKey('SETutorialStarted', true);
		var searchEngineIsKnown = SBExtension.isSearchEngineKnown();
		if (searchEngineIsKnown) {
			SBExtension.loadSettings();
			var settingHomepage = true;
			var settingHomepageValue = SBExtension.config.isNewTabSearch;
			var settingNewTabHomepage = true;
			var settingNewTabHomepageValue = settingNewTabHomepage;
			var settingSearchEngine = true;
			var settingSearchEngineValue = SBExtension.config.isSBSearch;
			SBExtension.browser.setDefaults(settingHomepage, settingHomepageValue, settingNewTabHomepage, settingNewTabHomepageValue, settingSearchEngine, settingSearchEngineValue);
		}
		if (cbFunction) {
			cbFunction();
		}
		SBExtension.setTutorialWindowId(null);
	};
	if (SBExtension.browser.FinishTutorial && !noCheckRequired) {
		SBExtension.browser.FinishTutorial(callback, mustClose=='mustClose');
	} else {
		callback();
	}
}

SBExtension.ActionHandler.prototype.OnTutorialUrlSwitched = function(urlParam) {
	if (SBExtension.browser.OpenTutorial) {
		SBExtension.browser.OpenTutorial(urlParam);
		return;
	}
}

SBExtension.ActionHandler.prototype.onCheckSurveyValidity = function(param, tabIdCalled) {
	var surveyIDs = param;
	var allAlertsOld = SBExtension.store.loadAlerts();
	var surveysOld = allAlertsOld && allAlertsOld[SBExtension.POPUP_ID_ANSW] || {};
	var surveysDeleted = false;
	for (var prjId in surveysOld) {
		var survey = surveysOld[prjId];
		var prjIdNum = parseInt(survey.prjId);
		if (!survey.dwId && surveyIDs.indexOf(prjIdNum)<0) {
			surveysDeleted = true;
			delete surveysOld[prjId];
		}
	}
	if (surveysDeleted) {
		SBExtension.store.saveAlerts(allAlertsOld, true);
	}
}

SBExtension.ActionHandler.prototype.onCheckFulcrumSurveyValidity = function(param, tabIdCalled) {
	var surveyIDs = (typeof param === "string") ? JSON.parse(param) : param;
	var sz = surveyIDs && surveyIDs.length || 0;
	if (!sz) return false;
	surveyIDs = surveyIDs.sort();
	var surveyIDsStr = "";
	for (var idx=0; idx<sz-1; idx++) {
		surveyIDsStr += surveyIDs[idx] + ",";
	}
	surveyIDsStr += surveyIDs[sz-1];
	if (SBExtension.checkFulcrumSurveyAvailabilityLoop[surveyIDsStr]) {
		return false;
	}
	SBExtension.networkPopup.checkFulcrumSurveyAvailability(surveyIDsStr, -SBExtension.getFulcrumCheckPeriodSecs(),
		function(data) {
			// Ajax request succeeded => check the result...
			SBExtension.actionHandler.onCheckSurveyValidity(data, 0);
		}, function(data) {
			// Ajax request failed => NO OP
	});
}

SBExtension.ActionHandler.prototype.onResetLocale = function(fromInit, callBack) {
	SBExtension.browser.resetLocale(fromInit, callBack);
}


SBExtension.ActionHandler.prototype.onCheckSurveyNotification = function(param, tabIdCalled) {
	var checkObject = JSON.parse(param);
	var surveyAlert = checkObject.data;

	var mbSurveyAlerts = {};
	mbSurveyAlerts[surveyAlert.srvId] = surveyAlert;
	if (SBExtension.checkMBSurveyAvailabilityLoop[surveyAlert.srvId]) {
		return false;
	}
	SBExtension.networkPopup.checkMBSurveyAvailability(surveyAlert.dwId, surveyAlert.srvId, -SBExtension.getMBCheckPeriodSecs(),
		function(data) {
			// Ajax request succeeded => check the result...
			var sz = data.length;
			var removedCount = 0;
			for (var dataIdx=0; dataIdx<sz; dataIdx++) {
				var surveyChkRes = data[dataIdx];
				if (surveyChkRes.wanted!=false) {
					continue;
				}
				var campaignId = surveyChkRes.campaignId;
				var alertDataToRemove = mbSurveyAlerts[campaignId];
				var alertId = alertDataToRemove.prjId;
				var alertToRemove = SBExtension.getAlert(SBExtension.POPUP_ID_ANSW, alertId);
				if (!alertToRemove) {
					continue;
				}
				removedCount++;
				alertToRemove.markRemoved();
				delete SBExtension.checkMBSurveyAvailabilityLoop[surveyAlert.srvId];
			}
			if (!removedCount) {
				return true;
			}
			this.executeForSelectedTab(function(tab) {
				var tbId = SBExtension.browser.getTabID(tab);
				if (tab && tabIdCalled && tbId && tabIdCalled!=tbId) {
					return;
				}
				var click = {};
				click.tabId = tbId;
				click.arrayState = checkObject.arrayState;
				click.name = "activateState";
				SBExtension.browser.tabsSendMessage(parseInt(tbId), click);
			});
			return (removedCount<sz);

		}, function(data) {
			// Ajax request failed => NO OP
	});
};



SBExtension.actionHandler = new SBExtension.ActionHandler();
