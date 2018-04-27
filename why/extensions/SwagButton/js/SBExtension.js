try {

if (typeof window === "undefined") window = content.window;

var SBExtension = {
	$:  //(jQuery) ? jQuery.noConflict() : 
	    window.$,
	globalState: null,
	POPUP_ID_SHOP: 0,
	POPUP_ID_SBTV: 1,
	POPUP_ID_PLAY: 2,
	POPUP_ID_SRCH: 3,
	POPUP_ID_ANSW: 4,
	POPUP_ID_DSCV: 5,
	POPUP_ID_SCDE: 6,
	POPUP_ID_ACCT: 7,
	POPUP_ID_SETTING: 8,
	POPUP_ID_NOTIFICATION: 9,

	swagSearchExtensionId: "nnegnghjbbaaojdkcdgmdehpakckeekb",
	swagSearchExtensionExists: false,
	swagSearchExtensionEnabled: false,

	popupMenuItems: [
		"shop",
		"watch",
		"play",
		"search",
		"answer",
		"discover",
		"sc",
		"account",
		"settings",
		"notification"
	],

	popupMenuIndexes: {
		"shop":0,
		"watch":1,
		"play":2,
		"search":3,
		"answer":4,
		"discover":5,
		"sc":6,
		"account":7,
		"settings":8,
		"notification": 9
	},

	getPopupMenuItem: function(idx) {
		if (idx<0 || idx>=this.popupMenuItems.length)
			idx = this.getDefaultMenuItemIndex();
		var res = this.popupMenuItems[idx];
		if (!res)
			res = this.popupMenuItems[0];
		return res;
	},

	getPopupMenuIndex: function(item) {
		var idx = this.popupMenuIndexes[item];
		if (idx==null || typeof idx == "undefined")
			idx = this.getDefaultMenuItemIndex();
		return idx;
	},

	isPopupMenuItemDisabled: function(choice) {
		var idx = SBExtension.getPopupMenuIndex(choice);
		return (SBExtension.globalState && !SBExtension.globalState.isCountryFullySupported(idx))
	},

	merchantPriorityCountry: {
		1:  [1, true],
		2:  [2, true],
		4:  [4, true],
		8:  [8, false],
		16: [4, false],
		32: [1, false],
		64: [64, false]
	},

	countryLocale: {
		1:  "en-US",
		2:  "en-US",
		4:  "en-US",
		8:  "en-US",
		16: "en-US",
		32: "en-US",
		64: "de-DE"
	},

	config: {
		merchantsRequestInterval : 60*60*24,
		resourceHostName: "www.swagbucks.com",

		debugIsEnabled: false, //true,
		debugAlertIsEnabled: false,
		debugErrorIsEnabled: false, //true, //false, //true,
		debugSystemErrorIsEnabled: false, //true, //false,
		debugLogIsEnabled: false,
		searchURL: "http://www.swagbucks.com/?f=@BROWSER_SEARCH_TYPE@&t=w&p=1&q={searchTerms}",
		searchName: "Swagbucks",
		searchAlias: "Swagbucks.com",
		searchDescription: "Swagbucks search engine",
		searchMethod: "GET",
		searchIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAIAAAD9MqGbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAntJREFUOE+NU1tvEkEY5Ue5u1StxAffffLFaqI+EB9M/4APGtvdBdaQaHzwgg22RmNibGR3odVAgtw0EWGhKFCttFAEgV1oF5blot/MUkwKJCaTycxkznznO+eMifFQxwdPsTzF8CTDm1k0k1PueCjT5CmCecysx8DAPPE0LjYFyfAEzRMIgKvZYD3JawaStMFVhKRoYD4NNqsmKrUWs/q3nO7wNUb4b7YO72mvRB9qdU1vHWoVT/yWXZifJGxiBKwBTxp6OsQz7zNOVZPLyrd44XWllT/oVF9+XERIQ2dDAtQnT+JmCDAAwD6JVbVG7WAnUVjfayQ20ratou9t4varT4vOzXOoAKg90hbB0IYV58TkcluXi43Ul59v9H67JKefBBf8mXuqVtcH3WJdcgUvMaLZ0BxqwgoKUg/85wv1uKLu88nlajNXa+08j14XJbbbUyvNbWlPGAz74dyKXTxJHyGBNwHSPwxcKMlSQy0KiTuKWioruWj+2YFWrTbzL2I3NtL24Z9hdHvVJp4asTWEgZnl5zZT9o7eLMuZ778jwHYw6JWVjDt01Ztc6nTlkpxyBS+ORYYMIW3BetDJIc5/yD7S+51KMx/Ku96luafBBSG51Or8qrV21yJWG3h7lC2UPlqAfEHTBO0hOd/ZUPYxOPmjGlsJXV6P32x3FYCtRqyIHbIQhxmnD/pExsDeSDnnswS+3gdhANPra/tyBqrhpowxijHyEzdppvF72CGSgzykuN3652w54A5fwSRRAJCqYyTenMADKo8igrIhmu96LZzXgr8o4skiMEGjGI/8RNoYG5SHMXnjIeMcG4j/7b+b0/7njG91LPR/ATB8bHiP4dccAAAAAElFTkSuQmCC",

		homePage: "http://www.swagbucks.com",

		sbHostName: "www.swagbucks.com", // TODO !!! : Replace for "QA" extension !!!
		sbDomainName: "swagbucks.com", // TODO : Replace for "QA" extension !!!
		sbMediaHost: "www.sbx-media.com", // TODO : Replace for "QA" extension !!!
		cookieHostName: "www.swagbucks.com", // TODO : Replace for "QA" extension !!!
		searchPage: "http://search.swagbucks.com/?f=@BROWSER_SEARCH_TYPE@", // TODO : Replace for "QA" extension !!!
		sbTutorialCmd: "http://www.swagbucks.com/swagbutton-tutorial", //"file:///c:/Users/public/tutorial/tutorial.html",

		cdnHostName: "www.sbx-cdn.com", // TODO : Replace for "QA" extension !!!

		isCompetitorIconAlive: false,
		
		forcingNonIFrameActivation: true,
		addingDeepLinkURL: true,
		
		domainToSbAffiliateMap: {
			"linksynergy.com" : {regex: /id=(nDQA3oKZiiQ|WxZXCYwb5Kw|xq[/]4qzvAAT4|mWcVgHGT0[/]Y|xEAOaeElf2E|OmdxViUZtwA)/, host: "click.linksynergy.com"},
			"walmart.com" : {regex: /id=nDQA3oKZiiQ|WxZXCYwb5Kw/, host: "linksynergy.walmart.com"},
			"onlineshoes.com" : {regex: /id=xq[/]4qzvAAT4|mWcVgHGT0[/]Y/, host: "linksynergy.onlineshoes.com"},
			"awin1.com" : {regex: /(r|id)=233859/, host: "www.awin1.com"},
			"avantlink.com" : {regex: /pw=(128299|146573)/, host: "www.avantlink.com"},
			"webmasterplan.com" : {regex: /ref=756827/, host: "partners.webmasterplan.com"},
			"webgains.com" : {regex: /wgcampaignid=204517/, host: "track.webgains.com"},
			"groupon.com" : {regex: /tsToken=US_AFF_0_200038_249562_0/, host: "tracking.groupon.com"},
			"7eer.net" : {regex: /[/]c[/](55700|49764)[/]/},
			"ebay.com" : {regex: /pub=5575082972/, host: "rover.ebay.com"},
			"successfultogether.co.uk" : {regex: /pub=5575082972/, host: "being.successfultogether.co.uk"},
			// Full match after extra params removal
			"kqzyfj.com" : {host: "www.kqzyfj.com"},
			"tkqlhce.com" : {host: "www.tkqlhce.com"},
			"anrdoezrs.net" : {host: "www.anrdoezrs.net"},
			"jdoqocy.com" : {host: "www.jdoqocy.com"},
			"dpbolvw.net" : {host: "www.dpbolvw.net"},
			// --- More ---
			"pntrac.com" : {host: "www.pntrac.com"},
			"pntra.com" : {host: "www.pntra.com"},
			"gopjn.com" : {host: "www.gopjn.com"},
			"pjatr.com" : {host: "www.pjatr.com"},
			"pjtra.com" : {host: "www.pjtra.com"},
			"pntrs.com" : {host: "www.pntrs.com"},
			"awin1.com" : {host: "www.awin1.com"},
			// --- More ---
			"zanox.com" : {host: "ad.zanox.com"},
			"zanox-affiliate.de" : {host: "www.zanox-affiliate.de"},
			// --- More ---
			"prf.hn" : {host: "prf.hn"},
			// --- More ---
			"doubleclick.net" : {host: "adclick.g.doubleclick.net"}
		},

		// 0 - shop & earn
		// 1 - sbtv
		// 2 - play
		// 3 - search
		// 4 - answer
		// 5 - discover
		// 6 - sc
		// 7 - account
		popoutViewArray: [0,1,1,1,1,1,1,1,1], //view popout
		
		blinkArray: ["sb1.png","sb2.png","sb3.png","sb4.png","sb5.png"], //view popout
		maxBlink: 2,
		blinkTime: 100,
	
		hashAffiliate: "",
		hashMerchant: "",
		
		StateTB: "SEStateTB",
		LoginMembers: "SELoginMembers",
		Members: "SEMembers",
		
		timeOutCheckState: 5000, //500000,//5000,
		heartBeatTS : 120000, //20000,
		merchantLoadURL: "",
		affNetworkLoadURL: "",
		apiURL : "http://api.conduit.com/",
		keyPrefixObj : "SEDomains_",
		keyPrefixTab : "SETabs_",
		keyPrefixLog : "SELog",
		keyPrefixCookie : "SE_",
		keyPrefixRequest : "SERequest_",
		keyPrefixActivate : "SEActivate_",
		keyPrefix : "",
		appName : "SBCashBack",
		greenClearState : 3600, // one-hour vs 1 min
		greenClearStateQA : 3600, //60,   // one-hour vs 1 min
		loginState : "0",
		loginCode : "",
		showSrvyProjID : false,

		merchantWidth: 294, 
		merchantDelta: 6, 
		merchantCount: 3,
		encraveLinkCloseExpirationMinutes: 60*24, //60,
		encraveLinkCloseStartNewDay: true, //false,
		imprDelta: 0,
		clickDelta: 0,
		lastImprTime: 0,
		lastClickTime: 0,

		updatePopupHiddenPeriod: 3600000, // Start showing again in one hour after dismissal...
		
		//isShopEarnBanner: true,
		//isButtonAlert: false,
		isBalanceAlert: false,
		isSurveyAlert: true,
		//isShoppingHints: true,
		isSBSearch: true,
		isNewTabSearch: true,
		
		isSwagbucksDomainName: function(domainName) {
			var matches = (SBExtension.config.sbDomainName==domainName);
			return matches;
		},
		isDomainNameReserved: function(domainName) {
			var matches = SBExtension.config.resourceHostName.indexOf(domainName)>=0 || SBExtension.config.cookieHostName.indexOf(domainName)>=0 || SBExtension.config.sbDomainName==domainName;
			return matches;
		},
		onLogin: function(loginState, code, showSrvyProjID) {
			SBExtension.config.loginState = loginState;
			SBExtension.config.loginCode = code;
			SBExtension.config.showSrvyProjID = showSrvyProjID;
			SBExtension.store.storeGlobalKey("popUpSE_loginState", loginState);
			SBExtension.store.storeGlobalKey("popUpSE_loginCode", code);
			SBExtension.store.storeGlobalKey("popUpSE_showSrvyProjID", showSrvyProjID);
		},
		getGreenClearState: function() {
			return (SBExtension.config.sbDomainName=="swagbucks.com") ? SBExtension.config.greenClearState : SBExtension.config.greenClearStateQA;
		},
		getMerchantLoadURL: function(knownCountry, knownMerchantHash) {
			return ((SBExtension.config.sbDomainName.indexOf("swagbucks")<0) || (!knownMerchantHash||knownMerchantHash.length==0) && SBExtension.config.hashMerchant.length==0)
			? "http://" + SBExtension.config.sbHostName + "/?cmd=tbf-get-merchant-list-jx&ext=1&loc=" + knownCountry
			: ("http://" + SBExtension.config.cdnHostName + "/g/swagbutton-merchants-hash-" + (((knownMerchantHash&&knownMerchantHash.length>0) ? knownMerchantHash : SBExtension.config.hashMerchant) + ".js?cmd=tbf-get-merchant-list-jx&ext=1&loc="+knownCountry));
		},
		getAffNetworkLoadURL: function() {
			return "http://" + SBExtension.config.sbHostName + "/?cmd=tbf-get-affiliate-list-jx&ext=1";
		},
		getSearchURL: function() {
			var browser = SBExtension.getAvailableBrowser("getURLSearchType");
			if (!browser.getURLSearchType)
				return null;
			var res = SBExtension.config.searchURL.replace("@BROWSER_SEARCH_TYPE@", browser.getURLSearchType());
			var searchTermsReplacement = (SBExtension.getAvailableBrowser("getSearchTermsReplacement").getSearchTermsReplacement) ? SBExtension.getAvailableBrowser().getSearchTermsReplacement() : null;
			if (searchTermsReplacement)
				res = res.replace("{searchTerms}", searchTermsReplacement);
			return res;
		},
		getSearchPage: function() {
			var browser = SBExtension.getAvailableBrowser("getURLSearchType");
			if (!browser.getURLSearchType)
				return null;
			var res = SBExtension.config.searchPage.replace("@BROWSER_SEARCH_TYPE@", browser.getURLSearchType());
			return res;
		},
		getHeartBeatTS: function() {
			return (SBExtension.globalState && SBExtension.globalState.memberInfo && SBExtension.globalState.memberInfo.memberID) ? SBExtension.config.heartBeatTS : SBExtension.config.heartBeatTS * 5;
		},
		setUpdatePopupHidden: function() {
			SBExtension.store.storeGlobalKey("popUpSE_UPDATE_HIDDEN_TS", ""+(new Date()).getTime());
		},
		isUpdatePopupHidden: function() {
			var updatePopupHiddenTS = SBExtension.store.retrieveGlobalKey("popUpSE_UPDATE_HIDDEN_TS");
			if (!updatePopupHiddenTS || ((new Date()).getTime()-Number(updatePopupHiddenTS)) >= SBExtension.config.updatePopupHiddenPeriod) {
				return false;
			}
			return true;
		}
	},

	checkMBSurveyAvailabilityLoop: {},
	checkFulcrumSurveyAvailabilityLoop: {},
	
	getInitialMBCheckTimeout: function() {
		return (SBExtension.config.sbDomainName=="swagbucks.com") ? 0 : SBExtension.getMBCheckPeriodSecs();
	},
	
	getMBCheckPeriodSecs: function() {
		return 15;
	},

	getInitialFulcrumCheckTimeout: function() {
		return (SBExtension.config.sbDomainName=="swagbucks.com") ? 0 : SBExtension.getFulcrumCheckPeriodSecs();
	},
	
	getFulcrumCheckPeriodSecs: function() {
		return 60;
	},
	
	loadSettings: function(skipStoring, isNewTabSearch, isSBSearch, forceSBSearch) {
		var settings = null;
		settings = SBExtension.getAvailableBrowser("getSettings").getSettings();
		if (!settings || forceSBSearch) {
			if (typeof isNewTabSearch != "undefined") {
				SBExtension.config.isNewTabSearch = isNewTabSearch;
				if (settings && forceSBSearch) {
					settings.isNewTabSearch = isNewTabSearch;
				}
			}
			if (typeof isSBSearch != "undefined") {
				SBExtension.config.isSBSearch = isSBSearch;
				if (settings && forceSBSearch) {
					settings.isSBSearch = isSBSearch;
				}
			}
			var settingsNew = SBExtension.setSettings(skipStoring);
			return (forceSBSearch) ? settings : settingsNew;
		}
		var isReSet = false;
		if (typeof settings.isBalanceAlert == "undefined") {
			SBExtension.config.isBalanceAlert = false;
			settings.isBalanceAlert = false;
			isReSet = true;
		}
		SBExtension.config.isBalanceAlert = settings.isBalanceAlert;
		if (typeof settings.isSurveyAlert == "undefined") {
			SBExtension.config.isSurveyAlert = false;
			settings.isSurveyAlert = false;
			isReSet = true;
		}
		SBExtension.config.isSurveyAlert = settings.isSurveyAlert;
		if (typeof settings.isNewTabSearch == "undefined") {
			SBExtension.config.isNewTabSearch = false;
			settings.isNewTabSearch = false;
			isReSet = true;
		}
		SBExtension.config.isNewTabSearch = settings.isNewTabSearch;
		if (typeof settings.isSBSearch == "undefined") {
			SBExtension.config.isSBSearch = false;
			settings.isSBSearch = false;
			isReSet = true;
		}
		SBExtension.config.isSBSearch = settings.isSBSearch;
		if (isReSet) {
			SBExtension.setSettings(skipStoring);
		}
		return settings;
	},
	
	setSettings: function(skipStoring) {
		var settings = {};
		settings.isBalanceAlert = SBExtension.config.isBalanceAlert;
		settings.isSurveyAlert = SBExtension.config.isSurveyAlert;
		settings.isNewTabSearch = SBExtension.config.isNewTabSearch;
		settings.isSBSearch = SBExtension.config.isSBSearch;
		if (!skipStoring) {
			SBExtension.getAvailableBrowser("setSettings").setSettings(settings);
		}
		return settings;
	},

	extend: function(parentPrototype, child) {
		function CloneInternal(){};
		CloneInternal.prototype = parentPrototype;
		child.prototype.constructor = child;
		return new CloneInternal();
	},

	getRandomValues: function(array) {
		var needToFinish = true;
		if (window.crypto && window.crypto.getRandomValues) {
			try {window.crypto.getRandomValues(array); needToFinish = false;} catch(err) {}
		}
		if (needToFinish && array && array.length) {
			for (var idx=0; idx<array.length; idx++) {
				array[idx] = Math.floor(Math.random() * 9007199254740992);
			}
		}
	},

	// Returns the version of Internet Explorer or 0 (indicating the use of another browser)
	getIEVersion: function(){
		var rv = 0; // Return value assumes non-IE.
		if (SBExtension.ieVersion) {
			rv = SBExtension.ieVersion;
		}
		try {
			var navigator = navigator || window.navigator;
		} catch(err) {
			SBExtension.DBG_navigatorError = "" + err;
			SBExtension.DBG_navigatorErrorStack = JSON.stringify(err.stack);
			console.log("SBExtension.DBG_navigatorError=" + SBExtension.DBG_navigatorError );
			console.log("SBExtension.DBG_navigatorErrorStack=" + SBExtension.DBG_navigatorErrorStack );
		}
		if (navigator.appName == 'Microsoft Internet Explorer'  ||  navigator.appName == 'Netscape'){
			var ua = navigator.userAgent.toLowerCase();
			var re  = new RegExp("(?:msie(?: |)|trident[ /].*rv:|chrome.*safari.*edge/)([0-9]{1,}[\.0-9]{0,})");
			var regRes = re.exec(ua);
			if (regRes && regRes.length)
				rv = parseFloat( regRes[1] );
		}
		return rv;
	},

	  newTabLinkExclusionSearch: "/g/shopredir?"
	, newTabLinkUrlMapSearch: new RegExp("[/](paid-surveys|polls|tasks|special-offers|coupons|noso|swagbucks-credit_card|activities|games|summary|home|contact|invite)([?].*|)$")
	, newTabLinkUrlMap:
		{  "paid-surveys":"paid_surveys"
		 , "polls":"daily_poll"
		 , "tasks":"tasks"
		 , "special-offers":"special_offers"
		 , "coupons":"coupons"
		 , "noso":"noso"
		 , "swagbucks-credit_card":"credit_card"
		 , "activities":"encrave"
		 , "games":"games"
		 , "summary":"view_account"
		 , "home":"view_help_desk"
		 , "contact":"contact_support"
		 , "invite":"invite_friends"
		 , "login":"login"
		 , "terms":"terms"
		 , "privacy":"privacy"
		}
	, newTabLinkGamesSearch:  new RegExp("[/]games[/]play[/]([1-9][0-9]*)[/]")
	,

	preprocessLink: function(url) {
		var args = "";
		if (url.indexOf(SBExtension.newTabLinkExclusionSearch) < 0) {
			var searchRes = SBExtension.newTabLinkUrlMapSearch.exec(url);
			if (searchRes && searchRes.length > 1) {
				var match = searchRes[1];
				var utm_campaign = SBExtension.newTabLinkUrlMap[match];
				if (utm_campaign) {
					var match2 = (searchRes.length > 1) ? searchRes[2] : "";
					args = ((match2=="?") ? "/" : "?") + "utm_source=SwagButton&utm_medium=directlink&utm_campaign=" + utm_campaign;
				}
			} else {
				searchRes = SBExtension.newTabLinkGamesSearch.exec(url);
				if (searchRes && searchRes.length > 1) {
					var gameID = searchRes[1];
					if (gameID) {
						var match2 = (searchRes.length > 1) ? searchRes[2] : "";
						args = ((match2=="?") ? "/" : "?") + "utm_source=SwagButton&utm_medium=directlink&utm_campaign=games_" + gameID;
					}
				}
			}
		}
		if (url.length>2 && url[0]=="@" && url[url.length-1]=="@") {
			methodNameArg = url.split('@');
			methodName    = methodNameArg[1];
			methodArg     = methodNameArg[2];
			if (methodName!="") {
				var objectRefAndMethod = this.getObjectAndMethodByName(methodName); // = SBExtension;
				var objectRef = objectRefAndMethod[0];
				var objectMethod = objectRefAndMethod[1];
				var paramValues = [methodArg];
				url = objectMethod.apply(objectRef, paramValues);
			}
		}
		return url + args;
	},

	getFlagSuffix: function(country) {
		var flag = "US";
		switch(country) {
			default:
			case "1":
				flag = "US";
				break;
			case "2":
				flag = "CA";
				break;
			case "4":
				flag = "UK";
				break;
			case "8":
				flag = "AU";
				break;
			case "64":
				flag = "DE";
				break;
		}
		return flag;
	},

	currencyForCountry: [
		"dollar",       // 0 <==  1 -- Actually - should be USD, but that's how business wanted it...
		"CAD",          // 1 <==  2
		"GBP",          // 2 <==  4
		"AUD",          // 3 <==  8
		"Euro",         // 4 <== 16 -- Actually - should be EUR, but that's how business wanted it...
		"INR",          // 5 <== 32
		"Euro"          // 6 <== 64 -- Actually - should be EUR, but that's how business wanted it...
	],

	currencySymbolForCountry: [
		"$",            // 0 <==  1
		"&#36;",        // 1 <==  2
		"&#163;",       // 2 <==  4
		"&#36;",        // 3 <==  8
		"&#8364;",      // 4 <== 16
		"&#8377;",      // 5 <== 32
		"&#8364;"       // 6 <== 64
	],

	getCurrencyForCountry: function(countryCode) {
		var idx = SBExtension.getIndexForCountry(countryCode);
		return SBExtension.currencyForCountry[idx];
	},

	getIndexForCountry: function(countryCode) {
		var bit = 1;
		var sz = SBExtension.currencyForCountry.length;
		for (var idx=0; idx<sz; idx++,bit*=2) {
			if ((bit & countryCode) == 0)
				continue;
			return idx;
		}
		return 0;
	},

	getCurrencySymbolForCountry: function(countryCode) {
		var idx = SBExtension.getIndexForCountry(countryCode);
		return SBExtension.currencySymbolForCountry[idx];
	},

	getOneCurrencySymbolForCountry: function(countryCode) {
		var idx = SBExtension.getIndexForCountry(countryCode);
		var sym = SBExtension.currencySymbolForCountry[idx];
		return (SBExtension.config.loginCode==64) ? "1 "+sym : sym+"1";
	},

	getUpdateVersion: function() {
		var updateVersion = SBExtension.store.retrieveGlobalKey("popUpSE_LAST_UPDATE_VERSION_ID");
		if (updateVersion)
			updateVersion = Number(updateVersion);
		if (!updateVersion || isNaN(updateVersion))
			updateVersion = 1;
		return updateVersion;
	},

	isUpdateAvailable: function() {
		return (SBExtension.currentVersion && SBExtension.getUpdateVersion() > SBExtension.currentVersion);
	},

	getUpdateVersionCritical: function() {
		var updateVersionCritical = SBExtension.store.retrieveGlobalKey("popUpSE_LAST_UPDATE_VERSION_CRITICAL_ID");
		if (!updateVersionCritical)
			updateVersionCritical = 1;
		return updateVersionCritical;
	},

	isCriticalUpdateAvailable: function() {
		return (SBExtension.currentVersion && SBExtension.getUpdateVersionCritical() > SBExtension.currentVersion);
	}
};

SBExtension.alert_debug = function(msg, err) {
	//if (SBExtension.browser && SBExtension.browser.getBrowserStatsFlag && SBExtension.browser.getBrowserStatsFlag()==64)
	//	return;
	if (SBExtension.config.debugAlertIsEnabled || SBExtension.config.debugIsEnabled&&err || SBExtension.config.debugErrorIsEnabled&&err&&err.stack)
		window.alert(msg + ((err) ? "\n\nSTACK: " + err.stack : ""));
};

SBExtension.log_debug = function(msg, err) {
	if (SBExtension.browser && SBExtension.browser.getBrowserStatsFlag && SBExtension.browser.getBrowserStatsFlag()==64)
		return;
	if (SBExtension.config.debugLogIsEnabled) {
		if (SBExtension.store && SBExtension.store.nativeLocalStorage) {
			window.external.StoreGlobalKey("__@@log@@__", msg + ((err) ? "\n\nSTACK: " + err.stack + "\n\n": ""));
		} else {
			console.log(msg + ((err) ? "\n\nSTACK: " + err.stack : ""));
		}
	}
};

SBExtension.defaultTabId    = 0;
SBExtension.defaultWindowId = 0;

SBExtension.isHomePageSetToSB = function() {
	var browser = SBExtension.getAvailableBrowser("getHomepage");
	return (browser && browser.getHomepage) ? (browser.getHomepage()==SBExtension.config.getSearchPage()) : undefined;
};

SBExtension.isNewTabPageSetToSB = function() {
	var browser = SBExtension.getAvailableBrowser("getNewTabHomepage");
	return (browser && browser.getNewTabHomepage) ? (browser.getNewTabHomepage()==SBExtension.config.getSearchPage()) : undefined;
};

SBExtension.isSearchSetToSB = function(alwaysKnown) {
	var browser = SBExtension.getAvailableBrowser("isSearchEngineKnown");
	return (browser && browser.isSearchEngineKnown) ? (browser.isSearchEngineKnown(alwaysKnown) && browser.getSearchEngineName()==SBExtension.config.searchName) : undefined;
};

SBExtension.isSearchEngineKnown = function() {
	var browser = SBExtension.getAvailableBrowser("isSearchEngineKnown");
	return (browser && browser.isSearchEngineKnown && browser.isSearchEngineKnown());
}

SBExtension.getInitialDefaultMenuItemIndex = function() {
	return (SBExtension.isSearchSetToSB(true) && SBExtension.globalState && SBExtension.globalState.isCountryFullySupported(SBExtension.POPUP_ID_SHOP))
		? SBExtension.POPUP_ID_SHOP
		: SBExtension.POPUP_ID_SRCH;
};

SBExtension.getSubsequentDefaultMenuItemIndex = function() {
	var browser = SBExtension.getAvailableBrowser("isSearchEngineKnown");
	return (browser && browser.isSearchEngineKnown && browser.isSearchEngineKnown() && browser.getSearchEngineName()!=SBExtension.config.searchName  ||  !SBExtension.globalState || !SBExtension.globalState.isCountryFullySupported(SBExtension.POPUP_ID_SHOP))
	        ? SBExtension.POPUP_ID_SRCH
		: SBExtension.POPUP_ID_SHOP;
};

SBExtension.isFirstPopupShown = function() {
	var frstPopupWasShown = (SBExtension.store.retrieveGlobalKey("FirstPopupShown") != "0");
	return frstPopupWasShown;
};

SBExtension.getDefaultMenuItemIndex = function() {
	if (SBExtension.isFirstPopupShown()) {
		return SBExtension.getSubsequentDefaultMenuItemIndex();
	}
	return SBExtension.getInitialDefaultMenuItemIndex();
};

SBExtension.copyOf = function (obj) {
    var typ = Object.prototype.toString.call(obj);
    if (typ == "[object Array]" || typ == "[object Object]") {
        var res = (typ == "[object Array]") ? [] : {};
        for (var n in obj) {
            if (obj.hasOwnProperty(n)) {
                res[n] = SBExtension.copyOf(n);
            }
        }
        return res;
    }
    return obj;
};

SBExtension.SBAlert = function(alertOrType, alertId, forceSaving) {
	var alert = (alertOrType && alertOrType.alertType) ? alertOrType : null;
	var alertType = (alert) ? alert.alertType : alertOrType;
	this.alertType = alertType;
	this.id = (alertId) ? alertId : ((alert) ? alert.id : 0);
	this.tsRecvd = (alert && alert.tsRecvd) ? alert.tsRecvd : (new Date()).getTime();
	this.tsSeen = (alert && alert.tsSeen) ? alert.tsSeen : 0;
	this.tsClicked = (alert && alert.tsClicked) ? alert.tsClicked : 0;
	this.tsHidden = (alert && alert.tsHidden) ? alert.tsHidden : 0;
	this.tsRemoved = (alert && alert.tsRemoved) ? alert.tsRemoved : 0;
	this.tsCreated = (alert && alert.tsCreated) ? alert.tsCreated : 0;

	this.markSeen = function(skipSaving) {
		this.tsSeen = (new Date()).getTime();
		if (!skipSaving) this.save();
	};
	this.markClicked = function(skipSaving) {
		this.tsClicked = (new Date()).getTime();
		if (this.isRemovableOnClick()) {
			this.markRemoved(true);
		}
		if (!skipSaving) this.save();
	};
	this.markRemoved = function(skipSaving) {
		this.tsRemoved = (new Date()).getTime();
		if (!skipSaving) this.save();
	};
	this.markHidden = function(skipSaving, hidingAllByType) {
		this.tsHidden = (new Date()).getTime();
		if (!skipSaving) this.save();
		if (hidingAllByType) {
			SBExtension.store.storeGlobalKey("SEAlerts_lastPopupClosedTSByType_" + this.alertType, this.tsHidden);
		}
	};
	this.markCreated = function(skipSaving) {
		this.tsCreated = (new Date()).getTime();
		if (!skipSaving) this.save();
	};
	this.isRemovableOnClick = function() {
		return (this.alertType == SBExtension.POPUP_ID_ACCT);
	};
	
	this.save = function() {
		SBExtension.store.saveAlerts([this]);
	};

	if (alert && alert.data) {
		this.data = alert.data;
	}

	if (!this.tsCreated) {
		this.markCreated(forceSaving ? false : true);
	} else if (forceSaving) {
		this.save();
	}
};

SBExtension.createAlert = function (alertOrType, alertId, skipSaving) {
	var alert = new SBExtension.SBAlert(alertOrType, alertId, !skipSaving);
	//if (!skipSaving) alert.save();
	return alert;
};

SBExtension.getAlert = function (alertType, alertId) {
	var allAlerts = SBExtension.store.loadAlerts();
	var typeAlerts = allAlerts[alertType];
	if (!typeAlerts) {
		return null;
	}		
	
	var alert = typeAlerts[alertId];
	if (!alert) {
		return null;
	}
	return alert;
};

SBExtension.saveAlert = function (alertType, alertId, alertData) {
	var allAlerts = SBExtension.store.loadAlerts();
	var typeAlerts = allAlerts[alertType];
	if (!typeAlerts) {
		return false;
	}		
	
	var alert = typeAlerts[alertId];
	if (!alert) {
		return false;
	}
	
	typeAlerts[alertId] = alertData;
	allAlerts[alertType] = typeAlerts;
	SBExtension.store.saveAlerts(allAlerts,	true);
	return true;
	
};

SBExtension.SBGlobalState = function() {
	this.globalType = 0, // 0 - one global type, 1 - global type from tab object
	this.loginState = 0;
	this.memberInfo = null;
	
	this.pCodeMSG = "";
	this.pCodeStatus = "";
	this.memberID = 0;
	
	this.init = function(loginState) {
		this.loginState = loginState;
		return this.get();
	};
	
	this.manualDefaultPriority = [100, 50, 5, 25, 5, 5, 25, 5, 25];
	this.navigationDefaultPriority = [99, 0, 0, 0, 0, 0, 0, 0, 0];
	this.pushNotifDefaultPriority = [20, 1, 0, 0, 0, 0, 1, 1, 0];

	// 0 - shop & earn
	// 1 - sbtv
	// 2 - play
	// 3 - search
	// 4 - answer
	// 5 - discover
	// 6 - sc
	// 7 - account
	this.stateSEActiveArray = {}; //push notification active for S&E
	this.stateActiveArray = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //push notification active
	this.manualPriority = this.manualDefaultPriority.slice();
	this.navigationPriority = this.navigationDefaultPriority.slice();
	this.pushNotifPriority = this.pushNotifDefaultPriority.slice();

	this.isCountrySupported = function() {
		return !this.memberInfo || !this.memberInfo.memberID || this.loginState==0 || this.memberInfo.country<=64; //32; //<8;
	};
	
	this.isCountryFullySupported = function(menuIndex) {
		var res = true;
		if (menuIndex==SBExtension.POPUP_ID_SBTV)
			res = !this.memberInfo || !this.memberInfo.memberID || this.loginState==0 || this.memberInfo.country<32; //!=32;
		else if (menuIndex==SBExtension.POPUP_ID_SHOP)
			res = !this.memberInfo || !this.memberInfo.memberID || this.loginState==0 || this.memberInfo.country!=0; //<8;
		else if (menuIndex==SBExtension.POPUP_ID_PLAY)
			res = !this.memberInfo || !this.memberInfo.memberID || this.loginState==0 || this.memberInfo.country!=32;
		return res;
	};
	
	this.setMemberInfo = function(memberInfo) {
		if (memberInfo.isErrorReceived) {
			this.loginState = 0;
			this.memberInfo = {memberID:0, status:0, msg:"", statusPCode:""};
			this.pCodeMSG = "";
			this.pCodeStatus = "";
			this.memberID = 0;
			return;
		}
		this.loginState = memberInfo.status;
		this.pCodeMSG = memberInfo.msg;
		this.pCodeStatus = memberInfo.statusPCode;
		this.memberID = memberInfo.memberID;
		this.memberInfo = memberInfo;
		this.manualPriority = this.manualDefaultPriority.slice();
		this.navigationPriority = this.navigationDefaultPriority.slice();
		this.pushNotifPriority = this.pushNotifDefaultPriority.slice();
		if (!this.isCountryFullySupported(SBExtension.POPUP_ID_SHOP)) {
			this.manualPriority[SBExtension.POPUP_ID_SHOP] = 0;
			this.navigationPriority[SBExtension.POPUP_ID_SHOP] = 0;
			this.pushNotifPriority[SBExtension.POPUP_ID_SHOP] = 0;
			if (this.memberInfo.country==32) {
				this.manualPriority[SBExtension.POPUP_ID_SBTV] = 0;
				this.navigationPriority[SBExtension.POPUP_ID_SBTV] = 0;
				this.pushNotifPriority[SBExtension.POPUP_ID_SBTV] = 0;
			}
		}
	};

	this.updateMemberInfo = function(memberInfo) {
		if (memberInfo.isErrorReceived) {
			this.loginState = 0;
			this.memberInfo = {memberID:0, status:0, msg:"", statusPCode:""};
			this.pCodeMSG = "";
			this.pCodeStatus = "";
			this.memberID = 0;
			return this.memberInfo;
		}
		var memberInfo2 = null;
		if (!this.memberInfo || memberInfo.memberID!=this.memberInfo.memberID || (!memberInfo.uName&&!this.memberInfo.uName) ) {
			// We will populate missing fields in memberInfo from global storage!!!
			var memberInfoStr = SBExtension.store.retrieveGlobalKey("SBmemberInfo");
			memberInfo2 = (memberInfoStr) ? JSON.parse(memberInfoStr) : false;
			if (memberInfo2.memberID==memberInfo.memberID) {
				var ignoredMemberFieldNames = ["surveys", "msg", "pCodeID", "calledMethodName", "relogin"];
				for (var name in memberInfo) {
					if (ignoredMemberFieldNames.indexOf(name)>=0) {
						continue;
					}
					memberInfo2[name] = memberInfo[name];
				}
			}
		}
		if (!memberInfo2) {
			memberInfo2 = memberInfo;
		}
		if (memberInfo2.status     !==undefined) this.loginState  = memberInfo2.status;
		if (memberInfo2.msg        !==undefined) this.pCodeMSG    = memberInfo2.msg;
		if (memberInfo2.statusPCode!==undefined) this.pCodeStatus = memberInfo2.statusPCode;
		if (memberInfo2.memberID   !==undefined) this.memberID    = memberInfo2.memberID;
		if (!this.memberInfo || this.memberInfo.memberID!=memberInfo2.memberID)
			this.memberInfo = null;
		if (this.memberInfo) {
			for (var name in memberInfo2) {
				this.memberInfo[name] = memberInfo2[name];
			}
		} else {
			this.memberInfo = memberInfo2;
		}
		return this.memberInfo;
	};

	this.save = function() {
		this.ts = new Date().getTime();
		SBExtension.store.storeGlobalState(this);
	};

	this.retrieve = function() {
		var state = SBExtension.store.retrieveGlobalState();
		this.setFrom(state);
	};

	this.toArray = function(arrayObj) {
		if (arrayObj.length)
			return arrayObj;
		var arrayRes = [];
		for (n in arrayObj) {
			arrayRes[n] = arrayObj[n];
		}
		return arrayRes;
	};

	this.setFrom = function(state) {
		if (!state)
			return;
		if (state.memberInfo)
			this.setMemberInfo(state.memberInfo);
		this.isLogin = state.isLogin;
		this.globalType = state.globalType;
		this.loginState = state.loginState;
		this.pCodeMSG = state.pCodeMSG;
		this.pCodeStatus = state.pCodeStatus;
		this.memberID = state.memberID;

		if (state.stateSEActiveArray)
			this.stateSEActiveArray = state.stateSEActiveArray; //this.toArray not needed, associative array it is...
		if (state.stateActiveArray)
		    this.stateActiveArray = this.toArray(state.stateActiveArray);
		if (state.manualPriority)
			this.manualPriority = state.manualPriority;
		if (state.navigationPriority)
			this.navigationPriority = state.navigationPriority;
		if (state.pushNotifPriority)
			this.pushNotifPriority = state.pushNotifPriority;

		if (state.heartBeatTS)
			this.heartBeatTS = state.heartBeatTS;

		if (state.ts && (!this.ts || state.ts>this.ts)) {
			this.ts = state.ts;
		} else if (!this.ts) {
			this.ts = new Date().getTime();
		}
		// TODO : for efficiency, it would help to only return dirty flag as "true" if globalState ACTUALLY was changed!!!
		return true;
	};
}

SBExtension.globalState = new SBExtension.SBGlobalState();

// Popup state (stored for each window)
function PopupExtnState() {
	this.stateArray = [0,0,0,0,0,0,0,0,0];
	
	this.tabId = SBExtension.defaultTabId;
	this.windowId = SBExtension.defaultWindowId;
	
	this.lastUserSelTS = 0;
	this.lastUserSelMenuItem = ""; 
	
	this.lastVisitedPageTS = 0;
	this.lastVisitedPageMenuItem = "";
	
	this.currentMenuItem = "";
	this.currentMenuSubItem = "";
	
	//this.defaultMenuItem = "shop";
	this.merchantID = 0;
	this.globalType = 0;

	//0 manualPriority:     [100, 50, 5, 25, 5, 5, 25, 5],
	//1 navigationPriority: [ 99,  0, 0,  0, 0, 0,  0, 0],
	//2 pushNotifPriority:  [ 20,  1, 0,  0, 0, 0,  1, 1],
	
	this.selectionPriority = 0; 
	this.selectionMethod = 1; 
	this.curMenuItemIndex = SBExtension.getDefaultMenuItemIndex(); //0;

	this.getDefaultMenuItem = function() {
		this.curMenuItemIndex = SBExtension.getDefaultMenuItemIndex(); //0;
		return SBExtension.getPopupMenuItem(this.curMenuItemIndex);
	};

	this.setPriority = function(method, itemIndex){
		try{
			var prior = 0;
			if(method == 0){
				prior = SBExtension.globalState.manualPriority[itemIndex];
			}else if(method == 1){
				prior = SBExtension.globalState.navigationPriority[itemIndex];
			}else if(method == 2){
				prior = SBExtension.globalState.pushNotifPriority[itemIndex];
			}
			
			if(method == 0){
				this.selectionPriority = prior; 
				this.selectionMethod = method; 
				this.curMenuItemIndex = itemIndex;
				this.currentMenuItem = SBExtension.getPopupMenuItem(this.curMenuItemIndex);
			} else if(method > 0) {
				if(this.selectionPriority < prior){
					this.selectionPriority = prior; 
					this.selectionMethod = method; 
					this.curMenuItemIndex = itemIndex;
					this.currentMenuItem = SBExtension.getPopupMenuItem(this.curMenuItemIndex);
				}
			}
		} catch(e) {
			SBExtension.alert_debug('setPriority: ' + e.message);
		}
	};
	
	this.init = function(tabId, windowId, globalType){
		this.tabId = tabId;
		this.windowId = windowId;
		this.globalType = globalType;
		return this.get();
	};
	
	this.changeTransition = function(lstVisitedPageTS, lstVisitedPageMenuItem){
		this.lastVisitedPageTS = lstVisitedPageTS + '';
		this.lastVisitedPageMenuItem = lstVisitedPageMenuItem;
	};
	
	this.onUserAction = function(lastUserSelTS, lastUserSelMenuItem, currMenuSubItem){
		this.lastUserSelTS = lastUserSelTS + '';
		this.lastUserSelMenuItem = lastUserSelMenuItem;
		if(currMenuSubItem){
			this.currentMenuSubItem = currMenuSubItem;
		}else{
			//this.currentMenuSubItem = currMenuSubItem;
		}
	};
	
	this.save = function(){
		SBExtension.alert_debug("!!!! INSIDE save() method for PopupExtnState!!! SBExtension.defaultTabId = " + SBExtension.defaultTabId);
		SBExtension.store.storeGlobalKey("GlobalState_" + this.windowId, this);
		SBExtension.store.storeGlobalKey("GlobalState_" + this.windowId + "_" + this.tabId, this);
		
		var tb = SBExtension.tabStateHandler.getTabByTabId(this.tabId, "");
		if(tb && tb.saveInStore){
			tb.lastUserSelTS = this.lastUserSelTS;
			tb.lastUserSelMenuItem = this.lastUserSelMenuItem;
			tb.lastVisitedPageTS = this.lastVisitedPageTS;
			tb.lastVisitedPageMenuItem = this.lastVisitedPageMenuItem;
			tb.currentMenuSubItem = this.currentMenuSubItem;
			tb.merchantID = this.merchantID;
			tb.stateArray = this.stateArray;
			tb.selectionPriority = this.selectionPriority; 
			tb.selectionMethod = this.selectionMethod; 
			tb.curMenuItemIndex = this.curMenuItemIndex;
			tb.saveInStore();
		}
	};
	
	this.get = function(){
		var storedState = null;
		var tb = SBExtension.tabStateHandler.getTabByTabId(this.tabId, "");
		if (this.globalType == 0) {
			storedState = SBExtension.store.retrieveGlobalKey("GlobalState_" + this.windowId);	
			if (storedState && tb) {
			    storedState.merchantID = tb.merchantID;
			    SBExtension.store.storeGlobalKey("GlobalState_" + this.windowId, storedState);
			}
		} else {
			if (!tb) {
				storedState = SBExtension.store.retrieveGlobalKey("GlobalState_" + this.windowId + "_" + this.tabId);
			} else {
				storedState = tb;
				SBExtension.store.storeGlobalKey("GlobalState_" + this.windowId + "_" + this.tabId, storedState);
			}
		}

		if(!storedState){
			this.lastUserSelTS = 0;
			this.lastUserSelMenuItem = "";
			this.lastVisitedPageTS = 0;
			this.lastVisitedPageMenuItem = "";
			this.currentMenuItem = "";
			this.merchantID = 0;
			this.currentMenuSubItem = "";
			this.stateArray = [0,0,0,0,0,0,0,0];
			this.selectionPriority = 0; 
			this.selectionMethod = 0; 
			this.curMenuItemIndex = SBExtension.getDefaultMenuItemIndex(); //0;
			return this;
		}
		
		this.lastUserSelTS = storedState.lastUserSelTS;
		this.lastUserSelMenuItem = storedState.lastUserSelMenuItem;
		this.lastVisitedPageTS = storedState.lastVisitedPageTS;
		this.lastVisitedPageMenuItem = storedState.lastVisitedPageMenuItem;
		this.merchantID = storedState.merchantID;
		this.currentMenuSubItem = storedState.currentMenuSubItem;
		this.stateArray = storedState.stateArray;
		this.selectionPriority = storedState.selectionPriority; 
		this.selectionMethod = storedState.selectionMethod; 
		this.curMenuItemIndex = storedState.curMenuItemIndex;
		//this.currentMenuItem = storedState.currentMenuItem;
		return this;
	};
};

SBExtension.getAvailableBrowser = function(method) {
	if (SBExtension.browser && (!method || SBExtension.browser[method]))
		return SBExtension.browser;
	if (SBExtension.browserPopup && (!method || SBExtension.browserPopup[method]))
		return SBExtension.browserPopup;
	if (SBExtension.browserInject && (!method || SBExtension.browserInject[method]))
		return SBExtension.browserInject;
	// This should NEVER happen!!!
	try { FAKE_OBJ.FAKE_METHOD();} catch(err) { SBExtension.alert_debug("getAvailableBrowser() will return empty object as there is no browser available for method "  + method + " !!!", err);}
	return {};
};

SBExtension.createNewPopupExtnState = function() {
	return new PopupExtnState();
};

SBExtension.popupSetStateChangeCallback = function(popup, stateActivityArray, stateSEActiveArray) {
	SBExtension.alert_debug ("IN the SBExtension.browser.executeForAllPopups callback -- BEFORE popup.SBExtension.popupUIMain.setStateChange!!! SBExtension.networkPopup.memberInfo = " + JSON.stringify(SBExtension.networkPopup.memberInfo) + "; SBExtension.browser=" + SBExtension.browser + "; debugAlertIsEnabled=" + SBExtension.debugAlertIsEnabled);
	popup.SBExtension.popupUIMain.setStateChange(stateActivityArray, SBExtension.networkPopup.memberInfo, stateSEActiveArray);
	SBExtension.alert_debug ("IN the SBExtension.browser.executeForAllPopups callback -- AFTER popup.SBExtension.popupUIMain.setStateChange!!!");
}

SBExtension.popupSetPCodeCallback = function(popup, data) {
	SBExtension.alert_debug ("IN the SBExtension.browser.executeForAllPopups callback -- BEFORE popup.SBExtension.popupUI[SBExtension.POPUP_ID_SCDE].setPCode(data) !!!");
	popup.SBExtension.popupUI[SBExtension.POPUP_ID_SCDE].setPCode(data);
	SBExtension.alert_debug ("IN the SBExtension.browser.executeForAllPopups callback -- AFTER popup.SBExtension.popupUI[SBExtension.POPUP_ID_SCDE].setPCode(data) !!!");
}

SBExtension.popupViewLoginPageCallback = function(popup) {
	SBExtension.alert_debug ("IN the SBExtension.browser.executeForAllPopups callback -- BEFORE popup.SBExtension.popupUILogin.viewLoginPage() !!!");
	popup.SBExtension.popupUILogin.viewLoginPage();
	SBExtension.alert_debug ("IN the SBExtension.browser.executeForAllPopups callback -- AFTER popup.SBExtension.popupUILogin.viewLoginPage() !!!");
}

SBExtension.broadcastStateChange = function(fields, selectedTabID) {
	// TODO : For efficiency, once completely debugged, we can eliminate storing/retrieving parameters to/from localStorage, and transfer them directly!
	var methodName = fields.method;
	if (!methodName) {
		SBExtension.alert_debug("SBBrowserPopupMSIE.prototype.broadcastStateChange error: no method in fields: " + JSON.stringify(fields));
		return;
	}
	var params = [methodName];
	for (fName in fields) {
		if (fName=="method")
			continue;
		var fValue = fields[fName];
		SBExtension.store.storeGlobalKey(fName, fValue);
		params.push(fName);
	}
	if (selectedTabID) {

		try { ERROR_ICON.ERROR_METHOD(); } catch(err) {SBExtension.alert_debug("@@@ SBExtension.broadcastStateChange PRIOR TO window.external.executeForAllPopups !!!", err);}

		window.external.OnExecuteInSelectedPopup( //ExecuteInSelectedTab(
			//function(params) {
			//	SBExtension.onExecuteCallback(params);
			//},
			params
		);
		return;
	}
	window.external.OnExecuteForAllPopups( //ExecuteForAllTabs(
		//function(params) {
		//	SBExtension.onExecuteCallback(params);
		//},
		params
	);
};

SBExtension.getObjectAndMethodByName = function(methodName) {
	var objectMethod = SBExtension;
	var methodNames = methodName.split(".");
	var idx = 0;
	var objectRef;
	for (var m in methodNames) {
		methodName = methodNames[m];
		//if (idx++ == 1) objectRef = objectMethod;
		objectRef = objectMethod;
		objectMethod = objectMethod[methodName];
	}
	return [objectRef, objectMethod];
};

SBExtension.onExecuteCallback = function() {
	// TODO : For efficiency, once completely debugged, we can eliminate storing/retrieving parameters to/from localStorage, and transfer them directly!
	SBExtension.log_debug("SBExtension.onExecuteCallback: arguments = " + JSON.stringify(arguments));
	if (arguments.length < 1) {
		return;
	}
	var args = [];
	Array.prototype.push.apply(args,arguments);
	var method = args.shift(); // remove and return 0th element!!!
	var objectRefAndMethod = this.getObjectAndMethodByName(method); // = SBExtension;
	var objectRef = objectRefAndMethod[0];
	var objectMethod = objectRefAndMethod[1];
	var paramValues = [];
	for (var p in args) {
		var param = args[p];
		if (param.length>0 && param[0]=='@') {
			param = (param=="@popup@") ? window : SBExtension.store.retrieveGlobalKey(param);
		}
		paramValues.push(param);
	}
	objectMethod.apply(objectRef, paramValues);
};

SBExtension.setDebugAlertingEnabled = function(value) {
	this.debugAlertIsEnabled = value;
};

SBExtension.getNetwork = function() {
	return (SBExtension.network) ? SBExtension.network : SBExtension.networkPopup;
}

SBExtension.headerByPosition = function (index, item, browser) {
	var data = (item) ? item.data : null;
	var br = '<br>';
	if (browser && browser.getLineBreakTag) {
		br = browser.getLineBreakTag();
	}
	switch(index) {
		case 0:
			return SBExtension.getAvailableBrowser().getLocalizedString("shopEarnChanged");
		case 1:
			return SBExtension.getAvailableBrowser().getLocalizedString("watchChanged");
		case 2:
			return SBExtension.getAvailableBrowser().getLocalizedString("featuredGamesChanged");
		case 3:
			return SBExtension.getAvailableBrowser().getLocalizedString("searchChanged");
		case 4:
			var text = SBExtension.getAvailableBrowser().getLocalizedString("newSurveyAvailable");
			if (data) {
				if (data.loi) {
					text = text.replace('@LOI@',data.loi);
				}
				var srvId = (SBExtension.config.showSrvyProjID) ? data.prjId : data.srvId;
				if (srvId) {
					text = text.replace('@SID@', srvId);
				}
			}
			return text;
		case 5:
			return SBExtension.getAvailableBrowser().getLocalizedString("discoverChanged");
		case 6:
			return SBExtension.getAvailableBrowser().getLocalizedString("newSwagCodeAvailable") + br + SBExtension.getAvailableBrowser().getLocalizedString("clickSBIconToView");
		case 7:
			if (data && data.sb && data.sb>0) {
				return SBExtension.getAvailableBrowser().getLocalizedString("youEarnedPrefix") + " " + data.sb + " " + SBExtension.getAvailableBrowser().getLocalizedString("youEarnedSuffix");
			} else
				return SBExtension.getAvailableBrowser().getLocalizedString("yourSBAccBalance") + br + SBExtension.getAvailableBrowser().getLocalizedString("hasBeenUpdated");
	}
}

SBExtension.textByPosition = function (index, item, browser) {
	var data = (item) ? item.data : null;
	switch (index) {
		case 0:
		case 1:
		case 2:
		case 3:
		case 5:
		case 6:
			return '';
		case 4:
			var forAnswering = SBExtension.getAvailableBrowser().getLocalizedString("forAnsweringSurvey");
			return SBExtension.getAvailableBrowser().getLocalizedString("earnForSurvey") + " " + data.sb + " SB" + ((forAnswering.length<2) ? forAnswering : " " + forAnswering);
		case 7:
			if (data) {
				var br = '<br>';
				if (browser && browser.getLineBreakTag) {
					br = browser.getLineBreakTag();
				}
				var dataSB = data.sb;
				var oper = SBExtension.getAvailableBrowser().getLocalizedString("hasBeenCredited"); //'has just been credited to your account.';
				if (dataSB < 0) {
					dataSB = -dataSB;
					oper = SBExtension.getAvailableBrowser().getLocalizedString("hasBeenDebited"); //'has just been debited from your account.';
				}
				return ''; // TODO may be replace: dataSB + ' SB ' + oper;
			} else
				return ''; // TODO may be replace: SBExtension.getAvailableBrowser().getLocalizedString("clickSBIconToView");
	}
}

SBExtension.convertAlertsToPopupArray = function(oneTypeAlerts) {
	var popupArray = [];
	if (!oneTypeAlerts)
		return popupArray;
	var rank = 0;
	for (var id in oneTypeAlerts) {
		var alert = oneTypeAlerts[id];
		if (typeof alert.rank != "undefined") {
			rank = alert.rank;
		}
		popupArray[rank++] = alert;
	}
	return popupArray;
}

SBExtension.urlByPosition = function(index, item, browser) {
	var data = (item) ? item.data : null;
	switch (index) {
		case 0:
		case 1:
		case 2:
		case 3:
		case 5:
			return '';
		case 4:
			if (data && data.url) {
				var br = '<br>';
				if (browser && browser.getLineBreakTag) {
					br = browser.getLineBreakTag();
				}
				if (item.tsClicked > 0) {
					return "<br/><span class=\"survey-started\">" + SBExtension.getAvailableBrowser().getLocalizedString("surveyStarted") + "</span>";
				}
				return br + " <a class=\"action-link\" data-index=\""+index+"\" data-id=\""+item.id+"\" href=\"" + data.url + "\" target=\"_blank\">" + SBExtension.getAvailableBrowser().getLocalizedString("getStarted") + "</a>";
			}
			return "";
		case 6:
			if (item.data && item.data.msg) {
				var mas = item.data.msg.split('~');
				if (mas.length == 2 && mas[0].length > 0 && mas[1].length > 0) {
					return '<a href="' + mas[1] + '" target="_blank">' + mas[0] + '</a>';
				} else {
					return mas[0];
				}
			}
			return "";
		case 7:
			return '<a class="action-link" data-index="'+index+'" data-id="'+item.id+'" href="http://www.swagbucks.com/account/summary" target="_blank">' + SBExtension.getAvailableBrowser().getLocalizedString("viewDetails") + '</a>';

	}
}

SBExtension.setTutorialWindowId = function(tutWinId) {
	if (SBExtension.browser && SBExtension.browser.setTutorialWindowId) {
		SBExtension.browser.setTutorialWindowId(tutWinId);
		return;
	}
	SBExtension.tutWinId = tutWinId;
}

SBExtension.getTutorialWindowId = function() {
	if (SBExtension.browser && SBExtension.browser.getTutorialWindowId) {
		return SBExtension.browser.getTutorialWindowId();
	}
	return SBExtension.tutWinId;
}

SBExtension.getStateToSend = function(installFlagParam, ignoringStateChangeHistory, mid) {
	var tbid = SBExtension.store.getTbUID();
	var standAlone = 8;
	var installFlag = (installFlagParam) ? installFlagParam : 4;
	var newStateRecord = {
		mid: mid,
		ts: Math.floor(((new Date()).getTime()/1000)),
		version: 0,
		tbid: tbid,
		flag: installFlag|standAlone|SBExtension.getAvailableBrowser().getBrowserStatsFlag()|((mid>0)?1:0)
	};
	var lastCalculatedStateRecord = SBExtension.store.retrieveGlobalKey("SSE_LastLiveTS");
	if (!lastCalculatedStateRecord || installFlagParam || lastCalculatedStateRecord.tbid!=newStateRecord.tbid || (lastCalculatedStateRecord.flag&!standAlone!=newStateRecord.flag&!standAlone) || lastCalculatedStateRecord.mid!=newStateRecord.mid) {
		// Need to store "last live" state
		if (((lastCalculatedStateRecord&256)!=0) && ((newStateRecord.flag&4)!=0)) {
			// Mark it as re-enabled if the last record indicates it was disabled (currently could only happen in Firefox...)
			newStateRecord.flag |= 1024;
		}
		newStateRecord.flag = (lastCalculatedStateRecord) ? newStateRecord.flag&~8 | (lastCalculatedStateRecord.flag&8) : newStateRecord.flag;
		newStateRecord.version = (lastCalculatedStateRecord) ? lastCalculatedStateRecord.version : newStateRecord.version;
		if (!ignoringStateChangeHistory) {
			SBExtension.store.storeGlobalKey("SSE_LastLiveTS", newStateRecord);
		}
	} else {
		// Refresh "last calculated" state
		lastCalculatedStateRecord.ts   = newStateRecord.ts;
		lastCalculatedStateRecord.tbid = newStateRecord.tbid;
		lastCalculatedStateRecord.flag = newStateRecord.flag&~8 | (lastCalculatedStateRecord.flag&8);
		newStateRecord = lastCalculatedStateRecord;
	}
	// Now - check whether the state is modified since last time we sent it...
	var lastSentStateRecord = SBExtension.store.retrieveGlobalKey("SSE_LastSentTS");
	if (installFlagParam || !lastSentStateRecord || lastSentStateRecord.tbid!=newStateRecord.tbid || lastSentStateRecord.flag!=newStateRecord.flag || lastSentStateRecord.version!=newStateRecord.version || lastSentStateRecord.mid!=newStateRecord.mid) {
		// If extension was INSTALLED, let's add optional (!) parameters (if needed)
		if (SBExtension.browser && SBExtension.browser.addOptionalInstallParams) {
			newStateRecord = SBExtension.browser.addOptionalInstallParams(newStateRecord);
		}
		if (!ignoringStateChangeHistory && SBExtension.browser && SBExtension.browser.setUninstallURL) {
			SBExtension.browser.setUninstallURL(newStateRecord);
		}
		return newStateRecord;
	}
	return (ignoringStateChangeHistory) ? newStateRecord : null;
}

SBExtension.isUsingLongLocale = function() {
	if (typeof SBExtension.usingLongLocale === "undefined") {
		SBExtension.usingLongLocale = false;
		var browser = SBExtension.getAvailableBrowser("isUsingLongLocale");
		if (browser && browser.isUsingLongLocale) {
			SBExtension.usingLongLocale = browser.isUsingLongLocale();
		}
	}
	return SBExtension.usingLongLocale;
}

SBExtension.getCurrentLocale = function(defaultOverrideLocale) {
	var curLoc = (SBExtension.isUsingLongLocale()) ? SBExtension.getCurrentLongLocale(defaultOverrideLocale) : SBExtension.getCurrentShortLocale(defaultOverrideLocale);
	return curLoc;
}

SBExtension.getCurrentBrowserLocale = function() {
	if (!SBExtension.currentBrowserLocale)
		SBExtension.currentBrowserLocale = (SBExtension.isUsingLongLocale()) ? SBExtension.getCurrentBrowserLongLocale() : SBExtension.getCurrentBrowserShortLocale();
	return SBExtension.currentBrowserLocale;
}

SBExtension.getCurrentBrowserLongLocale = function() {
	var lang;
	var browser = SBExtension.getAvailableBrowser("getCurrentLocale");
	if (browser && browser.getCurrentLocale) {
		lang = browser.getCurrentLocale();
	}
	lang = (lang || navigator.language || navigator.browserLanguage || navigator.userLanguage).replace('_','-');
	if (lang.indexOf("-")<0) {
		lang = lang + "-" + ((lang=="en")?"US":lang.toUpperCase());
	}
	return lang;
}

SBExtension.getCurrentBrowserShortLocale = function() {
	var lang;
	var browser = SBExtension.getAvailableBrowser("getCurrentLocale");
	if (browser && browser.getCurrentLocale) {
		lang = browser.getCurrentLocale();
	}
	lang = (lang || navigator.language || navigator.browserLanguage || navigator.userLanguage).split('-')[0];
	return lang;
}

SBExtension.getCurrentLongLocale = function(defaultOverrideLocale) {
	var countryLocale = SBExtension.countryLocale[parseInt(SBExtension.config.loginCode)];
	return (countryLocale) ? countryLocale : (defaultOverrideLocale || SBExtension.getCurrentBrowserLongLocale());
}

SBExtension.getCurrentShortLocale = function(defaultOverrideLocale) {
	var countryLocale = SBExtension.countryLocale[parseInt(SBExtension.config.loginCode)];
	var dashIdx;
	return (countryLocale) ? (((dashIdx=countryLocale.indexOf('-'))>=0)?countryLocale.substring(0,dashIdx):countryLocale) : (defaultOverrideLocale || SBExtension.getCurrentBrowserShortLocale());
}

// This is a fix to some weird issues -- primarily with IE...
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

} catch(err) {
	console.log("SBExt: err=" + err + "; stack = " + err.stack);
	window.alert("SBExt: err=" + err + "; stack = " + err.stack);
}

window.SBExtension = SBExtension;

