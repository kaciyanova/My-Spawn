SBExtension.Request = function(id, startURL, redirect) {
	this.id = id;
	this.startURL = startURL;
	this.finalURL = "";
	this.type = "";
	this.redirect = redirect;
	this.tabId = 0;
};

SBExtension.Request.prototype.addRedirect = function(url){
	if(this.redirect.indexOf(url) == -1){
		this.redirect.push(url);
	}
	this.save();
};

SBExtension.Request.prototype.save = function(){
	SBExtension.store.storeGlobalKey(SBExtension.config.keyPrefixRequest + this.id, this);
};

SBExtension.Request.prototype.remove = function(){
	SBExtension.store.clearKey(SBExtension.config.keyPrefixRequest + this.id, true);
};
