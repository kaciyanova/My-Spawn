function SBBrowser(siteHost) {
	throw new Error("SBBrowser is abstract and cannot be instantiated!");
}

SBBrowser.prototype.constructor = SBBrowser;

SBBrowser.prototype.initSBBrowser = function(siteHost) {
	// TODO - add common code here...
	this.siteHost = siteHost;
	// The following is for testing. It is always false on "live" system ...
	this.testGreenCrossOver = false;
	this.merchantTabs = {};
}

SBBrowser.prototype.executeForSelectedTab = function(windowId, tabFunction) {
	throw new Error("SBBrowser is abstract and executeForSelectedTab() method must be re-defined!");
}

SBBrowser.prototype.executeForSelectedTabBG = function(windowId, tabFunction) {
	return this.executeForSelectedTab(windowId, tabFunction);
}

SBBrowser.prototype.addOnFocusChangedListener = function(onFocusChangedListener) {
	throw new Error("SBBrowser is abstract and addOnFocusChangedListener() method must be re-defined!");
}

SBBrowser.prototype.addOnTabActivatedListener = function(onTabActivatedListener) {
	throw new Error("SBBrowser is abstract and addOnTabActivatedListener() method must be re-defined!");
}

SBBrowser.prototype.addOnTabCreatedListener = function(onTabCreatedListener) {
	throw new Error("SBBrowser is abstract and addOnTabsCreatedListener() method must be re-defined!");
}

SBBrowser.prototype.addOnTabUpdatedListener = function(onTabUpdatedListener) {
	throw new Error("SBBrowser is abstract and addOnTabUpdatedListener() method must be re-defined!");
}

SBBrowser.prototype.addOnTabMovedListener = function(onTabMovedListener) {
	throw new Error("SBBrowser is abstract and addOnTabMovedListener() method must be re-defined!");
}

SBBrowser.prototype.addOnTabRemovedListener = function(onTabRemovedListener) {
	throw new Error("SBBrowser is abstract and addOnTabRemovedListener() method must be re-defined!");
}

SBBrowser.prototype.addOnBeforeNavigateListener = function(onBeforeNavigateListener) {
	throw new Error("SBBrowser is abstract and addOnBeforeNavigateListener() method must be re-defined!");
}

SBBrowser.prototype.addOnBeforeRedirectListener = function(onBeforeRedirectListener) {
	throw new Error("SBBrowser is abstract and addOnBeforeRedirectListener() method must be re-defined!");
}

SBBrowser.prototype.addOnBeforeRequestListener = function(onBeforeRequestListener) {
	throw new Error("SBBrowser is abstract and addOnBeforeRequestListener() method must be re-defined!");
}

SBBrowser.prototype.addOnCompletedRequestListener = function(onCompletedRequestListener) {
	throw new Error("SBBrowser is abstract and addOnCompletedRequestListener() method must be re-defined!");
}

SBBrowser.prototype.addOnRequestErrorOccurredListener = function(onRequestErrorOccurredListener) {
	throw new Error("SBBrowser is abstract and addOnRequestErrorOccurredListener() method must be re-defined!");
}

SBBrowser.prototype.addOnCookiesChangedListener = function(onCookiesChangedListener) {
	throw new Error("SBBrowser is abstract and addOnCookiesChangedListener() method must be re-defined!");
}

SBBrowser.prototype.addOnMessageListener = function(onMessageListener) {
	throw new Error("SBBrowser is abstract and addOnMessageListener() method must be re-defined!");
}

SBBrowser.prototype.tabsSendMessage = function(activeInfo) {
	throw new Error("SBBrowser is abstract and tabsSendMessage() method must be re-defined!");
}

SBBrowser.prototype.getTabID = function(tab) {
	throw new Error("SBBrowser is abstract and getTabID() method must be re-defined!");
}

SBBrowser.prototype.getActivatedTabID = function(activeInfo) {
	throw new Error("SBBrowser is abstract and getActivatedTabID() method must be re-defined!");
}

SBBrowser.prototype.onTabCreated = function(event) {
	throw new Error("SBBrowser is abstract and onTabCreated() method must be re-defined!");
}

SBBrowser.prototype.onTabMoved = function(event) {
	throw new Error("SBBrowser is abstract and onTabMoved() method must be re-defined!");
}

SBBrowser.prototype.getPopoutByIndex = function(idx) {
	throw new Error("SBBrowser is abstract and getPopoutByIndex() method must be re-defined!");
}

SBBrowser.prototype.getPopoutByID = function(id, pos) {
	throw new Error("SBBrowser is abstract and getPopoutByID() method must be re-defined!");
}

SBBrowser.prototype.uninstallExtension = function(id) {
	throw new Error("SBBrowser is abstract and uninstallExtension() method must be re-defined!");
}

SBBrowser.prototype.reloadExtensionUI = function() {
	throw new Error("SBBrowser is abstract and reloadExtensionUI() method must be re-defined!");
}

SBBrowser.prototype.isMaster = function() {
	throw new Error("SBBrowser is abstract and isMaster() method must be re-defined!");
}

SBBrowser.prototype.getUninstalledIDs = function() {
	throw new Error("SBBrowser is abstract and getUninstalledIDs() method must be re-defined!");
}

SBBrowser.prototype.onWindowLoad = function() {
	throw new Error("SBBrowser is abstract and onWindowLoad() method must be re-defined!");
}

SBBrowser.prototype.getVersion = function() {
	throw new Error("SBBrowser is abstract and getVersion() method must be re-defined!");
}

SBBrowser.prototype.setCookie = function(cookie) {
	throw new Error("SBBrowser is abstract and setCookie() method must be re-defined!");
}

SBBrowser.prototype.getRequestUponCompletion = function(details) {
	throw new Error("SBBrowser is abstract and getRequestUponCompletion() method must be re-defined!");
}

SBBrowser.prototype.saveRequestUponCompletion = function(req) {
	throw new Error("SBBrowser is abstract and saveRequestUponCompletion() method must be re-defined!");
}

SBBrowser.prototype.finalizeRequestUponCompletion = function(req) {
	throw new Error("SBBrowser is abstract and finalizeRequestUponCompletion() method must be re-defined!");
}

SBBrowser.prototype.checkExtensionUpdate = function(url) {
	throw new Error("SBBrowser is abstract and checkExtensionUpdate() method must be re-defined!");
}

SBBrowser.prototype.checkForExtensionUpdate = function(extensionInfoSupplied, newVersionID, lastCritVersionID, newUpdateURL, newUpdateCritical) {
	throw new Error("SBBrowser is abstract and checkForExtensionUpdate() method must be re-defined!");
}

SBBrowser.prototype.onBeforeWebRequest = function(details) {
	throw new Error("SBBrowser is abstract and onBeforeWebRequest() method must be re-defined!");
}

SBBrowser.prototype.setPopupIcon = function(imgFileName) {
	throw new Error("SBBrowser is abstract and setPopupIcon() method must be re-defined!");
}

SBBrowser.prototype.getRealImageName = function(imgFileName) {
	throw new Error("SBBrowser is abstract and getRealImageName() method must be re-defined!");
}

SBBrowser.prototype.executeForAllPopups = function(callback) {	// MUST CALL BACK callback(popup) for all popups
	throw new Error("SBBrowser is abstract and executeForAllPopups() method must be re-defined!");
}

SBBrowser.prototype.getCurrentWindowID = function() {
	throw new Error("SBBrowser is abstract and getCurrentWindowID() method must be re-defined!");
}

SBBrowser.prototype.syncDomainState = function() {
	throw new Error("SBBrowser is abstract and syncDomainState() method must be re-defined!");
}

SBBrowser.prototype.isDesktopNotificationSupported = function() {
	throw new Error("SBBrowser is abstract and isDesktopNotificationSupported() method must be re-defined!");
}

SBBrowser.prototype.createDesktopNotification = function(iconURL, title, body) {
	throw new Error("SBBrowser is abstract and createDesktopNotification() method must be re-defined!");
}

SBBrowser.prototype.getTabWindowID = function(tab) {
	throw new Error("SBBrowser is abstract and getTabWindowID() method must be re-defined!");
}

SBBrowser.prototype.focusOnPopout = (window.SBBrowserPopup) ? SBBrowserPopup.prototype.focusOnPopout : function () { };
SBBrowser.prototype.isPopoutSupported = (window.SBBrowserPopup) ? SBBrowserPopup.prototype.isPopoutSupported : function () { };

SBBrowser.prototype.closePopout = function(tab) {
	throw new Error("SBBrowser is abstract and closePopout() method must be re-defined!");
}

SBBrowser.prototype.openPopUP = function(tabId, url) {
	throw new Error("SBBrowser is abstract and openPopUP() method must be re-defined!");
}

SBBrowser.prototype.openNewWindow = function(width, height, url, title) {
	throw new Error("SBBrowser is abstract and openNewWindow() method must be re-defined!");
}

SBBrowser.prototype.initPopOut = function(pos) {
	throw new Error("SBBrowser is abstract and initPopOut() method must be re-defined!");
}

SBBrowser.prototype.getBrowserStatsFlag = function() {
	throw new Error("SBBrowser is abstract and getBrowserStatsFlag() method must be re-defined!");
}

SBBrowser.prototype.onUpdatePerformed = function(updateMessage){
	throw new Error("SBBrowser is abstract and onUpdatePerformed() method must be re-defined!");
}

SBBrowser.prototype.checkVersionNumber = function() {
	throw new Error("SBBrowser is abstract and checkVersionNumber() method must be re-defined!");
}

SBBrowser.prototype.getSEVersionInfo = function(callback) {
	throw new Error("SBBrowser is abstract and getSEVersionInfo() method must be re-defined!");
}

SBBrowser.prototype.getURLSearchType = function() {
	throw new Error("SBBrowser is abstract and getURLSearchType() method must be re-defined!");
}

SBBrowser.prototype.addOnBeforeUninstallListener = function(onBeforeUninstallListener) {
	throw new Error("SBBrowser is abstract and addOnBeforeUninstallListener() method must be re-defined!");
}

SBBrowser.prototype.addOnBeforeDisableListener = function(onBeforeDisableListener) {
	throw new Error("SBBrowser is abstract and addOnBeforeDisableListener() method must be re-defined!");
}

SBBrowser.prototype.getConduitToolbarAddonsToUninstall = function(callback, onlyLookingForEnabled) {
	throw new Error("SBBrowser is abstract and getConduitToolbarAddonsToUninstall() method must be re-defined!");
}

SBBrowser.prototype.getNativeLocalStorage = function() {
	throw new Error("SBBrowser is abstract and getNativeLocalStorage() method must be re-defined!");
}

SBBrowser.prototype.addSecurityFieldsToAjaxCall = function(ajaxCall) {
	throw new Error("SBBrowser is abstract and addSecurityFieldsToAjaxCall() method must be re-defined!");
}

SBBrowser.prototype.broadcastStateChange = function(fields) {
	throw new Error("SBBrowser is abstract and broadcastStateChange() method must be re-defined!");
}

SBBrowser.prototype.onGlobalStateChanged = function() {
	throw new Error("SBBrowser is abstract and onGlobalStateChanged() method must be re-defined!");
}

SBBrowser.prototype.onRemoteCallSuccess = function(network, responseData) {
	throw new Error("SBBrowser is abstract and onRemoteCallSuccess() method must be re-defined!");
}

SBBrowser.prototype.onRemoteCallError = function(network, responseData) {
	throw new Error("SBBrowser is abstract and onRemoteCallError() method must be re-defined!");
}

SBBrowser.prototype.isPopupBeingOpened = function() {
	throw new Error("SBBrowser is abstract and isPopupBeingOpened() method must be re-defined!");
}

SBBrowser.prototype.isUpdateWithoutRestartSupported = function() {
	throw new Error("SBBrowser is abstract and isUpdateWithoutRestartSupported() method must be re-defined!");
}

SBBrowser.prototype.getLocalStorage = function() {
	throw new Error("SBBrowser is abstract and getLocalStorage() method must be re-defined!");
}

SBBrowser.prototype.isActivatingInSameTab = function(callbackSameTab, callbackDifferentTab) {
	throw new Error("SBBrowser is abstract and isActivatingInSameTab() method must be re-defined!");
}

SBBrowser.prototype.addTabToMerchant = function(tabId, merchantID) {
	if (merchantID) {
		var merchantTabs = this.merchantTabs[merchantID];
		if (!merchantTabs) {
			merchantTabs = {};
			this.merchantTabs[merchantID] = merchantTabs;
		}
		merchantTabs[tabId] = 1;
	}
}

SBBrowser.prototype.removeTabFromMerchant = function(tabId, merchantID) {
	if (merchantID) {
		var merchantTabs = this.merchantTabs[merchantID];
		if (merchantTabs) {
			delete merchantTabs[tabId];
		}
	}
}

SBBrowser.prototype.getMerchantTabs = function(merchantID) {
	var merchantTabs = null;
	if (merchantID) {
		merchantTabs = this.merchantTabs[merchantID];
	}
	return merchantTabs;
}

SBBrowser.prototype.getSettings = function() {
  throw new Error("SBBrowser is abstract and getSettings() method must be re-defined!");
}

SBBrowser.prototype.setSettings = function(settings) {
	throw new Error("SBBrowser is abstract and setSettings() method must be re-defined!");
}

SBBrowser.prototype.wasTutorialOpened = function() {
	throw new Error("SBBrowser is abstract and wasTutorialOpened() method must be re-defined!");
}

SBBrowser.prototype.setTutorialOpened = function() {
	throw new Error("SBBrowser is abstract and setTutorialOpened() method must be re-defined!");
}

SBBrowser.prototype.getLastHeartbeatTS = function() {
	throw new Error("SBBrowser is abstract and getLastHeartbeatTS() method must be re-defined!");
}

SBBrowser.prototype.setLastHeartbeatTS = function(curTS) {
        throw new Error("SBBrowser is abstract and setLastHeartbeatTS() method must be re-defined!");
}

SBBrowser.prototype.getLocalizedString = function(name) {
        throw new Error("SBBrowser is abstract and getLocalizedString() method must be re-defined!");
}

SBBrowser.prototype.startHeartbeatChecker = function() {
        throw new Error("SBBrowser is abstract and startHeartbeatChecker() method must be re-defined!");
}

