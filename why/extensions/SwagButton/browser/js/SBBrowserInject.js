function SBBrowserInject(siteHost) {
	throw new Error("SBBrowserInject is abstract and cannot be instantiated!");
}

SBBrowserInject.prototype.constructor = SBBrowserInject;

SBBrowserInject.prototype.initSBBrowserInject = function(siteHost) {
	// TODO - add common code here...
	this.siteHost = siteHost;
}

SBBrowserInject.prototype.addOnBgMessageListener = function(onMessageListener) { //function(data, sender) {
	throw new Error("SBBrowserInject is abstract and addOnBgMessageListener() method must be re-defined!");
}

SBBrowserInject.prototype.sendBgMessage = function(eventName, tabId, param, callbackFunction) {
	throw new Error("SBBrowserInject is abstract and sendBgMessage() method must be re-defined!");
}

SBBrowserInject.prototype.addWindowEventListener = function(windowEventListener) {
	throw new Error("SBBrowserInject is abstract and addWindowEventListener() method must be re-defined!");
}

SBBrowserInject.prototype.getURL = function(filePath, isUrlSecure) {
	throw new Error("SBBrowserInject is abstract and getURL() method must be re-defined!");
}

SBBrowserInject.prototype.createEventInjectionCode = function(message) {
	throw new Error("SBBrowserInject is abstract and createEventInjectionCode() method must be re-defined!");
}

SBBrowserInject.prototype.isInjectPagePreActivated = function() {
	throw new Error("SBBrowserInject is abstract and isInjectPagePreActivated() method must be re-defined!");
}

SBBrowserInject.prototype.jumpToURL = function(doc, url) {
	throw new Error("SBBrowserInject is abstract and jumpToURL() method must be re-defined!");
}

SBBrowserInject.prototype.getDocumentByID = function(tabId) {
	throw new Error("SBBrowserInject is abstract and getDocumentByID() method must be re-defined!");
}

SBBrowserInject.prototype.openNewTab = function(url) {
	throw new Error("SBBrowserInject is abstract and openNewTab() method must be re-defined!");
}

SBBrowserInject.prototype.getNativeLocalStorage = function() {
	throw new Error("SBBrowserInject is abstract and getNativeLocalStorage() method must be re-defined!");
}

SBBrowserInject.prototype.addSecurityFieldsToAjaxCall = function(ajaxCall) {
	throw new Error("SBBrowserInject is abstract and addSecurityFieldsToAjaxCall() method must be re-defined!");
}

SBBrowserInject.prototype.broadcastStateChange = function(fields) {
	throw new Error("SBBrowserInject is abstract and broadcastStateChange() method must be re-defined!");
}

SBBrowserInject.prototype.createTag = function(doc, tagName) {
	throw new Error("SBBrowserInject is abstract and createTag() method must be re-defined!");
};

SBBrowserInject.prototype.setAttribute = function(elem, attrName, attrValue) {
	throw new Error("SBBrowserInject is abstract and setAttribute() method must be re-defined!");
};

SBBrowserInject.prototype.getLocalStorage = function() {
	throw new Error("SBBrowserInject is abstract and getLocalStorage() method must be re-defined!");
};

SBBrowserInject.prototype.setInnerHTML = function(divSE, innerHTML) {
	throw new Error("SBBrowserInject is abstract and getLocalStorage() method must be re-defined!");
};

SBBrowserInject.prototype.getLocalizedString = function(name) {
        throw new Error("SBBrowserInject is abstract and getLocalizedString() method must be re-defined!");
};

SBBrowserInject.prototype.getVersion = function(callback) {
	this.sendBgMessage("GetVersion", -1, "",
			   function(res) {
				if (callback) {
					callback(res);
				}
			   });
}

window.SBBrowserInject = SBBrowserInject;
