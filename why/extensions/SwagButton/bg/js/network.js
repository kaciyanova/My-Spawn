// This method extends original Toolbar remote call infrastructure
// to cover for all new state-related methods/queries

SBNetwork = function() {
	this.popupCallback = null;
	this.memberInfo = null;
	this.popupState = null;
};

SBNetwork.prototype = SBExtension.extend(SBNetworkCommon.prototype, SBNetwork);
SBNetwork.prototype.constructor = SBNetwork;

SBNetwork.prototype.handleDailyWin = function(count) {
		if (!count) count = 0;
		var tbUID = SBExtension.store.getTbUID();
		var hash = SBExtension.store.retrieveGlobalKey("SE_HASH");
		var ts   = SBExtension.store.retrieveGlobalKey("SE_HASH_TS");
		if (tbUID > 0) {
			data = {
				method : 3,
				callback : this.onDailyWinSuccess,
				hash : hash,
				ts : ts,
				param : count,
				//object: this,
				callbackMethod : "network.onDailyWinSuccess"
			};
			this.remoteCall(data);
		}else{
			this.pollForDailyWin();
		}
}

SBNetwork.prototype.onLoginSuccess = function(data, calledFromPopup, remotePopupCallback, popupCallback) {
	try{
		if (data && data.loc) {
			SBExtension.config.onLogin((data.memberID > 0) ? "1" : "0", data.loc, data.showSrvyProjID);
		}
		var curPopupState = this.popupState;
		SBExtension.alert_debug('STARTING onLoginSuccess; calledFromPopup=' + JSON.stringify(calledFromPopup) + '; data=' + JSON.stringify(data) + '; this.popupState = ' + JSON.stringify(this.popupState) + '; curPopupCallback = ' + curPopupCallback); //, new Error());
		var tab = (calledFromPopup && calledFromPopup.id) ? calledFromPopup : (SBExtension.browser) ? SBExtension.browser.selectedTab : SBExtension.browserPopup.currentTab;
		curPopupState = this.getInitializedPopupState(data, calledFromPopup, tab);
		var curPopupCallback = (calledFromPopup) ? remotePopupCallback : popupCallback;
		var oldMemberID = SBExtension.store.retrieveGlobalKey("SELastMemberID");
		this.memberInfo = data;
		if (this.memberInfo.memberID > 0) {

			if (this.checkTesterCallback(data, true)) {
				return;
			}

			if (SBExtension.lastUninstallURL && SBExtension.lastUninstallURLMid==0 && SBExtension.browser.setUninstallURL) {
				// Replace mid !!! (to account for auto-login from the first heartbeat!)
				var lastUninstallURL = SBExtension.lastUninstallURL.replace("&mid=0&", "&mid="+this.memberInfo.memberID+"&");
				SBExtension.lastUninstallURLMid = this.memberInfo.memberID;
				SBExtension.browser.setUninstallURL(lastUninstallURL);
			}
			var oldCountry = SBExtension.store.retrieveGlobalKey("SE_COUNTRY");
			if (!oldCountry || oldCountry && oldCountry != data.country || !SBExtension.tabStateHandler.isMerchantListInitialized()) {
				SBExtension.store.storeGlobalKey("merchants", "");
				SBExtension.store.storeGlobalKey("SEFeatureCoupon", "");
				SBExtension.store.storeGlobalKey("merchantFeatureByID", "");
				SBExtension.store.storeGlobalKey("merchantFeatureByOrder", "");
				var totalMerchantHash = data.totalMerchantHash;
				if (totalMerchantHash && typeof data.totalMerchantHash == "string")
					totalMerchantHash = JSON.parse(data.totalMerchantHash);
				SBExtension.tabStateHandler.setMerchants(true, (totalMerchantHash) ? totalMerchantHash : data.hashMerchant, data.country, oldCountry);
				SBExtension.store.storeGlobalKey("SE_COUNTRY", data.country);
			}
			// SE_HASH MODIFICATION !!!
			SBExtension.store.storeGlobalKey("SE_HASH", data.hash);
			SBExtension.store.storeGlobalKey("SE_HASH_TS", data.ts);
			SBExtension.globalState.loginState = "1";
			SBExtension.alert_debug('!!! PRIOR TO ASSIGNING curPopupState.loginState = 1 !!! STARTING onLoginSuccess; calledFromPopup=' + JSON.stringify(calledFromPopup) + '; data=' + JSON.stringify(data) + '; curPopupState = ' + JSON.stringify(curPopupState) + '; curPopupCallback = ' + curPopupCallback); //, new Error());
			if (curPopupState)
				curPopupState.loginState = 1;
			SBExtension.alert_debug('!!! AFTER ASSIGNING curPopupState.loginState = 1 !!! STARTING onLoginSuccess; calledFromPopup=' + JSON.stringify(calledFromPopup) + '; data=' + JSON.stringify(data) + '; curPopupState = ' + JSON.stringify(curPopupState) + '; curPopupCallback = ' + curPopupCallback); //, new Error());
			SBExtension.config.heartBeatTS = this.memberInfo.heartBeatTS;
			SBExtension.globalState.heartBeatTS = this.memberInfo.heartBeatTS;
			if (SBExtension.MerchantStats) {
				var stateObj = new SBExtension.MerchantStats().getState();
				stateObj.setLogin(this.memberInfo.memberID);
				if(SBExtension.store.getTbUID()){
					var stateTB = new SBExtension.Stats().getState();
					stateTB.setLogin(this.memberInfo.memberID, oldMemberID);
				}
			}
		} else {
			SBExtension.alert_debug('!!! PRIOR TO ASSIGNING curPopupState.loginState = 0 !!! STARTING onLoginSuccess; calledFromPopup=' + JSON.stringify(calledFromPopup) + '; data=' + JSON.stringify(data) + '; curPopupState = ' + JSON.stringify(curPopupState) + '; curPopupCallback = ' + curPopupCallback); //, new Error());
			SBExtension.globalState.loginState = "0";
			if (curPopupState)
				curPopupState.loginState = 0;
			SBExtension.alert_debug('!!! AFTER ASSIGNING curPopupState.loginState = 0 !!! STARTING onLoginSuccess; calledFromPopup=' + JSON.stringify(calledFromPopup) + '; data=' + JSON.stringify(data) + '; curPopupState = ' + JSON.stringify(curPopupState) + '; curPopupCallback = ' + curPopupCallback); //, new Error());
		}
		SBExtension.browser.executeForSelectedTab(null, function(tab) {
			var tbId = SBExtension.browser.getTabID(tab);
			SBExtension.actionHandler.onUserAction("AnimateEmpty", tbId); 
		});
		SBExtension.alert_debug("onLoginSuccess(" + calledFromPopup + ") : BEFORE if (executeInBg) : " + curPopupState); //, new Error());

		this.getStateForTab(tab);

		SBExtension.alert_debug("!!! curPopupState.loginState = " + ((curPopupState)  ? curPopupState.loginState : curPopupState) + "; onLoginSuccess(" + calledFromPopup + ") : BEFORE if (curPopupState) : " + curPopupState); //, new Error());
		SBExtension.globalState.setMemberInfo(this.memberInfo);
		SBExtension.store.storeGlobalKey("SBmemberInfo", JSON.stringify(this.memberInfo));
		if (curPopupState){
			///*BB*/window.alert('INSIDE if (this.popupState) IN onLoginSuccessGetState; this.memberInfo=' + JSON.stringify(this.memberInfo));
			SBExtension.alert_debug("onLoginSuccess(" + calledFromPopup + ") : INSIDE if (this.popupState) : this.memberInfo = " + this.memberInfo);
			curPopupState.save();
			SBExtension.globalState.isLogin = true; // curPopupState.isLogin = true;
			SBExtension.globalState.dirty = true;
			if (SBExtension.popup && SBExtension.popup.calculateGlobalState) {
				SBExtension.popup.calculateGlobalState(curPopupState, curPopupCallback, popupCallback);
			}
		}
	} catch(e) {
		SBExtension.alert_debug('ERROR IN onLoginSuccess: ' + e.message, e);
	}
	SBExtension.globalState.dirty = true;
}

SBNetwork.prototype.getStateForTab = function(tab) {
	var getStateByTabId = function(tab) {
		var tbId = SBExtension.getAvailableBrowser().getTabID(tab);
		SBExtension.tabStateHandler.getStateByTabId(tbId);
	};
	if (tab) {
		getStateByTabId(tab);
	} else {
		SBExtension.browser.executeForSelectedTab(null, getStateByTabId);
	}
}

SBNetwork.prototype.getInitializedPopupState = function(data, calledFromPopup, tab) {
	var curPopupState = this.popupState;
	if (calledFromPopup && tab && tab.id) {
		curPopupState = SBExtension.createNewPopupExtnState();
		curPopupState.tabId = tab.id;
		curPopupState.windowId = tab.windowId;
		SBExtension.alert_debug('IN onLoginSuccess BEFORE get; curPopupState=' + JSON.stringify(curPopupState)); //, new Error());
		curPopupState.get();
		SBExtension.alert_debug('IN onLoginSuccessAFTER get; curPopupState=' + JSON.stringify(curPopupState)); //, new Error());
	} else if (!calledFromPopup && !curPopupState) {
		curPopupState = SBExtension.createNewPopupExtnState();
		if (tab) {
			curPopupState.tabId = tab.id;
			curPopupState.windowId = tab.windowId;
			curPopupState.get();
		}
	}
	if (curPopupState) {
		if (typeof data.error == "function") {
			if (data.status && data.statusText && (data.isErrorReceived || data.status!=200)) {
				curPopupState.errorMsg = data.statusText + " (" + data.status + ")";
			} else if (data.isErrorReceived) {
				curPopupState.errorMsg = "Unknown Error (" + data.status + ")";
			} else {
				curPopupState.errorMsg = "";
			}
		} else {
			curPopupState.errorMsg = data.error;
		}
	}
	return curPopupState;
}

SBNetwork.prototype.checkTesterCallback = function (data, isLogin) {
	if (SBExtension.MTester!==undefined && SBExtension.MTester.isTestEnabled() && SBExtension.MTester.loginCallback  && SBExtension.MTester.usersLoginDataEnabled == 1) {
		SBExtension.globalState.loginState = (isLogin) ? "1" : "0";
		SBExtension.globalState.setMemberInfo(this.memberInfo);
		if (isLogin) {
			SBExtension.store.storeGlobalKey("SE_HASH", data.hash);
			SBExtension.store.storeGlobalKey("SE_HASH_TS", data.ts);
			SBExtension.MTester.loginCallback();
		} else {
			SBExtension.MTester.logoutCallback();
		}
		return true;
	}
	return false;
}

SBNetwork.prototype.onStateSuccess = function (data, calledFromPopup, remotePopupCallback, popupCallback) {
    try {
        if (data && data.loc) {
            SBExtension.config.loginCode = data.loc;
        }
        if (data && data.showSrvyProjID) {
            SBExtension.config.showSrvyProjID = data.showSrvyProjID;
        }
        SBExtension.alert_debug('STARTING onStateSuccess; calledFromPopup=' + JSON.stringify(calledFromPopup) + '; data=' + JSON.stringify(data) + '; this.popupState = ' + JSON.stringify(this.popupState) + '; curPopupCallback = ' + curPopupCallback); //, new Error());
        var tab = (calledFromPopup && calledFromPopup.id) ? calledFromPopup : (SBExtension.browser) ? SBExtension.browser.selectedTab : SBExtension.browserPopup.currentTab;
        var curPopupState = this.getInitializedPopupState(data, calledFromPopup, tab);
        var curPopupCallback = (calledFromPopup) ? remotePopupCallback : popupCallback;
        var oldMemberID = SBExtension.store.retrieveGlobalKey("SELastMemberID");
        this.memberInfo = data;
        if (this.memberInfo.memberID > 0) {
            if (this.checkTesterCallback(data, true)) {
                return;
            }
            curPopupState.memberInfo = this.memberInfo;
            var oldCountry = SBExtension.store.retrieveGlobalKey("SE_COUNTRY");
            if (!oldCountry || oldCountry && oldCountry != data.country) {
                SBExtension.store.storeGlobalKey("merchants", "");
                SBExtension.store.storeGlobalKey("SEFeatureCoupon", "");
                SBExtension.store.storeGlobalKey("merchantFeatureByID", "");
                SBExtension.store.storeGlobalKey("merchantFeatureByOrder", "");
                SBExtension.tabStateHandler.setMerchants(true, data.hashMerchant, data.country, oldCountry);
                SBExtension.store.storeGlobalKey("SE_COUNTRY", data.country);
            }
            SBExtension.globalState.loginState = "1";
            if (curPopupState)
                curPopupState.loginState = 1;
            SBExtension.config.heartBeatTS = this.memberInfo.heartBeatTS;
            SBExtension.globalState.heartBeatTS = this.memberInfo.heartBeatTS;
            if (SBExtension.MerchantStats) {
                var stateObj = new SBExtension.MerchantStats().getState();
                stateObj.setLogin(this.memberInfo.memberID);
                if (SBExtension.store.getTbUID()) {
                    var stateTB = new SBExtension.Stats().getState();
                    stateTB.setLogin(this.memberInfo.memberID, oldMemberID);
                }
            }
        } else {
            curPopupState.memberInfo = this.memberInfo;
            SBExtension.globalState.loginState = "0";
            if (curPopupState)
                curPopupState.loginState = 0;
        }
		SBExtension.browser.executeForSelectedTab(null, function(tab) {
			var tbId = SBExtension.browser.getTabID(tab);
			SBExtension.actionHandler.onUserAction("AnimateEmpty", tbId); 
		});
        this.getStateForTab(tab);

        this.memberInfo = SBExtension.globalState.updateMemberInfo(this.memberInfo);
        SBExtension.store.storeGlobalKey("SBmemberInfo", JSON.stringify(this.memberInfo));
        if (curPopupState) {
            curPopupState.memberInfo = this.memberInfo;
            curPopupState.save();
            SBExtension.globalState.isLogin = false; // curPopupState.isLogin = false;
            SBExtension.globalState.dirty = true;
            if (SBExtension.popup && SBExtension.popup.calculateGlobalState) {
                SBExtension.popup.calculateGlobalState(curPopupState, curPopupCallback, popupCallback);
            }
        }
    } catch (e) {
        SBExtension.alert_debug('ERROR IN onStateSuccess: ' + e.message, e);
    }
    SBExtension.globalState.dirty = true;
}

SBNetwork.prototype.onPCodeSuccess = function (data, calledFromPopup, remotePopupCallback, popupCallback) {
    try {
        var tab = (calledFromPopup && calledFromPopup.id) ? calledFromPopup : (SBExtension.browser) ? SBExtension.browser.selectedTab : SBExtension.browserPopup.currentTab;
        var curPopupState = this.getInitializedPopupState(data, calledFromPopup, tab);
        var curPopupCallback = (calledFromPopup) ? remotePopupCallback : popupCallback;
        if (SBExtension.getAvailableBrowser().executeForAllPopups) {
            SBExtension.getAvailableBrowser().executeForAllPopups(
				function (popup) {
				    SBExtension.popupSetPCodeCallback(popup, data);
				}
			);
        }
        if (data.pCodeID > 0)
            SBExtension.store.storeGlobalKey("SE_SCODE_" + data.pCodeID, "1");
    } catch (e) {
        SBExtension.alert_debug('onPCodeSuccess: ' + e.message, e);
    }
}

SBNetwork.prototype.onDailyWinSuccess = function(data, count) {
		try{
			if (typeof count == "undefined")
				count = (!data || data.param == "undefined") ? 0 : data.param;
			if (data && data.msg > 0 || data.calledMethodName == "onLoginSuccess" || data.calledMethodName == "onLogoutSuccess") {
				// We don't show any custom notificfation here as - unlike toolbar - we already have generic orange dot notification and user can access his ledger right here...
			} else {
				var hash = data.hash;
				// If we failed, we will try just one more time with the new hash...
				if (!count && hash) {
					count = 1;
					SBExtension.store.storeGlobalKey("SE_HASH", hash);
					SBExtension.store.storeGlobalKey("SE_HASH_TS", data.ts);
					this.handleDailyWin(count);
				}
			}
			this.pollForDailyWin();
		} catch(e) {
			SBExtension.alert_debug('onDailyWinSuccess: ' + e.message, e);
		}
}

SBNetwork.prototype.onLogoutSuccess = function(data, calledFromPopup, remotePopupCallback, popupCallback) {
	try{
		if (data && data.loc) {
			SBExtension.config.loginCode = data.loc;
		}
		if (data && data.showSrvyProjID) {
			SBExtension.config.showSrvyProjID = data.showSrvyProjID;
		}
		SBExtension.alert_debug('STARTING onStateSuccess; calledFromPopup=' + JSON.stringify(calledFromPopup) + '; data=' + JSON.stringify(data) + '; this.popupState = ' + JSON.stringify(this.popupState) + '; curPopupCallback = ' + curPopupCallback); //, new Error());
		var tab = (calledFromPopup && calledFromPopup.id) ? calledFromPopup : (SBExtension.browser) ? SBExtension.browser.selectedTab : SBExtension.browserPopup.currentTab;
		var curPopupState = this.getInitializedPopupState(data, calledFromPopup, tab);
		var curPopupCallback = (calledFromPopup) ? ((remotePopupCallback==true) ? null : remotePopupCallback) : popupCallback;
		if (!data)
			data = {memberID:0};
		var oldMemberID = SBExtension.store.retrieveGlobalKey("SELastMemberID");
		this.memberInfo = data;
		// SE_HASH MODIFICATION !!!
		SBExtension.store.clearKey("SE_HASH", true);
		SBExtension.store.clearKey("SE_HASH_TS", true);
		SBExtension.globalState.loginState = "0";

		if (this.checkTesterCallback(data, false)) {
			return;
		}

		SBExtension.browser.executeForSelectedTab(null, function(tab) {
			var tbId = SBExtension.browser.getTabID(tab);
			//debugger;
			SBExtension.actionHandler.onUserAction("AnimateEmpty", tbId); 
		}); 
		var stateObj = new SBExtension.MerchantStats().getState();
		stateObj.setLogin(SBExtension.network.memberInfo.memberID);
		if(SBExtension.store.getTbUID()){
			var stateTB = new SBExtension.Stats().getState();
			stateTB.setLogin(SBExtension.network.memberInfo.memberID, oldMemberID);
		}
		if (curPopupState)
			curPopupState.loginState = 0;

		this.getStateForTab(tab);

		if (curPopupState.setMemberInfo) {
			curPopupState.setMemberInfo(this.memberInfo);
		} else {
			SBExtension.alert_debug("SBNetwork.prototype.onLogoutSuccess: this.popupState.setMemberInfo is ABSENT!!!");
		}
		SBExtension.globalState.setMemberInfo(this.memberInfo);
		SBExtension.store.storeGlobalKey("SBmemberInfo", JSON.stringify(this.memberInfo));

		if (curPopupState) {
			curPopupState.save();
			SBExtension.globalState.dirty = true;
			if (SBExtension.popup && SBExtension.popup.calculateGlobalState) {
				SBExtension.popup.calculateGlobalState(curPopupState, curPopupCallback, popupCallback);
			}
		}
		if (SBExtension.getAvailableBrowser().executeForAllPopups  &&  remotePopupCallback!=true) {
			SBExtension.getAvailableBrowser().executeForAllPopups(
				function(popup) {
					SBExtension.alert_debug("onLogoutSuccess: BEFORE popup.SBExtension.popupUILogin.viewLoginPage()");
					SBExtension.popupViewLoginPageCallback(popup);
					SBExtension.alert_debug("onLogoutSuccess: AFTER popup.SBExtension.popupUILogin.viewLoginPage()");
				}
				, ["popupViewLoginPageCallback", "@popup@"] //{"method":"popupViewLoginPageCallback", "@popup@":'@popup@'}
			);
		}
	} catch(e) {
		SBExtension.alert_debug('ERROR IN onLogoutSuccess: ' + e.message, e);
	}
	SBExtension.globalState.dirty = true;
}

SBNetwork.prototype.pollForDailyWin = function(interval) {
		var this_ = this;
		setTimeout(function() {
			this_.handleDailyWin();
		}, interval || 86400000);
}

SBNetworkCommon.prototype.onRefreshSBSuccess = function (data, calledFromPopup, remotePopupCallback, popupCallback) {
    try {
        var tab = (calledFromPopup && calledFromPopup.id) ? calledFromPopup : (SBExtension.browser) ? SBExtension.browser.selectedTab : SBExtension.browserPopup.currentTab;
        var curPopupState = this.getInitializedPopupState(data, calledFromPopup, tab);
        var curPopupCallback = (calledFromPopup) ? remotePopupCallback : popupCallback;
        SBExtension.globalState.retrieve();
        var newAmnt = SBExtension.globalState.memberInfo.sBs;
        var result = data.split("|");
        if (result[0] == 1) {
            newAmnt = "" + result[1];
            SBExtension.globalState.memberInfo.sBs = newAmnt;
            SBExtension.globalState.save();
        }
        if (SBExtension.popupUI && SBExtension.popupUI[SBExtension.POPUP_ID_ACCT] && SBExtension.popupUI[SBExtension.POPUP_ID_ACCT].onReloadPntsSuccess) {
            SBExtension.popupUI[SBExtension.POPUP_ID_ACCT].onReloadPntsSuccess(data);
        } else if (curPopupCallback) {
            curPopupCallback(data);
        }
    } catch (e) {
        SBExtension.alert_debug('onRemoteCallSBSuccess: ' + e.message, e);
    }
}

SBExtension.network = new SBNetwork();
if (SBExtension.getIEVersion()<=0) {
    SBExtension.networkPopup = SBExtension.network;
}

