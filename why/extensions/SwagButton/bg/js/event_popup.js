// Major hi-level event processing for popup/popout management

SBExtension.PopupController = function() {
	this.popout = [];
	this.popoutsById = {};
	this.currentPopup = null;
	this.desiredPopupWidth  = 415;
	this.desiredPopupHeight = 435;
};

SBExtension.PopupController.prototype.openPopUP = function(tabId, url){
	SBExtension.browser.openPopUP(tabId, url);
};

SBExtension.PopupController.prototype.popupAction = function(section, under_section){
	SBExtension.browser.executeForSelectedTab(null, function(tab) {
		var tbId = SBExtension.browser.getTabID(tab);
		var tabState = SBExtension.tabStateHandler.getTabByTabId(tbId, "");
		if(tabState){
			tabState.section = section;
			tabState.under_section = under_section;
			tabState.saveInStore();
		}
	});
};

SBExtension.PopupController.prototype.watchPopout = function(pos){
	try {
		if (pos == -1) {
			return;
		}
		var popoutIsSupported = SBExtension.browser.isPopoutSupported();
		var popupCount = 0;
		if(SBExtension.browser.getPopoutByIndex(pos)){
			popupCount = 1;
		}
		var pop = SBExtension.browser.getPopoutByIndex(pos);
		if(pop){
			SBExtension.browser.focusOnPopout((popoutIsSupported) ? pop.id : pos);
		} else if(popupCount == 0) {
			this.initPopOut(pos);
		}
	} catch(e) {
		SBExtension.alert_debug('PopupController.watchPopout: ' + e, e);
	}
};

SBExtension.PopupController.prototype.initPopOut = function(pos){
	SBExtension.browser.initPopOut(pos);
};

SBExtension.PopupController.prototype.checkPosition = function(popOutID, pos){
	if (SBExtension.browser.isPopoutSupported()) {
		var pop = SBExtension.popup.popout[pos];
		var popIds = SBExtension.popup.popoutsById[popOutID];
		if(pop != null && popIds.pos != pos){
			SBExtension.browser.focusOnPopout(pop.id);
			return true;
		}
	}
	return false;
};

SBExtension.PopupController.prototype.checkPopOutPosition = function(pos){
	try{
		if (SBExtension.browser.isPopoutSupported()) {
			var pop = SBExtension.popup.popout[pos];
			if(pop != null){
				return pop.id;
			}else{
				return -1;
			}
		} else {
			var pop = null;
			try{
				pop = SBExtension.popup.popout[pos];
				if(pop && pop.closed){
					SBExtension.popup.popout[pos] = null;
				}
			} catch(e) {
				SBExtension.popup.popout[pos] = null;
				pop = null;
			}
			if(pop){
				SBExtension.popupUIMain.addLog(";\n id: " + pop.id + " pos: " + pop.pos + " se_position: " + pop.se_position, false);
				//return pop.id;
				return pos;
			}else{
				if(pos == 1){
					//alert("id: -1");	
				}
				SBExtension.popupUIMain.addLog("; position: -1", false);
				return -1;
			}
		}
	} catch(e) {
		SBExtension.alert_debug('PopupController.checkPopOutPosition: ' + e, e);
	}
};

SBExtension.PopupController.prototype.setPopOutPosition = function(popOutID, pos){
	try{
		SBExtension.browser.getPopoutByID(popOutID, pos);
		if(pop){
			for(var i = 0; i < 8; i++){
				var p = SBExtension.popup.popout[i];
				if(p && p.id == pop.id){
					SBExtension.popup.popout[i] = null;
					break;
				}
			}
			pop.pos = pos;
			if(!SBExtension.popup.popout[pos]){
				SBExtension.popup.popout[pos] = pop;
			}
		}
	} catch(e) {
		SBExtension.alert_debug('PopupController.setPopOutPosition: ' + e, e);
	}
};
//debugger;
SBExtension.PopupController.prototype.initPopUp = function (callbackBG, pop) {
    try {
        var tutorialStarted = SBExtension.store.retrieveGlobalKey('SETutorialStarted');
        if (tutorialStarted) {
            SBExtension.actionHandler.OpenTutorial();
            SBExtension.store.storeGlobalKey("popUpSE_MustBeClosed", "true");
            return;
        }
        var this_ = this;
        SBExtension.browser.executeForSelectedTab(null, function (tab) {
            var tbId = SBExtension.browser.getTabID(tab);
            var state = new PopupExtnState();
            var windowId = SBExtension.browser.getTabWindowID(tab);
            state.init(tbId, windowId, SBExtension.globalState.globalType, SBExtension.globalState.loginState);
            //link to current open popup
            SBExtension.popup.currentPopup = (pop) ? pop : {};
            SBExtension.popup.currentPopup.tabId = tbId;
            //calculate popup state
            this_.calculateGlobalState(state, callbackBG);
        });
    } catch (e) {
        SBExtension.store.clearKey("popUpSE_MustBeClosed", true);
        SBExtension.alert_debug('PopupController.initPopUp: ' + e, e);
    }
};

//var cnttt=0;
SBExtension.PopupController.prototype.calculateGlobalState = function (state, callbackBG, popupCallback) {
    try {
        var save = state.save;
        $.extend(state, SBExtension.globalState);
        state.save = save;

        state.stateArray = $.extend(true, {}, SBExtension.globalState.stateActiveArray);

        if (SBExtension.globalState.stateSEActiveArray[state.windowId] == 1) {
            state.stateArray[0] = 1;
        } else {
            state.stateArray[0] = SBExtension.globalState.stateActiveArray[0];
        }
        if (SBExtension.network.memberInfo) {
            state.setMemberInfo(SBExtension.network.memberInfo);
        }

        var mID = SBExtension.tabStateHandler.getMid(state.tabId);
        var lstUser = parseInt(state.lastUserSelTS);
        var lstVisit = parseInt(state.lastVisitedPageTS);

        state.merchantID = mID;

        var dirty0 = SBExtension.globalState.setFrom(state);
        var currentMenuItemNew = "";
        var newSelectionCause = -1;

        /*---------OLD LOGIC---------*/
        if (lstUser == 0 && lstVisit == 0) {
            currentMenuItemNew = state.getDefaultMenuItem();
            newSelectionCause = 2;
        } else
            if (lstUser > lstVisit  &&  !SBExtension.isPopupMenuItemDisabled(state.lastUserSelMenuItem)) {
                currentMenuItemNew = state.lastUserSelMenuItem;
                newSelectionCause = 0;
            } else
                if (lstUser > lstVisit && state.lastUserSelMenuItem == "") {
                    currentMenuItemNew = state.getDefaultMenuItem();
                    newSelectionCause = 2;
                } else
                    if (lstUser < lstVisit  &&  !SBExtension.isPopupMenuItemDisabled(state.lastVisitedPageMenuItem)) {
                        currentMenuItemNew = state.lastVisitedPageMenuItem;
                        newSelectionCause = 1;
                    } else
                        if (lstUser < lstVisit && state.lastVisitedPageMenuItem == "") {
                            currentMenuItemNew = state.getDefaultMenuItem();
                            newSelectionCause = 2;
                        } else {
                            currentMenuItemNew = state.getDefaultMenuItem();
                            newSelectionCause = 2;
                        }
        /*---------OLD LOGIC---------*/

        // This new logic sets state according to events' priorities !!!
        for (var i in state.stateArray) {
            if (state.stateArray[i] == 1  ||  (mID && i==SBExtension.POPUP_ID_SHOP)) {
                state.setPriority((state.stateArray[i]==1)?2:1, i);
            }
        }
        if (currentMenuItemNew != "") {
            // Decide between old and new logic...
            var prior = -1;
            if (newSelectionCause == 0) {
                prior = SBExtension.globalState.manualPriority[currentMenuItemNew];
            } else if (newSelectionCause == 1) {
                prior = SBExtension.globalState.navigationPriority[currentMenuItemNew];
            } else if (newSelectionCause == 2) {
                prior = SBExtension.globalState.pushNotifPriority[currentMenuItemNew];
            }
            if (prior > state.selectionPriority) {
                this.selectionPriority = prior;
                this.selectionMethod = newSelectionCause;
                this.currentMenuItem = currentMenuItemNew;
                this.curMenuItemIndex = SBExtension.getPopupMenuIndex(currentMenuItemNew);
            }
        }
        
        state.swagSearchExtensionId = SBExtension.swagSearchExtensionId;
        state.swagSearchExtensionExists = SBExtension.swagSearchExtensionExists;
        state.swagSearchExtensionEnabled = SBExtension.swagSearchExtensionEnabled;
        state.save();

        var popUpIndex = -1;
        var id = -1;
        for (var i = 0; i < 8; i++) {
            var pop = SBExtension.browser.getPopoutByIndex(i);
            //get position
            if (pop && pop.isNew) {
                pop.isNew = false;
                popUpIndex = i;
                id = pop.id;
                break;
            }
        }
        if (popUpIndex > -1) {
            SBExtension.popup.currentPopup == null;
        }

        var dirty = dirty0 || SBExtension.globalState.setFrom(state);
        SBExtension.globalState.save();
        SBExtension.globalState.dirty = dirty;

        try {
            var click = {};
            click.name = "clearNotification";
            SBExtension.browser.tabsSendMessage(parseInt(state.tabId), click);
        } catch (e) {
            SBExtension.alert_debug('PopupController.calculateGlobalState tabsSendMessage; e = ' + e, e);
        }

        if (callbackBG) {
            SBExtension.alert_debug('PopupController.calculateGlobalState BEFORE callbackBG : ' + callbackBG);

            var popupIsBeingOpened = SBExtension.browser.isPopupBeingOpened();
            if (popupIsBeingOpened || callbackBG==popupCallback) {
                if (SBExtension.browserPopup) {
                    SBExtension.browserPopup.setPopupBeingOpened(false);
                }
            }
            callbackBG(state, SBExtension.popup.popout, popUpIndex, id);
            SBExtension.alert_debug('PopupController.calculateGlobalState AFTER callbackBG');
        }

    } catch (e) {
        SBExtension.alert_debug('PopupController.calculateGlobalState; e = ' + e, e);
    }
};

SBExtension.PopupController.prototype.closePopOut = function(id){
	try{
		SBExtension.browser.closePopout(id);
	} catch(e) {
		SBExtension.alert_debug('PopupController.closePopOut: ' + e, e);
	}
};

SBExtension.PopupController.prototype.onPopupUnload = function(watchPos){
	if (SBExtension.store.isActiveNotificationState()) {
		// Restore the popup icon notification dot in case there is at least one menu item with notification dot still not cleared...
		var currentPopup = this.currentPopup;
		var curPopupTabID = (currentPopup) ? currentPopup.tabId : -1;
		SBExtension.actionHandler.onUserAction("AnimateReActive", curPopupTabID);
	} else {
		// Hide desktop notification if present...
		if (SBExtension.updateController.desktopNotification)
			SBExtension.updateController.hideDesktopNotification();
		// Hide popup icon notification dot in case there is NO menu items with notification dot still not cleared...
		var currentPopup = this.currentPopup;
		var curPopupTabID = (currentPopup) ? currentPopup.tabId : -1;
		SBExtension.actionHandler.onUserAction("AnimateReActive", curPopupTabID);
	}
	// Popout the Watch panel if needed...
	if (watchPos && SBExtension.globalState.isCountryFullySupported(SBExtension.POPUP_ID_SBTV)) {
		SBExtension.popup.watchPopout(watchPos); //SBExtension.popupUIMain.getMenuTypePosition('watch'));
	}
};

SBExtension.popup = new SBExtension.PopupController();
