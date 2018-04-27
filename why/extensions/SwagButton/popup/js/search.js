SBExtension.PopupUISearch = function() {
	if (!SBExtension.browserPopup.isSearchChangeSupported(true)) {
		this.inptCnt = 1; 
		this.txtElements = [{txt:'saw_input',btn:'saw_submit'}]; 
		// variable contructors
		this.rfcIDElements = [];
		this.iSuggest = null;

		// Write the cache busting IFRAME
		document.write('<iframe style="height:0px;width:0px;visibility:hidden;display:none;" src="about:blank">this prevents back forward cache</iframe>');

		// Write the minimum styles
		document.writeln('<style type="text/css">');
		document.writeln('.suggest_link {overflow:hidden;}');
		document.writeln('.suggest_link_over {overflow:hidden;cursor:pointer;}');
		document.writeln('.suggest_panel {position:absolute;display:none;text-align:left;}');
		document.writeln('</style>');
	}
	
	$('#saw_input_container').focusin(function() {
		SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].onSearchFocusIn();
	}).focusout(function() {
		SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].onSearchFocusOut();
	});
	
	$('#saw_input').keyup(function(e) {
		SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].onKeyUp();
	});

	$('.saw_cross').click(function(e) {
		SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].onClearField();
	});

	$('#search_promo_close').unbind('click').bind('click', function(){
		SBExtension.store.storeGlobalKey("DefSearchPopupClosedTS", "" + (new Date()).getTime());
		$('#search_promo').hide();
	});
	
	var this_ = this;

	$('#help_search', document).unbind('click').bind('click', function(){
		this_.help_search();
	});

	$('#help_search', document).keypress(function(e) {
		if(e.which == 13) {
		    this_.help_search();
		}
	});
};

SBExtension.PopupUISearch.prototype.onClearField = function() {
	$('.saw_cross, #suggest').css("display", "none");
	$('#saw_input').val('');
};

SBExtension.PopupUISearch.prototype.onKeyUp = function() {
	if ($.trim($('#saw_input').val()) =='') {
		$('.saw_cross').css("display", "none");
		SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].onSearchFocusIn();
	} else {
		$('.saw_cross').css("display", "block");
		SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].onSearchFocusOut(true);
	}
};

SBExtension.PopupUISearch.prototype.onSearchFocusOut = function(noGreyingOut) {
	SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].curDoc = document;
	setTimeout(function() {
		var curDoc = SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].curDoc;
		if (!noGreyingOut) {
			$('#search_win_container #saw_input_container', curDoc).css({'background-color':'#f2f2f2', 'border-color':'#ccc'});
		}
		$('#search_promo', curDoc).css("display", "none");
		$("#wnd_main_content").unbind( "click" );
	}, 250);
}

SBExtension.PopupUISearch.prototype.onSearchFocusIn = function() {
	var focusWasTriggerred = SBExtension.popupUILogin.focusWasTriggerred;
	if (!focusWasTriggerred) {
		var curTS = (new Date()).getTime();
		SBExtension.popupUILogin.focusWasTriggerred = curTS;
		var userTriggerred = SBExtension.popupUILogin.mouseIsClicked || SBExtension.popupUILogin.keyIsPressed;
		delete SBExtension.popupUILogin.mouseIsClicked;
		delete SBExtension.popupUILogin.keyIsPressed;
		var mainTS = (SBExtension.popupUILogin.afterMainDisplayTS) ? SBExtension.popupUILogin.afterMainDisplayTS : SBExtension.popupUILogin.beforeMainDisplayTS;
		if (mainTS && (curTS-mainTS) > SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].focusDelay) {
			userTriggerred = true;
			SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].focusDelay = 150;
		}
		if (!userTriggerred) {
			$('input').blur();
			return;
		}
	}
	var searchEngineIsKnown = SBExtension.isSearchEngineKnown() || SBExtension.popupUIMain.globalState.swagSearchExtensionExists;
	if (searchEngineIsKnown) {
		$('#help_search',document).text( SBExtension.browserPopup.getLocalizedString("letsGo") );
	}
	$('#search_win_container #saw_input_container').css({'background-color':'#fff', 'border-color':'#69B8D6'});
	var defaultSearchPrompted = this.promptDefaultSearch();
	if (!defaultSearchPrompted) {
		return;
	}
	$("#wnd_main_content").unbind('click')
	                      .bind('click', function(e) {
		var eX = e.pageX;
		var eY = e.pageY;
		var inputElem = $("#saw_input_container");
		var inputElemPos = inputElem.offset();
		var inputElemW = inputElem.outerWidth();
		var inputElemH = inputElem.outerHeight();
		var posX = inputElemPos.left;
		var posY = inputElemPos.top;
		if (eX<posX || eY<posY || eX>posX+inputElemW || eY>posY+inputElemH) {
			$("#wnd_main_content").unbind('click');
			$("#saw_input").blur();
		}
	});
}

SBExtension.PopupUISearch.prototype.promptDefaultSearch = function() {
	var curSearchString = $.trim($('#saw_input').val());
	var promptRequired = (curSearchString=='') && SBExtension.browserPopup.isPromptDefaultSearchRequired();
	if (!promptRequired) {
		$('#search_promo').css("display", "none");
		return false;
	}
	$('#search_promo_close').unbind('click').bind('click', function(){
		SBExtension.store.storeGlobalKey("DefSearchPopupClosedTS", "" + (new Date()).getTime());
		$('#search_promo').css("display", "none");
	})
	$('#search_promo').css("display", "block");
	return true;
}

SBExtension.PopupUISearch.prototype.showSearchPopup = function() {
	SBExtension.browserPopup.openHelpPopUp();
};

SBExtension.PopupUISearch.prototype.help_search = function() {
	var searchEngineIsKnown = SBExtension.isSearchEngineKnown();
	if (searchEngineIsKnown) {
		if (!SBExtension.isSearchSetToSB()) {
			if (true) { //SBExtension.popupUIMain.globalState.curMenuItemIndex == SBExtension.POPUP_ID_SETTING) {
				SBExtension.loadSettings();
				SBExtension.config.isSBSearch = true;
				SBExtension.setSettings();
				if (SBExtension.browserPopup.onSBSearchClicked) {
					SBExtension.browserPopup.onSBSearchClicked(SBExtension.config.isSBSearch);
				}
			}
			SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].onSearchFocusOut(true);
			SBExtension.popupUIMain.globalState.curMenuItemIndex = SBExtension.POPUP_ID_SETTING;
			SBExtension.popupUIMain.startByState();
		}
		return;
	}
	SBExtension.browserPopup.openHelpPopUp();
};

SBExtension.PopupUISearch.prototype.doSearch = function(search, popupSearchType) {
	if (popupSearchType == "101") {
		var storedSearch = SBExtension.store.retrieveGlobalKey("SE_search_"+SBExtension.popupUIMain.globalState.windowId);
		if (storedSearch==search) {
			return;
		}
		SBExtension.store.storeGlobalKey("SE_search_"+SBExtension.popupUIMain.globalState.windowId, search);
	}
	var url = 'http://www.swagbucks.com/?t=w&p=1&f=' + popupSearchType + '&q=' + search;
	SBExtension.browserPopup.openNewTab(url);
};

SBExtension.PopupUISearch.prototype.initSearch = function() {
	var this_ = this;
	var memberLocation = (SBExtension.popupUIMain && SBExtension.popupUIMain.globalState && SBExtension.popupUIMain.globalState.memberInfo) ? SBExtension.popupUIMain.globalState.memberInfo.country : 1;
	$('#search_powered', document).text((memberLocation==1) ? SBExtension.browserPopup.getLocalizedString("poweredByYahoo") : SBExtension.browserPopup.getLocalizedString("poweredByGoogleBing"))
	var popupSearchType = SBExtension.browserPopup.getPopupSearchType();
	$('#saw_submit', document).click(function(){
		if(this_.homeSearch()){
			var search = $('#saw_input', document).val();
			this_.doSearch(search, popupSearchType);
			return false;
		}
	});

	$('#saw_input', document).keypress(function(e) {
		if(e.which == 13) {
			if(this_.homeSearch()){
				var search = $('#saw_input', document).val();
				this_.doSearch(search, popupSearchType);
				return false;
			}
		}
	});

	$('.suggest_panel', document).css({
		left: '-=' + 30,
		top: '+=' + 8
	});
};

SBExtension.PopupUISearch.prototype.viewSearch = function () {
try {
	var firstTimeInChrome = !SBExtension.isSearchEngineKnown() && !SBExtension.isFirstPopupShown();
	SBExtension.store.storeGlobalKey("FirstPopupShown", "1");
	var memberLocation = (SBExtension.popupUIMain && SBExtension.popupUIMain.globalState && SBExtension.popupUIMain.globalState.memberInfo) ? SBExtension.popupUIMain.globalState.memberInfo.country : 1;
	$('#search_powered', document).text((memberLocation==1) ? SBExtension.browserPopup.getLocalizedString("poweredByYahoo") : SBExtension.browserPopup.getLocalizedString("poweredByGoogleBing"))
	if (SBExtension.browserPopup.getPopupSearchType() == "102") {
		// MSIE
		$("#help_label").text(SBExtension.browserPopup.getLocalizedString("wantGcFasterNoMiss"));
		$(".left_search_content").css('width', '225px');
		$(".right_search_content").css('width', '120px').css('margin-top', '20px');
		$("#surveyImgImg").css('top', '45px');
	} else if (firstTimeInChrome) {
		// Chrome (VERY first time)
		this.help_search();
	}
} catch(e) {SBExtension.alert_debug("ERROR IN SBExtension.PopupUISearch.prototype.viewSearch: " + e + "; STACK: " + e.stack);}
};

SBExtension.PopupUISearch.prototype.homeSearch = function(){
	var $form = $('#search_win_container', document);
	var $inpt = $form.find('#saw_input');
	if($inpt.val() == $inpt.attr('placeholder') || $inpt.val() == ''){
		!$inpt.is(":focus") && $inpt.focus();
		return false;
	}else return true;
};

if (!SBExtension.popupUI) {
	SBExtension.popupUI = [];
}
SBExtension.popupUI[SBExtension.POPUP_ID_SRCH] = new SBExtension.PopupUISearch();
SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].focusDelay = 300;

$(function(){
	//SBExtension.alert_debug(" -- WILL CALL initSearch()");
	SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].initSearch();
});

