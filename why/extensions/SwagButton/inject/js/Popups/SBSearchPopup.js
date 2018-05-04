if (SBExtension.browserInject) {

function SBSearchPopups() {}
	
SBSearchPopups.prototype = SBExtension.extend(SBPopupBase.prototype, SBSearchPopups);

SBSearchPopups.prototype.initSearch = function(jqSB, doc, tabId) {
	this.init(jqSB, doc, tabId);
	jqSB("#sestylePopup", doc).remove();
	    //for special terms
	    style = doc.createElement("style");
	    style.type = "text/css";
	    style.id = "sestylePopup";
	
	    if (style.styleSheet) {
		style.styleSheet.cssText = SBExtension.injectPage.cssPopop;
	} else {
		style.appendChild(doc.createTextNode(SBExtension.injectPage.cssPopop));
	}
}
	
SBSearchPopups.prototype.createPopup = function(data){
	var isUrlSecure = (this.doc.location.href.indexOf("https:")==0);
	this.jqSB('#SESearchPopupId', this.doc).remove();
	var div = this.doc.createElement("div");
	div.setAttribute("id", "SESearchPopupId");
	var divInnerHTML = 
		'<div class="SESearchImgContainer">' +
			'<div class="SESearchImgage">' +
					'<img src="'+ this.imageByPosition(7, isUrlSecure) +'"/>' +
			'</div>' +
		'</div>' +
		'<div class="SESearchContent">' +
				'<div id="sbNotifCloseBtn"></div>' +
				'<div class="SESearchContentText">' + data.text + '</div>' +
				'<div id="clickViewText"></div>' +
		'</div>';
	SBExtension.browserInject.setInnerHTML(div, divInnerHTML, this.doc);

	this.doc.getElementsByTagName("HTML")[0].appendChild(div);
	this.jqSB('#sbNotifCloseBtn', this.doc).click(function(e){
		e.stopPropagation()
		(elem = this.parentNode.parentNode).parentNode.removeChild(elem);
		
	});
	var url = data.clickURL;
	this.jqSB('#SESearchPopupId', this.doc).click(function(){
		SBExtension.browserInject.showLoginScreen(url);
		(elem = this).parentNode.removeChild(elem);
	});
}
	
SBSearchPopups.prototype.clearPopup = function(doc){
	var element = doc.getElementById('SESearchPopupId');
	if(element && element.parentNode){
		element.parentNode.removeChild(element);
	}
}

SBExtension.searchPopups = new SBSearchPopups();

}
