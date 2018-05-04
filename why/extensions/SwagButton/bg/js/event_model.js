// Ensures periodic queries are sent to the server and manages 
// state/response/notifications received back from it ...

//try {

SBExtension.UpdateController = function() {
	this.lastCheckStateExtTS = 0;
	this.desktopNotification = null;
	this.checkStateExtTimer = null;
	this.nextCheckStateTS = 0;
	this.stateDesktopNotificationHiddenAt = 0;
	this.hideDesktopNotificationTimer = null;
};

SBExtension.UpdateController.prototype.initEventModel = function() {
	try{
		SBExtension.initEventModelCalled = true;
		SBExtension.network.checkState(this.intervalEvent);
		SBExtension.initEventModelCallSucceeded = true;
	} catch(e) {
		SBExtension.alert_debug('UpdateController.initEventModel: ' + e, e);
	}
};

// Create desktop notification. It can be shown/made clickable below - see notification.show() and notification.onclick() ...
SBExtension.UpdateController.prototype.createDesktopNotification = function() {
	if (!SBExtension.browser.isDesktopNotificationSupported()) return;
	this.desktopNotification = SBExtension.browser.createDesktopNotification(
			  "img/banner/sb_logo.svg",  // icon url - can be relative
			  SBExtension.browser.getLocalizedString("information"),  // notification title
			  SBExtension.browser.getLocalizedString("informationClick")  // notification body text
			);
	var this_ = this;
	SBExtension.browser.executeForSelectedTab(null, function(tab) { //chrome.tabs.getSelected(null, function(tab) {
		this_.desktopNotification.onclick = function(){
			//window.focus();
			//chrome.windows.update(tab.windowId, { "focused": true });
			var windowId = SBExtension.browser.getTabWindowID(tab);
			SBExtension.browser.focusOnPopout(windowId);
			SBExtension.actionHandler.onUserAction('BlinkIcon');
			this_.hideDesktopNotification();
		};
		this_.desktopNotification.onclose = function(){
			this_.hideDesktopNotification();
		};
	});
};

// Hide desktop notification, but then create it again so it can be shown again when needed.
SBExtension.UpdateController.prototype.hideDesktopNotification = function() {
	if (!SBExtension.browser.isDesktopNotificationSupported()) return;
	if (this.desktopNotification)
		this.desktopNotification.cancel();
	SBExtension.updateController.createDesktopNotification();
	this.stateDesktopNotificationHiddenAt = this.getActiveStateMask();
};

SBExtension.UpdateController.prototype.getActiveStateMask = function() {
	try{
		var mask = 0;
		var oneBit = 1;
		for(var i = 0; i < SBExtension.globalState.stateActiveArray.length; i++){
			if (SBExtension.globalState.stateActiveArray[i] > 0)
				mask |= oneBit;
			oneBit = oneBit << 1;
		}
		return mask;
	} catch(e) {
		SBExtension.alert_debug('UpdateController.getActiveStateMask: ' + e, e);
	}
};

SBExtension.UpdateController.prototype.intervalEvent = function(dataObj) {
	//window.alert("In SBExtension.UpdateController.prototype.intervalEvent + SBExtension.initialized = " + SBExtension.initialized);
	if (dataObj.globalState) {
		dataObj = dataObj.globalState;
	}
	var data = dataObj;
	if (data.memberInfo) {
		data = {};
		for (var n in dataObj) {
			if (n=="memberInfo") {
				data[n] = dataObj[n];
			}
		}
		var memberInfo = data.memberInfo;
		for (var n in memberInfo) {
			data[n] = memberInfo[n];
		}
	}
	try{
		var err = new Error();
		//alert(err.stack + "\n\n" + JSON.stringify(data));
		if(data.readyState == 4 && data.status == 200){
			//alert(err.stack + "\n\n" + JSON.stringify(data));
			return;
		}else{
		//	alert(err.stack + "\n\n" + JSON.stringify(data));
		}
		var isNewActiveState = 0;
		var this_ = SBExtension.updateController;
		if (!SBExtension.initialized) {
			if (SBExtension.config.debugIsEnabled) {
				try {
					FAKE_ERROR_OBJECT.FAKE_ERROR_CALL();
				} catch(err) {
					SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - SKIPPED AS NOT INITIALIZED !!!", err);
				}
			}
			this_.checkStateExt();
			return;
		}
		SBExtension.tabStateHandler.onCheckState(data);
		SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - data.status = " + data.status);
		var globalStateChanged = false;
		if (data.status == 0) {
			if(SBExtension.globalState.loginState == "0"){
				SBExtension.network.memberInfo = null;
				var gsActiveArray = SBExtension.globalState.stateActiveArray;
				var gsActiveArrayLength = gsActiveArray.length;
				for (var i = 0; i < gsActiveArrayLength; i++){
					if (!gsActiveArray[i]) {
						gsActiveArray[i] = 0;
						globalStateChanged = true;
					}
				}
				var stateArray = gsActiveArray.slice();
				var stateSEActiveArray = {};
				SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - BEFORE SBExtension.browser.executeForAllPopups!!!");
				if (globalStateChanged) {
					var done = SBExtension.browser.onGlobalStateChanged(false, true);
					if (!done) {
						SBExtension.store.storeGlobalState(SBExtension.globalState);
						SBExtension.browser.executeForAllPopups(
							function(popup) {
								//SBExtension.popupSetStateChangeCallback(popup, stateArray, stateSEActiveArray);
								popup.SBExtension.popupUIMain.setStateChange(stateArray, SBExtension.networkPopup.memberInfo, stateSEActiveArray); //stateArray, SBExtension.networkPopup.memberInfo, stateSEActiveArray);
							}
							, ["popupUIMain.setStateChange"] //{"method":"popupSetStateChangeCallback", "@popup@":'@popup@', "popupSetStateChangeCallback.stateArray":stateArray, "popupSetStateChangeCallback.stateSEActiveArray":stateSEActiveArray}
						);
					}
				}
				SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - AFTER SBExtension.browser.executeForAllPopups!!!");
			}
			this_.checkStateExt();
			return;
		}
		SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - AFTER if data.status!!!");
	
		SBExtension.network.memberInfo = SBExtension.globalState.updateMemberInfo(data.memberInfo || data);

		SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - BEFORE SBExtension.store.retrieveGlobalKey !!! SBExtension.network.memberInfo.memberID=" + ((SBExtension.network.memberInfo) ? SBExtension.network.memberInfo.memberID : ("[SBExtension.network.memberInfo=]" + SBExtension.network.memberInfo)));

		var storeMember = SBExtension.store.retrieveGlobalKey("SBmemberInfo_" + SBExtension.network.memberInfo.memberID);
		SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - AFTER SBExtension.store.retrieveGlobalKey !!!  storeMember = " + storeMember);

		var storeMember = (storeMember) ? JSON.parse(storeMember) : false;
		if (storeMember && storeMember.memberID == SBExtension.network.memberInfo.memberID && SBExtension.network.memberInfo && SBExtension.network.memberInfo.memberID > 0) {
			SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - STARTING if(storeMember && storeMember.memberID !!!");
			if (SBExtension.store.getTbUID()) {
				var stateTB = new SBExtension.Stats().getState();
				stateTB.setLogin(SBExtension.network.memberInfo.memberID, SBExtension.lastStatsSentMid);
			}
			var stateObj = new SBExtension.MerchantStats().getState();
			stateObj.setLogin(SBExtension.network.memberInfo.memberID);

			var allAlertsOld = SBExtension.store.loadAlerts();
			allAlertsOld = allAlertsOld ? allAlertsOld : {};
			var allAlerts = {};

			var storeMemberSBs = storeMember.sBs;
			storeMemberSBs = parseInt((storeMemberSBs.replace) ? storeMemberSBs.replace(",", "") : storeMemberSBs)
			var dataSBs = parseInt((data.sBs.replace) ? data.sBs.replace(",", "") : data.sBs);

			var accAlerts = allAlertsOld[SBExtension.POPUP_ID_ACCT];
			var lastHeartbeatTS = SBExtension.browser.getLastHeartbeatTS();
			var curTS = (new Date()).getTime();
			SBExtension.browser.setLastHeartbeatTS(curTS);
			// If there was no heartbeats recorded for more than 15 min => Ignore!!!
			if ((lastHeartbeatTS && (curTS-lastHeartbeatTS <= 900000)) && dataSBs && storeMemberSBs != dataSBs) {
				var deltaSB =  dataSBs - storeMemberSBs;
				storeMember.sBs = data.sBs;
				SBExtension.store.storeGlobalKey("SBmemberInfo_" + SBExtension.network.memberInfo.memberID, JSON.stringify(storeMember));
				if (!SBExtension.config.isBalanceAlert) {
					delete allAlerts[SBExtension.POPUP_ID_ACCT];
				} else {
					if (!SBExtension.globalState.stateActiveArray[SBExtension.POPUP_ID_ACCT]) {
						SBExtension.globalState.stateActiveArray[SBExtension.POPUP_ID_ACCT] = 1;
						globalStateChanged = true;
					}
					isNewActiveState |= (1 << SBExtension.POPUP_ID_ACCT);
					if (!accAlerts || !accAlerts[0]) {
						var accAlert = SBExtension.createAlert(SBExtension.POPUP_ID_ACCT, 0, true);
						accAlerts = {};
						if (!accAlert.id) {
							accAlert.id = 0;
						}
						accAlert.data = {sb: deltaSB};
						accAlerts[accAlert.id] = accAlert;
						allAlerts[SBExtension.POPUP_ID_ACCT] = accAlerts;
					} else {
						var accAlert = accAlerts[0];
						accAlert.tsRemoved = accAlert.tsSeen = accAlert.tsHidden = accAlert.tsClicked = 0;
						var accAlertData = accAlert.data;
						if (accAlertData) {
							accAlertData.sb = deltaSB;
						} else {
							accAlert.data = {sb: deltaSB};
						}
						allAlerts[SBExtension.POPUP_ID_ACCT] = accAlerts;
					}
					SBExtension.store.clearKey("SSE_AlertShown_"+SBExtension.POPUP_ID_ACCT+"_"+accAlert.id, true);
				}
			} else if (accAlerts) {
				allAlerts[SBExtension.POPUP_ID_ACCT] = accAlerts;
			}
			var pCodeID = data.pCodeID;
			var pCodeHistory = SBExtension.store.retrieveGlobalKey("SE_SCODE_HISTORY");
			if (!pCodeHistory) {
				pCodeHistory = [];
			}
			// Check notification on THAT swagcode and below - remember not to show it anymore!
			var pCodeIDState = (!pCodeID || pCodeID<0) ? true : SBExtension.store.retrieveGlobalKey("SE_SCODE_" + pCodeID);
			if (pCodeID>0) {
				if(pCodeHistory.indexOf(pCodeID) > -1) {
					SBExtension.globalState.stateActiveArray[SBExtension.POPUP_ID_SCDE] = 0;
				} else {
					pCodeHistory.push(pCodeID);
				}
				if (!pCodeIDState) {
					SBExtension.globalState.stateActiveArray[SBExtension.POPUP_ID_SCDE] = 1;
					globalStateChanged = true;
					isNewActiveState |= (1 << SBExtension.POPUP_ID_SCDE);
					SBExtension.store.storeGlobalKey("SE_SCODE_" + pCodeID, "1");
				}
				var scAlertsOld = (allAlertsOld) ? allAlertsOld[SBExtension.POPUP_ID_SCDE] : null;
				var scAlertOld = (scAlertsOld) ? scAlertsOld[pCodeID] : null;
				var scAlert = (scAlertOld) ? scAlertOld : SBExtension.createAlert(SBExtension.POPUP_ID_SCDE, pCodeID, true);
				var scAlerts = {};
				var scAlertData = {
					id: pCodeID,
					status: data.status,
					statusPCode: data.statusPCode,
					msg: data.msg
				};
				scAlert.id = pCodeID;
				scAlert.data = scAlertData;
				scAlerts[scAlert.id] = scAlert;
				allAlerts[SBExtension.POPUP_ID_SCDE] = scAlerts;
			} else {
				SBExtension.globalState.stateActiveArray[SBExtension.POPUP_ID_SCDE] = 0;
				if(pCodeID != pCodeIDState){
					SBExtension.browser.executeForSelectedTab(null, function(tab) {
						var tbId = SBExtension.browser.getTabID(tab);
						SBExtension.browser.tabsSendMessage(parseInt(tbId), {tabId:tbId, name:"clearPCodeNotification"});
					});
				}
			}
			var srvAlertsOld = (allAlertsOld) ? allAlertsOld[SBExtension.POPUP_ID_ANSW] : null;
			var surveys = (data.surveys && (data.surveys.length>0 || Object.keys(data.surveys).length)) ? data.surveys : null;
			var srvAlertsNew = {};
			var rankNext = 0;
			if (!SBExtension.config.isSurveyAlert) {
				delete allAlerts[SBExtension.POPUP_ID_ANSW];
			} else {
				var memberIDPart = (SBExtension.network.memberInfo && SBExtension.network.memberInfo.memberID) ? "&memberid=" + SBExtension.network.memberInfo.memberID : "";
				if (surveys) {
					for (var idx in surveys) {
						var survey = surveys[idx];
						if (survey.prjId && !survey.url) {
							survey.url = "http://" + SBExtension.config.sbHostName + "/g/survey-click/?projectid=" + survey.prjId + "&sourceid=13" + memberIDPart;
						}
						var prjId = survey.prjId;
						var srvAlert = (srvAlertsOld) ? srvAlertsOld[prjId] : null;
						if (srvAlert) {
							delete srvAlertsOld[prjId];
						} else {
							srvAlert = SBExtension.createAlert(SBExtension.POPUP_ID_ANSW, prjId, true);
						}
						srvAlert.rank = idx;
						rankNext = idx+1;
						srvAlert.data = survey;
						srvAlertsNew[prjId] = srvAlert;
	 				}
				}
				if (srvAlertsOld) {
					for (var prjId in srvAlertsOld) {
		 				var srvAlert = srvAlertsOld[prjId];
						if (srvAlert && srvAlert.data && srvAlert.data.prjId && !srvAlert.data.url) {
							srvAlert.data.url = "http://" + SBExtension.config.sbHostName + "/g/survey-click/?projectid=" + srvAlert.data.prjId + "&sourceid=13" + memberIDPart;
						}
						if (srvAlert && !srvAlert.tsRemoved) {
							srvAlert.rank = rankNext++;
							srvAlertsNew[srvAlert.id] = srvAlert;
						}
					}
				}
				if (rankNext != 0) {
	 				allAlerts[SBExtension.POPUP_ID_ANSW] = srvAlertsNew;
					isNewActiveState |= (1 << SBExtension.POPUP_ID_ANSW);
					SBExtension.globalState.stateActiveArray[SBExtension.POPUP_ID_ANSW] = 1;
				}
			}

			if (allAlerts) {
				SBExtension.store.saveAlerts(allAlerts, true);
				//SBExtension.globalState.stateActiveArray[SBExtension.POPUP_ID_ANSW] = 1;
			}
			SBExtension.store.storeGlobalKey("SE_SCODE_HISTORY", pCodeHistory);
		}
		SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - AFTER if(storeMember && storeMember.memberID !!!");
	
		SBExtension.network.memberInfo = data;
		if (SBExtension.network.memberInfo && SBExtension.network.memberInfo.memberID && !SBExtension.network.memberInfo.uName) {
			// We will populate missing fields in memberInfo from global storage!!!
			var memberInfoStr = SBExtension.store.retrieveGlobalKey("SBmemberInfo");
			var memberInfo2 = (memberInfoStr) ? JSON.parse(memberInfoStr) : false;
			if (memberInfo2.memberID==SBExtension.network.memberInfo.memberID) {
				for (var name in memberInfo2) {
					if (!SBExtension.network.memberInfo[name])
						SBExtension.network.memberInfo[name] = memberInfo2[name];
				}
			}
		}
		if(SBExtension.network.memberInfo.memberID > 0){
			SBExtension.store.storeGlobalKey("SBmemberInfo_" + SBExtension.network.memberInfo.memberID, JSON.stringify(SBExtension.network.memberInfo));
		}
	
		if(SBExtension.network.memberInfo && SBExtension.network.memberInfo.memberID > 0){
			if (!SBExtension.globalState.loginState) {
				SBExtension.globalState.loginState = "1";
				globalStateChanged = true;
			}
			if (SBExtension.network.memberInfo.heartBeatTS && SBExtension.network.memberInfo.heartBeatTS!=SBExtension.globalState.heartBeatTS) {
				globalStateChanged = true;
				SBExtension.config.heartBeatTS = SBExtension.network.memberInfo.heartBeatTS;
				SBExtension.globalState.heartBeatTS = SBExtension.network.memberInfo.heartBeatTS;
				globalStateChanged = true;
			} else if (SBExtension.globalState.heartBeatTS < 60000) {
				SBExtension.config.heartBeatTS = 60000;
				SBExtension.globalState.heartBeatTS = 60000;
				globalStateChanged = true;
			}
		}else{
			if (SBExtension.globalState.loginState) {
				SBExtension.globalState.loginState = "0";
				globalStateChanged = true;
			}
		}

		if (globalStateChanged) {
			SBExtension.globalState.setMemberInfo(SBExtension.network.memberInfo);
		}
		SBExtension.browser.executeForSelectedTab(null, function(tab) {
			var tbId = SBExtension.browser.getTabID(tab);
			SBExtension.actionHandler.onUserAction("AnimateReActive", tbId); 
		});
		
		var isPopUpOpen = false;

		var stateArray = (SBExtension.globalState.stateActiveArray) ? SBExtension.globalState.stateActiveArray.slice() : [];
		var stateSEActiveArray = (SBExtension.globalState.stateSEActiveArray) ? SBExtension.copyOf(SBExtension.globalState.stateSEActiveArray) : {}; // slice() and [] !!!

		if (globalStateChanged) {
			var done = SBExtension.browser.onGlobalStateChanged(false, true);
			if (!done) {
				SBExtension.store.storeGlobalState(SBExtension.globalState);
				SBExtension.browser.executeForAllPopups(
					function(popup) {
						popup.SBExtension.popupUIMain.setStateChange(stateArray, SBExtension.networkPopup.memberInfo, stateSEActiveArray); //stateArray, SBExtension.networkPopup.memberInfo, stateSEActiveArray);
					}
					, ["popupUIMain.setStateChange"] //, {"method":"popupSetStateChangeCallback", "@popup@":'@popup@', "popupSetStateChangeCallback.stateArray":stateArray, "popupSetStateChangeCallback.stateSEActiveArray":stateSEActiveArray}
				);
			}
		}

		if(!isPopUpOpen && SBExtension.store.isActiveNotificationState()){
			SBExtension.browser.executeForSelectedTab(null, function(tab) {
				var tbId = SBExtension.browser.getTabID(tab);
				if (isNewActiveState && stateArray.length) {
					var click = {};
					click.tabId = tbId;
					click.arrayState = stateArray; //SBExtension.globalState.stateActiveArray.slice();
					for (var idx in click.arrayState) {
						if (click.arrayState[idx] && ( (isNewActiveState&(1<<idx)) == 0)){
							click.arrayState[idx] = 0;
						}
					}
					click.name = "activateState";
					SBExtension.browser.tabsSendMessage(parseInt(tbId), click);
				}
				if(this_ && this_.desktopNotification){
					this_.desktopNotification.onclick = function(){
						//window.focus();
						//chrome.windows.update(tab.windowId, { "focused": true });
						var windowId = SBExtension.browser.getTabWindowID(tab);
						SBExtension.browser.focusOnPopout(windowId);
						SBExtension.actionHandler.onUserAction('BlinkIcon');
						this_.hideDesktopNotification();
					};
					var curActiveState = this_.getActiveStateMask();
					// If any 0 bit turned into 1 bit => we need to show the desktop notification again !!!
					if ((curActiveState & ~this_.stateDesktopNotificationHiddenAt) != 0) {
						this_.desktopNotification.show();
						if (this_.hideDesktopNotificationTimer) {
							clearTimeout(this_.hideDesktopNotificationTimer);
						}
						this_.hideDesktopNotificationTimer = setTimeout(function(){
							this_.hideDesktopNotification();
						}, 5000);
					}
				}
				// Ensure popup icon shows orange notification dot...
				SBExtension.actionHandler.onUserAction("AnimateTransActive", tbId);
			});
		
		}
		//BB SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - AFTER if(!isPopUpOpen && this_.isActiveState()){ !!!");
	
		SBExtension.store.storeGlobalKey("SBmemberInfo", JSON.stringify(SBExtension.network.memberInfo));
		//BB SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - AFTER SBExtension.store.storeGlobalKey("SBmemberInfo" but BEFORE this_.checkStateExt!!!");
		this_.checkStateExt();
		SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - AFTER this_.checkStateExt!!!");
	} catch(e) {
		SBExtension.alert_debug('UpdateController.intervalEvent: ' + e.message, e);
	}
};

//empty state
SBExtension.UpdateController.prototype.clearMenuPosition = function(index, wID, globalStateChangeCallback){
	try{
		if(index > -1){
			if(SBExtension.globalState.stateSEActiveArray[wID] == 1){
				//SBExtension.globalState.stateSEActiveArray.splice(wID, 1)
				delete SBExtension.globalState.stateSEActiveArray[wID];
			}
			SBExtension.globalState.stateActiveArray[index] = 0;
			//SBExtension.globalState.lastWId = wID;
			SBExtension.globalState.save();
			SBExtension.browser.onGlobalStateChanged(false, true, false, globalStateChangeCallback);
		}	
	} catch(e) {
		SBExtension.alert_debug('UpdateController.clearMenuPosition: ' + e, e);
	}
};

SBExtension.UpdateController.prototype.withinOneMinuteFromMidnight = function(theDate) {
	try{
		var theDateMillis = theDate.getTime();
		var midnightDate = new Date(
			theDate.getFullYear(),
			theDate.getMonth(),
			theDate.getDate(),
			0,0,0);
		var midnightDate = midnightDate.getTime();
		var diff = theDateMillis - midnightDate;
		// If the difference from LAST midnight is larger than half-a-day, calculate what's left till NEXT midnight...
		if (diff>43200000)
			diff = 86400000-diff;
		return (diff<60000);
	} catch(e) {
		SBExtension.alert_debug('UpdateController.withinOneMinuteFromMidnight: ' + e, e);
	}
};

SBExtension.UpdateController.prototype.checkStateExt = function(){
	try{
		//window.alert("In SBExtension.UpdateController.prototype.checkStateExt + SBExtension.initialized = " + SBExtension.initialized);
		var isMaster = SBExtension.browser.isMaster();
		// This check here ensures we are NEVER going to start sending requests from multiple windows [e.g., in firefox] 
		if (!isMaster)
			return;
		var nowTS = new Date().getTime();
		var this_ = this;
		var needToReschedule = this.nextCheckStateTS && nowTS < this.nextCheckStateTS;
		if (!SBExtension.initialized) {
			needToReschedule = true;
			this.nextCheckStateTS = nowTS + SBExtension.config.getHeartBeatTS();
		}
		if (needToReschedule) {
			// This code here ensures we are NEVER going to start sending request too frequently (as it have happened before...) 
			// - ONLY ONE timer is allowed and it better be right as far as timing is concerned...
			if (this.checkStateExtTimer) {
				clearTimeout(this.checkStateExtTimer);
			}
			this.checkStateExtTimer = setTimeout(function(){
				this_.checkStateExt();
			}, this.nextCheckStateTS-nowTS);
			return;
		}
		this.nextCheckStateTS = nowTS + SBExtension.config.getHeartBeatTS();
		setTimeout(function(){
			var nowDate = new Date();
			nowTS = nowDate.getTime();
			var willDelay = false;
			// This code here ensures we will NOT send any request within one minute from midnight...
			if (this_.withinOneMinuteFromMidnight(nowDate)) {
				willDelay = true;
			}
			// This code here ensures we will NOT send any request more frequently than we should...
			else if(nowTS - this_.lastCheckStateExtTS < SBExtension.config.timeOutCheckState){
				willDelay = true;
			}
			if(willDelay){
				setTimeout(function(){
					try {
						this_.lastCheckStateExtTS = nowTS;
						SBExtension.network.checkState(this_.intervalEvent);
					} catch(e) {
						SBExtension.alert_debug('UpdateController.checkStateExt in setTimeout(function() : ' + e, e);
					}
				}, SBExtension.config.timeOutCheckState);	
			}else{
				this_.lastCheckStateExtTS = nowTS;
				SBExtension.network.checkState(this_.intervalEvent);
			}
		}, SBExtension.config.getHeartBeatTS());	
	} catch(e) {
		SBExtension.alert_debug('UpdateController.checkStateExt: ' + e, e);
	}	
};

SBExtension.UpdateController.prototype.onHeartbeatCheck = function(){
	var millisSinceLastHB = (new Date()).getTime() - (this.lastCheckStateExtTS || 0);
	if (millisSinceLastHB > SBExtension.config.getHeartBeatTS() * 1.03) {
		// Restart HeartBeats
		SBExtension.network.checkState(SBExtension.updateController.intervalEvent);
	}
};

SBExtension.updateController = new SBExtension.UpdateController();

//} catch(errMain) {
//    SBExtension.alert_debug('ERROR!!! -- Initializing event_model !!! errMain=' + errMain, errMain);
//}

//$( document ).ready(function() {
//	SBExtension.updateController.createDesktopNotification();
//	SBExtension.updateController.initEventModel();
//});
