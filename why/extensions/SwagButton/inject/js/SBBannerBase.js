if (SBExtension.browserInject) {

function SBBannerBase() {
	throw new Error("SBBannerBase is abstract and cannot be instantiated!");
}

SBBannerBase.prototype.constructor = SBBannerBase;

SBBannerBase.prototype.init = function(jqSB, doc, tabId) {
	this.jqSB = jqSB;
	this.doc = doc;
	this.tabId = tabId;
}

SBBannerBase.prototype.initStyle = function(color, state, onExtensionPage) {
	throw new Error("SBBannerBase is abstract and initStyle() method must be re-defined!");
}

SBBannerBase.prototype.checkPosition = function(tabId, toolbarId, toolbarHeight) {
	throw new Error("SBBannerBase is abstract and createPopup() method must be re-defined!");
}

SBBannerBase.prototype.createBanner = function(data, state) {
	throw new Error("SBBannerBase is abstract and createBanner() method must be re-defined!");
}

SBBannerBase.prototype.renderBanner = function(data, state) {
	throw new Error("SBBannerBase is abstract and renderBanner() method must be re-defined!");
}

SBBannerBase.prototype.removeBanner = function(doc,jqSB) {
	throw new Error("SBBannerBase is abstract and removeBanner() method must be re-defined!");
}

window.SBBannerBase = SBBannerBase;

}
