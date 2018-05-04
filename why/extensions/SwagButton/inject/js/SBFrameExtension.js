if (typeof SBExtension === "undefined" || SBExtension.browserInject) {

var SBFrameExtension = {
	onDocumentComplete: function(response) {
		if (response.isEncraveFrame) {
			var curDoc = (response.document) ? response.document : document;
			curDoc.domIsReady = true;
			var s = curDoc.createElement("SCRIPT");
		  	s.type = "text/javascript";
		  	s.src = response.jsUrl;	
			curDoc.getElementsByTagName("BODY")[0].appendChild(s);
		} else if ((typeof SBExtension!=="undefined") && SBExtension.injectPage && (response.isPage || response.forceDocumentComplete)) {
			var curDoc = (response.document) ? response.document : null;
			if (curDoc) {
				curDoc.domIsReady = true;
			} else {
				document.domIsReady = true;
			}
			
			SBExtension.injectPage.onDocumentComplete(curDoc, response.tabId>0 && (response.pageLoadedBefore || !response.isPage) ? -response.tabId : response.tabId, response.isPage);
		}
	}
};

window.SBFrameExtension = SBFrameExtension;

}