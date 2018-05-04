function SBBrowserPopup(siteHost) {
	throw new Error("SBBrowserPopup is abstract and cannot be instantiated!");
}

SBBrowserPopup.prototype.constructor = SBBrowserPopup;

SBBrowserPopup.prototype.initSBBrowserPopup = function(siteHost) {
	// TODO - add common code here...
}

SBBrowserPopup.prototype.createTag = function(doc, tagName) {
	throw new Error("SBBrowserPopup is abstract and createTag() method must be re-defined!");
}

SBBrowserPopup.prototype.setAttribute = function(elem, attrName, attrValue) {
	throw new Error("SBBrowserPopup is abstract and setAttribute() method must be re-defined!");
}

SBBrowserPopup.prototype.setText = function(elem, text) {
	throw new Error("SBBrowserPopup is abstract and setText() method must be re-defined!");
}

SBBrowserPopup.prototype.openNewTab = function(url) {
	throw new Error("SBBrowserPopup is abstract and openNewTab() method must be re-defined!");
}

SBBrowserPopup.prototype.setNewTabURLOnClick = function(elem, url) {
	throw new Error("SBBrowserPopup is abstract and setNewTabURLOnClick() method must be re-defined!");
}

SBBrowserPopup.prototype.isSearchChangeSupported = function() {
	throw new Error("SBBrowserPopup is abstract and isSearchChangeSupported() method must be re-defined!");
}

SBBrowserPopup.prototype.isPopoutSupported = function() {
	throw new Error("SBBrowserPopup is abstract and isPopoutSupported() method must be re-defined!");
}

SBBrowserPopup.prototype.isMenuJSSupported = function() {
	return this.isPopoutSupported();
}

SBBrowserPopup.prototype.focusOnPopout = function(windowId) {
	throw new Error("SBBrowserPopup is abstract and focusOnPopout() method must be re-defined!");
}

SBBrowserPopup.prototype.clickEventListen = function(windowId) {
	throw new Error("SBBrowserPopup is abstract and clickEventListen() method must be re-defined!");
}

SBBrowserPopup.prototype.getPopupSearchType = function() {
	throw new Error("SBBrowserPopup is abstract and getPopupSearchType() method must be re-defined!");
}

SBBrowserPopup.prototype.getNativeLocalStorage = function() {
	throw new Error("SBBrowserPopup is abstract and getNativeLocalStorage() method must be re-defined!");
}

SBBrowserPopup.prototype.addSecurityFieldsToAjaxCall = function(ajaxCall) {
	throw new Error("SBBrowserPopup is abstract and addSecurityFieldsToAjaxCall() method must be re-defined!");
}

SBBrowserPopup.prototype.broadcastStateChange = function(fields) {
	throw new Error("SBBrowserPopup is abstract and broadcastStateChange() method must be re-defined!");
}

SBBrowserPopup.prototype.initPopUp = function() {
	throw new Error("SBBrowserPopup is abstract and initPopUp() method must be re-defined!");
}

SBBrowserPopup.prototype.onRemoteCallSuccess = function(network, responseData) {
	throw new Error("SBBrowserPopup is abstract and onRemoteCallSuccess() method must be re-defined!");
}

SBBrowserPopup.prototype.onRemoteCallError = function(network, responseData) {
	throw new Error("SBBrowserPopup is abstract and onRemoteCallError() method must be re-defined!");
}

SBBrowserPopup.prototype.isPopoutLinked = function() {
	throw new Error("SBBrowserPopup is abstract and isPopoutLinked() method must be re-defined!");
}

SBBrowserPopup.prototype.getBrowserStatsFlag = function() {
	throw new Error("SBBrowserPopup is abstract and getBrowserStatsFlag() method must be re-defined!");
}

SBBrowserPopup.prototype.finishPopupLoading = function() {
	throw new Error("SBBrowserPopup is abstract and finishPopupLoading() method must be re-defined!");
};

SBBrowserPopup.prototype.setPopupBeingOpened = function(openFlag) {
	throw new Error("SBBrowserPopup is abstract and setPopupBeingOpened() method must be re-defined!");
};

SBBrowserPopup.prototype.getURL = function(filePath) {
	throw new Error("SBBrowserPopup is abstract and getURL() method must be re-defined!");
}

SBBrowserPopup.prototype.getLocalStorage = function() {
	throw new Error("SBBrowserPopup is abstract and getLocalStorage() method must be re-defined!");
}

SBBrowserPopup.prototype.onUpdateConfirmed = function(updateIsCritical) {
	throw new Error("SBBrowserPopup is abstract and onUpdateConfirmed() method must be re-defined!");
}

SBBrowserPopup.prototype.doConfirmUpdate = function(updateIsCritical, prompt) {
	throw new Error("SBBrowserPopup is abstract and doConfirmUpdate() method must be re-defined!");
}

SBBrowserPopup.prototype.getSettings = function() {
	throw new Error("SBBrowserPopup is abstract and getSettings() method must be re-defined!");
};

SBBrowserPopup.prototype.setSettings = function(settings) {
	throw new Error("SBBrowserPopup is abstract and setSettings() method must be re-defined!");
};

SBBrowserPopup.prototype.OpenTutorial = function() {
	throw new Error("SBBrowserPopup is abstract and OpenTutorial() method must be re-defined!");
};

SBBrowserPopup.prototype.setInnerHTML = function(divSE, innerHTML) {
	throw new Error("SBBrowserPopup is abstract and getLocalStorage() method must be re-defined!");
};

SBBrowserPopup.prototype.isPromptDefaultSearchRequired = function() {
	throw new Error("SBBrowserPopup is abstract and isPromptDefaultSearchRequired() method must be re-defined!");
};

SBBrowserPopup.prototype.getLocalizedString = function(name) {
        throw new Error("SBBrowserPopup is abstract and getLocalizedString() method must be re-defined!");
};

SBBrowserPopup.prototype.isPromptDefaultSearchRequired = function() {
	if (SBExtension.isSearchSetToSB())
		return false;
	var lastPopupClosedTS = SBExtension.store.retrieveGlobalKey("DefSearchPopupClosedTS");
	return (!lastPopupClosedTS || !((new Date()).getTime() < parseInt(lastPopupClosedTS)+24*3600000));
};

SBBrowserPopup.prototype.translate = function(callback, doc, suffix, bodyElemName) {
  try {
	var browserPopup = this;
	if (!browserPopup.isTranslationRequired || browserPopup.isTranslationRequired(suffix)) {
		doc = doc || document;
		var callbackLocal = function() {
		  bodyElemName = bodyElemName || "#se_body";
		  $($(bodyElemName, doc)[0].getElementsByTagName("*")).each(function(){
			if ($(this).is("[l10n]:not(.l10n-replaced)")) {
				var attr = $(this).attr("l10n");
				if (attr) {
					browserPopup.setInnerHTML($(this)[0], browserPopup.getLocalizedDtdString(attr), doc);
				}
			}
			if ($(this).is("[l10nValue]:not(.l10n-replaced)")) {
				var attr = $(this).attr("l10nValue");
				if (attr)
					$(this).val(browserPopup.getLocalizedDtdString(attr));
			}
			if ($(this).is("[l10nTitle]:not(.l10n-replaced)")) {
				var attr = $(this).attr("l10nTitle");
				if (attr)
					$(this).attr("title", browserPopup.getLocalizedDtdString(attr));
			}
			if ($(this).is("[l10nPlaceholder]:not(.l10n-replaced)")) {
				var attr = $(this).attr("l10nPlaceholder");
				if (attr) {
					var elem = doc.createElement('span');
					browserPopup.setInnerHTML(elem, browserPopup.getLocalizedDtdString(attr), doc);
					var decoded = elem.textContent;
					$(this).attr("placeholder", decoded);
				}
			}
			if ($(this).is("[l10nReplacementEl]:not(.l10n-replaced)")) {
				var dummyLink = $("a", this);
				var text = dummyLink.text();
				var realEl = $("#" + $(this).attr("l10nReplacementEl"));
				realEl.text(text).val(text).replaceAll(dummyLink);
				$(this).addClass("l10n-replaced");
			}
		  });
		  if (callback) {
			callback();
		  }
		};
		browserPopup.resetLocale(false, callbackLocal);
		if (browserPopup.onTranslationFinished) {
			browserPopup.onTranslationFinished(suffix);
		}
	} else {
		if (callback) {
			callback();
		}
	}
  } catch(err) {
	console.log("TRANSLATE: " + err);
  }
};
