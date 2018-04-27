SBExtension.PopupUISetting = function() {}
SBExtension.PopupUISetting.prototype.initSetting = function (doc, forceSBSearch, isNewTabSearch, isSBSearch) {
	if (!doc) {
		doc = document;
	}

	if (SBExtension.browser) {
		isNewTabSearch = (forceSBSearch) ? isNewTabSearch : SBExtension.isNewTabPageSetToSB();
		isSBSearch = (forceSBSearch) ? isSBSearch : SBExtension.isSearchSetToSB();
		SBExtension.loadSettings(false, isNewTabSearch, isSBSearch, forceSBSearch);
	} else {
		SBExtension.loadSettings();
	}

	$('#isBalanceAlert',doc).prop('checked', SBExtension.config.isBalanceAlert?true:false);
	$('#isSurveyAlert',doc).prop('checked', SBExtension.config.isSurveyAlert?true:false);
	$('#isNewTabSearch',doc).prop('checked', SBExtension.config.isNewTabSearch?true:false);
	$('#isSBSearch',doc).prop('checked', SBExtension.config.isSBSearch?true:false);

	if (!SBExtension.browserPopup.isSearchChangeSupported(true) && SBExtension.browserPopup.isWindowsPlatform()) {
		$('#settings_extra').show();
		if (SBExtension.popupUIMain.globalState.swagSearchExtensionEnabled) {
			if (!$('#isSBSearch',doc).prop('checked'))
				$('#isSBSearch',doc).prop('checked', true);
			if (!$('#isNewTabSearch',doc).prop('checked'))
				$('#isNewTabSearch',doc).prop('checked', true);
		} else {
			if ($('#isSBSearch',doc).prop('checked'))
				$('#isSBSearch',doc).prop('checked', false);
			if ($('#isNewTabSearch',doc).prop('checked'))
				$('#isNewTabSearch',doc).prop('checked', false);
		}
	}
	
	$('#isBalanceAlert',doc).unbind('change').bind('change', function(){
		SBExtension.config.isBalanceAlert = !SBExtension.config.isBalanceAlert;
		SBExtension.setSettings();
	});
	
	$('#isSurveyAlert',doc).unbind('change').bind('change', function(){
		SBExtension.config.isSurveyAlert = !SBExtension.config.isSurveyAlert;
		SBExtension.setSettings();
	});

	
	$('#isNewTabSearch',doc).unbind('change').bind('change', function(){
		SBExtension.config.isNewTabSearch = !SBExtension.config.isNewTabSearch;
		SBExtension.setSettings();
		if (SBExtension.browserPopup.onNewTabSearchClicked) {
			SBExtension.browserPopup.onNewTabSearchClicked(SBExtension.config.isNewTabSearch);
		}
	});
	
	$('#isSBSearch',doc).unbind('change').bind('change', function(){
		if (!SBExtension.browserPopup.isSearchChangeSupported(true) && !SBExtension.popupUIMain.globalState.swagSearchExtensionExists) {
			SBExtension.browserPopup.openHelpPopUp(true);
			return;
		}
		SBExtension.config.isSBSearch = !SBExtension.config.isSBSearch;
		SBExtension.setSettings();
		var activeElement = document.activeElement;
		if (activeElement && activeElement.id=="saw_input") {
			setTimeout(function() {
				SBExtension.popupUI[SBExtension.POPUP_ID_SRCH].onKeyUp();
			}, 500);
		}
		if (SBExtension.browserPopup.onSBSearchClicked) {
			SBExtension.browserPopup.onSBSearchClicked(SBExtension.config.isSBSearch);
		}
	});
};

if (!SBExtension.popupUI) {
	SBExtension.popupUI = [];
}
SBExtension.popupUI[SBExtension.POPUP_ID_SETTING] = new SBExtension.PopupUISetting();

document.addEventListener("DOMContentLoaded", function(event) { 
	SBExtension.popupUI[SBExtension.POPUP_ID_SETTING].initSetting();
});
