SBExtension.PopupUIDiscover = function() {
}

SBExtension.PopupUIDiscover.prototype.viewDiscover = function(){
	var memberLocation = (SBExtension.popupUIMain && SBExtension.popupUIMain.globalState && SBExtension.popupUIMain.globalState.memberInfo) ? SBExtension.popupUIMain.globalState.memberInfo.country : 1;
	// DISABLE plugins FOR ALL...
	$('#plugins', document).hide();
	//  UK, IE, AU - no "Coupons" or "Credit Card"
	//  CA - no "Credit Card"
	//  IN - no "Coupons" or "Credit Card" or "Encrave" or "NOSO"
	if (memberLocation!=1) {          // NOT US
		$('#credit_card', document).hide();
		if (memberLocation != 2) {    // NOT CA
			$('#coupons', document).hide();
		}
		if (memberLocation >= 32) {   // IN and DE (Germany) only !!!
			$('#activities', document).hide();
			$('#noso', document).hide();
		}
	}
	SBExtension.browserPopup.clickEventListen('.new_tab_link');
}

if (!SBExtension.popupUI) {
	SBExtension.popupUI = [];
}

SBExtension.popupUI[SBExtension.POPUP_ID_DSCV] = new SBExtension.PopupUIDiscover();
