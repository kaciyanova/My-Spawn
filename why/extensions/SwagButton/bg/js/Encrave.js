SBExtension.Encrave = {
	ts: SBExtension.store.retrieveGlobalKey("SE_HASH_TS") || 0,
	hosts: SBExtension.store.retrieveGlobalKey("ENCRAVE_HOSTS") || [],
	frames: SBExtension.store.retrieveGlobalKey("ENCRAVE_FRAMES") || [],
	jsUrl: SBExtension.store.retrieveGlobalKey("ENCRAVE_JS_URL") || "",
	tabIds: {}
};
SBExtension.Encrave.setProperties = function(data) {
	if (data && data.hosts && data.frames && data.jsUrl) {
		SBExtension.store.storeGlobalKey("ENCRAVE_HOSTS", data.hosts);
		SBExtension.store.storeGlobalKey("ENCRAVE_FRAMES", data.frames);
		SBExtension.store.storeGlobalKey("ENCRAVE_JS_URL", data.jsUrl);
		this.hosts = data.hosts;
		this.frames = data.frames;
		this.jsUrl = data.jsUrl;
	}
};

SBExtension.Encrave.handleEncraveTop = function(request, tabId) {
	var reqLoc = request.location;
	if (typeof reqLoc == "string") {
		// This is here to avoid "permission denied: in IE...
		reqLoc = JSON.parse(reqLoc);
	}
	delete this.tabIds[tabId];
	if (this.hosts.indexOf(reqLoc.hostname) > -1) {
		this.tabIds[tabId] = reqLoc.pathname;
	}
};
SBExtension.Encrave.handleEncraveIframe = function(request, tabId, callback) {
	if (this.tabIds[tabId]) {
		if (request.windowName == 'contIframe') {
			var jsUrl = "";
			if (typeof this.jsUrl == "string") {
				 jsUrl = this.jsUrl;
			}
			else if (this.jsUrl['file'] && this.jsUrl['path']) {
				var parentPath = this.tabIds[tabId];
				var idIndex = parentPath.indexOf("/promo");
				if (idIndex > -1) {
					jsUrl = this.jsUrl.path + parentPath.substring(idIndex + 7, parentPath.length) + "/" + this.jsUrl.file;
				}
				else {
					jsUrl = this.jsUrl.path + this.jsUrl.file;
				}
			}
			if (jsUrl.length > 0) {
				var response = {isEncraveFrame: true, jsUrl: jsUrl};
				if (request.document) {
					response.document = request.document;
				}
				callback(response);
				return;					
			}
		}
	}
	var response = {isEncraveFrame: false, forceDocumentComplete:request.forceDocumentComplete};
	if (request.document) {
		response.document = request.document;
	}
	response.tabId = tabId;
	callback(response);
};

SBExtension.Encrave.handleEncravePageLoad = function(request, tabId, callback) {
	if (request.isTop) {
		this.handleEncraveTop(request, tabId);
		var response = {isEncraveFrame: false, isPage: true};
		if (request.document) {
			response.document = request.document;
		}
		response.tabId = tabId;
		response.pageLoadedBefore = SBExtension.store.onPageLoadAfterInstall();
		callback(response);
	}
	else {
		this.handleEncraveIframe(request, tabId, callback);
	}
};
