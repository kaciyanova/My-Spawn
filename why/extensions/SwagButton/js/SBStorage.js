var SBExtension_nativeLocalStorage = SBExtension.getAvailableBrowser().getNativeLocalStorage();

try {

SBExtension.store = {
    domStorageManager: null,
    domStorageUri: null,
    ioService: null,
    scriptSecManager: null,
    scriptSecPrincipal: null,
    nativeLocalStorage: SBExtension_nativeLocalStorage,
    localStorage: (SBExtension.getAvailableBrowser().isLocalStoragePreset()) ? ((SBExtension_nativeLocalStorage) ? SBExtension_nativeLocalStorage : localStorage) : null,
    cachedSbDomainName: (SBExtension.getAvailableBrowser().isLocalStoragePreset()) ? SBExtension.config.sbDomainName : null,
    initialized: SBExtension.getAvailableBrowser().isLocalStoragePreset(),
    haventCalledGetTbUID: true,
    getLocalStorage: function() {
        if (!SBExtension.store.initialized) {
            SBExtension.store.initialized = true;
            SBExtension.store.localStorage = SBExtension.getAvailableBrowser().getLocalStorage();
            var browser = SBExtension.browser;
            if (browser && browser.getSettings) {
            	browser.getSettings();
            }
        }
        return SBExtension.store.localStorage;
    },
    storeGlobalKey : function(key, value){              // Storing key function
        var obj = false;
        if (typeof(value) == 'object'){
            value = JSON.stringify(value);
            obj = true;
        }
        SBExtension.store.getLocalStorage().setItem(key, obj ? 'obj_'+value : value+'');
    },
    retrieveGlobalKey : function(key, callback) {                  // Retrieving key function
        var val;
        try {
          val = SBExtension.store.getLocalStorage().getItem(key, function(val) {
            if (callback) {
                if (val && val.indexOf('obj_') == 0){
                    val = val.slice(4,val.length);
                    val = JSON.parse(val);
                }
                callback(val);
            }
          });
          if (val && val.indexOf('obj_') == 0){
            val = val.slice(4,val.length);
            val = JSON.parse(val);
          }
        } catch(err) {
            SBExtension.alert_debug('store.retrieveGlobalKey: ' + err, err);
        }
        return val;
    },
    clearKey : function(key,removing){
        if (removing) {
            SBExtension.store.getLocalStorage().removeItem(key);
            return;
        }
        if (SBExtension.store.getLocalStorage()) { //localStorage){
            SBExtension.store.getLocalStorage().setItem(SBExtension.config.keyPrefix + key, '');
        }
    },
    storeTbUID: function(tbUID, ignoringFirstTime) {
    	var tbUIDStr = ""+tbUID;
    	SBExtension.store.storeGlobalKey("SSE_TBUID", tbUIDStr);
    	var storedTbUID = "";
    	if (SBExtension.browser && SBExtension.browser.setTbUID) {
    		if (SBExtension.browser.getTbUID) {
    			storedTbUID = SBExtension.browser.getTbUID();
    			ignoringFirstTime = false;
    		}
    		SBExtension.browser.setTbUID(tbUIDStr);
    	}
    	var lastTbUIDModified = (ignoringFirstTime) ? false : (storedTbUID != tbUIDStr);
    	SBExtension.store.lastTbUIDModified = lastTbUIDModified;
    	if (lastTbUIDModified) {
    		SBExtension.store.lastTbUIDModifiedInSession = lastTbUIDModified;
    	}
    	SBExtension.store.lastTbUID = tbUID;
    },
    isActiveNotificationState: function() {
    	try{
    		var allAlerts = SBExtension.store.loadAlerts();
    		for (var i in allAlerts) {
    			var typeAlerts = allAlerts[i];
    			for (var j in typeAlerts) {		
    				var alert = typeAlerts[j];
    				if (alert.tsSeen == 0) {
    					return true;
    				}
    			}
    		}
    		return false;
    	} catch(e) {
    		SBExtension.alert_debug('store.isActiveNotificationState: ' + e, e);
    	}
    },
    peekTbUID: function() {
        var tbUID = SBExtension.store.retrieveGlobalKey("SSE_TBUID");
        if (!tbUID && SBExtension.browser && SBExtension.browser.getTbUID) {
            tbUID = SBExtension.browser.getTbUID();
        }
        return tbUID;
    },
    getTbUID: function(callback, firstPopupShown) {
    	if (callback && SBExtension.store.haventCalledGetTbUID && (typeof firstPopupShown == "undefined")) {
    		SBExtension.store.retrieveGlobalKey("FirstPopupShown", function(firstPopupShown) {
    			SBExtension.store.getTbUID(callback, (typeof firstPopupShown == "undefined") ? -1 : firstPopupShown);
    		});
    		return;
    	}
    	if (SBExtension.store.haventCalledGetTbUID) {
    		if (!callback) {
    			firstPopupShown = SBExtension.store.retrieveGlobalKey("FirstPopupShown");
    		}
    		if (firstPopupShown == null) {
    			SBExtension.store.storeGlobalKey("FirstPopupShown", "0");
    		}
    	}
    	SBExtension.store.haventCalledGetTbUID = false;
        var tbUID = SBExtension.store.lastTbUID;
    	if (tbUID) {
    		if (callback) {
    			callback(tbUID);
    		}
    		return tbUID;
    	}
    	tbUID = SBExtension.store.retrieveGlobalKey("SSE_TBUID", (callback) ? function(tbUID) {SBExtension.store.getTbUIDOnRetrieveSSE_TBUID(tbUID, callback)} : undefined);
    	if (!callback) {
    		return SBExtension.store.getTbUIDOnRetrieveSSE_TBUID(tbUID);
    	}
    },
    getTbUIDOnRetrieveSSE_TBUID: function(tbUID, callback) {
    	if (tbUID) {
    		var tbUIDStr = "" + tbUID;
    		if (parseInt(tbUIDStr)==tbUIDStr) {
    			if (!SBExtension.store.checkedBackup) {
    			    	SBExtension.store.checkedBackup = true;
    				if (SBExtension.browser && SBExtension.browser.getTbUID) {
    					var tbUIDBkp = SBExtension.browser.getTbUID();
    					if (tbUIDBkp != tbUIDStr) {
    						SBExtension.store.storeTbUID(tbUIDStr, true);
    					}
    				}
    			}
    			SBExtension.store.lastTbUID = tbUID;
    			if (callback) {
    				callback(tbUID);
    			}
    			return tbUID;
    		}
    	}
    	if (!tbUID && SBExtension.browser && SBExtension.browser.getTbUID) {
    		tbUID = SBExtension.browser.getTbUID();
    	}
    	if (!tbUID) {
    		tbUID = SBExtension.store.retrieveGlobalKey("SE_TBUID", (callback) ? function(tbUID) {SBExtension.store.getTbUIDOnRetrieveSE_TBUID(tbUID, callback)} : undefined);
    	}
    	if (!callback) {
    		return SBExtension.store.getTbUIDOnRetrieveSE_TBUID(tbUID);
    	}
    },
    getTbUIDOnRetrieveSE_TBUID: function(tbUID, callback) {
    	if (tbUID) {
    		var tbUIDStr = "" + tbUID;
    		if (parseInt(tbUIDStr)==tbUIDStr) {
    			SBExtension.store.storeTbUID(tbUID);
    			if (callback) {
    				callback(tbUID);
    			}
	    		return tbUID;
    		}
    	}
    	SBExtension.store.lastTbUID = SBExtension.store.setForceTbUID();
    	if (callback) {
    		callback(BExtension.store.lastTbUID);
    	}
    	return SBExtension.store.lastTbUID;
    },
    setTbUID: function(tbid) {
    	var tbUID = SBExtension.store.retrieveGlobalKey("SSE_TBUID");
    	if (tbUID == tbid) {
        	return tbUID;
    	} else {
    		tbUID = SBExtension.store.retrieveGlobalKey("SE_TBUID");
    		if (tbUID) {
    			SBExtension.store.storeTbUID(tbUID);
    			if (tbUID == tbid) {
    				return tbUID;
			}
    		}
    	}
    	tbUID = tbid;
    	if(tbid > 0){
    		tbUID = tbid * -1;
    	}
    	SBExtension.store.storeTbUID(tbUID);
    	return tbUID;
    },
    setForceTbUID: function() {
    	var array = new Uint32Array(1);
    	SBExtension.getRandomValues(array);
    	var tbUID = new Date().getTime() * 4096 + (array[0]%4096);
    	SBExtension.store.storeTbUID(tbUID);
        return tbUID;
    },
    clearKeysByPrefixes: function(prefixes) {
    	if (SBExtension.store.nativeLocalStorage) {
    		SBExtension.store.nativeLocalStorage.clearKeysByPrefixes(prefixes);
		return;
	}
	if (typeof prefixes == "string") {
		prefixes = (prefixes.length>0) ? prefixes.substring(1).split(prefixes[0]) : [prefixes];
	}
	var locStor = SBExtension.store.getLocalStorage();
	for (key in locStor) {
		for (var idx in prefixes) {
			if (key.indexOf(prefixes[idx])==0) {
				SBExtension.store.clearKey(key,true);
				break;
			}
		}
	}
    },
    retrieveGlobalState: function() {
		return SBExtension.store.retrieveGlobalKey("GlobalState_");
    },
    storeGlobalState: function(globalState) {
		globalState.ts = new Date().getTime();
		SBExtension.store.storeGlobalKey("GlobalState_", globalState);
		SBExtension.store.storeGlobalKey("popUpSE_loginState", globalState.loginState);
    },
    onPageLoadAfterInstall: function() {
		// Returns true if it is NOT the first page load OR if it's NOT the first browser start after installation !!!
		var tbUID = SBExtension.store.peekTbUID();
		var firstSessionAfterInstall = (!tbUID || SBExtension.store.lastTbUIDModifiedInSession);
		var res = (SBExtension.store.firstPageLoadAfterInstall || SBExtension.store.retrieveGlobalKey("SSE_FIRST_PAGE_LOADED")) ? true : false;
		if (!res) {
			if (firstSessionAfterInstall) {
				SBExtension.store.firstPageLoadAfterInstallBeforeInit = true;
			} else {
				res = true;
			}
			SBExtension.store.storeGlobalKey("SSE_FIRST_PAGE_LOADED", "1");
		}
		SBExtension.store.firstPageLoadAfterInstall = true;
		return res;
    },
    onLoadAlerts: function(allAlerts) {
		for (var alertType in allAlerts) {
			var typeAlerts = allAlerts[alertType];
			for (var alertId in typeAlerts) {
				var alert = SBExtension.createAlert(typeAlerts[alertId], alertId, true);
				typeAlerts[alertId] = alert;
			}
		}
    },
    loadAlerts: function(callback) {
		//var keyName = "popUpSE_alertsClicked";
		var keyName = "SEAlerts";
		var callbackCalled = false;
		var allAlerts = SBExtension.store.retrieveGlobalKey(keyName, (callback) ? function(allAlerts) {
			SBExtension.store.onLoadAlerts(allAlerts);
			callback(allAlerts);
			callbackCalled = true;
		} : undefined);
		if (allAlerts && !callbackCalled) {
			SBExtension.store.onLoadAlerts(allAlerts);
			if (callback) {
				callback(allAlerts);
			}
		}
		return allAlerts;
    },
    saveAlerts: function(alerts, clearingFirst) {
		//var keyName = "popUpSE_alertsClicked";
		var keyName = "SEAlerts";
		var globalKeyStored = false;
		var onLoadAllAlerts = function(allAlerts) {
			if (!allAlerts) {
				allAlerts = {};
			}
			for (var idx in alerts) {
				var alert = alerts[idx];
				var alertType = alert.alertType;
				var typeAlerts = allAlerts[alertType];
				if (!typeAlerts) {
					typeAlerts = {};
					allAlerts[alertType] = typeAlerts;
				}
				typeAlerts[alert.id] = alert;
			}
			SBExtension.store.storeGlobalKey(keyName, allAlerts);
			globalKeyStored = true;
		};
		if (!clearingFirst) {
			allAlerts = SBExtension.store.loadAlerts(onLoadAllAlerts);
			if (allAlerts && !globalKeyStored) {
				onLoadAllAlerts(allAlerts);
			}
			return;
		}
		SBExtension.store.storeGlobalKey(keyName, alerts);
    }
};

if (SBExtension.store.initialized) {
    var browser = SBExtension.browser;
    if (browser && browser.getSettings) {
    	browser.getSettings();
    }
}

} catch(err) {
    console.log("ERROR in SBStorage.js: " + err.stack);
}