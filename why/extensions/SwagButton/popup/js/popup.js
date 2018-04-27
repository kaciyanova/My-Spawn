// Main popup initialization/logic. 

// Logic for the "login" popup, shown when the extension is in the "logged out" state
//debugger;
try {

SBExtension.PopupUIMain = function () {
    this.sbPopoutIsLinked = SBExtension.browserPopup.isPopoutLinked();
    this.sbPopoutIsSupported = SBExtension.browserPopup.isPopoutSupported();
    this.initPopUpIsRequired = (SBExtension.browserPopup.initPopUpIsRequired) ? SBExtension.browserPopup.initPopUpIsRequired() : this.sbPopoutIsSupported;
    this.sbMenuJSIsSupported = SBExtension.browserPopup.isMenuJSSupported();
    this.globalState = SBExtension.createNewPopupExtnState();
    this.isPopOut = false;
    this.popOutID = -1;
    this.isMSite = false;
    this.tryResizingPopout = -1;
}

SBExtension.PopupUIMain.prototype.init = function() {
	var menuIdx = document.location.href.indexOf('?menu=');
	var menuOverride;
	if (menuIdx>0) {
		menuOverride = document.location.href.substring(menuIdx+6);
		SBExtension.store.storeGlobalKey("SSE_menuOverride", menuOverride);
	}
	$('#critical_update_submit', document).unbind('click')
	                                      .bind('click', function() {
		var prompt = SBExtension.browserPopup.getLocalizedString("promptCriticalUpdate");
		SBExtension.browserPopup.doConfirmUpdate(true, prompt);
	});
	$('#se_body', document).hide();
	try {
	    if (this.initPopUpIsRequired) {
	        SBExtension.browserPopup.setPopupBeingOpened(true);
	        SBExtension.browserPopup.initPopUp();
	        // Remove desktop notification and remember the state we started from...
	        if (SBExtension.updateController.hideDesktopNotification)
	            SBExtension.updateController.hideDesktopNotification();
	    }
	    if (this.sbMenuJSIsSupported) {
	        $('#watch-button-in,#watch-button-out').click(function() {
	            SBExtension.popupUIMain.header_wnd_right();
	        });
        if (!SBExtension.globalState.isCountryFullySupported(SBExtension.POPUP_ID_SBTV) || SBExtension.bg && SBExtension.bg.SBExtension && !SBExtension.bg.SBExtension.globalState.isCountryFullySupported(SBExtension.POPUP_ID_SBTV)) {
            $('#menu_watch', document).hide();
            $('.menu_icon', document).addClass("sbTvNotSupported");
        }
		$('div[id^=menu_]').click(function() {
			try {
				SBExtension.popupUIMain.changePopupMenu({target:this});
			} catch(err) {
				SBExtension.alert_debug("SBExtension.popupUIMain.changePopupMenu failed: err = " + err, err);
			}
		});
	    } else {
	        addLoadEvent(addLoadEventCallback);
	    }
	} catch(err) {
		SBExtension.alert_debug("!!!!!!!!!!!!! ERROR in popup init: err=" + err, err);
	}
};

SBExtension.PopupUIMain.prototype.isUpdatePopupVisible = function() {
	if (SBExtension.isCriticalUpdateAvailable()) {
		return false;
	}
	if (!SBExtension.isUpdateAvailable()) {
		return false;
	}
	return !SBExtension.config.isUpdatePopupHidden();
};

SBExtension.PopupUIMain.prototype.addUpdatePopupIfNeeded = function() {
	if (SBExtension.popupUIMain.isUpdatePopupVisible()) {
		$('#update_popup', document).show();
		$('#update_popup_close', document).unbind('click')
		                                  .bind('click', function() {
			SBExtension.config.setUpdatePopupHidden();
			$('#update_popup', document).hide();
		});
		$('#update_submit', document).unbind('click')
		                             .bind('click', function() {
			var prompt = SBExtension.browserPopup.getLocalizedString("promptCriticalUpdate");
			SBExtension.browserPopup.doConfirmUpdate(false, prompt);
		});
	} else {
		$('#update_popup', document).hide();
	}
};

// initialization for popup
SBExtension.PopupUIMain.prototype.callbackBG = function(state, popout, popUpIndex, id) {
	SBExtension.popupUIMain.translate(
		function() {
			SBExtension.popupUIMain.callbackBGDo(state, popout, popUpIndex, id, document);
		}
		, document
	);
	//SBExtension.popupUIMain.callbackBGDo(state, popout, popUpIndex, id, document);
};

// initialization for popup
SBExtension.PopupUIMain.prototype.callbackBGDo = function(state, popout, popUpIndex, id, doc) {
	doc = doc || document;
	setTimeout(function() {
		var quantserveImg = $('#sb_quantserve', doc);
		SBExtension.browserPopup.setAttribute($(quantserveImg), "src", "http://pixel.quantserve.com/pixel/p-b15U9CAASyBMc.gif?labels=Swagbucks+Browser+Extension&ts=" + new Date().getTime());
	}, 500);
	setTimeout(function() {
		var comscoreImg = $('#sb_comscore', doc);
		SBExtension.browserPopup.setAttribute($(comscoreImg), "src", "http://b.scorecardresearch.com/p?c1=7&c2=15366183&c3=1&cv=2.0&cj=1&ts=" + new Date().getTime());
	}, 500);
	try{
		SBExtension.popupUIMain.addUpdatePopupIfNeeded();
		if (state && state.globalState) {
			for (n in state) {
				for (m in state[n]) {
					this.globalState[m] = state[n][m];
				}
			}
		} else if (state) {
			for (n in state) {
				this.globalState[n] = state[n];
			}
		}
		$('#se_body', doc).show();
		if (SBExtension.isCriticalUpdateAvailable()) {
			$('#lp_content_wrap', doc).hide();
			$('#main', doc).hide();
			$('#lp_content_wrap_unsupported', doc).hide();
			$('#lp_content_wrap_critical_update', doc).show();
			$('#critical_update_submit', doc).unbind('click')
			                                      .bind('click', function() {
			        var prompt = SBExtension.browserPopup.getLocalizedString("promptCriticalUpdate");
			        SBExtension.browserPopup.doConfirmUpdate(true, prompt);
			});
		} else if (!SBExtension.globalState.isCountrySupported()) {
			$('#lp_content_wrap', doc).hide();
			$('#main', doc).hide();
			$('#lp_content_wrap_critical_update', doc).hide();
			$('#lp_content_wrap_unsupported', doc).show();
		} else if (popUpIndex > -1) {
			try {
				$('#lp_content_wrap', doc).hide();
				$('#lp_content_wrap_critical_update', doc).hide();
				$('#lp_content_wrap_unsupported', doc).hide();
				$('#main', doc).show();
				$('#top_deals', doc).css('display', 'block');
				this.isPopOut = true;
				this.popOutID = id;
				
				this.startByStatePopOut(popUpIndex);
				$('.menu-items', doc).hide();
				$('.footer', doc).hide();
			} catch(e) {
				SBExtension.alert_debug('PopupUIMain.callbackBG popUpIndex: ' + e, e);
			}
		} else if (!SBExtension.globalState.loginState || !SBExtension.globalState.memberInfo || !SBExtension.globalState.memberInfo.memberID) {
			try {
				$('#lp_content_wrap_critical_update', doc).hide();
				$('#lp_content_wrap_unsupported', doc).hide();
				$('#main', doc).hide();
				$('#lp_content_wrap', doc).show();
				//$('#se_body', doc).css('background-color', '#5283AE');
				SBExtension.popupUILogin.preloaderInit();
				SBExtension.popupUILogin.checkState();
			} catch(e) {
				SBExtension.alert_debug('PopupUIMain.callbackBG unmember: ' + e.message + ". Stack=" + e.stack);
			}
		} else {
			try {
				$('#main', doc).css('display', 'block');
				this.startByState();
				$('#lp_content_wrap', doc).hide();
				$('#lp_content_wrap_critical_update', doc).hide();
				$('#lp_content_wrap_unsupported', doc).hide();
			} catch(e) {
				SBExtension.alert_debug('PopupUIMain.callbackBG else: ' + e, e);
			}
		}
		if (this.popOutID > 0) {
			$( "#popout_id,#snap_back", doc).unbind( "click" );
		}
		SBExtension.popupUIMain.userEvent();
		SBExtension.popupUILogin.setUserData();
		SBExtension.popupUILogin.viewNotificationCount();
		this.setStateChange(this.globalState.stateArray);
		SBExtension.actionHandler.onUserAction("AnimateTransNonActive", this.globalState.tabId);
	} catch(e) {
		SBExtension.alert_debug('PopupUIMain.callbackBG: ' + e, e);
	}
};

SBExtension.PopupUIMain.prototype.userEvent = function() {
	if (!this.sbMenuJSIsSupported) {
		setTimeout(function() {
			addLoadEventCallback();
		}, 1000);
	}

	$('#img_user', document).attr("src", "http://profileimages.swagbucks.com/profile-lg/"+SBExtension.popupUIMain.globalState.memberID+".jpg");
	
	$('#account_image_and_settings', document).click(function(e) {
		if (e.isPropagationStopped()) {
			return;
		}
		if ($('.user_data_list').is(':visible')) {
			$('.user_data_list, .user_background', document).css('display', 'none');//.hide();
		} else {
			$('.user_data_list, .user_background', document).css('display', 'block');//.show();
		}
		e.stopPropagation();
	});
	
	$('.user_background, .user_links, #main', document).click(function() {
		$('.user_data_list, .user_background', document).css('display', 'none');//.hide();
	});
	
	$('#sb_global_nav_sb_display', document).click(function() {
		SBExtension.popupUI[SBExtension.POPUP_ID_ACCT].onSBRefresh();
	});
}

// ACTIVATE STATE
SBExtension.PopupUIMain.prototype.setStateChange = function(stateArray, memberInfo, seArrayAction) {
	try{
		SBExtension.popupUILogin.preloaderClose();
		if (memberInfo) {
			SBExtension.globalState.setMemberInfo(memberInfo);
		}
		SBExtension.popupUILogin.setUserData();
		SBExtension.popupUILogin.viewNotificationCount();
		
		if (stateArray) {
			this.globalState.stateArray = stateArray;
		}

		if (seArrayAction) {
			this.globalState.stateSEActiveArray = seArrayAction;
		} else {
			seArrayAction = this.globalState.stateSEActiveArray;
		}
		if (seArrayAction && seArrayAction[this.globalState.windowId] == 1) {
			this.globalState.stateArray[0] = 1;
			this.globalState.save();
		}
		if (this.globalState.stateArray) {
			var length= 0;
			for(var key in this.globalState.stateArray) {
				if (this.globalState.stateArray.hasOwnProperty(key)) {
					length++;
				}
			}
		
			for (var i = 0; i < length; i++) {
				var val = this.globalState.stateArray[i];
				var item = this.menuNameByPosition(i);
				if (val == 1) {
					this.globalState.setPriority(0, i);
					this.globalState.save();
					$('.' + item + "_activity", document).css('display', 'block');
				} else {
					$('.' + item + "_activity", document).css('display', 'none');
				}
			}
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUIMain.setStateChange: ' + e, e);
	}
};

// MENU INITIALIZE
SBExtension.PopupUIMain.prototype.viewMenu = function(type, fromPopout) {
	try {
		this.addLog("menu: " + type, true);
		this.clearMenu();
		this.hideContent();
		$('#'+type+'-content', document).css('display','block');
		this.watchLogic(type);
		this.shopEarnLogic(type);
		if (type == 'sc') {
			SBExtension.popupUI[SBExtension.POPUP_ID_SCDE].viewSC();
		}
		else if (type == 'settings') {
			SBExtension.popupUI[SBExtension.POPUP_ID_SETTING].initSetting();
		}
		else if (type == 'notification') {
			SBExtension.popupUI[SBExtension.POPUP_ID_NOTIFICATION].init();
		}
		
		$('#menu_' + type, document).addClass(type + '_selected');
		if (fromPopout) {
			this.tryResizingPopout = 3;
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUIMain.viewMenu: ' + e, e);
	}
	SBExtension.browserPopup.clickEventListen('.new_tab_link');
};

SBExtension.PopupUIMain.prototype.watchLogic = function(type) {
	try{
		$('#coming_soon_watch', document).hide();
		if (type != 'watch') {
			$('#wrapped_iframe', document).attr('src','').hide();
		} else {
			if (!SBExtension.globalState.isCountryFullySupported(SBExtension.POPUP_ID_SBTV)) {
				$('#wrapped_iframe', document).attr('src','').hide();
				$('#coming_soon_watch', document).show();
			} else {
				$('#wrapped_iframe', document).show();
				$('#watch-button-in').show();
				$('#watch-button-out').hide();
				if (this.popOutID > 0) {
					$('#watch-button-in').hide();
					$('#watch-button-out').show();
					//$('.header-wnd-left', document).css({'width':'360px'});
					$('#watch-content', document).css({'height':'800px'});
					$('.main-content', document).css({'height':'800px'});
				}
				if (!$('#menu_watch').hasClass('watch_selected')) {
					$('#wrapped_iframe', document).attr('src','http://toolbartv.swagbucks.com?tb=1');
				}
			}
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUIMain.watchLogic: ' + e, e);
	}
};

SBExtension.PopupUIMain.prototype.shopEarnLogic = function(type) {
	try {
		if (this.sbPopoutIsSupported && this.popOutID > 0) {
			$('#watch-button-in', document).removeClass('header-wnd-right header-wnd-right_sp')
			                               .addClass('header-wnd-right_out');
		} else {//for shop
			if (!SBExtension.globalState.isCountryFullySupported(SBExtension.POPUP_ID_SBTV) && type=='watch') {
				$('#watch-button-in', document).removeClass('header-wnd-right header-wnd-right_out')
				                               .addClass('header-wnd-right_sp');
			} else
			if (this.sbPopoutIsSupported&&type=='shop' || !this.sbPopoutIsSupported&&type!='watch') {
				$('#watch-button-in', document).removeClass('header-wnd-right header-wnd-right_out')
				                               .addClass('header-wnd-right_sp');
			} else {
				$('#watch-button-in', document).removeClass('header-wnd-right_out header-wnd-right_sp')
				                               .addClass('header-wnd-right');
			}
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUIMain.shopEarnLogic: ' + e, e);
	}
};

// hide menu style
SBExtension.PopupUIMain.prototype.clearMenu = function() {
	try{
		if (!$('#menu_watch', document).hasClass('watch_selected')) {
			$('#wrapped_iframe', document).attr('src','');
		}

		$('#menu_shop', document).removeClass('shop_selected');
		$('#menu_watch', document).removeClass('watch_selected');
		$('#menu_sc', document).removeClass('sc_selected');
		$('#menu_settings', document).removeClass('settings_selected');
		$('#menu_notification', document).removeClass('notification_selected');
	} catch(e) {
		SBExtension.alert_debug('PopupUIMain.clearMenu: ' + e, e);
	}
};

// hide content window
SBExtension.PopupUIMain.prototype.hideContent = function() {
	$('.main-content', document).hide();
	$('#shop-content, #watch-content, #sc-content, #settings-content, #notification-content').hide();
};

SBExtension.PopupUIMain.prototype.recalcStateByPopup = function(type) {
	try{
		var pos = this.getMenuTypePosition(this.globalState.currentMenuItem);
		this.addLog("; pos: " + pos + "; currentMenuItem: " + this.globalState.currentMenuItem, false);
		var id = SBExtension.popup.checkPopOutPosition(pos);
		if (id > 0) {
			//SBExtension.alert_debug("recalc id: " + id);
			$('.main-content', document).hide();
			$('#popout-content', document).css('display', 'block');
			$("#popout_id", document).bind('click', function() {
				SBExtension.browserPopup.focusOnPopout(id);
			});
			var this_ = this;
			$("#snap_back", document).click(function() {
				SBExtension.popup.closePopOut(id);
				this_.viewMenu(type);
			});
			$('#wrapped_iframe', document).attr('src','');
			return true;
		}
		return false;
	} catch(e) {
		SBExtension.alert_debug('PopupUIMain.recalcStateByPopup: ' + e, e);
		return false;
	}
};

// start popup with state
SBExtension.PopupUIMain.prototype.startByState = function() {
	try {
        	var mID = 0;
		if (this.globalState.merchantID) {
			mID = parseInt(this.globalState.merchantID);
		}
		if(SBExtension.POPUP_ID_SHOP != this.globalState.curMenuItemIndex &&
			SBExtension.POPUP_ID_SBTV != this.globalState.curMenuItemIndex &&
			SBExtension.POPUP_ID_SCDE != this.globalState.curMenuItemIndex &&
			SBExtension.POPUP_ID_SETTING != this.globalState.curMenuItemIndex) {
				this.globalState.curMenuItemIndex = SBExtension.POPUP_ID_SHOP;
		}
		var menuOverride = SBExtension.store.retrieveGlobalKey("SSE_menuOverride");
		if (menuOverride) {
			SBExtension.store.clearKey("SSE_menuOverride", true);
		}
		var menu = menuOverride || this.menuNameByPosition(parseInt(this.globalState.curMenuItemIndex));
		//alert(this.globalState.curMenuItemIndex + " - " + menu)

		$('#coming_soon_shop').hide();
		$('.shop_top_btn', document).removeClass('active_shop_btn');
		if (menu != "shop") {
			this.viewMenu(menu);
			if (this.recalcStateByPopup(menu)) {
				SBExtension.browserPopup.clickEventListen('.new_tab_link');
				return;
			}
		} else
		//Coming Soon
		if (!SBExtension.globalState.isCountryFullySupported(SBExtension.POPUP_ID_SHOP)) {
			SBExtension.popupUI[SBExtension.POPUP_ID_SHOP].shopLogic();
			this.viewMenu(menu);
			this.shopEarnLogic(menu);
			return;
		} else 
		if (menu == "shop" && mID > 0) {
			this.viewMenu(menu);
			if (this.recalcStateByPopup(menu)) {
				SBExtension.browserPopup.clickEventListen('.new_tab_link');
				return;
			}
			SBExtension.popupUI[SBExtension.POPUP_ID_SHOP].showMerchantCoupons(mID);
			$('#top_shop_si', document).show();
			$('#top_deals_coupons', document).hide();
			this.isMSite = true;
			$('#top_deals', document).css('display', 'block');
			$('#top_stores', document).css('display', 'none');
		} else
		
		if (menu == "shop") {
			this.viewMenu(menu);
			if (this.recalcStateByPopup(menu)) {
				SBExtension.browserPopup.clickEventListen('.new_tab_link');
				return;
			}
			//TODO: !!!!!!!!!!!!!! ?????????????????? Doble-check why FF had it commented ?!
			if (mID > 0 && SBExtension.popupUI && SBExtension.popupUI[SBExtension.POPUP_ID_SHOP]) {
				SBExtension.popupUI[SBExtension.POPUP_ID_SHOP].showMerchantCoupons(mID);
			}
			
			$('.shop_top_btn', document).removeClass('active_shop_btn');
			
			$('#top_deals', document).css('display', 'none');
			$('#top_stores', document).css('display', 'block');

			SBExtension.popupUI[SBExtension.POPUP_ID_SHOP].showMerchntList();
			SBExtension.browserPopup.clickEventListen('.new_tab_link');
		} else {
			this.viewMenu(menu);
			if (this.recalcStateByPopup(menu)) {
				SBExtension.browserPopup.clickEventListen('.new_tab_link');
				return;
			}
			$('#top_shop_si', document).css('display', 'none');
			$('#top_deals_coupons', document).show();
			
			$('#top_deals', document).css('display', 'none');
			$('#top_stores', document).css('display', 'block');
			
			SBExtension.popupUI[SBExtension.POPUP_ID_SHOP].showMerchntList();
		}
	} catch(e) {
		SBExtension.alert_debug("PopupUIMain.startByState: " + e, e);
	}
	SBExtension.browserPopup.clickEventListen('.new_tab_link');
};

// Pop-out / pop-back-in BUTTON
SBExtension.PopupUIMain.prototype.header_wnd_right = function() {
	try {
		if (this.popOutID > 0) {
			if (this.sbPopoutIsSupported) {
				self.close();
			} else {
				$('#se_panelbutton', document).removeAttr('open');
			}
		}
		var pos = this.getMenuPosition();
		if (!SBExtension.globalState.isCountryFullySupported(pos)) {
			return;
		}
		if (!this.sbPopoutIsLinked && pos == 1) {//SBTV
			var url = "http://toolbartv.swagbucks.com?tb=1";
			var title = "SBTV";
			var width = "390";
			var height = "810";

			var wnd = window.open(url, title, "chrome,width="+width+",height="+height+",centerscreen");
			return;
		}
		if (!this.sbPopoutIsSupported && pos!=1) {
			return;
		}
		
		if (SBExtension.config.popoutViewArray[pos] == 0) {
			return;
		}
		
		var id = SBExtension.popup.checkPopOutPosition(pos);
		if (id > 0) {
			SBExtension.browserPopup.focusOnPopout(id);
		}
		if (this.popOutID < 0) {
			pos = this.getMenuPosition();
			SBExtension.popup.initPopOut(pos);
			if (this.sbPopoutIsSupported) {
				self.close();
			} else {
				$('#se_panelbutton', document).removeAttr('open');
			}
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUIMain.header_wnd_right: ' + e, e);
	}
}

// MENU
SBExtension.PopupUIMain.prototype.changePopupMenu = function (menu) {
    try {
        var oldMenu = "shop";
        $('.menu-items', document).children().each(function (k, v) {
            if (v.className.indexOf($(v).attr('data-type') + "_selected") !== -1) {
                oldMenu = $(v).attr('data-type');
                return false;
            }
        });
        SBExtension.popupUILogin.viewNotificationCount();
        SBExtension.popupUIMain.addUpdatePopupIfNeeded();

        var type = 'shop';
        try {
            type = menu.target.attributes['data-type'].value;
        } catch (e) { }
        if (type == "shop") {
            this.isMSite = (this.globalState.merchantID > 0);
        }
        var pos = this.getMenuTypePosition(type);

        if (oldMenu) {
            var oldPos = this.getMenuTypePosition(oldMenu);
            var windowId = this.globalState.windowId;
            if (!windowId) {
                windowId = SBExtension.browserPopup.currentTab; this.globalState.windowId = windowId;
            }
            SBExtension.updateController.clearMenuPosition(oldPos, windowId);
            this.globalState.stateArray[oldPos] = 0;
            SBExtension.updateController.clearMenuPosition(pos, windowId);
            this.globalState.stateArray[pos] = 0;
            this.globalState.save();
            $('.' + oldMenu + "_activity").hide();
            $('.' + type + "_activity").hide();
        }
		//debugger;
        this.globalState.setPriority(0, pos);
        this.globalState.onUserAction(new Date().getTime(), type);
        this.globalState.save();

        if (this.popOutID > 0) {
            if (SBExtension.popup.checkPosition(this.popOutID, pos)) {
                return;
            }
        }

        this.viewMenu(type);
        this.addLog("; pos: " + pos + "; currentMenuItem: " + type, false);
        var id = SBExtension.popup.checkPopOutPosition(pos);
        if (id > 0 && this.popOutID != id) {
            $('.main-content', document).hide();
            $('#popout-content', document).css('display', 'block');
            $("#popout_id,#snap_back", document).unbind("click");
            $("#popout_id", document).click(function () {
                SBExtension.browserPopup.focusOnPopout(id);
            });
            var this_ = this;
            if (this.popOutID == -1) {
                $("#snap_back", document).click(function () {
                    SBExtension.popup.closePopOut(id);
                    this_.viewMenu(type);
                });
            }
            $('#wrapped_iframe', document).attr('src', '');
            return;
        }

        if (type == 'shop') {
            SBExtension.popupUI[SBExtension.POPUP_ID_SHOP].shopLogic();
        }
        if (this.popOutID > 0) {
            SBExtension.popup.setPopOutPosition(this.popOutID, pos);
        }
    } catch (e) {
        SBExtension.alert_debug('PopupUIMain.changePopupMenu: ' + e, e);
    }
    SBExtension.browserPopup.onGlobalStateChanged();
};

SBExtension.PopupUIMain.prototype.resetFromPopout = function(pos) {
	this.startByStatePopOut(pos);
};

// start popup with state popout
SBExtension.PopupUIMain.prototype.startByStatePopOut = function(popUpIndex) {
	var menuItem = SBExtension.getPopupMenuItem(popUpIndex);
	if (popUpIndex == SBExtension.POPUP_ID_SHOP) {
		SBExtension.popupUI[SBExtension.POPUP_ID_SHOP].showMerchntList();
		$('#top_deals', document).css('display', 'block');
		$('#top_btn_td', document).addClass('active_shop_btn');
	}
	this.viewMenu(menuItem, true);
};

//get menu name by index
SBExtension.PopupUIMain.prototype.menuNameByPosition = function(index) {
	return SBExtension.getPopupMenuItem(index);
};

SBExtension.PopupUIMain.prototype.getMenuPosition = function() {
	if ($('#menu_shop', document).hasClass('shop_selected')) {
		return SBExtension.POPUP_ID_SHOP;
	} else
	if ($('#menu_watch', document).hasClass('watch_selected')) {
		return SBExtension.POPUP_ID_SBTV;
	} else
	if ($('#menu_sc', document).hasClass('sc_selected')) {
		return SBExtension.POPUP_ID_SCDE;
	} else
	if ($('#menu_settings', document).hasClass('settigs_selected')) {
		return SBExtension.POPUP_ID_SETTING;
	}  else
	if ($('#menu_notification', document).hasClass('notification_selected')) {
		return SBExtension.POPUP_ID_NOTIFICATION;
	}
};

SBExtension.PopupUIMain.prototype.getMenuTypePosition = function(type) {
	switch(type) {
		case "shop":
			return SBExtension.POPUP_ID_SHOP;
			break;
		case "watch":
			return SBExtension.POPUP_ID_SBTV;
			break;
		case "sc":
			return SBExtension.POPUP_ID_SCDE;
			break;
		case "settings":
			return SBExtension.POPUP_ID_SETTING;
			break;
		case "notification":
			return SBExtension.POPUP_ID_NOTIFICATION;
			break;
	}
};

SBExtension.PopupUIMain.prototype.resizePopout = function(tryAgainIfNeeded) {
	try {
		var deltaX = (SBExtension.popup.desiredPopupWidth) ? SBExtension.popup.desiredPopupWidth-window.innerWidth : 0;
		var deltaY = (SBExtension.popup.desiredPopupHeight) ? SBExtension.popup.desiredPopupHeight-window.innerHeight : 0;
		var needResizing = (deltaX!=0 || deltaY!=0 || window.innerWidth!=window.document.body.clientWidth || window.innerHeight!=window.document.body.clientHeight);
		if (needResizing) {
			window.resizeBy(deltaX+20,deltaY+20);
			window.setTimeout(function() {window.resizeBy(-20,0);window.setTimeout(function() {window.resizeBy(0,-20);},10);},10);
			if (tryAgainIfNeeded) {
				var this_ = this;
				window.setTimeout(function() {
					this_.resizePopout(tryAgainIfNeeded-1);
				},250);
			}
		}else{
			SBExtension.popup.desiredPopupWidth = 0;
			SBExtension.popup.desiredPopupHeight = 0;
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUIMain.resizePopout: ' + e, e);
	}
};

SBExtension.PopupUIMain.prototype.initResizeCommon = function() {
	if (SBExtension.popup.desiredPopupWidth && this.tryResizingPopout>=0) {
		var this_ = this;
		window.setTimeout(function() {this_.resizePopout(this_.tryResizingPopout);},250);
	}
};

SBExtension.PopupUIMain.prototype.initResize = function() {
	// ONLOAD EXTENSION POPUP 
	$('#menu_shop', document).addClass('shop_selected');
	$('#shop-content', document).css('display', 'block'); //show();
	this.initResizeCommon();
};

SBExtension.PopupUIMain.prototype.addLog = function(msg, clear) {
};

SBExtension.PopupUIMain.prototype.translate = function(callback, doc) {
	SBExtension.browserPopup.translate(callback, doc);
};

SBExtension.PopupUIMain.prototype.resetSettingsUI = function() {
	SBExtension.popupUI[SBExtension.POPUP_ID_SETTING].initSetting();
};

try {
	try {SBExtension.store.clearKey("popUpSE_MustBeClosed", true);} catch(e) {}
	SBExtension.popupUIMain = new SBExtension.PopupUIMain();
	SBExtension.popupUIMain.init();
} catch(err) {
	SBExtension.alert_debug("Exception INSIDE new SBExtension.PopupUIMain() : " + err, err);
}

$(function() {
	SBExtension.popupUILogin.initLogin();
});

SBExtension.browserPopup.finishPopupLoading();

} catch(critError) {
    SBExtension.alert_debug("CRITICAL ERROR initializing SBExtension.PopupUIMain !!! STACK: " + critError, critError);
}
