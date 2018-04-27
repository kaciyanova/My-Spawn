if (SBExtension.browserInject) {

function SBPopupBase() {
	throw new Error("SBPopupBase is abstract and cannot be instantiated!");
}

SBPopupBase.prototype.constructor = SBPopupBase;

SBPopupBase.prototype.init = function(jqSB, doc, tabId) {
	this.jqSB = jqSB;
	this.doc = doc;
	this.tabId = tabId;
}

SBPopupBase.prototype.createPopup = function(data) {
	throw new Error("SBPopupBase is abstract and createPopup() method must be re-defined!");
}

SBPopupBase.prototype.clearPopup = function(doc) {
	throw new Error("SBPopupBase is abstract and clearPopup() method must be re-defined!");
}

//get popup icon by index
SBPopupBase.prototype.imageByPosition = function (index, isUrlSecure){
	switch(index){
		case 0:
			return SBExtension.browserInject.getURL('img/pops/shop_earn.png', isUrlSecure);
		case 1:
			return SBExtension.browserInject.getURL('img/pops/sbtv.png', isUrlSecure);
		case 2:
			return SBExtension.browserInject.getURL('img/pops/play.png', isUrlSecure);
		case 3:
			return SBExtension.browserInject.getURL('img/pops/search.png', isUrlSecure);
		case 4:
			return SBExtension.browserInject.getURL('img/pops/answer.svg', isUrlSecure);
		case 5:
			return SBExtension.browserInject.getURL('img/pops/discover.png', isUrlSecure);
		case 6:
			return SBExtension.browserInject.getURL('img/pops/sc.svg', isUrlSecure);
		case 7:
			return SBExtension.browserInject.getURL('img/pops/account.svg', isUrlSecure);
	}
}

window.SBPopupBase = SBPopupBase;

}
