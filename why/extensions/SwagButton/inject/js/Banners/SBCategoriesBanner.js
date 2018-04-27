if (SBExtension.browserInject) {

function SBCategoriesBanner() {}
	
SBCategoriesBanner.prototype = SBExtension.extend(SBBannerBase.prototype, SBCategoriesBanner);

SBCategoriesBanner.prototype.initCategories = function(jqSB, doc, tabId) {
	this.init(jqSB, doc, tabId);
}
	
SBCategoriesBanner.prototype.initStyle = function() { //function(tab)
	this.jqSB("#sestyle1", this.doc).remove();
	var css = 
		"#popUpSEToolbar div, #popUpSEHooray div { \n" +
		"/* add in your default preferences in here - color, list styles, font family etc.. */ \n" +
		"/* position: static !important; */\n" +
		"/* z-index: auto !important; */\n" +
		"/* color: #000 !important; */\n" +
		"background: transparent none repeat scroll 0 0 !important;\n" +

		"/* float: none !important; */\n" +
		"clear: none !important;\n" +

		"/* padding: 0 !important; */\n" +
		"/* margin: 0 !important; */\n" +
		"border: 0 solid #000 !important;\n" +

		"min-height: 0 !important; \n" +
		"max-height: none !important; \n" +
		"/* height: auto !important; */\n" +
		"line-height: 12px;/\n" +

		"/* min-width: 0 !important; */\n" +
		"max-width: none !important; \n" +
		"/* width: auto !important; */\n" +

		"/* font: normal normal normal 11px/1.5 arial, verdana, sans-serif !important; */\n" +
		"font-family: Arial,Helvetica,sans-serif; \n" +
		"list-style: disc outside none !important; \n" +
		"letter-spacing: normal !important; \n" +
		"text-align: left !important; \n" +
		"text-decoration: none !important; \n" +
		"text-indent: 0 !important; \n" +
		"text-transform: none !important; \n" +
		"white-space: normal !important; \n" +
		"word-spacing: normal !important; \n" +
		"vertical-align: baseline !important;\n" +

		"unicode-bidi: normal !important; \n" +
		"direction: ltr !important;\n" +

		"clip: auto !important; \n" +
		"overflow: visible !important; \n" +
		"visibility: visible !important; \n" +
		"outline: invert none medium !important;\n" +

		"/** odditites which will need specified separately for each property that it goes against **/ \n" +
		"display: inline !important; \n" +
		"cursor: auto !important;\n" +

		"/* if any of the elements are to be draggable you cannot set these \n" +
		"you should however take care and set all four even if auto in the individual positioned elements \n" +
		"top: auto !important; \n" +
		"right: auto !important; \n" +
		"bottom: auto !important; \n" +
		"left: auto !important; \n" +
		"*/ \n" +
		"}\n" +

		"#popUpSEToolbar img, #popUpSEHooray img { \n" +
			"float: none !important; \n" +
			"max-width: none !important; \n" +
			"width: initial !important; \n" +
			"vertical-align: initial !important; \n" +
			"-ms-box-sizing: initial !important; \n" +
			"-moz-box-sizing: initial !important; \n" +
			"-webkit-box-sizing: initial !important; \n" +
			"box-sizing: initial !important; \n" +
		"}\n" +

		"/* \n" +
		"absolute containers needs a width \n" +
		"or a min and max width \n" +
		"or at least the parent one does.. \n" +
		"*/\n" +

		"/* extension specific general resets */\n" +

		"#popUpSEToolbar div, #popUpSEHooray div, \n" +
		"#popUpSEToolbar ul, #popUpSEHooray ul \n" +
		"#popUpSEToolbar dl, #popUpSEHooray dl, \n" +
		"#popUpSEToolbar dt, #popUpSEHooray dt, \n" +
		"#popUpSEToolbar dd, #popUpSEHooray dd, \n" +
		"#popUpSEToolbar h2, #popUpSEHooray h2, \n" +
		"#popUpSEToolbar h3, #popUpSEHooray h3, \n" +
		"#popUpSEToolbar { \n" +
		"display: block !important; \n" +
		"} \n" +
		"\n" +
		"#popUpSEToolbar li, #popUpSEHooray li { \n" +
		"display: list-item !important; \n" +
		"margin-left: 0px !important; \n" +
		"margin-right: 0px !important; \n" +
		"margin-top: 0px !important; \n" +
		"margin-bottom: 0px !important; \n" +
		"}\n" +

		"/* table display properties would need to go in here if tables are used in your DHTML */\n" +

		"#popUpSEToolbar b, #popUpSEHooray b, \n" +
		"#popUpSEToolbar strong, #popUpSEHooray strong {font-weight: bold !important;}\n" +

		"#popUpSEToolbar i, #popUpSEHooray i, \n" +
		"#popUpSEToolbar em, #popUpSEHooray em {font-style: italic !important;}\n" +

		"#popUpSEToolbar h2, #popUpSEHooray h2, \n" +
		"#popUpSEToolbar h3, #popUpSEHooray h3 { \n" +
		"font-weight: bold !important; \n" +
		"}\n" +

		"#popUpSEToolbar {height:68px;width:100%;min-width:1000px;position:fixed;top:0px;left:0px;z-index:2147483645;box-shadow: 0 1px rgba(0, 0, 0, 0.64);color:#FFFFFF;background-color:#6DB8D8;repeat-x scroll 0 0 transparent;cursor:default;}" +
		"#popUpSEHooray  {height:68px;width:100%;                 position:fixed;top:0px;left:0px;z-index:2147483645;box-shadow: 0 1px rgba(0, 0, 0, 0.64);color:#FFFFFF;background-color:#4669B6;repeat-x scroll 0 0 transparent;cursor:default;}" +
		"#popUpSpecialCaseToolbar {height:68px;width:100%;min-width:1000px;position:fixed;top:0px;left:0px;z-index:2147483645;box-shadow: 0 1px rgba(0, 0, 0, 0.64);color:#FFFFFF;background-color:#6DB8D8;repeat-x scroll 0 0 transparent;cursor:default;}" +
		"#popUpSEHoorayInnerWrap {width:800px; margin: 0 auto;}" +
		"#popUpSEToolbarInner{text-align:left;font-family:sans-serif;color:#fff;height:36px;min-width:150px;margin:30px 0px 2px 100px;float:left;width:500px;}" + 
		"#popUpSEHoorayInner{text-align:left;font-family:sans-serif;color:#fff;height:36px;min-width:150px;margin:20px 0px 2px auto;float:left;width:950px;}" + 
		"#popUpSEToolbarButton{float:left;margin-top:3px;width:400px;}" +
		"#popUpSEHoorayButton{margin-top: -15px;margin-left: 0px;width: 260px;/*float:right;margin-top:3px;width:400px;*/}" +
		"#popupSEClickPrompt{font-size:18px;font-weight:bold;color: white !important;}" +
		"#popupSEMerchant {font-size:14px;margin-top:5px;color: white !important;}" +
		"#popUpSEToolbarLink{font-size:14px;color:#285187;font-weight:normal;text-decoration:none;}" +
		"#popUpSEToolbarCross{height:19px;width:18px;position:fixed;top:12px;right:15px;}" +
		"#popUpSEToolbarCart{height:42px;width:43px;position:fixed;top:15px;left:15px;}" +
		"#popUpSEHoorayCart{height:42px;width:43px;position:relative;top:-5px;left:-20px;float:left;}" +
		"#actionBtnAction {width: 190px;display: block;margin-top: 15px;color: #fff;font-family:sans-serif;font-size: 14px;font-weight: bold;line-height: 30px;text-align: center;border-radius: 3px;cursor: pointer;text-decoration: none;background-color: #f26c4f;margin-left: 40px;}" +
		"#actionBtnAction:hover {background-color: #d55f45;}" +
		"#actionBtnAction:active {background-color: #ba533d;}";

	this.jqSB("#sestyle2", this.doc).remove();
	var style = this.doc.createElement("style");
	style.type = "text/css";
	style.id = "sestyle1";
	if (style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(this.doc.createTextNode(css));
	}
	var addElement = this.doc.getElementsByTagName("head");
	if (addElement == undefined || addElement == null || addElement.length == 0) {
		addElement = this.doc.getElementsByTagName('body');
	}
	if (addElement && addElement.length > 0) {
		addElement[0].appendChild(style);
	}
	this.jqSB("#sestyle2", this.doc).remove();
	//for special terms
	style = this.doc.createElement("style");
	style.type = "text/css";
	style.id = "sestyle2";

	if (style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(this.doc.createTextNode(css));
	}
	if (addElement && addElement.length > 0) {
		addElement[0].appendChild(style);
	}
}

SBCategoriesBanner.prototype.checkPosition = function(toolbarId, toolbarHeight) {
	if (!toolbarId) {
		toolbarId = "popUpSEToolbar";
	}
	if (!toolbarHeight) {
		toolbarHeight = 68;
	}
	var marginTop = toolbarHeight+2;
	try {
		// Firefox - fighting dead objects...
		//this.doc = SBExtension.injectPage.getDocumentByID(this.tabId);
		var popUpSEToolbar = this.doc.getElementById(toolbarId);
		if (popUpSEToolbar && popUpSEToolbar.style.height == "0px") {
			popUpSEToolbar.style.height = toolbarHeight + "px";
		}
		if (popUpSEToolbar && (parseInt(this.doc.body.style.marginTop) == 0 || isNaN(parseInt(this.doc.body.style.marginTop)))) {
			this.doc.body.style.marginTop = marginTop + 'px';
			this.doc.body.stylePositionOld = this.doc.body.style.position;
			this.doc.body.style.position='relative';
			SBExtension.injectPage.setFixedElement(this.doc.body.childNodes, this.doc, marginTop);
		} else if( !popUpSEToolbar && parseInt(this.doc.body.style.marginTop) == marginTop) {
			this.doc.body.style.marginTop='0px';
			this.doc.body.style.position = this.doc.body.stylePositionOld;
			SBExtension.injectPage.setUnFixedElement();
			SBExtension.injectPage.fixed_element = [];
		}
	} catch(e) {
		SBExtension.alert_debug('Error in injectPopUpHtml -> checkBodyMargin()', e);
	}
	_this = this;
	setTimeout(function() {
		_this.checkPosition(_this.doc, _this.tabId, toolbarId, toolbarHeight);
	}, 500);
}

SBCategoriesBanner.prototype.createBanner = function(data, state) {
	if (!state) {
		state = SBExtension.store.retrieveGlobalKey("popUpBC_" + this.tabId, function(state) {
			return SBExtension.categoriesBanner.createBanner(data, (state) ? state : -1);
		});
	}
	if (state == -1) {
		state = null;
	}
	this.checkPosition('popUpSEToolbar',90);//'popUpSpecialCaseToolbar', 90
	var element = this.doc.getElementById('popUpSEToolbar');
	var state = (state) ? state.split('@') : null;
	if (!element) {
		this.initStyle();
	}
	if (!state || state[2]!=data.domain) {
		SBExtension.store.clearKey("popUpBC_" + this.tabId);
		state = [4, 0, data.domain];
		SBExtension.store.storeGlobalKey("popUpBC_" + this.tabId, 4 + '@' + 0 + '@' + data.domain);
	}
	if (!element && state[0] == 4) {
		this.renderBanner(data);
	}
}

SBCategoriesBanner.prototype.renderBanner = function(data, state) {
	var res = false;
	this.checkPosition(this.doc, this.tabId);
	try {
		var popUpSEToolbar = this.doc.getElementById("popUpSEToolbar");
		if(popUpSEToolbar && popUpSEToolbar.style.display == ''){
			return true;
		}
		this.jqSB('div[id=popUpSEToolbar]', this.doc).remove();
	} catch(e) {
		SBExtension.alert_debug('Error in injectPopUpHtml -> remove()', e);
	}
	try {
		var eventClose = SBExtension.browserInject.createEventInjectionCode({
			seType :'SEClose',
			seTabID:this.tabId,
			seState:0,
			seMID: data.mID
		});
		var eventClick = SBExtension.browserInject.createEventInjectionCode({
			seType :'SEClick',
			seTabID:this.tabId,
			seState:0,
			seMID: data.mID
		});
	} catch(e) {
		SBExtension.alert_debug('Error in injectPopUpHtml -> createEventInjectionCode()', e);
	}


	try {
		var divSE = this.doc.createElement("div");
		divSE.setAttribute("id", "popUpSEToolbar");
		var divSEInnerHTML = '<div id="popUpSEToolbarCart">' +
				'<img src="' + SBExtension.browserInject.getURL("img/banner/sb_logo.svg") + '"/>' +
			'</div>' +
			'<div id="popUpSEToolbarInner">' +
				'<div id="popupSEClickPrompt">' + data.text + '</div>' +
			'</div>' +
			'<div id="popUpSEToolbarButton">' +
				'<a id="actionBtnAction" href="' + data.clickURL + '" target="_blank">' + data.callToAction + '</a>' +
			'</div>' +
			'<div id="popUpSEToolbarCross">' +
				'<a href="#" id="sbHidePopUp">' +
					'<img src="' + SBExtension.browserInject.getURL("img/banner/cross.svg") + '"/>' +
				'</a>' +
			'</div>';
		SBExtension.browserInject.setInnerHTML(divSE, divSEInnerHTML, this.doc);

		this.doc.getElementsByTagName("HTML")[0].appendChild(divSE);
		res = (this.doc.getElementById("popUpSEToolbar") != null);
		_this = this;
		setTimeout(function() {
			var img = _this.jqSB('<img/>', {id:"sb_quantserve", style:"display:none", src:"http://pixel.quantserve.com/pixel/p-b15U9CAASyBMc.gif?labels=Swagbucks+Browser+Extension&ts=" + new Date().getTime()});
			_this.jqSB(divSE).append(img);
		},100);
		setTimeout(function() {
			var img = _this.jqSB('<img/>', {id:"sb_comscore", style:"display:none", src:"http://b.scorecardresearch.com/p?c1=7&c2=15366183&c3=1&cv=2.0&cj=1&ts=" + new Date().getTime()});
			_this.jqSB(divSE).append(img);
		},100);
	} catch(e) {
			SBExtension.alert_debug('Error in injectPopUpHtml -> setting popUpSEToolbar div content', e);
	}

	try {
		SBExtension.injectPage.animateShowPopUp(this.jqSB(divSE), this.doc, data, state);
	} catch(e) {
		SBExtension.alert_debug('Error in injectPopUpHtml -> setting popUpSEToolbar div dynamic content', e);
	}
	
	try {
		var sbHidePopUp = this.doc.getElementById('sbHidePopUp'); 
		this.jqSB(sbHidePopUp, this.doc).click(function() {
			SBExtension.injectPage.contentListener({
				seType :'SECBClose',
				tabId:data.tabId,
				state:0,
				seMID: data.mID});
			});
	} catch(e) {
		SBExtension.alert_debug('Error in injectPopUpHtml -> adding event', e);
	}

	return res;
}

SBCategoriesBanner.prototype.removeBanner = function(doc, jqSB) {
	var element = doc.getElementById('popUpSEToolbar');
	if (element) {
		jqSB(element).remove();
	}
}

SBExtension.categoriesBanner = new SBCategoriesBanner();

}
