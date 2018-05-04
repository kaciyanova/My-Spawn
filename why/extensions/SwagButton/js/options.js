$(document).ready(function ($) {
  function callback() {
	var btnLabel = getQueryString()["btnLabel"];
	if (btnLabel) {
		if (btnLabel == SBExtension.getAvailableBrowser().getLocalizedString("continueUninstall")) {
			$('#settings_ext').hide();
			$("#notif_wrap").hide();
			SBExtension.config.isSBSearch     = false;
			SBExtension.config.isNewTabSearch = false;
			SBExtension.setSettings();
			var settings = SBExtension.getAvailableBrowser("getSettings").getSettings();
			var sorryText = SBExtension.getAvailableBrowser().getLocalizedString("doYouKnowUninstallEarning");
			$('.settings_head').show();
			$('.settings_body').text(sorryText)
			                   .show();
			$('#swagButtonLegalDisclaimer')
				.add('#swagButtonLegalDisclaimerWrap')
				.add('#settings_newTabOpensSearch')
				.hide();
		}
		var marginFromCenter = parseInt($("#centerFloater").css("margin-bottom")); // - 40;
		$("#centerFloater").css("margin-bottom",marginFromCenter+"px");
		//SBExtension.getAvailableBrowser("setInnerHTML").setInnerHTML($('#contBtn'), btnLabel);
		$('#contBtn').html(btnLabel).click(function() {
			saveAndContinue();
		}).show();
		$('#contBtnWrap').click(function() {
			saveAndContinue();
		});
		$('#contBtnWrap').css('display', 'inline-block');
	}
	var title = getQueryString()["title"];
	if (title) {
		document.title = title;
		$('#logo_title').text(title);
	}
  }
  SBExtension.browserPopup.translate(callback, document, "_options", "#SE_option_html");
});

function saveAndContinue() {
	var nowTS = (new Date()).getTime();
	if (SBExtension.saveAndContinueClickedTS && nowTS-SBExtension.saveAndContinueClickedTS<100) {
		SBExtension.saveAndContinueClickedTS = nowTS;
		return;
	}
	SBExtension.saveAndContinueClickedTS = nowTS;
	if ($('.settings_head').is(':visible')) {
		if (SBExtension.browser && SBExtension.browser.navigateToUninstallURL) {
			SBExtension.browser.navigateToUninstallURL();
		}
	}
	var lastWindowId = (SBExtension.bg && SBExtension.bg.SBExtension && SBExtension.bg.SBExtension.lastWindowId) ? SBExtension.bg.SBExtension.lastWindowId : SBExtension.lastWindowId;
	if (SBExtension.actionHandler) {
		SBExtension.actionHandler.OnTutorialFinished(true);
	}
	var restartTutorial = getQueryString()["restartTutorial"];
	if (restartTutorial) {
		if (lastWindowId) {
			if (SBExtension.bg && SBExtension.bg.SBExtension) {
				SBExtension.bg.SBExtension.setTutorialWindowId(lastWindowId);
			}
			SBExtension.setTutorialWindowId(lastWindowId);
		}
		window.location.href = restartTutorial;
		return;
	}
	if (lastWindowId) {
		if (SBExtension.bg && SBExtension.bg.SBExtension) {
			delete SBExtension.bg.SBExtension.lastWindowId;
		}
		delete SBExtension.lastWindowId;
	}
	window.close(); 
}

function getQueryString() {
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	var length = vars.length;
	for (var i=0;i<length;i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
		// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]], decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	} 
	return query_string;
}
