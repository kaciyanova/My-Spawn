if (SBExtension.browserInject) {

function SBSpecialCaseBanner() {}
	
SBSpecialCaseBanner.prototype = SBExtension.extend(SBBannerBase.prototype, SBSpecialCaseBanner);

SBSpecialCaseBanner.prototype.initSpecialCase = function(jqSB, doc, tabId) {
	this.init(jqSB, doc, tabId);
	this.specialHistory = {};
	this.widthSCMerchants = 0;
	this.countView = 0;
	this.widthSCMerchant = 0;
	this.moveTime = 0;
}
	
SBSpecialCaseBanner.prototype.initStyle = function() { //function(tab)
	var doc = this.doc;
	var style = this.jqSB("#sestyle3", doc);
	if(style.length > 0){
		return;
	}

	    var css = 
			"#popUpSpecialCaseToolbar {font-family: sans-serif;height:90px;width:100%;min-width:640px;position:fixed;top:0px;left:0px;z-index:2147483645;box-shadow: 0 1px rgba(0, 0, 0, 0.64);color:#FFFFFF;background-color:#6DB8D8;repeat-x scroll 0 0 transparent;cursor:default;}" +
			//"#popUpSESCInnerWrap {width:800px;}" +
			"#popUpSESCInner{text-align:left;font-family:sans-serif;color:#fff;height:90px;min-width:150px;margin-left: 30px;float:left;width:240px;}" + 
			"#popUpSEIcon{height:42px;width:43px;position:relative;top:25px;left:-20px;float:left;}" + 
			"#popupSESCPrompt{font-size:18px;font-weight:bold;margin-top: 15px;}" +
			"#popupSECase {font-size:14px;margin-top:2px;margin-left: 45px;line-height: 20px;}" +
			"#popUpSESCCross{height:19px;width:18px;position:fixed;top:12px;right:15px;}" +
			//"#SCMerchants {width:650px;position:relative;margin: 0px auto;height:90px;overflow: hidden;}" +
			"#SCMerchants {width:650px; position: absolute; left: 0px; right: 0px; padding: 0px 30px 0px 250px; margin: 0px auto;/*overflow: hidden;*/}" +
			"#SCMerchantsLine {position:absolute;height:90px;overflow: hidden;width: 600px;}" +
			
			//".SEScrollMove {width:10px;height:22px;float:left;margin-top: 35px;margin-left:5px;margin-right:5px;}" +
			".SEScrollMove {width:10px;height:22px;}" +
			".SEScrollMoveLeftActive {cursor:pointer;background: url(" + SBExtension.browserInject.getURL("img/case/left_active.png") + ") no-repeat center;}" +
			".SEScrollMoveLeftNonActive {background: url(" + SBExtension.browserInject.getURL("img/case/left_non_active.png") + ") no-repeat center;}" +
			".SEScrollMoveRightActive {cursor:pointer;background: url(" + SBExtension.browserInject.getURL("img/case/right_active.png") + ") no-repeat center;}" +
			".SEScrollMoveRightNonActive {background: url(" + SBExtension.browserInject.getURL("img/case/right_non_active.png") + ") no-repeat center;}" +
			//"#SCMerchantsContainer { width:600px;height:90px;float: left; }" +
			"#SCMerchantsContainer { width:600px;height:90px;position: relative;display:block;overflow:hidden;padding-left: 25px;padding-right: 25px; margin-top: 8px;}" +
			//".SCMerchant {background-color:white; border-radius:5px;width:295px;height:74px;margin-top: 8px;margin-right:10px;float: left;}"
			".SCMerchant {background-color:white; border-radius:5px;width:293px;height:74px;list-style: none;margin-right:7px;float: left;}" +
			"#SCMerchantsLeft {position:absolute;top:30px; left: 0px;display: block;}" +
			"#SCMerchantsRight {position:absolute;top:30px; right: 0px;display: block;}" +
			"#ULMerchantsContainer {overflow: hidden; position: relative;}" +
			"#ULMerchants {list-style: none;overflow: hidden;position: relative;top: 0px;left: 0px;margin: 0px;padding: 0px;width: 1752px;}" + 
			".SCMerchantImageHelper {display: inline-block; height: 100%; vertical-align: middle;}" +
			".SCMerchantImage {float:left; margin:0px 21px 0px 14px; max-width: 100px; height: 100%;}" +
			".SCMerchantImage img {max-width: 100px; max-height: 60px; vertical-align: middle;}" +
			".SCMerchantText {float:left;margin-left: 5px;margin-top: 5px;font-weight: bold;}" +
			".SCMerchantTextHead {color:#2C86B2;font-size: 18px;line-height: 35px;}" +
			".SCMerchantTextEarn {color:#616161;font-size: 14px;}" +
		
		
		"/*#popUpSpecialCaseToolbar div { \n" +
		"background: transparent none repeat scroll 0 0 !important;\n" +
		"clear: none !important;\n" +
		"border: 0 solid #000 !important;\n" +
		"min-height: 0 !important; \n" +
		"max-height: none !important; \n" +
		"line-height: 12px;\n" +
		"max-width: none !important; \n" +

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

		"display: inline !important; \n" +
		"cursor: auto !important;\n" +

		"}\n" +

		"#popUpSpecialCaseToolbar div, \n" +
		"#popUpSpecialCaseToolbar ul, \n" +
		"#popUpSpecialCaseToolbar dl, \n" +
		"#popUpSpecialCaseToolbar dt, \n" +
		"#popUpSpecialCaseToolbar dd, \n" +
		"#popUpSpecialCaseToolbar h2, \n" +
		"#popUpSpecialCaseToolbar h3, \n" +
		"#popUpSpecialCaseToolbar { \n" +
		"display: block !important; \n" +
		"}*/\n" +
		"\n" +
		"#popUpSpecialCaseToolbar li { \n" +
		"display: list-item !important; \n" +
		"margin-left: 0px !important; \n" +
		"margin-right: 0px !important; \n" +
		"margin-top: 0px !important; \n" +
		"margin-bottom: 0px !important; \n" +
		"}\n" +

		"/*#popUpSpecialCaseToolbar b, \n" +
		"#popUpSpecialCaseToolbar strong {font-weight: bold !important;}\n" +

		"#popUpSpecialCaseToolbar i, \n" +
		"#popUpSpecialCaseToolbar em {font-style: italic !important;}\n" +

		"#popUpSpecialCaseToolbar h2, \n" +
		"#popUpSpecialCaseToolbar h3 { \n" +
		"font-weight: bold !important; \n" +
		"}\n" +

		"#popUpSpecialCaseToolbar {height:68px;width:100%;min-width:1000px;position:fixed;top:0px;left:0px;z-index:2147483645;box-shadow: 0 1px rgba(0, 0, 0, 0.64);color:#FFFFFF;background-color:#6DB8D8;repeat-x scroll 0 0 transparent;cursor:default;}" +
		"#popUpSESCInner{text-align:left;font-family:sans-serif;color:#fff;height:36px;min-width:150px;margin:20px 0px 2px 100px;float:left;width:350px;}" + 
		"#popUpSESCButton{float:left;margin-top:3px;width:400px;}" +
		"#popUpSEHoorayButton{margin-top: -15px;margin-left: 0px;width: 260px;/*float:right;margin-top:3px;width:400px;*/}" +
		
		"#popUpSESCLink{font-size:14px;color:#285187;font-weight:normal;text-decoration:none;}" +
		"#popUpSESCCross{height:19px;width:18px;position:fixed;top:12px;right:15px;}" +
		"#popUpSESCCart{height:42px;width:43px;position:fixed;top:15px;left:15px;*/}"
		;

		this.jqSB("#sestyle3", doc).remove();
		var style = doc.createElement("style");
		style.type = "text/css";
		style.id = "sestyle3";
		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(doc.createTextNode(css));
		}
		var addElement = doc.getElementsByTagName("head");
		if(addElement == undefined || addElement == null || addElement.length == 0){
			addElement = doc.getElementsByTagName('body');
		}
		if(addElement && addElement.length > 0){
			addElement[0].appendChild(style);
		}
}

SBSpecialCaseBanner.prototype.checkPosition = function(delta) {
	var doc = this.doc;
	var left = parseInt(this.jqSB('#ULMerchants', doc).css("left")) * -1;
	if(delta > 0){
		if (left - this.widthSCMerchant <= 0) {
			this.jqSB('#SCMerchantsRight', doc).removeClass('SEScrollMoveRightNonActive').addClass('SEScrollMoveRightActive');
			this.jqSB('#SCMerchantsLeft', doc).removeClass('SEScrollMoveLeftActive').addClass('SEScrollMoveLeftNonActive');
		}else{
			this.jqSB('#SCMerchantsRight', doc).removeClass('SEScrollMoveRightNonActive').addClass('SEScrollMoveRightActive');
			if ((left + this.widthSCMerchant) <= SBExtension.specialCaseBanner.widthSCMerchants) {
				this.jqSB('#SCMerchantsLeft', doc).removeClass('SEScrollMoveLeftNonActive').addClass('SEScrollMoveLeftActive');
			}
		}
		if (left - this.widthSCMerchant >= 0) {
			this.jqSB('#ULMerchants', doc).animate({left: "+="+this.widthSCMerchant+"px"}, 800,
				function(){
					SBExtension.specialCaseBanner.getActiveElement(doc);
				} );
		}
	} else {
		if ((left + this.widthSCMerchant) + this.widthSCMerchant >= SBExtension.specialCaseBanner.widthSCMerchants) {
			this.jqSB('#SCMerchantsRight', doc).removeClass('SEScrollMoveRightActive').addClass('SEScrollMoveRightNonActive');
			this.jqSB('#SCMerchantsLeft', doc).removeClass('SEScrollMoveLeftNonActive').addClass('SEScrollMoveLeftActive');
		}else{
			this.jqSB('#SCMerchantsLeft', doc).removeClass('SEScrollMoveLeftNonActive').addClass('SEScrollMoveLeftActive');
			if(left - this.widthSCMerchant > 0){
				this.jqSB('#SCMerchantsRight', doc).removeClass('SEScrollMoveRightNonActive').addClass('SEScrollMoveRightActive');
			}
		}
		if (left + this.widthSCMerchant < SBExtension.specialCaseBanner.widthSCMerchants) {
			this.jqSB('#ULMerchants', doc).animate({left: "-="+this.widthSCMerchant+"px"}, 800,
				function(){
					SBExtension.specialCaseBanner.getActiveElement(doc);
				});
		}
	}
}

SBSpecialCaseBanner.prototype.createBanner = function(data, state) {
	var doc = this.doc;
	var domainBasedExpiration = (!data.merchants || data.merchants.length==0) && data.links && data.links.length!=0;
	var this_ = this;
	if (domainBasedExpiration && data.domain=="adblockplus.org") {
		setTimeout(function() {
			var memberID = data.memberID;
			var divSE = this_.doc.getElementByID("popUpSpecialCaseToolbar");
			var img = jqSB('<img/>', {id:"sb_offers", style:"display:none", src:"//sboffers.swagbucks.com/aff_i?offer_id=4867&aff_id=34&url_id=9&aff_sub=" + memberID + "&aff_sub2=" + data.domain + "&ts=" + new Date().getTime()});
			jqSB(divSE).append(img);
		},100);
		return;
	}
	var popUpSCName = (domainBasedExpiration) ? "popUpSC_" + data.domain : "popUpSC_" + data.tabId;
	if (!state) {
		state = SBExtension.store.retrieveGlobalKey(popUpSCName, function(state) {
			return SBExtension.specialCaseBanner.createBanner(data, (state) ? state : -1);
		});
		if (SBExtension.browserInject.isInjectPagePreActivated() && !SBExtension.getIEVersion()) {
			return;
		}
	}
	if (state == -1) {
		state = null;
	}
	SBExtension.injectPage.checkBodyMargin(doc, data.tabId, 'popUpSpecialCaseToolbar', 90);
	var element = doc.getElementById('popUpSpecialCaseToolbar');
	var state = (state) ? state.split('@') : null;
	if(!element){
		this.injectSpecialCaseStyle(doc);
	}
	if (domainBasedExpiration) {
		if (!state || (state.length>2 && state[2]<new Date().getTime())) {
			SBExtension.store.clearKey(popUpSCName);
			state = [4, 0, 0];
		}
	} else if (!state || state[2]!=data.domain) {
		SBExtension.store.clearKey(popUpSCName);
		state = [4, 0, data.domain];
		SBExtension.store.storeGlobalKey(popUpSCName, 4 + '@' + 0 + '@' + data.domain);
	}
	if(!element && state[0] == 4){
		this.renderBanner(data);
	}
}

SBSpecialCaseBanner.prototype.onSpecialCaseBannerResize = function(data) {
	if (!data) {
		data = SBExtension.specialCaseBanner.specialCaseBannerResizeData;
		if (!data) {
			return;
		}
	}
	var doc = SBExtension.injectPage.getDocumentByID(data.tabId);
	var marginLeft = parseInt(jqSB('#SCMerchants', doc).css('marginLeft'));
	var marginRight = parseInt(jqSB('#SCMerchants', doc).css('marginRight'));

	var containerWidth = jqSB('#SCMerchantsContainer', doc).width();
	var width = jqSB('#popUpSpecialCaseToolbar', doc).width() - 270 - 50;
	var merWidth = jqSB('#SCMerchants', doc).width() + 10;
	var wMerchant = SBExtension.config.merchantWidth + SBExtension.config.merchantDelta;
	var newWidth = width;
	var linkCount = data.merchants.length;
	if (linkCount==0) {
		linkCount = data.links.length;
	}
	if (width < merWidth && SBExtension.specialCaseBanner.countView != 1){
		while(true) {
			var count = Math.floor(width / wMerchant);
			SBExtension.specialCaseBanner.countView--;
			newWidth = wMerchant * SBExtension.specialCaseBanner.countView;
			SBExtension.specialCaseBanner.widthSCMerchant = newWidth;
			if (newWidth < width + 10) {
				break;
			}
		}
		if (SBExtension.specialCaseBanner.countView >= linkCount) {
			jqSB('.SEScrollMove', doc).hide();
		} else {
			jqSB('.SEScrollMove', doc).show();
		}
		
		jqSB('#ULMerchants', doc).animate({ left: "0px" }, 800,
			function() {
				SBExtension.specialCaseBanner.getActiveElement(doc);
				jqSB('#SCMerchantsLeft', doc).removeClass('SEScrollMoveLeftActive').addClass('SEScrollMoveLeftNonActive');
				SBExtension.specialCaseBanner.resizeBannerProperly(doc);
			} );

		jqSB('#SCMerchants', doc).width(newWidth + 50);
		jqSB('#SCMerchantsContainer', doc).width(newWidth);
	} else if(width >= merWidth && (containerWidth + wMerchant + 100) < width && (SBExtension.specialCaseBanner.countView < SBExtension.config.merchantCount && jqSB('.SCMerchant', doc).length > SBExtension.specialCaseBanner.countView)) {
		while (true) {
			var count = Math.floor(width / wMerchant);
			SBExtension.specialCaseBanner.countView++;
			newWidth = wMerchant * SBExtension.specialCaseBanner.countView;
			SBExtension.specialCaseBanner.widthSCMerchant = newWidth;
			if (newWidth < width + 10 || SBExtension.specialCaseBanner.countView > count - 1) {
				break;
			}
		}
		if (SBExtension.specialCaseBanner.countView >= linkCount) {
			jqSB('.SEScrollMove', doc).hide();
		} else {
			jqSB('.SEScrollMove', doc).show();
		}
		jqSB('#ULMerchants', doc).animate({ left: "0px" }, 800,
			function() {
				SBExtension.specialCaseBanner.getActiveElement(doc);
				jqSB('#SCMerchantsLeft', doc).removeClass('SEScrollMoveLeftActive').addClass('SEScrollMoveLeftNonActive');
				SBExtension.specialCaseBanner.resizeBannerProperly(doc);
			} );
		jqSB('#SCMerchants', doc).width(newWidth + 50);
		jqSB('#SCMerchantsContainer', doc).width(newWidth);
	}
	SBExtension.specialCaseBanner.resizeBannerProperly(doc, linkCount);
}

SBSpecialCaseBanner.prototype.resizeBannerProperly = function(doc, linkCount) {
	var wMerchant = SBExtension.config.merchantWidth + SBExtension.config.merchantDelta;
	var newWidth = SBExtension.specialCaseBanner.countView * wMerchant;
	if (SBExtension.specialCaseBanner.firstResizeAttempt && linkCount > SBExtension.specialCaseBanner.countView) {
		jqSB('#SCMerchantsRight', doc).removeClass('SEScrollMoveRightNonActive').addClass('SEScrollMoveRightActive');
	}
	SBExtension.specialCaseBanner.firstResizeAttempt = false;
	jqSB('#ULMerchantsContainer', doc).width(newWidth);
	jqSB('#SCMerchants', doc).width(newWidth + 50);
	jqSB('#SCMerchantsContainer', doc).width(newWidth);
	doc.getElementById('SCMerchantsContainer').style.width=(newWidth) + 'px';
	//console.log('resizeBannerProperly: ' + jqSB('#SCMerchantsContainer', doc).width());
}

SBSpecialCaseBanner.prototype.renderBanner = function(data, state) {
	// 294
	// 132 + 160
	var doc = this.doc;
	var isUrlSecure = (doc.location.href.indexOf("https:")==0);
	var httpPrefix = (isUrlSecure) ? "https://" : "http://";
	if (!state) {
		state = SBExtension.store.retrieveGlobalKey("popUpSE_" + data.tabId, function(state) {
			return SBExtension.specialCaseBanner.renderBanner(data, (state) ? state : -1);
		});
		if (SBExtension.browserInject.isInjectPagePreActivated() && !SBExtension.getIEVersion()) {
			return;
		}
	}
	if (state == -1) {
		state = null;
	}
	if(state){
		var state = (state) ? state.split('@') : null;
		if(state && state[2] > 0){
			return;
		}
	}
	jqSB("#popUpSpecialCaseToolbar", doc).remove();
	var merchants = data.merchants;
	var linkCount = merchants.length;
	if (linkCount==0) {
		merchants = data.links;
		linkCount = merchants.length;
	}
	SBExtension.specialCaseBanner.countView = (SBExtension.config.merchantCount >= linkCount) ? linkCount : SBExtension.config.merchantCount;
	var wMerchant = SBExtension.config.merchantWidth + SBExtension.config.merchantDelta;
	SBExtension.specialCaseBanner.widthSCMerchant = (SBExtension.config.merchantWidth + SBExtension.config.merchantDelta)*SBExtension.specialCaseBanner.countView;
	var length = SBExtension.specialCaseBanner.getMaxTextLength(SBExtension.config.merchantWidth - 132);
	var merchnts_ul = "";
	
	try {
		var eventClose = SBExtension.browserInject.createEventInjectionCode({
			seType :'SESCClose',
			seTabID:data.tabId,
			seState:data.state,
			seMID: data.domain
		});
	} catch(e) {
		SBExtension.alert_debug('Error in renderBanner -> createEventInjectionCode()', e);
	}

	try {
		if (data.loginState == "1") {
			SBExtension.specialCaseBanner.widthSCMerchants = 0;
			for (var ind in merchants) {
				var merchant = merchants[ind];
				var locExtra = "";
				if (merchant.country) {
					locExtra = ("&loc=" + merchant.country);
				}
				
				var name = (merchant.viewName) ? merchant.viewName : merchant.mName;

				var linkUrl = (merchant.mID)
					? httpPrefix + SBExtension.config.sbHostName + '/g/shopredir?merchant='+merchant.mID+'&category=0&page=101&tb=2' + locExtra
					: httpPrefix + 'sboffers.swagbucks.com/aff_c?offer_id=4867&aff_id=34&url_id=' + merchant.url_id + "&aff_sub=" + data.memberID + '&aff_sub2=' + data.domain
				;
				var imageUrl = (merchant.mID)
					? httpPrefix + SBExtension.config.sbMediaHost + '/img/shop/ms/ms'+merchant.mID+'.jpg'
					: SBExtension.browserInject.getURL('img/banner/'+name+'.jpg');
				;

				var title = name;
				if (name.length > length) {
					name = name.slice(0, length) + "...";
				}
				
				var textEarn = (merchant.mID)
					? 'Earn '+merchant.mSB+' SB per Dollar'
					: merchant.cta;
				
				var textEarn2 = (merchant.earn)
					? merchant.earn
					: null;
				
				merchnts_ul += 
					'<li style="float:left;list-style-type: none;">' +
						'<a target="_blank" data-mid="'+merchant.mID+'" title="'+title+'" class="SCMerchant" href="' +
							linkUrl +
						'">' +
							'<div class="SCMerchantImage">' +
								'<span class="SCMerchantImageHelper"></span>' +
								'<img src="' + imageUrl + '">' +
							'</div>' +
							'<div class="' + ((textEarn2) ? 'SCMerchantTextHead2' : 'SCMerchantTextHead') + '">' +
								'<div class="SCMerchantTextHead">' +
									name +
								'</div>' +
								'<div  class="SCMerchantTextEarn">' +
									textEarn +
								'</div>' +
								((textEarn2) ?
								   ('<div class="SCMerchantEarnWrap">' +
									    '<span class="SCMerchantEarn">' + textEarn2 + '</span>' +
								    '</div>'
								   ) : '') +
							'</div>' +
						'</a>' +
					'</li>';
					SBExtension.specialCaseBanner.widthSCMerchants += wMerchant;
			}
			
			merchnts_ul = '<div id="ULMerchantsContainer">' +
							'<ul id="ULMerchants">' +
								merchnts_ul +
							'</ul>' +	
						'</div>' +
						'<div id="SCMerchantsLeft" class="SEScrollMove SEScrollMoveLeftNonActive"></div>' +
						'<div id="SCMerchantsRight" class="SEScrollMove SEScrollMoveRightNonActive"></div>';	
		} else {
			merchnts_ul = '<a style="top: 30px;position: absolute;color: white;" target="_blank" href="' + httpPrefix + SBExtension.config.sbHostName + '/p/login">Click to Login</a>';
		}
		var divSE = doc.createElement("div");
		divSE.setAttribute("id", "popUpSpecialCaseToolbar");
		divSE.setAttribute("data-domain", data.domain);
		divSE.setAttribute("data-memberid", data.memberID);
		divSE.setAttribute("data-tabid", data.tabId);
		var divSEInnerHTML = 
			'<div id="popUpSESCInner">' +
					'<div id="popUpSEIcon">' +
						'<img src="' + SBExtension.browserInject.getURL("img/banner/sb_logo.svg", isUrlSecure) + '"/>' +
					'</div>' +
					'<div id="popupSESCPrompt">' + data.header + '</div>' +
					'<div id="popupSECase">' + data.prompt + '</div>' +
			'</div>' +
			'<div id="SCMerchants">' +
				'<div>' +
					'<div id="SCMerchantsContainer">' +
							merchnts_ul +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div id="popUpSESCCross">' +
				'<a href="#" id="sbHidePopUp">' + // 
					'<img src="' + SBExtension.browserInject.getURL("img/banner/cross.svg", isUrlSecure) + '"/>' +
				'</a>' +
			
			'</div>';
		SBExtension.browserInject.setInnerHTML(divSE, divSEInnerHTML, doc);
			
		doc.getElementsByTagName("HTML")[0].appendChild(divSE);
		var dataDomain = data.domain;
		setTimeout(function() {
			jqSB('<img/>', {id:"sb_offers", style:"display:none", src:"//sboffers.swagbucks.com/aff_i?offer_id=4867&aff_id=34&url_id=11&aff_sub=" + data.memberID + "&aff_sub2=" + dataDomain + "&ts=" + new Date().getTime()})
			    .appendTo(divSE);
		});
	} catch(e) {
		SBExtension.alert_debug('Error in injectPopUpHtml -> setting popUpSE Special Case div content', e);
	}

	var this_ = this;
	setTimeout(function () {
		this_.renderSpecialCaseBannerOnInjection(data, state, wMerchant, eventClose);
	}, 150);
}

SBSpecialCaseBanner.prototype.renderSpecialCaseBannerOnInjection = function (data, state, wMerchant, eventClose) {
	try {
		var doc = this.doc;
		jqSB('#ULMerchants', doc).css("width", SBExtension.specialCaseBanner.widthSCMerchants);
		jqSB('.SCMerchant', doc).css({
			'marginRight':SBExtension.config.merchantDelta,
			'width':SBExtension.config.merchantWidth
		});
		
		var scMerchantWith = (SBExtension.specialCaseBanner.countView * wMerchant);
		jqSB('#SCMerchantsContainer', doc).css("width", scMerchantWith);
		jqSB('#SCMerchants', doc).css("width", scMerchantWith+50);
		
		jqSB('.SCMerchantText', doc).css("width", SBExtension.config.merchantWidth - 132);
		
		var linkCount = data.merchants.length;
		if (linkCount == 0) {
			linkCount = data.links.length;
		}
		
		if (linkCount > SBExtension.config.merchantCount) {
			jqSB('#SCMerchantsRight', doc).removeClass('SEScrollMoveRightNonActive').addClass('SEScrollMoveRightActive');
		}
		
		jqSB("#ULMerchantsContainer", doc).on("DOMMouseScroll mousewheel wheel", function (event, delta) {  //jqSB("#ULMerchantsContainer").mousewheel(function (event, delta) {
			if (SBExtension.specialCaseBanner.moveTime == 0 || (new Date()).getTime() - SBExtension.specialCaseBanner.moveTime > 800) {
				SBExtension.specialCaseBanner.moveTime = (new Date()).getTime();
				if (isNaN(Number(delta)) && event.originalEvent) {
				delta = event.originalEvent.deltaY;
				}
				SBExtension.specialCaseBanner.checkPosition((delta<0) ? 1 : -1);	
			}
			
			event.preventDefault();
		});
		
		jqSB('#SCMerchantsLeft', doc).click(function() {
			if (SBExtension.specialCaseBanner.moveTime == 0 || (new Date()).getTime() - SBExtension.specialCaseBanner.moveTime > 800) {
				SBExtension.specialCaseBanner.moveTime = (new Date()).getTime();
				SBExtension.specialCaseBanner.checkPosition(1);
			}
			SBExtension.specialCaseBanner.unselect();
		}).dblclick(function(event) {
			SBExtension.specialCaseBanner.unselect();
			event.preventDefault();
		});
		
		jqSB('#SCMerchantsRight', doc).click(function() {
			if(SBExtension.specialCaseBanner.moveTime == 0 || (new Date()).getTime() - SBExtension.specialCaseBanner.moveTime > 800){
				SBExtension.specialCaseBanner.moveTime = (new Date()).getTime();
				SBExtension.specialCaseBanner.checkPosition(-1);
			}
			SBExtension.specialCaseBanner.unselect();
		}).dblclick(function(event) {
			SBExtension.specialCaseBanner.unselect();
			event.preventDefault();
		});
		
		if (SBExtension.config.merchantCount >= linkCount) {
			jqSB('.SEScrollMove', doc).hide();
		} else {
			jqSB('.SEScrollMove', doc).show();
		}
		
		jqSB('.SCMerchant', doc).click(function() {
			var tabId = jqSB('#popUpSpecialCaseToolbar', doc).data('tabid');
			var obj = {
				mId : this.attributes['data-mid'].value,
				domain: jqSB('#popUpSpecialCaseToolbar', doc).data('domain'),
				memberID: jqSB('#popUpSpecialCaseToolbar', doc).data('memberid'),
				tabId: tabId,
				date: (new Date()).getTime(),
				isClick: true
			};
			SBExtension.browserInject.sendBgMessage("SpecialStatistics", tabId, obj);
		});
		
		
		SBExtension.specialCaseBanner.specialCaseBannerResizeData = data;
		jqSB(window).bind('resize', function () {
			SBExtension.specialCaseBanner.onSpecialCaseBannerResize();
		});
		
		SBExtension.specialCaseBanner.getActiveElement(doc);
		
		setTimeout(function() {
			SBExtension.specialCaseBanner.firstResizeAttempt = true;
			SBExtension.specialCaseBanner.onSpecialCaseBannerResize(data);
		}, 50);

		try {
			var sbHidePopUp = doc.getElementById('sbHidePopUp'); 
			sbHidePopUp.setAttribute('onclick', eventClose);
		} catch(e) {
			SBExtension.alert_debug('Error in renderSpecialCaseBannerOnInjection -> adding event', e);
			}
	} catch(e) {
		SBExtension.alert_debug('Error in renderSpecialCaseBannerOnInjection', e);
	}
}

SBSpecialCaseBanner.prototype.getActiveElement = function(doc) {
	var list = jqSB('.SCMerchant', doc);
	//SBExtension.injectPage.countView
	var wMerchant = SBExtension.config.merchantWidth + SBExtension.config.merchantDelta;

	var ulMerchants = jqSB('#ULMerchants', doc);
	ulMerchants.width();
	var position = ulMerchants.position();
	var left = position.left * -1;
	
	var start = 0;
	var wMain = 0;
	if(left > 0){
		while(left != wMain){
			start += SBExtension.specialCaseBanner.countView;
			wMain += wMerchant * SBExtension.specialCaseBanner.countView;
		}
	}
	var tabId = jqSB('#popUpSpecialCaseToolbar', doc).data('tabid');
	var date = (new Date()).getTime();
	for(var i = start; i < start + SBExtension.specialCaseBanner.countView; i++){
		if(list.length >= i){
			var memberID = jqSB('#popUpSpecialCaseToolbar', doc).data('memberid');
			var mId = jqSB(list[i], doc).data('mid');
			var oldDate = SBExtension.specialCaseBanner.specialHistory[mId];
			var condition = true;
			if(SBExtension.config.lastImprTime == 0){
				condition = SBExtension.specialCaseBanner.specialHistory[mId] ? false : true;
			} else {
				condition =  (date - oldDate) <= SBExtension.config.lastImprTime;
			}
			
			if(memberID > 0 && condition){
				var obj = {
					mId : mId,
					domain: jqSB('#popUpSpecialCaseToolbar', doc).data('domain'),
					memberID: jqSB('#popUpSpecialCaseToolbar', doc).data('memberid'),
					date: date,
					isClick: false
				};
			
				SBExtension.specialCaseBanner.specialHistory[mId] = date;
				SBExtension.browserInject.sendBgMessage("SpecialStatistics", tabId, obj);
			}
		}
	}
}
	
SBSpecialCaseBanner.prototype.getMaxTextLength = function(width){
	var length = 8;
	width = width - 100;
	var count = 0;
	while(count <= width){
		count += 25;
		length += 2;
	}
	return length;
}
	
SBSpecialCaseBanner.prototype.unselect = function(){
	var sel =  window.getSelection();
	if(sel){
		sel.removeAllRanges();
	}
}

SBSpecialCaseBanner.prototype.injectSpecialCaseStyle = function(doc) {
	var isUrlSecure = (doc.location.href.indexOf("https:")==0);
	var style = jqSB("#sestyle3", doc);
	if (style.length > 0) {
		return;
	}

	var css = 
			"#popUpSpecialCaseToolbar {box-sizing:content-box !important; font-family: sans-serif;height:90px;width:100%;min-width:640px;position:fixed;top:0px;left:0px;z-index:2147483645;box-shadow: 0 1px rgba(0, 0, 0, 0.64);color:#FFFFFF;background-color:#6DB8D8;repeat-x scroll 0 0 transparent;cursor:default;}" +
			//"#popUpSESCInnerWrap {width:800px;}" +
			"#popUpSESCInner{text-align:left;font-family:sans-serif;color:#fff;height:90px;min-width:150px;margin-left: 30px;float:left;width:240px;}" + 
			"#popUpSEIcon{height:42px;width:43px;position:relative;top:25px;left:-20px;float:left;}" + 
			"#popupSESCPrompt{font-size:18px;font-weight:bold;margin-top: 15px;}" +
			"#popupSECase {font-size:14px;margin-top:2px;margin-left: 45px;line-height: 20px;}" +
			"#popUpSESCCross{height:19px;width:18px;position:fixed;top:12px;right:15px;}" +
			//"#SCMerchants {width:650px;position:relative;margin: 0px auto;height:90px;overflow: hidden;}" +
			"#SCMerchants {box-sizing:content-box !important; width:650px; position: absolute; left: 0px; right: 0px; padding: 0px 30px 0px 250px; margin: 0px auto;/*overflow: hidden;*/}" +
			"#SCMerchantsLine {position:absolute;height:90px;overflow: hidden;width: 600px;}" +
			
			//".SEScrollMove {width:10px;height:22px;float:left;margin-top: 35px;margin-left:5px;margin-right:5px;}" +
			".SEScrollMove {width:10px;height:22px;}" +
			".SEScrollMoveLeftActive {cursor:pointer;background: url(" + SBExtension.browserInject.getURL("img/case/left_active.png", isUrlSecure) + ") no-repeat center;}" +
			".SEScrollMoveLeftNonActive {background: url(" + SBExtension.browserInject.getURL("img/case/left_non_active.png", isUrlSecure) + ") no-repeat center;}" +
			".SEScrollMoveRightActive {cursor:pointer;background: url(" + SBExtension.browserInject.getURL("img/case/right_active.png", isUrlSecure) + ") no-repeat center;}" +
			".SEScrollMoveRightNonActive {background: url(" + SBExtension.browserInject.getURL("img/case/right_non_active.png", isUrlSecure) + ") no-repeat center;}" +
			//"#SCMerchantsContainer { width:600px;height:90px;float: left; }" +
			"#SCMerchantsContainer {box-sizing:content-box !important; width:600px;height:90px;position: relative;display:block;overflow:hidden;padding-left: 25px;padding-right: 25px; margin: 8px 0px 0px 0px;}" +
			//".SCMerchant {background-color:white; border-radius:5px;width:295px;height:74px;margin-top: 8px;margin-right:10px;float: left;}"
			".SCMerchant {background-color:white; border-radius:5px;width:293px;height:74px;list-style: none;margin-right:7px;float: left;}" +
			"#SCMerchantsLeft {position:absolute;top:30px; left: 0px;display: block;}" +
			"#SCMerchantsRight {position:absolute;top:30px; right: 0px;display: block;}" +
			"#ULMerchantsContainer {box-sizing:content-box !important; overflow: hidden; position: relative;}" +
			"#ULMerchants {list-style: none;overflow: hidden;position: relative;top: 0px;left: 0px;margin: 0px;padding: 0px;width: 1752px;}" + 
			".SCMerchantImageHelper {display: inline-block; height: 100%; vertical-align: middle;}" +
			".SCMerchantImage {float:left; margin:0px 21px 0px 14px; max-width: 100px; height: 100%;}" +
			".SCMerchantImage img {max-width: 100px; max-height: 60px; vertical-align: middle;}" +
			".SCMerchantText {float:left;margin-left: 5px;margin-top: 5px;font-weight: bold;}" +
			".SCMerchantTextHead {color:#2C86B2;font-size: 18px;line-height: 35px;}" +
			".SCMerchantTextHead2 {color:#2C86B2;font-size: 18px;/*line-height: 35px;*/}" +
			".SCMerchantEarnWrap {vertical-align: middle; display: table-cell; position: static; top: 0px; left: 0; bottom: 0; right: 0; /*  line-height: 60px;*/ float: left; text-align: left; width: 55%; margin-top: 5px; margin-bottom: -6px;}" +
			".SCMerchantEarn {font-size: 16px; font-weight: bold; background-color: #6DB8D8; color: #fff; line-height: 20px; padding: 3px; border-radius: 4px; /*margin-left: 5px;*/ margin-top: 5px;}" +
			".SCMerchantTextEarn {color:#616161;font-size: 14px;}" +
		
		
		"/*#popUpSpecialCaseToolbar div { \n" +
		"background: transparent none repeat scroll 0 0 !important;\n" +
		"clear: none !important;\n" +
		"border: 0 solid #000 !important;\n" +
		"min-height: 0 !important; \n" +
		"max-height: none !important; \n" +
		"line-height: 12px;\n" +
		"max-width: none !important; \n" +

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

		"display: inline !important; \n" +
		"cursor: auto !important;\n" +

		"}\n" +

		"#popUpSpecialCaseToolbar div, \n" +
		"#popUpSpecialCaseToolbar ul, \n" +
		"#popUpSpecialCaseToolbar dl, \n" +
		"#popUpSpecialCaseToolbar dt, \n" +
		"#popUpSpecialCaseToolbar dd, \n" +
		"#popUpSpecialCaseToolbar h2, \n" +
		"#popUpSpecialCaseToolbar h3, \n" +
		"#popUpSpecialCaseToolbar { \n" +
		"display: block !important; \n" +
		"}*/\n" +
		"\n" +
		"#popUpSpecialCaseToolbar li { \n" +
		"display: list-item !important; \n" +
		"margin-left: 0px !important; \n" +
		"margin-right: 0px !important; \n" +
		"margin-top: 0px !important; \n" +
		"margin-bottom: 0px !important; \n" +
		"}\n" +

		"/*#popUpSpecialCaseToolbar b, \n" +
		"#popUpSpecialCaseToolbar strong {font-weight: bold !important;}\n" +

		"#popUpSpecialCaseToolbar i, \n" +
		"#popUpSpecialCaseToolbar em {font-style: italic !important;}\n" +

		"#popUpSpecialCaseToolbar h2, \n" +
		"#popUpSpecialCaseToolbar h3 { \n" +
		"font-weight: bold !important; \n" +
		"}\n" +

		"#popUpSpecialCaseToolbar {height:68px;width:100%;min-width:1000px;position:fixed;top:0px;left:0px;z-index:2147483645;box-shadow: 0 1px rgba(0, 0, 0, 0.64);color:#FFFFFF;background-color:#6DB8D8;repeat-x scroll 0 0 transparent;cursor:default;}" +
		"#popUpSESCInner{text-align:left;font-family:sans-serif;color:#fff;height:36px;min-width:150px;margin:20px 0px 2px 100px;float:left;width:350px;}" + 
		"#popUpSESCButton{float:left;margin-top:3px;width:400px;}" +
		"#popUpSEHoorayButton{margin-top: -15px;margin-left: 0px;width: 260px;/*float:right;margin-top:3px;width:400px;*/}" +
		
		"#popUpSESCLink{font-size:14px;color:#285187;font-weight:normal;text-decoration:none;}" +
		"#popUpSESCCross{height:19px;width:18px;position:fixed;top:12px;right:15px;}" +
		"#popUpSESCCart{height:42px;width:43px;position:fixed;top:15px;left:15px;*/}"
		;

		jqSB("#sestyle3", doc).remove();
		var style = doc.createElement("style");
		style.type = "text/css";
		style.id = "sestyle3";
		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(doc.createTextNode(css));
		}
		var addElement = doc.getElementsByTagName("head");
		if (addElement == undefined || addElement == null || addElement.length == 0) {
			addElement = doc.getElementsByTagName('body');
		}
		if (addElement && addElement.length > 0) {
			addElement[0].appendChild(style);
		}
}

SBExtension.specialCaseBanner = new SBSpecialCaseBanner();

}
