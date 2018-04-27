//SBExtension.store.retrieveGlobalKey("merchants")
SBExtension.PopupUIShop = function() {
	this.cntRepeatCoupon = 0;
	this.cntRepeatMerchant = 0;
	this.spanEarnCount = 0;
	this.couponURL = "http://" + SBExtension.config.sbHostName + "/?cmd=tbf-get-coupon-list-jx&ext=1";
	this.prefixFeatureCoupon = "SEFeatureCoupon";
	this.prefixCoupon = "SEViewCoupon_";
	this.expireCoupon = 30; //min
	this.couponSection = '#top_shop_si';
	this.couponFeatureSection = '#top_deals_coupons';
	this.merchantFeatureStore = "merchantFeatureByID";
	this.merchantFeatureStoreOrder = "merchantFeatureByOrder";
	this.merchantStore = "merchantByID";
}

SBExtension.PopupUIShop.prototype.shopLogic = function(){
	try{
		$('#top_deals_coupons', document).show();
		//Coming Soon
		if (!SBExtension.popupUIMain.globalState.isCountryFullySupported(SBExtension.POPUP_ID_SHOP)) {
			$("#top_shop_dc", document).text('');
			$(this.couponFeatureSection).text('');
			$('#coming_soon_shop').show();
			$('#shop-content').show();
		}  else	{
			$('#coming_soon_shop').hide();
			if(SBExtension.popupUIMain.isMSite){
				this.showMerchantCoupons(SBExtension.popupUIMain.globalState.merchantID);
				$('#top_deals', document).css('display', 'block');
				$('#top_stores', document).css('display', 'none');
			}else{
				$('#top_deals', document).css('display', 'none');
				$('#top_stores', document).css('display', 'block');
				this.showMerchntList();
			}
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUIShop.shopLogic: ' + e.message, e);
	}
	SBExtension.browserPopup.clickEventListen('.new_tab_link');
};

SBExtension.PopupUIShop.prototype.getMerchantStore = function(type){
	try{
		var temp_merchnts = null;
		if(type=="feature_order"){
			temp_merchnts = SBExtension.store.retrieveGlobalKey(this.merchantFeatureStoreOrder);
		}else if(type=="feature"){
			temp_merchnts = SBExtension.store.retrieveGlobalKey(this.merchantFeatureStore);
		}else{
			temp_merchnts = SBExtension.store.retrieveGlobalKey(this.merchantStore);
		}
		var merchantList = {};
		if(temp_merchnts == ""){
			return null;
		}
		merchantList = JSON.parse(temp_merchnts);
		return merchantList;
	} catch(e) {
		SBExtension.alert_debug('PopupUIShop.getMerchantStore: ' + e.message, e);
	}
};

SBExtension.PopupUIShop.prototype.getMerchantStoreById = function(id){
	try{
		var list = this.getMerchantStore('feature');
		if(list && list[id]){
			return list[id];
		}
		list = this.getMerchantStore('');
		if(list && list[id]){
			return list[id];
		}
		return null;
	} catch(e) {
		SBExtension.alert_debug('PopupUIShop.getMerchantStoreById: ' + e.message, e);
	}
};

// ADD MERCHANT WITH COUPONS
SBExtension.PopupUIShop.prototype.showMerchantCoupons = function(merID){
	try{
		$(this.couponSection).text('');
		var merchant = this.getMerchantStoreById(merID);
		if(merchant == null){
			return;
		}
		
		var appendElement = $("#top_shop_si", document);
		var flagActivate = SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixActivate + merID);
		this.couponMerchant(appendElement, merchant, flagActivate);
		this.getCoupons(merID, function() {
			SBExtension.browserPopup.clickEventListen('.new_tab_link');
		});
	} catch(e) {
		SBExtension.alert_debug('PopupUIShop.showMerchantCoupons: ' + e.message, e);
	}
};

// ADD FEACHURED COUPONS
SBExtension.PopupUIShop.prototype.showFeatureCoupons = function(){
	var this_ = this;
	try{
		var feature_coupons = SBExtension.store.retrieveGlobalKey(this.prefixFeatureCoupon);
		$(this.couponFeatureSection).text('');
		if(feature_coupons == ""){
			if(this.cntRepeatCoupon < 6){
				this.cntRepeatCoupon++;
				SBExtension.popupUILogin.preloaderInit();
				setTimeout(function(){
					this_.showFeatureCoupons();
				},3000);
			}else{
				this.cntRepeatCoupon = 0;
				SBExtension.popupUILogin.preloaderClose();
			}
			return;
		}
		SBExtension.popupUILogin.preloaderClose();
		var featureCoupons = [];
		featureCoupons = JSON.parse(feature_coupons);
		if(!featureCoupons || featureCoupons.length==0){
			return;
		}
		
		for(couponIdx in featureCoupons){
			var coupon = featureCoupons[couponIdx];
			this.createCoupon($(this.couponFeatureSection), coupon, false);
		}
		
		//var divMain = $("<div />", { 'class': 'merchant', style: 'padding:0px;'});
		//$(this.couponFeatureSection).append(divMain);
	} catch(e) {
		SBExtension.alert_debug('PopupUIShop.showFeatureCoupons: ' + e.message, e);
	}
}

SBExtension.PopupUIShop.prototype.getCurrencySymbol = function(country){
	try{
		if (!country) {
			country = (SBExtension.popupUIMain.globalState.memberInfo && SBExtension.popupUIMain.globalState.memberInfo.country) ? SBExtension.popupUIMain.globalState.memberInfo.country : 1;
		}
		return SBExtension.getCurrencySymbolForCountry(country);
	} catch(e) {
		SBExtension.alert_debug('PopupUIShop.getCurrencySymbol: ' + e.message, e);
	}
};

//ADD COUPON MERCHANT
SBExtension.PopupUIShop.prototype.couponMerchant = function(appendElement, merchant, flagActivate){
	try{
		var merchantCountry = merchant.country;
		var locExtra = "";
		if (merchantCountry) {
			locExtra = ("&loc=" + merchantCountry);
		}
		var curSymbol = SBExtension.getOneCurrencySymbolForCountry(merchantCountry);
		var divMain = $("<div />", { "id": "main_shop_info" }).css('background','url('+"http://" + SBExtension.config.sbMediaHost + "/img/shop/smbi/smbi"+merchant.mID+".jpg"+') 100% 0%/cover no-repeat');//.css({"background-size":"cover"});
		var divCart = $("<div />", { 'class':'merchant_cart_main merchant_cart' });
		if (flagActivate != 1) {
			var divHeader = $("<div />", { "class": "header_merchant_active" });
			var divHeaderLeft = $("<div />", { "class": "header_merchant_left" });
			var spanEarn = SBExtension.browserPopup.createTag(document, "div");
			SBExtension.browserPopup.setAttribute(spanEarn, "class", 'merchant_earn merchant_earn_header');
			if(spanEarn.length) {
				SBExtension.browserPopup.setInnerHTML(spanEarn[0], SBExtension.browserPopup.getLocalizedString("earn") + ' ' + parseInt(merchant.mSB)+' SB ' + SBExtension.browserPopup.getLocalizedString("per") + ' ' + curSymbol, document);
			} else {
				spanEarn = SBExtension.browserPopup.createTag(document, "html:div");
				SBExtension.browserPopup.setAttribute(spanEarn, "class", 'merchant_earn merchant_earn_header');
				var spanEarnInnerHTML = SBExtension.browserPopup.getLocalizedString("earn") + ' ' + merchant.mSB+' SB ' + SBExtension.browserPopup.getLocalizedString("per") + ' ' + curSymbol;
				SBExtension.browserPopup.setInnerHTML(spanEarn, spanEarnInnerHTML, document);
			}
			
			var spanName = SBExtension.browserPopup.createTag(document, "div");
			SBExtension.browserPopup.setAttribute(spanName, "class", 'merchant_earn_name');
			var spanNameInnerHTML = SBExtension.browserPopup.getLocalizedString("at") + ' ' + merchant.mName;
			if(spanName.length) {
				SBExtension.browserPopup.setInnerHTML(spanName[0], spanNameInnerHTML, document);
			} else {
				spanName = SBExtension.browserPopup.createTag(document, "html:div");
				SBExtension.browserPopup.setAttribute(spanName, "class", 'merchant_earn_name');
				SBExtension.browserPopup.setInnerHTML(spanName, spanNameInnerHTML, document);
			}
			
			divHeaderLeft.append($(spanEarn));
			divHeaderLeft.append(spanName);
			
			var mURL = 'http://' + SBExtension.config.sbHostName + '/g/shopredir?merchant='+merchant.mID+'&category=0&page=45&tb=2' + locExtra;
			
			var divHeaderRight = $("<div />", { "class": "header_merchant_right" });
			var linkBtn = SBExtension.browserPopup.createTag(document, "a");
			SBExtension.browserPopup.setText(linkBtn, SBExtension.browserPopup.getLocalizedString("activate"));
			SBExtension.browserPopup.setAttribute(linkBtn, "class", "survey_go_btn merchant_button new_tab_link");
			SBExtension.browserPopup.setAttribute(linkBtn, "data-url", mURL);
			divHeaderRight.append($(linkBtn));
			
			divHeader.append(divHeaderLeft);
			divHeader.append(divHeaderRight);
		} else {
			var divHeader = $("<div />", { "class": "header_merchant_active" });
			var spanEarn = $("<div />", { 'class': 'merchant_earn merchant_earn_activated', html : SBExtension.browserPopup.getLocalizedString("shopEarnActivatedAt") + ' ' + merchant.mName}); //at " + merchant.mName})
			divHeader.append(spanEarn);
		}
		
		var divMImg = $("<div />", { 'class': 'merchant_image merchant_cart' }).css('background-image','url('+"http://" + SBExtension.config.sbMediaHost + "/img/shop/ms/ms"+merchant.mID+".jpg"+')');
		
		var divClear = $("<div />", {class : "clear", style : "clear:both;"});
		
		var divMainNew = $("<div />",{ html : SBExtension.browserPopup.getLocalizedString("couponsDeals"), class: "shop_coupon_text" });
		
		var linkBtn = SBExtension.browserPopup.createTag(document, "a");
		
		divCart.append(divMImg);
		divMain.append(divCart);
		
		divMain.append(divClear);
		
		appendElement.append(divHeader);
		appendElement.append(divMain);
		appendElement.append(divMainNew);
	} catch(e) {
		SBExtension.alert_debug('PopupUIShop.couponMerchant: ' + e.message, e);
	}
};

SBExtension.PopupUIShop.prototype.addCountryFlagIfNeeded = function(memberCountry, merchantCountry, lastCountry, divToAdd, divClassName) {
	var htmlFlag = "";
	if (merchantCountry && (memberCountry && memberCountry != merchantCountry || !memberCountry && lastCountry != merchantCountry)) {
		var flag = SBExtension.getFlagSuffix(merchantCountry);
		htmlFlag = SBExtension.browserPopup.createTag(document, "img");
		SBExtension.browserPopup.setAttribute(htmlFlag, 'src', SBExtension.browserPopup.getURL('img/shopearn/flag-'+flag+'.png'));
		if (divClassName) {
			SBExtension.browserPopup.setAttribute(htmlFlag, 'class', divClassName);
		}
	}
	if (htmlFlag != '') {
		divToAdd.append($(htmlFlag));
	}
};

// CREATE COUPON
SBExtension.PopupUIShop.prototype.createCoupon = function(appendElement, coupon, isSimpleMerchant) {
	try{
		var couponCountry = coupon.country;
		var network = SBExtension.getNetwork();
		var memberCountry = (network.memberInfo && network.memberInfo.country) ? network.memberInfo.country : 0;
		var lastCountry = SBExtension.store.retrieveGlobalKey("SE_COUNTRY");
		if (couponCountry && (memberCountry && memberCountry != couponCountry || !memberCountry && lastCountry != couponCountry)) {
			var mCountry = (memberCountry) ? memberCountry : lastCountry;
			var curCountrySettings = SBExtension.merchantPriorityCountry[mCountry];
			var limitToSelf = (curCountrySettings) ? curCountrySettings[1] : null;
			if (limitToSelf) {
				return;
			}
		}

		if (isSimpleMerchant) {
			var divMain = $("<div />", { class : "coupon_item" });
			
			var divMTitle = $("<div />", { 'class': 'coupon_text' }) ;
			var locExtra = "";
			if (couponCountry) {
				locExtra = ("&loc=" + couponCountry);
			}
			var cURL = 'http://' + SBExtension.config.sbHostName + '/g/shopredir?merchant='+coupon.mID+'&category=0&page=30&coupon='+coupon.cID+'&tb=2' + locExtra;
			var exp = $("<span />", { class : "coupon", text: coupon.cDescription });
			
			var divEarn;
			var spanEarn;
			if (coupon.cCode == '') {
				divEarn = $("<div />", { 'class': 'coupon_action couponCode no_code_req' });
				var copy_wrapper = $("<div />", { 'class': 'copy_wrapper'});
				var copy = SBExtension.browserPopup.createTag(document, "input");
				SBExtension.browserPopup.setText(copy, coupon.cCode);
				SBExtension.browserPopup.setAttribute(copy, "class", "copy");
				SBExtension.browserPopup.setAttribute(copy, "value", SBExtension.browserPopup.getLocalizedString("noCodeRequired"));
				SBExtension.browserPopup.setAttribute(copy, "readonly", 'readonly');
				
				var copied_text = $("<div />", { 'class': 'copied_text', text : SBExtension.browserPopup.getLocalizedString("copied") });
				
				copy_wrapper.append($(copy));
				copy_wrapper.append(copied_text);
				
				divEarn.append(copy_wrapper);
			} else {
				divEarn = $("<div />", { 'class': 'coupon_action couponCode code_req codeReqInit' });
				var copy_wrapper = $("<div />", { 'class': 'copy_wrapper'});
				var copy = SBExtension.browserPopup.createTag(document, "input");
				SBExtension.browserPopup.setText(copy, coupon.cCode);
				SBExtension.browserPopup.setAttribute(copy, "class", "copy");
				SBExtension.browserPopup.setAttribute(copy, "value", coupon.cCode);
				SBExtension.browserPopup.setAttribute(copy, "readonly", 'readonly');
				
				var copied_text = $("<div />", { 'class': 'copied_text', text : SBExtension.browserPopup.getLocalizedString("copied") });
				var coupon_code = $("<div />", { 'class': 'copied_code', text : SBExtension.browserPopup.getLocalizedString("couponCode") + ':' });
				
				copy_wrapper.append($(copy));
				copy_wrapper.append(copied_text);
				
				divEarn.append(coupon_code);
				divEarn.append(copy_wrapper);
			}
			
			var copy_btn = $("<div />", {class:"coupon_btn_merchant_container"});
			var linkBtn = SBExtension.browserPopup.createTag(document, "a");
			SBExtension.browserPopup.setText(linkBtn, SBExtension.browserPopup.getLocalizedString("shopNow"));
			SBExtension.browserPopup.setAttribute(linkBtn, "class", "survey_go_btn coupon_btn_merchant new_tab_link");
			SBExtension.browserPopup.setAttribute(linkBtn, "data-url", cURL);
			
			copy_btn.append(linkBtn);
			divEarn.append(copy_btn);
			
			var divClear = $("<div />", {class : "clear"});

			divMTitle.append(exp);
			
			divMain.append(divMTitle);
			var htmlFlag = "";
			this.addCountryFlagIfNeeded(memberCountry, couponCountry, lastCountry, divMain, 'merchant_content_img');
			divMain.append(divEarn);
			divMain.append(divClear);
			appendElement.append(divMain);
		
		} else {
			var divCEarn;
			var spanEarn;
			if (coupon.cCode == '') {
				divCEarn = $("<div />", { style: " margin-top: 5px; margin-left: 0px; ", class: 'float_left coupon_action couponCode no_code_req' });
			} else {
				divCEarn = $("<div />", { style: " margin-top: 5px; margin-left: 0px; ", class: 'float_left coupon_action couponCode code_req codeReqInit' });
				var copy_wrapper = $("<div />", { 'class': 'copy_wrapper'});
				var copy = SBExtension.browserPopup.createTag(document, "input");
				SBExtension.browserPopup.setText(copy, coupon.cCode);
				SBExtension.browserPopup.setAttribute(copy, "class", "copy");
				SBExtension.browserPopup.setAttribute(copy, "value", coupon.cCode);
				SBExtension.browserPopup.setAttribute(copy, "readonly", 'readonly');
				SBExtension.browserPopup.setAttribute(copy, "style", 'width:130px;height:24px;font-size: 11px;');
				var copied_text = $("<div />", { 'class': 'copied_text', text : SBExtension.browserPopup.getLocalizedString("copied") });
				
				copy_wrapper.append($(copy));
				copy_wrapper.append(copied_text);
				divCEarn.append(copy_wrapper);
			}

			var divMain = $("<div />", { 'class': 'merchant' });
			
			var divMImg = $("<div />", { 'class': 'float_left' });
			var img = SBExtension.browserPopup.createTag(document, "img");
			SBExtension.browserPopup.setAttribute(img, "src", "http://" + SBExtension.config.sbMediaHost + "/img/shop/ms/ms"+coupon.mID+".jpg");
			
			var divMContent = $("<div />", { 'class': 'float_left merchant_content' });
			var divMTitle = $("<div />", { 'class': 'merchant_title', text : (coupon.mName ? coupon.mName : "Same text..." ) });
			var divMText = $("<div />", { 'class': 'merchant_text', text : coupon.cDescription + ' ' + coupon.cExpDate.replace('Expires:', 'Exp:') });
			//Hack! G-d knows why, but FF wants this line to wrap text, and Chrome clears the whole popup if the line is there...
			if (!SBExtension.browserPopup.isLocalStoragePreset || !SBExtension.browserPopup.isLocalStoragePreset())
				SBExtension.browserPopup.setAttribute(divMText[0], "style", 'display: table-cell;');
			var divAction = $("<div />", { 'class': 'merchant_action' });
			
			var divBtn = $("<div />", { 'class': 'float_left' });
			var locExtra = "";
			if (couponCountry) {
				locExtra = ("&loc=" + couponCountry);
			}
			var cURL = 'http://' + SBExtension.config.sbHostName + '/g/shopredir?merchant='+coupon.mID+'&category=0&page=30&coupon='+coupon.cID+'&tb=2' + locExtra;
			var linkBtn = SBExtension.browserPopup.createTag(document, "a");
			SBExtension.browserPopup.setText(linkBtn, SBExtension.browserPopup.getLocalizedString("shopNow"));
			SBExtension.browserPopup.setAttribute(linkBtn, "class", "survey_go_btn new_tab_link");
			SBExtension.browserPopup.setAttribute(linkBtn, "data-url", cURL);
			
			var divEarn = $("<div />", { 'class': 'float_left' });
			var curSymbol = SBExtension.getOneCurrencySymbolForCountry(couponCountry);
			var spanEarn = $("<span />", { "id": 'shop_title_earn'+(++this.spanEarnCount), class: 'merchant_earn', html : SBExtension.browserPopup.getLocalizedString("plusEarn") + ' ' +coupon.mSB+' SB ' + SBExtension.browserPopup.getLocalizedString("per") + ' ' + curSymbol });
			
			var divClear = $("<div />", {class : "clear"});

			divMImg.append($(img));
			
			divBtn.append($(linkBtn));
			divEarn.append(spanEarn);
			divAction.append(divBtn);
			divAction.append(divEarn);
			
			divMContent.append(divMTitle);
			var htmlFlag = "";
			this.addCountryFlagIfNeeded(memberCountry, couponCountry, lastCountry, divMContent, 'merchant_content_img');
			divMContent.append(divMText);
			divMContent.append(divAction);
			divMContent.append(divCEarn);
			
			divMain.append(divMImg);
			divMain.append(divMContent);
			divMain.append(divClear);

			appendElement.append(divMain);
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUIShop.createCoupon: ' + e.message, e);
	}
};

// ADD MERCHANTS
SBExtension.PopupUIShop.prototype.showMerchntList = function(){
	var this_ = this;
	try{
		var appendElement = $("#top_shop_dc", document);
		appendElement.text('');
		var merchantList = this.getMerchantStore("feature_order");
		if(!merchantList){
			if(this.cntRepeatMerchant < 6){
				this.cntRepeatMerchant++;
				SBExtension.popupUILogin.preloaderInit();
				setTimeout(function(){
					this_.showMerchntList();
				},3000);
			}else{
				this.cntRepeatMerchant = 0;
				SBExtension.popupUILogin.preloaderClose();
			}
			return;
		}
		SBExtension.popupUILogin.preloaderClose();
		this.cntRepeatMerchant = 0;
		var curCountryMerchantArray = [];
		var otherCountriesMerchantArray = [];
		var network = SBExtension.getNetwork();
		var curCountry = (network.memberInfo && network.memberInfo.country) ? network.memberInfo.country : 0;
		if (!curCountry) {
			curCountry = (SBExtension.globalState.memberInfo && SBExtension.globalState.memberInfo.country) ? network.memberInfo.country : 0;
		}
		if (!curCountry) {
			curCountry = SBExtension.store.retrieveGlobalKey("SE_COUNTRY");
		}
		var curCountrySettings = SBExtension.merchantPriorityCountry[curCountry];
		var curCountryNew = (curCountrySettings) ? curCountrySettings[0] : null;
		var limitToSelf = (curCountrySettings) ? curCountrySettings[1] : null;
		curCountry = (curCountryNew) ? curCountryNew : 1;

		var featuredStores = SBExtension.browserPopup.getLocalizedString("featuredStores");
		var divTitle = $("<div />", { 'class': 'merchant-title', text: featuredStores});
		appendElement.append(divTitle);

		var linkAll = SBExtension.browserPopup.createTag(document, "a");
		SBExtension.browserPopup.setText(linkAll, SBExtension.browserPopup.getLocalizedString("viewAllStores"));
		SBExtension.browserPopup.setAttribute(linkAll, "href", "http://www.swagbucks.com/shop/allstores/?view=list&utm_source=SwagButton&utm_medium=directlink&utm_campaign=view_all_stores");
		SBExtension.browserPopup.setAttribute(linkAll, "target", "_blank");
		var divLinkAll = $("<div />", { 'class': 'merchant-link-all'});
		divLinkAll.append(linkAll);
		appendElement.append(divLinkAll);

		for (var merchntName in merchantList) {
			var merchant = merchantList[merchntName];
			if (!curCountry || merchant.country == curCountry) {
				curCountryMerchantArray.push(merchant);
			} else if (!limitToSelf) {
				otherCountriesMerchantArray.push(merchant);
			}
		}
		var allCountriesMerchantArray = curCountryMerchantArray.concat(otherCountriesMerchantArray);
		for (var idx in allCountriesMerchantArray) {
			var merchant = allCountriesMerchantArray[idx];
			this.createMerchantToList(appendElement, merchant);
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUIShop.showMerchntList: ' + e.message, e);
	}
};

// create merchant
SBExtension.PopupUIShop.prototype.createMerchantToList = function(appendElement, merchant){
	try{
		var divMain = $("<div />", { 'class': 'merchant', title:merchant.mDescription });
		var imgWrapID = 'merchant_img_wrap' + merchant.mID;
		var divTop = $("<div />", { 'class': 'merchant_top', id: imgWrapID} );
		var divMImg = $("<div />", { 'class': 'float_left merchant_img_wrap', id: imgWrapID} );			
		var divMImgTR = $("<div />", { 'class': 'inline_img_wrap'});

		var img = SBExtension.browserPopup.createTag(document, "img");
		SBExtension.browserPopup.setAttribute(img, "src", "http://" + SBExtension.config.sbMediaHost + "/img/shop/ms/ms"+merchant.mID+".jpg");
		SBExtension.browserPopup.setAttribute(img, "alt", merchant.mName);
		SBExtension.browserPopup.setAttribute(img, "title", merchant.mName);

		
		var htmlFlag = "";
		var network = SBExtension.getNetwork();
		var memberCountry = (network.memberInfo && network.memberInfo.country) ? network.memberInfo.country : 0;
		var lastCountry = SBExtension.store.retrieveGlobalKey("SE_COUNTRY");
		var merchantCountry = merchant.country;
		
		var divBtn = $("<div />", { 'class': 'float_right margin-top-6 merchant-btn-container' });
		var locExtra = "";
		if (merchantCountry) {
			locExtra = ("&loc=" + merchantCountry);
		}
		var mURL = 'http://' + SBExtension.config.sbHostName + '/g/shopredir?merchant='+merchant.mID+'&category=0&page=45&tb=2' + locExtra;
		var linkBtn = SBExtension.browserPopup.createTag(document, "a");
		SBExtension.browserPopup.setText(linkBtn, SBExtension.browserPopup.getLocalizedString("shopBtn"));
		SBExtension.browserPopup.setAttribute(linkBtn, "class", "survey_go_btn new_tab_link merchnt_btn");
		SBExtension.browserPopup.setAttribute(linkBtn, "data-url", mURL);

		var divBottom = $("<div />", { 'class': 'merchant_bottom'} );
		var curSymbol = SBExtension.getOneCurrencySymbolForCountry(merchantCountry);

		var upTo = SBExtension.browserPopup.getLocalizedString("upTo") + " ";
		var isUpTo = (merchant.upTo==1);

		var earnText = SBExtension.browserPopup.getLocalizedString(isUpTo ? "earnUpTo" : "earn") + " ";
		var perText = isUpTo ? upTo[0].toUpperCase() + upTo.substring(1) : "";
		var cashbackText = SBExtension.browserPopup.getLocalizedString(isUpTo ? "earnCashback" : "cashBack") + " ";

		var spanEarn = $("<span />", { 'class': 'merchant_bottom_earn float_left', html : earnText + merchant.mSB+'% ' + ' ' + cashbackText + ' ' });
		var spanPer = $("<span />", { 'class': 'merchant_per float_right', html : perText + merchant.mSB+' SB ' + SBExtension.browserPopup.getLocalizedString("per") + ' ' + curSymbol});
		
		var divClear = $("<div />", {class : "clear"});


		divMImgTR.append($(img));
		divMImg.append(divMImgTR);
		divTop.append(divMImg);
		
		divBtn.append($(linkBtn));
		divTop.append(divBtn);

		divBottom.append(spanEarn)
		         .append(spanPer);

		divMain.append(divTop)
		       .append(divBottom)
		       .append(divClear);

		appendElement.append(divMain);
	} catch(e) {
		SBExtension.alert_debug('PopupUIShop.createMerchantToList: ' + e.message, e);
	}
};

SBExtension.PopupUIShop.prototype.getCoupons = function(merID, callback){
	try{
		var storeCoupon = SBExtension.store.retrieveGlobalKey(this.prefixCoupon + merID);
		if(storeCoupon){
			storeCoupon = JSON.parse(storeCoupon);
			if(new Date().getTime() - storeCoupon.timestamp < this.expireCoupon * 60 * 1000){
				for(couponName in storeCoupon.coupons){
					var coupon = storeCoupon.coupons[couponName];
					this.createCoupon($(this.couponSection), coupon, true);
				}
				if (callback) {
					callback();
				}
				return;
			}else{
				SBExtension.store.clearKey(this.prefixCoupon + merID, true);
			}
		}
		
		var this_ = this;
		var url = this.couponURL + "&mid=" + merID;
		var inputData = "";
		var ajaxCall = {
			type: 'POST',
			url: url,
			//data: inputData,
			success: function (data) {
			  try {
				var coupons;
				var loaded = false;
				try {
					if (typeof data == "string") {
						data = data.replace('\t',' ');
						coupons = JSON.parse(data);
					} else {
						coupons = data;
					}
				} catch(e) {
				}
				
				var storeCoupon = {};
				storeCoupon.mID = merID;
				storeCoupon.timestamp = new Date().getTime();
				storeCoupon.coupons = coupons.se_coupons;
				SBExtension.store.storeGlobalKey(this_.prefixCoupon + merID, JSON.stringify(storeCoupon));
				
				for(index in coupons.se_coupons){
					var coupon = coupons.se_coupons[index];
					this_.createCoupon($(this_.couponSection), coupon, true);
				}
				var divMain = $("<div />", { 'class': 'merchant', style: 'padding:0px;'});
				$(this_.couponSection).append(divMain);
				if (callback) {
					callback();
				}
			  } catch(e) {
				SBExtension.alert_debug('Error in coupon response processing: ' + e.message, e);
			  }
			},
			error: function (data) {
				SBExtension.alert_debug("ERROR result in SBExtension.PopupUIShop.prototype.getCoupons: url=" + url + "; request data=" + JSON.stringify(inputData) + "; response data=" + JSON.stringify(data));
			},
			crossDomain: true
		};
		SBExtension.getAvailableBrowser().addSecurityFieldsToAjaxCall(ajaxCall, { dataType: 'JSON', xhrFields: { withCredentials: true } });
		if (SBExtension.getAvailableBrowser().executeAjaxCall) {
			SBExtension.getAvailableBrowser().executeAjaxCall(ajaxCall);
		} else {
			$.ajax(
				ajaxCall
			);
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUIShop.getCoupons: ' + e.message, e);
	}
};

if (!SBExtension.popupUI) {
	SBExtension.popupUI = [];
}
SBExtension.popupUI[SBExtension.POPUP_ID_SHOP] = new SBExtension.PopupUIShop();
