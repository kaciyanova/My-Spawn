SBExtension.TabObject = function(tabId){
	this.lastUserSelTS = 0;
	this.lastUserSelMenuItem = "";
	this.lastVisitedPageTS = 0;
	this.lastVisitedPageMenuItem = "";
	this.currentMenuSubItem = "";
	this.stateArray = [0,0,0,0,0,0,0,0];
	this.selectionPriority = 0; 
	this.selectionMethod = 0; 
	this.curMenuItemIndex = 0;
	
	this.tabId = tabId;
	this.instanceID = 0;
	this.url = "";
	this.host = "";
	this.domain = "";
	this.matchedBy = 0;
	this.oldHost = "";
	this.oldDomain = "";
	this.oldMatchedBy = -1;
	this.dirty = 0;
	this.affMerch = [];
	this.referrer = "";
	this.forceGreenState = false;
	this.store = false;
	this.initialization = false;
	this.merchantID = 0;
	this.bannerEnabled = true;
	this.isMainFrameMerchant = false;
};

SBExtension.TabObject.prototype.clean = function(){
	this.affMerch = [];
};

SBExtension.TabObject.prototype.setMerchantByDomainObject = function(merchant, domainObject, returningCalculatedMerchantOnlyNoSave) {
	if (merchant && !this.merchantID) {
		this.isMainFrameMerchant = false;
		if (merchant.type != "main_frame") {
			return null;
		}
		this.isMainFrameMerchant = true;
		if (!returningCalculatedMerchantOnlyNoSave) {
			this.hardSetMerchant(merchant);
		}
		return merchant.mID; //false;
	}
	if (merchant && this.merchantID) {
		if (merchant.mID != this.merchantID && merchant.type != "main_frame" && this.isMainFrameMerchant) {
			return this.merchantID;
		}


		var differentMatch = false;
		if (domainObject.matchedBy && this.matchedBy && this.matchedBy != domainObject.matchedBy) {
			differentMatch = true;
		}
		if (!differentMatch && this.getMatch() != domainObject.getMatch()) {
			differentMatch = true;
		}

		if (differentMatch) {
			if (!returningCalculatedMerchantOnlyNoSave) {
				this.hardSetMerchant(merchant);
				this.matchedBy = domainObject.matchedBy;
			}
			return merchant.mID; //false;
		}
		var locMerchant = SBExtension.tabStateHandler.getMerchantByID(this.merchantID);
		var locMerchantName = (locMerchant) ? locMerchant.nameMerchant : "";
		var merchantName = SBExtension.tabStateHandler.getMerchantNameByID(merchant.mID);
		if (locMerchantName == merchantName) {
			if(locMerchant.country == merchant.country){
				return merchant.mID; //false;
			} else if (locMerchant.country != merchant.country) {
				throw new Error("SHOULD NEVER HAPPEN: locMerchant.country [" + locMerchant.country + "] != merchant.country [" + merchant.country + "] for merchantName=" + merchantName); //return merchant.mID; //true;
			}
		} else {
			if (!returningCalculatedMerchantOnlyNoSave) {
				this.hardSetMerchant(merchant);
				this.matchedBy = domainObject.matchedBy;
			}
			return merchant.mID; //false;
		}
	}
	if(!merchant){
		if (!returningCalculatedMerchantOnlyNoSave) {
			this.hardSetMerchant(null);
			this.matchedBy = 0;
		}
		return null;
	}
	return merchant.mID; //false;
};

SBExtension.TabObject.prototype.setMerchant = function(merchant, host, returningCalculatedMerchantOnlyNoSave){
	if(merchant && !this.merchantID){
		if (!returningCalculatedMerchantOnlyNoSave) {
			this.hardSetMerchant(merchant);
		}
		return merchant.mID; //false;
	}
	if(merchant && this.merchantID){
		var locMerchant = SBExtension.tabStateHandler.getMerchantByID(this.merchantID);
		var locMerchantName = (locMerchant) ? locMerchant.nameMerchant : "";
		var merchantName = SBExtension.tabStateHandler.getMerchantNameByID(merchant.mID);
		
		if(host != this.host){
			if (!returningCalculatedMerchantOnlyNoSave) {
				this.hardSetMerchant(merchant);
			}
			return merchant.mID; //false;
		}else if(locMerchantName == merchantName){
			if(locMerchant.country == merchant.country){
				return merchant.mID; //false;
			}else if(locMerchant.country != merchant.country){
				throw new Error("SHOULD NEVER HAPPEN: locMerchant.country [" + locMerchant.country + "] != merchant.country [" + merchant.country + "] for merchantName=" + merchantName); //return merchant.mID; //true;
			}
		}else{
			if (!returningCalculatedMerchantOnlyNoSave) {
				this.hardSetMerchant(merchant);
			}
			return merchant.mID; //false;
		}
	}
	if(!merchant){
		if (!returningCalculatedMerchantOnlyNoSave) {
			this.hardSetMerchant(null);
		}
		return null;
	}
	return merchant.mID; //false;
};

SBExtension.TabObject.prototype.hardSetMerchant = function(merchant){
	if (merchant==null || this.merchantID != merchant.mID)
		SBExtension.browser.removeTabFromMerchant(this.tabId, this.merchantID);
	this.merchantID = (merchant==null) ? null : merchant.mID;
};

SBExtension.TabObject.prototype.addAff = function(host){
	if(host.indexOf("data:image") == 0 || host == "about:blank" || SBExtension.config.isDomainNameReserved(host)){
		return;
	}
	if(this.affMerch.indexOf(host) == -1){
		this.affMerch.push(host);
	}
};

SBExtension.TabObject.prototype.saveStore = function(store){
	this.store = store;
};

SBExtension.TabObject.prototype.saveInStore = function(){
	SBExtension.browser.addTabToMerchant(this.tabId, this.merchantID);
	SBExtension.store.storeGlobalKey(SBExtension.config.keyPrefixTab + this.tabId, this);
};

SBExtension.TabObject.prototype.save = function(){
	if(this.host != this.oldHost){
		if(this.oldHost != ""){
			var obj = SBExtension.tabStateHandler.getObjectByHost(this.oldHost);
			obj.removeTab(this.tabId);
			obj.save();
		}
	}
	if(this.host != ""){
		var obj = SBExtension.tabStateHandler.getObjectByHost(this.host,this.url);
		obj.addTab(this.tabId);
		obj.save();
	}
	this.saveInStore();
};

SBExtension.TabObject.prototype.setUrl = function(url){
	this.url = url;
	var tabStateHandler = SBExtension.tabStateHandler;
	var host = tabStateHandler.getHostname(url);
	var matchedBy = {};
	if (host) {
		var domain = tabStateHandler.getDomainnameFromHost(host);
		var merchant = tabStateHandler.getMerchantByUrl(url, host, domain, matchedBy);
		if (merchant && merchant.checkURL) {
			host = tabStateHandler.getHostname(merchant.checkURL);
			domain =  tabStateHandler.getDomainnameFromHost(host);
			var checkMerchant = tabStateHandler.getMerchantByUrl("", host, domain);
			var mUrl = merchant.nameMerchant;
				if(mUrl[mUrl.length-1] == '/'){
					mUrl = mUrl.substr(0, mUrl.length-1);
				}
				var index = url.indexOf(mUrl);
				if(!checkMerchant && index > 0 && index < 13){
					matchedBy.matchedByURL = true;
					url = merchant.nameMerchant;
				}
		}
	}	
	if(this.host != ""){
		this.oldHost = this.host;
		this.oldDomain = this.oldDomain;
		this.oldMatchedBy = this.matchedBy;
	}
	var newMatchedBy = (matchedBy.matchedByURL) ? 3 : ((matchedBy.matchedByHost) ? 2 : ((matchedBy.matchedByDomain) ? 1 : 0));
	this.matchedBy = newMatchedBy;
	this.domain = tabStateHandler.getDomainname(url);
	this.host = (!newMatchedBy) ? this.domain : tabStateHandler.getHostname(url);
};

SBExtension.TabObject.prototype.getMatch = function() {
	return (this.matchedBy==1) ? this.domain : ((this.matchedBy==3) ? this.url : this.host);
};

SBExtension.TabObject.prototype.getReferrer= function(){
	var referrer = {};
	referrer.tabId = this.tabId;
	referrer.name = "getReferral";
	SBExtension.browser.tabsSendMessage(this.tabId, referrer);
};

SBExtension.TabObject.prototype.remove = function(){
	SBExtension.store.clearKey(SBExtension.config.keyPrefixTab + this.tabId, true);
};
