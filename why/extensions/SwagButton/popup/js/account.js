SBExtension.PopupUIAccount = function() {
	this.pntReloading = false;
	this.justReloaded = false;
}

SBExtension.PopupUIAccount.prototype.initAccount = function(){
	$('#sb_global_nav_sb_display', document).hover(function(){
		$('#nav_sb_reload_trgr', document).css('display', 'block');
	}, function(){
		if(!$('#nav_sb_reload_trgr', document).hasClass('refreshing_points')) {
			$('#nav_sb_reload_trgr', document).hide();
		}
	});
	
	var this_ = this;
	$('#sb_global_nav_sb_display', document).click(function(){
		this_.onSBRefresh();
	});
};

SBExtension.PopupUIAccount.prototype.onSBRefresh = function(){
	var $self = $('#nav_sb_reload_trgr', document);
	$('#nav_sb_reload_trgr', document).addClass('refreshing_points');
	var this_ = this;
	setTimeout(function(){
		if(this_.justReloaded) {
			$self.removeClass('refreshing_points').hide();
		}else {
			this_.reloadPnts(function(){
				$self.removeClass('refreshing_points').hide();
				this_.justReloaded = true;
				setTimeout(function(){
					this_.justReloaded = false;
				}, 10000);
			});
		}
	}, 400)
};

SBExtension.PopupUIAccount.prototype.reloadPnts = function (callback, reloadPointsDisplay) {
    if (this.pntReloading) return;
    this.pntReloading = true;
    var reloadPointsDisplay = (typeof reloadPointsDisplay == 'undefined' ? true : reloadPointsDisplay);
    SBExtension.networkPopup.refreshSB(
        function (stateData, responseData) {
            var data = (responseData) ? ((responseData.responseData) ? responseData.responseData : responseData) : stateData;
            SBExtension.popupUI[SBExtension.POPUP_ID_ACCT].onReloadPntsSuccess(data, callback)
        },
        SBExtension.popupUIMain.globalState
    );
};

SBExtension.PopupUIAccount.prototype.onReloadPntsSuccess = function (data, callback) {
    var newAmnt = document.getElementById("tbar_sb_amount").innerHTML;
    var result = (data.split) ? data.split("|") : ((data.memberInfo && (typeof data.memberInfo.sBs != "undefined")) ? data.memberInfo.sBs : []);
    if (result[0] == 1) {
        newAmnt = "" + result[1];
        if (newAmnt.length > 3 && newAmnt[newAmnt.length - 3] == '.')
            newAmnt = newAmnt.substring(0, newAmnt.length - 3);
    }
    var this_ = this;
    setTimeout(function () {
        this_.reloadPntsDisplay(newAmnt);
        if ($.isFunction(callback)) {
            callback();
        }
    }, 1000);
};

SBExtension.PopupUIAccount.prototype.reloadPntsDisplay = function(newAmntPnts){
	SBExtension.browserPopup.setInnerHTML(document.getElementById('tbar_sb_amount'), newAmntPnts, document);
	$('#nav_sb_reload_trgr', document).removeClass('refreshing_points').hide();
	this.justReloaded = true;
	this.pntReloading = false;
};

SBExtension.PopupUIAccount.prototype.formatNumbersWithCommas = function(x) {
	if(!x) return "";
	return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
};

if (!SBExtension.popupUI) {
	SBExtension.popupUI = [];
}
SBExtension.popupUI[SBExtension.POPUP_ID_ACCT] = new SBExtension.PopupUIAccount();

$(function(){
	//SBExtension.alert_debug(" -- WILL CALL initAccount()");
	SBExtension.popupUI[SBExtension.POPUP_ID_ACCT].initAccount();
});
