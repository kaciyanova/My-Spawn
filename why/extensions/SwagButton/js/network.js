// This method extends original Toolbar remote call infrastructure
// to cover for all new state-related methods/queries

try {

// To make it foolproof and easy to test -- this file will be ignored on non-IE WHEN INSIDE THE POPUP!!!

if (SBExtension.getIEVersion() || SBExtension.browser) {

if (!window.jqSB) {
	var jqSB = $;
}

SBNetworkCommon = function() {
	this.memberInfo = null;
	this.popupState = null;
};

SBNetworkCommon.prototype.constructor = SBNetworkCommon;

SBNetworkCommon.prototype.login = function(loginData, callback, state){
	this.popupState = state;
	this.handleLogin(loginData, callback);
};

SBNetworkCommon.prototype.checkStateBG = function(loginData, callback, state){
	this.popupState = state;
	this.checkState(undefined, undefined, undefined, callback);
};

SBNetworkCommon.prototype.logout = function(callback, state){
	delete state.memberInfo;
	state.loginState = 0;
	this.popupState = state;
	this.handleLogout(callback);
};

SBNetworkCommon.prototype.checkForPCode = function (callback, state) {
    this.popupState = state;
    this.handlePCode(callback);
};

SBNetworkCommon.prototype.refreshSB = function (callback, state) {
    this.popupState = state;
    this.handleRefreshSB(callback);
};

SBNetworkCommon.prototype.getCurrentMemberID = function() {
    return (this.memberInfo && this.memberInfo.memberID) ? this.memberInfo.memberID : 0;
};

SBNetworkCommon.prototype.getStateToSend = function(installFlagParam, ignoringStateChangeHistory) {
	var  mid = this.getCurrentMemberID();
	return SBExtension.getStateToSend(installFlagParam, ignoringStateChangeHistory, mid);
}

SBNetworkCommon.prototype.reportExtnStateChange = function(stateRecord, async) {
	if (async) {
		setTimeout( function() {
			SBExtension.networkPopup.doReportStateChange(stateRecord);
		}, 0);
	} else {
		SBExtension.networkPopup.doReportStateChange(stateRecord);
	}
}

SBNetworkCommon.prototype.checkFulcrumSurveyAvailability = function(surveyIDsStr, asyncTimeout, successCallback, errorCallback) {
	if (asyncTimeout) {
		asyncTimeout *= 1000; // secs -> msecs
		var asyncInterval = (asyncTimeout>0) ? 0 : -asyncTimeout;
		asyncTimeout = (asyncTimeout<0) ? SBExtension.getInitialFulcrumCheckTimeout() : asyncTimeout;
		var checkFulcrumSurveyAvailabilityLoop = setTimeout( function() {
			SBExtension.networkPopup.doCheckFulcrumSurveyAvailability(surveyIDsStr, successCallback, errorCallback, asyncInterval);
		}, asyncTimeout);
		if (asyncInterval)
			SBExtension.checkFulcrumSurveyAvailabilityLoop[surveyIDsStr] = checkFulcrumSurveyAvailabilityLoop;
	} else {
		SBExtension.networkPopup.doCheckFulcrumSurveyAvailability(surveyIDsStr, successCallback, errorCallback);
	}
}

SBNetworkCommon.prototype.doCheckFulcrumSurveyAvailability = function(surveyIDsStr, successCallback, errorCallback, asyncTimeout) {
	try {
		if (!surveyIDsStr || !surveyIDsStr.length) {
			return;
		}
		var url = "http://" + SBExtension.config.sbHostName + '/?cmd=survey-filter-invalid&project_ids=' + surveyIDsStr + '&rnd='+Math.random();
		var ajaxCall = {
			type : 'GET',
			url : url,
			data : {},
			success : function(resp) {
				if (successCallback) {
					if (resp.length<2 || resp.charAt(0) == "0") {
						if (errorCallback) {
							errorCallback(data);
						}
						return;
					}
					var data = [];
					try {
						data = JSON.parse("[" + resp.substring(2) + "]");
					} catch(err) {
						if (errorCallback) {
							errorCallback(data);
						}
						return;
					}
					var canRepeat = successCallback(data);
					if (asyncTimeout && canRepeat) {
						SBExtension.networkPopup.checkFulcrumSurveyAvailability(surveyIDsStr, -asyncTimeout, successCallback, errorCallback);
					}
				}
			},
			error: function(data){
				SBExtension.alert_debug ("ERROR result from doCheckFulcrumSurveyAvailability; url: " + url + "; request data: " + JSON.stringify(stateRecord) + "; response data: " + JSON.stringify(data));
				if (errorCallback) {
					errorCallback(data);
				}
			},
			crossDomain: true
		};
		SBExtension.getAvailableBrowser().addSecurityFieldsToAjaxCall(ajaxCall, {dataType: 'html', xhrFields: {withCredentials: true}});
		if (SBExtension.getAvailableBrowser().executeAjaxCall) {
			SBExtension.getAvailableBrowser().executeAjaxCall(ajaxCall);
		} else {
			jqSB.ajax(
				ajaxCall
			);
		}
	} catch(e) {
		SBExtension.alert_debug('ERROR checkFulcrumSurveyAvailability: ' + e.message, e);
	}
}

SBNetworkCommon.prototype.checkMBSurveyAvailability = function(dwId, cmpId, asyncTimeout, successCallback, errorCallback) {
  try {
	if (asyncTimeout) {
		asyncTimeout *= 1000; // secs -> msecs
		var asyncInterval = (asyncTimeout>0) ? 0 : -asyncTimeout;
		asyncTimeout = (asyncTimeout<0) ? SBExtension.getInitialMBCheckTimeout() : asyncTimeout;
		var checkMBSurveyAvailabilityLoop = setTimeout( function() {
			SBExtension.networkPopup.doCheckMBSurveyAvailability(dwId, [cmpId], successCallback, errorCallback, asyncInterval);
		}, asyncTimeout);
		if (asyncInterval)
			SBExtension.checkMBSurveyAvailabilityLoop[cmpId] = checkMBSurveyAvailabilityLoop;
	} else {
		SBExtension.networkPopup.doCheckMBSurveyAvailability(dwId, [cmpId], successCallback, errorCallback);
	}
  } catch(err) {
	SBExtension.alert_debug("ERROR in networkCommon.checkMBSurveyAvailability: err=" + err, err);
  }
}

SBNetworkCommon.prototype.doCheckMBSurveyAvailability = function(dwId, cmpIds, successCallback, errorCallback, asyncTimeout) {
	try {
		if (!cmpIds || !cmpIds.length) {
			return;
		}
		var sz = cmpIds.length;
		var url = "http://surveys.insightexpressai.com/ix/enterPartner.aspx?partnerID=121&g=" + dwId + '&test=true&testCampaigns=' + cmpIds[0];
		for (var idx=1; idx<sz; idx++) {
			url += (','+cmpIds[idx]);
		}
		var ajaxCall = {
			type : 'GET',
			url : url,
			data : {},
			success : function(data) {
				if (successCallback) {
					var canRepeat = successCallback(data);
					if (asyncTimeout && canRepeat) {
						SBExtension.networkPopup.checkMBSurveyAvailability(dwId, cmpIds, -asyncTimeout, successCallback, errorCallback);
					}
				}
			},
			error: function(data){
				SBExtension.alert_debug ("ERROR result from doCheckMBSurveyAvailability; url: " + url + "; request data: " + JSON.stringify(stateRecord) + "; response data: " + JSON.stringify(data));
				if (errorCallback) {
					errorCallback(data);
				}
			},
			crossDomain: true
		};
		SBExtension.getAvailableBrowser().addSecurityFieldsToAjaxCall(ajaxCall, {dataType : 'JSON', xhrFields: {withCredentials: true}});
		if (SBExtension.getAvailableBrowser().executeAjaxCall) {
			SBExtension.getAvailableBrowser().executeAjaxCall(ajaxCall);
		} else {
			jqSB.ajax(
				ajaxCall
			);
		}
	} catch(e) {
		SBExtension.alert_debug('ERROR checkMBSurveyAvailability: ' + e.message, e);
	}
}

SBNetworkCommon.prototype.doReportStateChange = function(stateRecord) {
	try {
		var url = "http://" + SBExtension.config.sbHostName + '/?cmd=tbf-jx-state-change&ext=1&rnd='+Math.random();
		var ajaxCall = {
			type : 'POST',
			url : url,
			data : stateRecord,
			success : function(data) {
				// The record has been successfully processed on the server. Store it in localStorage
				SBExtension.store.storeGlobalKey("SSE_LastSentTS", stateRecord);
			},
			error: function(data){
				SBExtension.alert_debug ("ERROR result from doReportStateChange; url: " + url + "; request data: " + JSON.stringify(stateRecord) + "; response data: " + JSON.stringify(data));
			},
			crossDomain: true
		};
		SBExtension.getAvailableBrowser().addSecurityFieldsToAjaxCall(ajaxCall, {dataType : 'JSON', xhrFields: {withCredentials: true}});
		if (SBExtension.getAvailableBrowser().executeAjaxCall) {
			SBExtension.getAvailableBrowser().executeAjaxCall(ajaxCall);
		} else {
			jqSB.ajax(
				ajaxCall
			);
		}
	} catch(e) {
		SBExtension.alert_debug('ERROR doReportStateChange: ' + e.message, e);
	}
}

SBNetworkCommon.prototype.fetchLoginData = function() {
		var loginData = {
			emailAddress : jqSB("#sbxTbUsername").val(),
			pswd : jqSB("#sbxTbPassword").val()
		};
		if (jqSB("#persistLocal").prop("checked")) {
			loginData.persist = "on";
		}
		return loginData;
}

SBNetworkCommon.prototype.checkState = function(intervalEvent, intervalObject, intervalEventMethod, callback) {
		var data = {
			type : 'GET',
			method : 5,
			callback : intervalEvent ? SBExtension.updateController.intervalEvent : this.onStateSuccess,
			callbackMethod: intervalEventMethod ? intervalEventMethod : ((intervalEvent) ? "updateController.intervalEvent" : "network.onStateSuccess"),
			popupCallback: callback
		};
		if (intervalObject)
			data.object = intervalObject;
		else if (intervalEvent)
		    data.object = SBExtension.updateController;
		this.remoteCall(data);
}

SBNetworkCommon.prototype.handleLogin = function(loginData, callback) {
		var data = {
			type : 'POST',
			secure: true,
			method : 1,
			data : loginData,
			callback : this.onLoginSuccess,
			callbackMethod : "network.onLoginSuccess",
			popupCallback: callback
		};
		this.remoteCall(data);
}

SBNetworkCommon.prototype.handlePCode = function(callback) {
		data = {
			method : 2,
			callback: this.onPCodeSuccess, //((!this.onPCodeSuccess || !SBExtension.network) ? SBExtension.popupUI[SBExtension.POPUP_ID_ACCT].onReloadPntsSuccess : this.onPCodeSuccess),
			callbackMethod : "network.onPCodeSuccess",
			popupCallback: callback
		};
		this.remoteCall(data);
}

SBNetworkCommon.prototype.handleLogout = function(callback) {
		data = {
			method : 4,
			callback : this.onLogoutSuccess,
			callbackMethod : "network.onLogoutSuccess",
			popupCallback: callback
		};
		this.remoteCall(data);
}

SBNetworkCommon.prototype.handleRefreshSB = function(callback) {
	data = {
		url : "http://" + SBExtension.config.sbHostName + "/?cmd=sb-jx-refreshsb&mid=" + this.memberInfo.memberID + "&rnd="+Math.random(),
		callback: this.onRefreshSBSuccess, //((!this.onRefreshSBSuccess || !SBExtension.network) ? SBExtension.popupUI[SBExtension.POPUP_ID_ACCT].onReloadPntsSuccess : this.onRefreshSBSuccess),
		callbackMethod : "network.onRefreshSBSuccess",
		popupCallback: callback
	};
	this.remoteCall(data, 'html');
}

SBNetworkCommon.prototype.extractGlobalStateFromPopupState = function(data) {
	SBExtension.globalState.retrieve();
	var globalState = (data.globalState) ? data.globalState : data;
	this.popupState = (data.popupState) ? data.popupState : globalState;
	if (globalState && globalState.ts) { // && (!SBExtension.globalState || (SBExtension.globalState.ts<globalState.ts))) {
		SBExtension.globalState.setFrom(globalState);
		SBExtension.globalState.save();
	}
	this.memberInfo = SBExtension.globalState.memberInfo; //data;
	SBExtension.popupUIMain.setStateChange(); //SBExtension.globalState.stateArray, SBExtension.globalState.memberInfo, SBExtension.globalState.stateSEActiveArray);
}

SBNetworkCommon.prototype.onLoginSuccess = function(data, calledFromPopup, remotePopupCallback) {
	try{
		UNSUPPORTED_CALL_ERROR.NO_onLoginSuccess_IN_POPUP();
	} catch(e) {
		SBExtension.alert_debug('ERROR IN onLoginSuccess: ' + e.message, e);
	}
}

SBNetworkCommon.prototype.onStateSuccess = function(data, calledFromBroadcast) {
	try{
		UNSUPPORTED_CALL_ERROR.NO_onStateSuccess_IN_POPUP();
	} catch(e) {
		SBExtension.alert_debug('ERROR IN onStateSuccess: ' + e.message, e);
	}
}

SBNetworkCommon.prototype.onPCodeSuccess = function(data, calledFromBroadcast) {
	try{
		UNSUPPORTED_CALL_ERROR.NO_onPCodeSuccess_IN_POPUP();
	} catch(e) {
		SBExtension.alert_debug('ERROR IN onPCodeSuccess: ' + e.message, e);
	}
}

SBNetworkCommon.prototype.onLogoutSuccess = function(data, calledFromBroadcast) {
	try{
		UNSUPPORTED_CALL_ERROR.NO_onLogoutSuccess_IN_POPUP();
	} catch(e) {
		SBExtension.alert_debug('ERROR IN onLogoutSuccess: ' + e.message, e);
	}
}

SBNetworkCommon.prototype.remoteCall = function(callInfo, dataType) {
		var ajaxCall;
		try{
			var cmdNum = callInfo.method;
			var sentData = (callInfo.data) ? callInfo.data : {};
			var hash = (callInfo.hash) ? callInfo.hash : SBExtension.store.retrieveGlobalKey("SE_HASH");
			var ts = (callInfo.ts) ? callInfo.ts : SBExtension.store.retrieveGlobalKey("SE_HASH_TS");
			if (hash && ts) {
				sentData.hash = hash;
				sentData.ts   = ts;
			}
			if (!sentData.memberID) {
				if (this.memberInfo && this.memberInfo.memberID) {
					sentData.memberID = this.memberInfo.memberID;
				} else {
					var memberInfoStr = SBExtension.store.retrieveGlobalKey("SBmemberInfo");
					var memberInfo2 = (memberInfoStr) ? JSON.parse(memberInfoStr) : false;
					if (memberInfo2 && memberInfo2.memberID) {
						sentData.memberID = memberInfo2.memberID;
					}
					if (memberInfo2 && (!this.memberInfo || this.memberInfo.memberID!=memberInfo2.memberID)) {
						this.memberInfo = memberInfo2;
					}
				}
			}
			var url = (callInfo.url) ? callInfo.url : ((callInfo.secure)?"https://":"http://") + SBExtension.config.sbHostName + '/?cmd=tbf-jx-' + cmdNum + '&ext=1&rnd='+Math.random();
			
			jqSB.support.cors = true;

			//SBExtension.alert_debug("jqSB.support.cors = " + jqSB.support.cors);
			var this_ = this;
			var callState = {};
			ajaxCall = {
				type : callInfo.type || 'GET',
				url : url,
				headers: { 'x-swagbutton': '1' },
				data : sentData,
				success : function(responseData) {
				  try {
				  	if (responseData.loc) {
				  		SBExtension.config.loginCode = responseData.loc;
				  		SBExtension.globalState.loginCode = responseData.loc;
						SBExtension.store.storeGlobalKey("popUpSE_loginCode", SBExtension.config.loginCode);
				  	}
				  	if (responseData.showSrvyProjID) {
				  		SBExtension.config.showSrvyProjID = responseData.showSrvyProjID;
				  		SBExtension.globalState.showSrvyProjID = responseData.showSrvyProjID;
						SBExtension.store.storeGlobalKey("popUpSE_showSrvyProjID", SBExtension.config.showSrvyProjID);
				  	}
					var data = {popupState: this_.popupState, responseData: responseData, url: url, callInfo:callInfo};
					this_.callInfo = callInfo;
					SBExtension.getAvailableBrowser().onRemoteCallSuccess(this_, data, callState, callInfo);
				  } catch(err) {
					SBExtension.alert_debug("ERROR in success callback after ajaxCall!!! callInfo = " + JSON.stringify(callInfo) + "; responseData = " + JSON.stringify(responseData), err);
				  }
				},
				error: function(responseData){
				  try {
					var data = {popupState: this.popupState, responseData: responseData, url: url, callInfo:callInfo};
					this_.callInfo = callInfo;
					try {
						FAKE_OBJ.FAKE_CALL();
					} catch(err) {
						SBExtension.alert_debug("FAKE_ERROR. STACK TRACE FOR FIRST CALL IS ... callInfo = " + JSON.stringify(callInfo) + "; responseData = " + JSON.stringify(responseData) + "; url = " + url, err);
					}
					SBExtension.getAvailableBrowser().onRemoteCallError(this_, data, callState, callInfo);
				  } catch(err) {
					SBExtension.alert_debug("ERROR in error callback after ajaxCall!!! callInfo = " + JSON.stringify(callInfo) + "; responseData = " + JSON.stringify(responseData), err);
				  }
				},
				crossDomain: true
			};
			callState.ajaxCall = ajaxCall;
			SBExtension.getAvailableBrowser().addSecurityFieldsToAjaxCall(ajaxCall, {dataType : (dataType) ? dataType : 'JSON', xhrFields: {withCredentials: true}});

			var newStateRecord = this.getStateToSend();
			if (newStateRecord) {
				this.reportExtnStateChange(newStateRecord, true);
			}

			if (SBExtension.getAvailableBrowser().executeAjaxCall) {
			    function doExecuteAjaxCall(attemptIdx) {
			        if (attemptIdx==0) {
			            var succeeded = SBExtension.getAvailableBrowser().executeAjaxCall(ajaxCall, attemptIdx);
			            return succeeded;
			        } else {
			            setTimeout(function () {
			                var succeeded = SBExtension.getAvailableBrowser().executeAjaxCall(ajaxCall, attemptIdx++);
			                if (SBExtension.config.debugSystemErrorIsEnabled  &&  attemptIdx > 5) {
			                    SBExtension.alert_debug('executeAjaxCall failed (' + attemptIdx + ' times in a row!) for ajaxCall = ' + JSON.stringify(ajaxCall), {stack:"unknown"}, true);
			                    SBExtension.initialized = true;
			                    return;
			                }
			                if (succeeded > 0) {
			                    SBExtension.initialized = true;
			                    return;
			                }
			                doExecuteAjaxCall(attemptIdx);
			            }, attemptIdx*200);
			        }
			    }
			    var ajaxCallSucceeded = doExecuteAjaxCall(0);
			    if (typeof ajaxCallSucceeded != "undefined" && ajaxCallSucceeded < 0) {
			        doExecuteAjaxCall(1);
			    } else {
			        SBExtension.initialized = true;
			    }
			} else {
				jqSB.ajax(
					ajaxCall
				);
				SBExtension.initialized = true;
			}
		} catch(e) {
			SBExtension.alert_debug('remoteCall: ' + e.message + ' for ajaxCall = ' + JSON.stringify(ajaxCall), e, true);
			SBExtension.initialized = true;
		}
}

SBNetworkCommon.prototype.onRemoteCallSuccess = function (successData, currentTab, remoteCallback, callInfo) {
    var remoteCallbackCalled = false;
    var localCallbackCalled = false;
    var callInfo;
    var data;
    var this_ = this;
    var myCallback = function (param) {
        if (remoteCallbackCalled || successData.fromBG)
            return;
        if (!param)
            param = { popupState: this.popupState, globalState: SBExtension.globalState };
        var localSameAsRemote = (callInfo.callback==SBExtension.updateController.intervalEvent || callInfo.callbackMethod=="updateController.intervalEvent");
        if (remoteCallback) {
            remoteCallbackCalled = true;
            remoteCallback(param);
        } else if (!localCallbackCalled && callInfo && callInfo.callback) {
            localCallbackCalled = true;
            data.param = param.param;
            callInfo.callback.call((callInfo.object) ? callInfo.object : this_, data, currentTab, callInfo.popupCallback);
        }
        if (!remoteCallbackCalled && !(localSameAsRemote && localCallbackCalled)) {
            SBExtension.updateController.intervalEvent(param);
        }
    };
    try {
        var callInfo = successData.callInfo;
        if (successData.fromBG) {
            // This is the case the main job is already done by BG and we just got the state back from BG !!!
            callInfo = this.callInfo;
            var data = successData.stateFromBG;
            this.extractGlobalStateFromPopupState(data);
            SBExtension.store.storeGlobalKey("popUpSE_loginState", SBExtension.globalState.loginState);
            var respData = successData.responseData;
            try {
                if (respData && respData.responseData) respData = respData.responseData;
                if (typeof respData === "string") respData = JSON.parse(respData);
                if (respData && respData.loc) {
                    SBExtension.globalState.loginCode = respData.loc;
                    SBExtension.store.storeGlobalKey("popUpSE_loginCode", SBExtension.globalState.loginCode);
                }
                if (respData && respData.showSrvyProjID) {
                    SBExtension.globalState.showSrvyProjID = respData.showSrvyProjID;
                    SBExtension.store.storeGlobalKey("popUpSE_showSrvyProjID", SBExtension.globalState.showSrvyProjID);
                }
            } catch(err2) {}
            if (callInfo && callInfo.popupCallback) callInfo.popupCallback(SBExtension.globalState, respData);
            return;
        }
        // The rest of the method is executed in BG only !!!
        if (successData.popupResponseData) {
            // This is the case message from popup arrived to BG. Need to set callInfo etc. as needed!!!
            data = successData.popupResponseData;
            if (!callInfo) { callInfo = {}; callInfo.method = successData.callInfoMethod; }
            callInfo.callbackMethod = successData.callbackMethod;
            var objectRefAndMethod = SBExtension.getObjectAndMethodByName(callInfo.callbackMethod);
            callInfo.object = objectRefAndMethod[0];
            callInfo.callback = objectRefAndMethod[1];
        } else {
            data = successData.responseData;
        }
        // The rest of the method is executed in BG only based upon callInfo and data!!!
        var url = successData.url;
        this.popupState = successData.popupState;
        if (data && data.length) {
            try {
                data = JSON.parse(data);
            } catch (err) {
                if (typeof successData.callInfoMethod != "undefined") SBExtension.alert_debug("!!! ajaxCall.success ERROR in JSON.parse !!! data = " + data, err);
            }
        }
        SBExtension.alert_debug("AJAX SUCCESS in network.js -- for url: " + url + "; data: " + JSON.stringify(data));
        var shouldGetEncraveLists = false;
        if (data && data.hash && data.ts) {
            SBExtension.store.storeGlobalKey("SE_HASH", data.hash);
            SBExtension.store.storeGlobalKey("SE_HASH_TS", data.ts);
            if (SBExtension.Encrave && data.encraveTS) {
                if (data.encraveTS != SBExtension.Encrave.ts) {
                    SBExtension.store.storeGlobalKey("ENCRAVE_TS", data.encraveTS);
                    SBExtension.Encrave.ts = data.encraveTS;
                    shouldGetEncraveLists = true;
                }
            }
        }
        if (data.versionID && SBExtension.browser) {
            SBExtension.browser.checkForExtensionUpdate(true, data.versionID, data.lastCritVersionID, data.updateURL, false);
        }
        if (!data || !data.memberID && data.error == "invalid member") {
            SBExtension.alert_debug("IN TRY BEFORE this.onLogoutSuccess!!!");
            data.calledMethodName = "onLogoutSuccess";
            this.onLogoutSuccess(data, currentTab, (successData.popupResponseData||callInfo.callback) ? true : false, callInfo.popupCallback);
            if (SBExtension.updateController && SBExtension.updateController.intervalEvent) {
                callInfo.callback.call((callInfo.object) ? callInfo.object : this, data, currentTab, myCallback, callInfo.popupCallback);
                localCallbackCalled = true;
            }
        }
        else if (data.relogin) {
            if (data.memberID) {
                data.calledMethodName = "onLoginSuccess";
                this.onLoginSuccess(data, undefined, undefined, callInfo.popupCallback);
            } else {
                data.calledMethodName = "onLogoutSuccess";
                try { FAKE_ERROR.FAKE_METHOD(); } catch (err) { SBExtension.alert_debug("!!! PRIOR TO logout callback method!!! data=" + JSON.stringify(data) + "; callInfo=" + JSON.stringify(callInfo), err); }
                this.onLogoutSuccess(data, currentTab, (successData.popupResponseData||callInfo.callback) ? true : false, callInfo.popupCallback);
            }
            if (callInfo.callback) {
                callInfo.callback.call((callInfo.object) ? callInfo.object : this, data, currentTab, myCallback, callInfo.popupCallback);
            }
            localCallbackCalled = true;
        }
        else if (callInfo.callback) {
            if (callInfo.param && !currentTab) {
                callInfo.callback.call((callInfo.object) ? callInfo.object : this, data, callInfo.param, undefined, callInfo.popupCallback);
            } else {
                callInfo.callback.call((callInfo.object) ? callInfo.object : this, data, currentTab, myCallback, callInfo.popupCallback);
            }
            localCallbackCalled = true;
        } else {
            if (SBExtension.config.debugIsEnabled) { try { FAKE_ERROR.FAKE_METHOD(); } catch (err) { SBExtension.alert_debug("!!! UNDEFINED callInfo.callback method!!! callInfo=" + JSON.stringify(callInfo), err); } }
        }
        if (shouldGetEncraveLists) {
            var urlEncrave = "http://" + SBExtension.config.sbHostName + '/?cmd=tbf-get-encrave-list&rnd=' + Math.random();
            var ajaxCall = {
                type: 'GET',
                url: urlEncrave,
                success: function (data) {
                    try {
                        SBExtension.Encrave.setProperties(data);
                    } catch (e) {
                        SBExtension.alert_debug('remoteCall result: ' + e.message, e);
                    }
                },
                error: function (data, textStatus, errorThrown) {
                    SBExtension.alert_debug("ERROR remoteCall result url: " + urlEncrave + "; data: " + JSON.stringify(data));
                },
                crossDomain: true
            };
            SBExtension.getAvailableBrowser().addSecurityFieldsToAjaxCall(ajaxCall, { dataType: 'JSON', xhrFields: { withCredentials: true} });
            window.setTimeout(function () {
                if (SBExtension.getAvailableBrowser().executeAjaxCall) {
                    SBExtension.getAvailableBrowser().executeAjaxCall(ajaxCall);
                } else {
                    jqSB.ajax(
                        ajaxCall
                    );
                }
            }, 100);
        }
    } catch (e) {
        SBExtension.alert_debug('Error in remoteCall: data=' + data + '; Error: ' + e.message, e);
    }
    try {
        var fullState = { popupState: this.popupState, globalState: SBExtension.globalState, param: callInfo.param};
        myCallback(fullState);
    } catch (e) {
        SBExtension.alert_debug('Error in remoteCall calback: data=' + data + '; Error: ' + e.message, e);
    }
    return fullState;
}

SBNetworkCommon.prototype.onRemoteCallError = function(errorData, callInfo) {
	var callInfo = errorData.callInfo;
	if (errorData.stateFromBG) {
		// This is the case the main job is already done by BG and we just got the state back from BG !!!
		errorData.stateFromBG.stateFromBG = true;
		callInfo = this.callInfo;
		var data = successData.stateFromBG;
		this.extractGlobalStateFromPopupState(data); // SBExtension.globalState = 
                SBExtension.store.storeGlobalKey("popUpSE_loginState", SBExtension.globalState.loginState);
		if (callInfo && callInfo.popupCallback) callInfo.popupCallback(data);
		return;
	}
	// The rest of the method is executed in BG only !!!
	var data;
	if (errorData.responseData) {
		data = errorData.responseData;
	} else {
		// This is the case message from popup arrived to BG. Need to set callInfo etc. as needed!!!
		data = errorData;
		if (!callInfo) callInfo = {};
		callInfo.callbackMethod = data.callbackMethod;
		var objectRefAndMethod = SBExtension.getObjectAndMethodByName(callInfo.callbackMethod); // = SBExtension;
		callInfo.object = objectRefAndMethod[0];
		callInfo.callback = objectRefAndMethod[1];
	}
	// The rest of the method is executed in BG only based upon callInfo and data!!!
	var url = errorData.url;
	this.popupState = errorData.popupState;
	SBExtension.alert_debug ("ERROR remoteCall result url: " + url + "; data: " + JSON.stringify(data) + "; jqSB.support.cors = " + jqSB.support.cors + "; ");
	if (SBExtension.updateController && SBExtension.updateController.intervalEvent) {
		if (!callInfo.object) {
			if (SBExtension.config.debugIsEnabled) {try {FAKE_ERROR.FAKE_METHOD();} catch(err) {SBExtension.alert_debug ("!!! UNDEFINED callInfo.object to use in error callback method!!! callInfo=" + JSON.stringify(callInfo), err);}}
		}
		data.isErrorReceived = true;
		callInfo.callback.call((callInfo.object) ? callInfo.object : this, data, undefined, undefined, callInfo.popupCallback);
	}
}

SBNetworkCommon.prototype.noop = function(){
}

SBExtension.networkPopup = new SBNetworkCommon();

}

} catch(err) {
SBExtension.debug_alert("!!!!!!!!!!! ERROR initializing SBExtension.networkPopup !!! err = " + err);
}
