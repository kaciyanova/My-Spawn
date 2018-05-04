SBExtension.TabStateHandler = function() {
	this.lastMerchantAssigned = 0;
	this.merchantCount = 0;
	this.merchantCountSpec = 0;
 	//this.merchants = {};
 	this.merchantList = {};
	//this.merchantsSpec = {};
	this.merchantsByID = {};
	this.merchantsByIDSpec = {};
 	//this.merchantHosts = {};
	//this.merchantHostsSpec = {};
 	//this.merchantURL = {};
	//this.merchantURLSpec = {};
	this.merchantsByURL = {};
	this.merchantsByURLSpec = {};
	this.affiliate = {};
	this.bannerCategories = {};
	this.setMerchantsNeverCalled = true;
	this.lastTabStateSent = {};
};

SBExtension.TabStateHandler.prototype.getRegexname = function(str,re) {
	if (str === undefined || str == null || str == "") {
		return str;
	}
	if (! str.match) {
		return '';
	}
	var arr = str.match(re);
	if (arr === undefined || arr === null) {
		return str;
	} else {
		return arr[1].toString();
	}
};

SBExtension.TabStateHandler.prototype.getHostname = function(url) {
	if (!url)
		return url;
	var host;
	//find & remove protocol (http, ftp, etc.) and get host
	if (url.indexOf("://") > -1) {
		host = url.split('/')[2];
	} else {
		host = url.split('/')[0];
	}
	//find & remove port number
	host = host.split(':')[0];
	return host;
};

SBExtension.TabStateHandler.prototype.getDomainname = function(str) {
	dom = this.getHostname(str);
	dom = this.getDomainnameFromHost(dom);
	return dom;
};

SBExtension.TabStateHandler.prototype.getDomainnameFromHost = function(str) {
	if (!str || !str.length)
		return str;
	var ends = str.split('.');
	var re;
	if (ends && ends.length>=1 && ends[ends.length - 1].length == 2 && !(ends.length==3 && ends[0]=="www")) {
		re =  /^(?:(?:[^.?]+[.])*?)((?:[^\/.?]+)[.](?:[^\/.]+)[.](?:[^\/.]+))$/im
	} else {
		re =  /^(?:(?:[^.?]+[.])+|)((?:[^\/.?]+)[.](?:[^\/.]+))(?:.*$)/im
	}
	return this.getRegexname(str, re);
};

SBExtension.TabStateHandler.prototype.setState = function(tabId, url) {
	var tab = this.getTabByTabId(tabId, "");
	var obj = this.getObjectByHost(tab.host, tab.url);
	obj.setStateValue(7);
	obj.save();
};

SBExtension.TabStateHandler.prototype.getMerchantNameByID = function(mID) {
	var merchant;
	if (mID > 0) {
		//main table
		merchant = this.merchantsByID[mID];
		//spec table
		if (!merchant) {
			merchant = this.merchantsByIDSpec[mID];
		}
		if (merchant) {
			return merchant.nameMerchant;
		}
	}
	return "";
};

SBExtension.TabStateHandler.prototype.getMerchantByID = function(mID) {
	var merchant;
	if (mID > 0) {
		//main table
		merchant = this.merchantsByID[mID];
		//spec table
		if (!merchant) {
			merchant = this.merchantsByIDSpec[mID];
		}
	}
	return merchant;
};

SBExtension.TabStateHandler.prototype.getMerchantByUrl = function(urlURL, urlHost, urlDomain, matchedBy, startURL, req) {
	var merchant = undefined;
	var merchantSpec = undefined;
	//by merchant url
	if (startURL) {
		merchant = this.getSwagbuckMerchantLink(startURL);
		if (merchant) {
			return merchant;
		}
	}
	
	//by url
	merchant = undefined;
	
	//this.merchantList
	var domain = (urlURL && !urlDomain) ? SBExtension.tabStateHandler.getDomainname(urlURL) : urlDomain;
	if (!domain && urlHost) {
		domain = SBExtension.tabStateHandler.getDomainnameFromHost(urlHost);
	}
	var merObj = this.merchantList[domain];
	if (!merObj) {
		return undefined;
	}
	if (urlURL && merObj[2]) {
		for (var indxURL in merObj[2]) {
			var merchant_obj =  merObj[2][indxURL];

			var urlx = indxURL;
			if (urlx.length>0 && urlx[urlx.length-1] == '/') {
				urlx = urlx.substr(0, urlx.length-1);
			}
			
			var mUrl = urlURL;
			if (urlURL[urlURL.length-1] != '/' && indxURL[indxURL.length-1] == '/') {
				mUrl = urlURL + '/';
			}
			
			var is_check = true;
			var checkURL = merchant_obj.checkURL;
			if (checkURL) {
				is_check = mUrl.indexOf(checkURL)>=0;
			}
			
			var mUrlIdx = -100, mUrlxIdx = -100;
			if ((is_check && ((mUrlIdx=mUrl.indexOf(indxURL))>=0 || (mUrlxIdx=mUrl.indexOf(urlx))>=0))
			  || (mUrlIdx>=0&&mUrlIdx<13 || mUrlxIdx>=0&&mUrlxIdx<13 || mUrlIdx == -100 && (mUrlIdx=mUrl.indexOf(indxURL))>=0&&mUrlIdx<13 || mUrlxIdx == -100 && (mUrlxIdx=mUrl.indexOf(urlx))>=0&&mUrlIdx<13)) {
				mUrlIdx = (mUrlIdx>=0) ? mUrlIdx : mUrlxIdx;
				var urlPrefix = mUrl.substring(0, mUrlIdx);
				if (urlPrefix.match(/^(?:http(?:s|):\/\/|)(?:www[.]|)$/)) {
					merchant = merObj[2][indxURL];
					break;
				}
			}
		}
		
		/*for (var url in this.merchantURLSpec) {
			if (urlURL.indexOf(url)>=0) {
				merchantSpec = this.merchantURLSpec[url];
				break;
			}
		}*/
		
		if (merchant && merchant.country == SBExtension.config.loginCode) {
			if (matchedBy) matchedBy.matchedByURL = true;
			return merchant;
		}
		/*if (merchantSpec && merchantSpec.country == SBExtension.config.loginCode) {
			if (matchedBy) matchedBy.matchedByURL = true;
			return merchantSpec;
		}*/
		if (merchant) {
			if (matchedBy) matchedBy.matchedByURL = true;
			SBExtension.tabStateHandler.checkSpecTransition(req);
			return merchant;
		}
		/*if (merchantSpec) {
			if (matchedBy) matchedBy.matchedByURL = true;
			return merchantSpec;
		}*/
	}

	urlHost = urlHost || this.getHostname(urlURL);
	if (urlHost && merObj[1]) {
		for (var indxHost in merObj[1]) {
			if (urlHost != indxHost) {
				continue;
			}
			var merchant =  merObj[1][urlHost];
			/*if (merchant && merchant.country == SBExtension.config.loginCode) {
			return merchant;
			}*/
			if (merchant) {
				if (matchedBy) matchedBy.matchedByHost = true;
				return merchant;
			}
		}
	}
		
	var merchant_Us = null;
	if (!merchant && domain && merObj[0]) {
		if (!$.isArray(merObj[0])) {
			var merchant = merObj[0];
			if (matchedBy) matchedBy.matchedByDomain = true;
		} else {
			for (var indx in merObj[0]) {
				var merchant = merObj[0][indx];
				if (merchant && merchant.country == SBExtension.config.loginCode) {
					if (matchedBy) matchedBy.matchedByDomain = true;
					return merchant;
				}
				if (merchant.country == 1) {
					merchant_Us = merchant;
				}
			}
		}
	}

	if (merchant_Us && merchant && merchant.country != SBExtension.config.loginCode) {
		merchant = merchant_Us;
		if (matchedBy) matchedBy.matchedByDomain = true;
	}
	
	SBExtension.tabStateHandler.checkSpecTransition(req);
	
	return merchant;
};

SBExtension.TabStateHandler.prototype.checkSpecTransition = function(req) {
	if (req && req.startURL && req.finalURL) {
		for (var merchantName in this.merchantsStartFinalSpecUrl) {
			var m = this.merchantsStartFinalSpecUrl[merchantName];
			if (m.affStartUrl && m.affFinalUrl && req.startURL.indexOf(m.affStartUrl) > -1 && req.finalURL.indexOf(m.affFinalUrl) > -1) {
				var dom =  this.getObjectByHost(merchantName);
				dom.specAffStartUrl = m.affStartUrl;
				dom.save();
			}
		}
	}
}

SBExtension.TabStateHandler.prototype.isMerchantRelatedUrl = function(url) {
	var mer = this.getMerchantByUrl(url);
	if (mer)
		return true;
	return false;
};

SBExtension.TabStateHandler.prototype.getSwagbuckMerchantLink = function(url, merchant) {
	if (merchant && merchant.mURL && url.length>=merchant.mURL.length && url.substring(0,merchant.mURL.length)==merchant.mURL) {
		return merchant;
	}
	var itIsSbMerchant = false;
	var itIsSbMerchant = this.getMerchantFromSBUrl(url);
	if (itIsSbMerchant) {
		return itIsSbMerchant;
	}
	url = url.replace(/([&?][a-z]*url[a-z]*=[^&]*)/i,'');
	var idx = url.search(/([?&]sid=[0-9]+(&afsrc=1|)$|[?&](u1|mid|ascsubtag)=[0-9]+$)/);
	if (idx < 0) {
		itIsSbMerchant = this.merchantsByURL[url];
		if (!itIsSbMerchant) {
			itIsSbMerchant = this.merchantsByURLSpec[url];
		}
	} else {
		var currentUrl = url.substring(0,idx);
		var merByURL = this.merchantsByURL;
		for (var merBUIdx=0; merBUIdx<2 && !itIsSbMerchant; merBUIdx++) {
			itIsSbMerchant = merByURL[currentUrl];
			if (!itIsSbMerchant) {
				var counter = 0;
				var tidx = currentUrl.lastIndexOf("&");
				while(tidx>=0) {
					currentUrl = currentUrl.substring(0,tidx);
					itIsSbMerchant = merByURL[currentUrl];
					if (itIsSbMerchant || counter > 20)
						break;
					tidx = currentUrl.lastIndexOf("&");
					counter++;
				}
			}
			merByURL = this.merchantsByURLSpec;
		}
	}
	return itIsSbMerchant;
};

SBExtension.TabStateHandler.prototype.checkBtnOrSiteMerchantURL = function(merchant, url) {
	var itIsSbMerchant = null;
	var mURL = merchant.mURL;
	var idx = 0;
	do {
		if (mURL.length > 0 && url.indexOf(mURL) >= 0) {
			itIsSbMerchant = merchant;
			break;
		}
		mURL = (idx++==0) ? merchant.sURL : null;
	} while (mURL);
	return itIsSbMerchant;
};

SBExtension.TabStateHandler.prototype.isSwagbuckMerchantLinkNew = function(url, merchant) {
  try {
	var urlHost   = SBExtension.tabStateHandler.getHostname(url);
	var urlDomain = SBExtension.tabStateHandler.getDomainnameFromHost(urlHost);
	var domainCheck = SBExtension.config.domainToSbAffiliateMap[urlDomain];
	if (domainCheck) {
		if (domainCheck.regex && (!domainCheck.host || domainCheck.host==urlHost)) {
			var idx = url.search(domainCheck.regex);
			if (idx > 0) {
				return {domainMatched: true, result: true};
			}
		}
		return {domainMatched: true, result: false};
	}
	else {
		return {domainMatched: false, result: false}
	}
  } catch(err) {
  	return;
  }
};

SBExtension.TabStateHandler.prototype.isSwagbuckMerchantLink = function(url, merchant) {
	var sbMerchantLinkFound = this.isSwagbuckMerchantLinkNew(url, merchant);
	if (sbMerchantLinkFound) {
		if (!sbMerchantLinkFound.domainMatched) {
			return false;
		}
		if (sbMerchantLinkFound.result) {
			return true;
		}
	}
	// Fallback to other (and old) ways ...
	var itIsSbMerchant = this.getSwagbuckMerchantLink(url, merchant);
	if (itIsSbMerchant) {
		return true;
	}
	for (var affUrlDB in this.affiliate) {
		if (url.indexOf(affUrlDB) != -1) {
			idx = url.search(/click-5897557-+/);
			if (idx > 0) {
				return true;
			}
			idx = url.search(/pubid=K391144+/);
			if (idx > 0) {
				return true;
			}
			idx = url.search(/id=nDQA3oKZiiQ+/);
			if (idx > 0) {
				return true;
			}
			idx = url.search(/affiliateid=5897557+/);
			if (idx > 0) {
				return true;
			}
		}
	}
	if (merchant) {
		var checkURL = merchant.checkURL;
		var domain =  this.getDomainname(checkURL);
		var host = this.getHostname(checkURL);
		var checkMerchant = this.getMerchantByUrl("", host, domain);
		var obj = this.getObjectByHost(domain, checkURL);
		if (checkMerchant) {
			if (obj && obj.state == '7') {
				var params = merchant.param.split('@');
				for (var i in params) {
					if (url.indexOf(params[i]) == -1) {
						return false;
					}
				}
				return true;
			}
		} else if (merchant.param) {
			var params = merchant.param.split('@');
			for (var i in params) {
				if (url.indexOf(params[i]) == -1) {
					return false;
				}
			}
			return true;
		}
	}
	return false;
};

SBExtension.TabStateHandler.prototype.setAffNetworks = function(forceReload, interval) {
  try {
	SBExtension.tabStateHandler.doSetAffNetworks(forceReload);
	if (SBExtension.tabStateHandler.affiliate) {
		for (var n in SBExtension.tabStateHandler.affiliate) {
			return;
		}
	}
	if (!interval) {
		interval = 500;
	}
	setTimeout( function() {
		var affSz = 0;
		if (SBExtension.tabStateHandler.affiliate) {
			for (var n in SBExtension.tabStateHandler.affiliate) {
				affSz++;
				break;
			}
		}
		if (affSz == 0) {
			SBExtension.tabStateHandler.affiliate = JSON.parse(SBExtension.store.retrieveGlobalKey("affiliate"));
			if (SBExtension.tabStateHandler.affiliate) {
				for (var n in SBExtension.tabStateHandler.affiliate) {
					affSz++;
					break;
				}
			}
		}
		if (affSz == 0) {
			interval *= 2;
			SBExtension.tabStateHandler.setAffNetworks(true, interval);
		}
	}, interval);
  } catch(err) {
	SBExtension.alert_debug('setAffNetworks: ' + err.message, err);
  }
};

SBExtension.TabStateHandler.prototype.sbAffMap = null;
SBExtension.TabStateHandler.prototype.mpAffMap = null;

SBExtension.TabStateHandler.prototype.map2Str = function(prefix, map) {
    var str = "@" + prefix + "@";
    for (var name in map) {
        var val = map[name];
        str +=(name+"@"+(val.regex?val.regex:"") + "@" + (val.host?val.host:"") + "@");
    }
    return str;
}

SBExtension.TabStateHandler.prototype.str2Map = function(str) {
    str = str.trim();
    if (str.length < 200) {
        console.log("String is too short");
        return null;
    }
    var delim = str[0];
    var strArr = str.split(delim);
    var strArrLength = strArr.length;
    if (strArrLength < 20) {
        console.log("Array is too short");
        return null;
    }
    var myPointsFlag;
    if ((myPointsFlag = ["SB","MP"].indexOf(strArr[1]))<0) {
        console.log("BAD prefix: " + strArr[0]);
        return null;
    }
    var domainToSbAffiliateMap = {};
    for (var arrIdx=2; arrIdx<strArrLength-3; arrIdx+=3) {
        var domainName = strArr[arrIdx];
        if (!domainName) {
            console.log("No domain for index " + arrIdx);
            return null;
        }
        var mapElem = domainToSbAffiliateMap[domainName] = {};
        var regex = strArr[arrIdx+1];
        if (regex) {
            mapElem.regex = regex;
        }
        var host = strArr[arrIdx+2];
        if (host) {
            mapElem.host = host;
        }
    }
    domainToSbAffiliateMap.myPointsFlag = myPointsFlag;
    return domainToSbAffiliateMap;
}

SBExtension.TabStateHandler.prototype.doSetAffNetworks = function(forceReload) {
	var this_ = this;
	if (forceReload || SBExtension.store.retrieveGlobalKey("affiliate") == "" || SBExtension.store.retrieveGlobalKey("affiliate") == undefined) {
		$.get(SBExtension.config.getAffNetworkLoadURL(), function(data) {
		  try {
			var affiliateArray = JSON.parse(data);
			if (affiliateArray[0] !== undefined) {
				affiliateMap = {};
				var affSz = affiliateArray.length;
				for (var idx=0; idx<affSz; idx++) {
					var affName = affiliateArray[idx];
					if (idx>=affSz-2 && affName.length>100 && affName[0]==affName[3] && ["SB", "MP"].indexOf(affName.substring(1,3))>=0) {
						var oneMap = this_.str2Map(affName)
						if (oneMap) {
							if (oneMap.myPointsFlag) {
								delete oneMap.myPointsFlag;
								this_.mpAffMap = oneMap;
								if (SBExtension.config.isMyPoints) {
									SBExtension.config.domainToSbAffiliateMap = oneMap;
								}
							} else {
								this_.sbAffMap = oneMap;
								if (!SBExtension.config.isMyPoints) {
									SBExtension.config.domainToSbAffiliateMap = oneMap;
								}
							}
							continue;
						}
					}
					affiliateMap[affName] = true;
				}
				affiliateArray = affiliateMap;
			}
			this_.affiliate = affiliateArray;
			SBExtension.store.storeGlobalKey("affiliate", JSON.stringify(this_.affiliate));
		  } catch(err) {
			SBExtension.alert_debug('doSetAffNetworks: ' + err.message, err);
		  }
		});
	} else {
		try {
			this.affiliate = JSON.parse(SBExtension.store.retrieveGlobalKey("affiliate"));
		} catch(err) {
			SBExtension.alert_debug('doSetAffNetworks: ' + err.message, err);
		}
	}
};

SBExtension.TabStateHandler.prototype.convertToMultiMerchantsIfNeeded = function() {
	var totMerchSignature = SBExtension.store.retrieveGlobalKey("totMerchSignature");
	if (!totMerchSignature) {
		var lastChangeTS = SBExtension.store.retrieveGlobalKey("merchantsLastChangeTS");
		var oldCountry  = SBExtension.store.retrieveGlobalKey("SE_COUNTRY");
		// This whole "merchantLastCountry" business is just to force updating international members as they have been screwed since merchants CDN release...
		var merchantLastCountry  = SBExtension.store.retrieveGlobalKey("merchantLastCountry");
		if (oldCountry==1 && !merchantLastCountry) {
			merchantLastCountry = 1;
		}
		if (!lastChangeTS)
			lastChangeTS = 0;
		var oldSignature = SBExtension.store.retrieveGlobalKey("merchantsSignature");
		if (oldSignature && merchantLastCountry) {
			totMerchSignature = {};
			totMerchSignature[merchantLastCountry] = oldSignature;
			SBExtension.store.storeGlobalKey("totMerchSignature", totMerchSignature);
			SBExtension.store.storeGlobalKey("merchantsSignature_" + merchantLastCountry, oldSignature);
			var newMerchantsStr = SBExtension.store.retrieveGlobalKey("merchants");
			SBExtension.store.storeGlobalKey("merchants_" + merchantLastCountry, newMerchantsStr);
			SBExtension.store.storeGlobalKey("merchantsLastChangeTS" + merchantLastCountry, lastChangeTS);
			SBExtension.store.storeGlobalKey("merchantsNextLoadTS" + merchantLastCountry, "" + (new Date().getTime() + SBExtension.config.merchantsRequestInterval*1000));
		}
	}
};

SBExtension.TabStateHandler.prototype.processMerchantCountryLoop = function(newSignatureArray, forceReload, lastOneCountry) {
	try {
		for (var oneCountryString in newSignatureArray) {
			var oneCountry = parseInt(oneCountryString);
			if (lastOneCountry && oneCountry<=lastOneCountry) {
				continue;
			}
			var newSignature = newSignatureArray[oneCountryString];
			var asyncCallMade = this.setMerchants(forceReload, newSignature, oneCountryString, -1, true, function() {
				setTimeout(function() {
					SBExtension.tabStateHandler.processMerchantCountryLoop(newSignatureArray, forceReload, oneCountry);
				});
				return;
			});
			if (asyncCallMade) {
				return;
			}
		}
		SBExtension.tabStateHandler.assignMerchants(SBExtension.totalMerchantsReloadInProgress);
		SBExtension.config.totalMerchantHash = newSignatureArray;
		SBExtension.store.storeGlobalKey("totMerchSignature", newSignatureArray);
	} catch(err) {
		SBExtension.alert_debug("setMerchants - total signature loop ERROR! " + err, err);
	}
	delete SBExtension.totalMerchantsReloadInProgress;
};

SBExtension.TabStateHandler.prototype.setMerchants = function(forceReload, newSignature, newCountry, oldCountry, calledForSingleCountry, callback) {
  try {
	if (this.setMerchantsNeverCalled) {
		if (!newSignature) {
			this.convertToMultiMerchantsIfNeeded();
		}
	}
	this.setMerchantsNeverCalled = false;
	var newSignatureArray = (newSignature) ? newSignature : SBExtension.store.retrieveGlobalKey("totMerchSignature");
	if (!calledForSingleCountry && (!newSignatureArray || (typeof newSignatureArray != "object"))) {
		calledForSingleCountry = true;
		if (newSignatureArray && (typeof newSignatureArray=="string") && ((newSignatureArray=newSignatureArray.trim()).charAt(0)=='{')) {
			var newSigArray = JSON.parse(newSignatureArray);
			newSignatureArray = newSigArray;
			calledForSingleCountry = false;
		}
	}
	if (!calledForSingleCountry) {
		if (SBExtension.totalMerchantsReloadInProgress) {
			return false;
		}
		SBExtension.totalMerchantsReloadInProgress = {};
		this.processMerchantCountryLoop(newSignatureArray, forceReload);
		return false;
	}
	//SBExtension.log_debug("In SBExtension.TabStateHandler.prototype.setMerchants: BEFORE SBExtension.store.retrieveGlobalKey(merchantsLastChangeTS ...\r\n");
	if (!oldCountry)
		oldCountry  = SBExtension.store.retrieveGlobalKey("SE_COUNTRY");
	// This whole "merchantLastCountry" business id just to force updating international members as they have been screwed since merchants CDN release...
	var merchantLastCountry  = SBExtension.store.retrieveGlobalKey("merchantLastCountry");
	if (oldCountry==1 && !merchantLastCountry) {
		merchantLastCountry = 1;
	}
	//SBExtension.log_debug("In SBExtension.TabStateHandler.prototype.setMerchants: AFTER SBExtension.store.retrieveGlobalKey(merchantsLastChangeTS ...\r\n");
	var lastChangeTS = SBExtension.store.retrieveGlobalKey("merchantsLastChangeTS_" + merchantLastCountry);
	if (!lastChangeTS)
		lastChangeTS = 0;
	var totMerchSignature = SBExtension.store.retrieveGlobalKey("totMerchSignature");
	var oldSignature = (oldCountry==-1 && totMerchSignature && totMerchSignature[newCountry]) ? ((totMerchSignature[newCountry]==SBExtension.store.retrieveGlobalKey("merchantsSignature_" + ((newCountry)?newCountry:oldCountry))) ? totMerchSignature[newCountry] : null): SBExtension.store.retrieveGlobalKey("merchantsSignature_" + ((newCountry)?newCountry:oldCountry));
	var curCountry = 0;
	if (!newCountry && SBExtension.globalState && SBExtension.globalState.memberInfo) {
			curCountry = SBExtension.globalState.memberInfo.country;
	}
	if (oldCountry!=-1 && (newCountry && (newCountry != oldCountry || (curCountry && newCountry != curCountry)))) {
		oldSignature = null;
	}
	var merchantsFromStore;
	if (forceReload && newSignature && oldSignature==newSignature) {
		// If the new signature is known and the old signature was stored, we shall only actually force reload from the server if they are different
		forceReload = false;
	} else if (!forceReload && ((!merchantLastCountry && oldSignature) || newSignature && newSignature!=oldSignature)) {
		// If there is no signature stored - force reload for the first time...
		forceReload = true;
		if (!newSignature && !merchantLastCountry && oldSignature)
			newSignature = oldSignature;
	}
	if (!newCountry) {
		if (oldCountry) {
			newCountry = oldCountry;
		}
		else if (SBExtension.globalState && SBExtension.globalState.memberInfo && SBExtension.globalState.memberInfo.country) {
			newCountry = SBExtension.globalState.memberInfo.country;
		}
		else {
			newCountry = 1;
		}
	}
	if (!forceReload)
		merchantsFromStore = SBExtension.store.retrieveGlobalKey("merchants_" + newCountry);
	if (forceReload || (!merchantsFromStore && !SBExtension.merchantsReloadInProgress)) { // true) { //
	  try {
		SBExtension.merchantsReloadInProgress = true;
		SBExtension.store.clearKey("merchantsSignature", true);
		var merchantListURL;
		if (newSignature&&newSignature.length && (SBExtension.totalMerchantsReloadInProgress || newSignature!=SBExtension.config.hashMerchant)) {
			merchantListURL = SBExtension.config.getMerchantLoadURL(newCountry, newSignature) + "&lastChgTS=" + lastChangeTS;
		} else {
			merchantListURL = SBExtension.config.getMerchantLoadURL(newCountry, undefined) + "&lastChgTS=" + lastChangeTS;
		}
		if (oldCountry!=-1) {
			SBExtension.store.storeGlobalKey("merchantLastCountry", newCountry);
			if (newCountry!=oldCountry) {
				SBExtension.store.storeGlobalKey("SE_COUNTRY", newCountry);
			}
		}
		//SBExtension.log_debug("In SBExtension.TabStateHandler.prototype.setMerchants: in if (merchantsFromStore BEFORE post...\r\n");
		var ajaxCall = {
		  type: 'GET',
		  url: merchantListURL,
		  success: function (data) {
		   //SBExtension.log_debug("In SBExtension.TabStateHandler.prototype.setMerchants: in if (merchantsFromStore INSIDE post callback; data=[" + data + "]\r\n");
		   try {
			var loaded = false;
			data = data.replace('\t',' ');
			var newMerchants = JSON.parse(data);
			if (newMerchants && newMerchants.lastChangeTS!==undefined) {
				if (newMerchants.lastChangeTS==0 || newMerchants.lastChangeTS > lastChangeTS)
					loaded = true;
				delete newMerchants.lastChangeTS;
			}
			if (loaded) {
				if (newMerchants.signature) {
					newSignature = newMerchants.signature;
					delete newMerchants.signature;
				}
				SBExtension.tabStateHandler.assignMerchants(newMerchants, SBExtension.totalMerchantsReloadInProgress, newCountry);
				SBExtension.store.storeGlobalKey("merchantsSignature_" + newCountry, newSignature);
				SBExtension.store.storeGlobalKey("merchants_" + newCountry, JSON.stringify(newMerchants));
				SBExtension.store.storeGlobalKey("merchantsLastChangeTS_" + newCountry, lastChangeTS);
				SBExtension.store.storeGlobalKey("merchantsNextLoadTS_" + newCountry, "" + (new Date().getTime() + SBExtension.config.merchantsRequestInterval*1000));
				if (!SBExtension.totalMerchantsReloadInProgress) {
					// Mostly - just for backward compatibility...
					var totMerchSignature = SBExtension.store.retrieveGlobalKey("totMerchSignature");
					if (!totMerchSignature) {
						totMerchSignature = {};
					}
					totMerchSignature[newCountry] = newSignature;
					SBExtension.store.storeGlobalKey("totMerchSignature", totMerchSignature)
				}
			}
			SBExtension.merchantsReloadInProgress = false;
			if (callback) {
				callback();
			}
		   } catch(e2) {
			SBExtension.alert_debug("Error processing merchants SUCCESS reponse!!! " + e2, e2);
			SBExtension.merchantsReloadInProgress = false;
			if (callback) {
				callback();
			}
		   }
		  },
		  error: function (data) {
		   try {
			if (SBExtension.config.debugErrorIsEnabled) try {FAKE_ERROR.FAKE_METHOD();} catch(err) {
			  SBExtension.alert_debug("Error loading merchants!!! data=" + JSON.stringify(data), err);}
			SBExtension.merchantsReloadInProgress = false;
			if (callback) {
				callback();
			}
		   } catch(e2) {
			SBExtension.alert_debug("Error processing merchants ERROR reponse!!! " + e2, e2);
			SBExtension.merchantsReloadInProgress = false;
			if (callback) {
				callback();
			}
		   }
		  },
		  crossDomain: true
		};
		$.ajax(ajaxCall);
		return true;
	  } catch(e) {
		SBExtension.alert_debug("Error loading merchants!!! " + e, e);
		SBExtension.merchantsReloadInProgress = false;
	  }
	} else if (merchantsFromStore) {
		SBExtension.alert_debug("In SBExtension.TabStateHandler.prototype.setMerchants: in if (merchantsFromStore INSIDE else...\r\n");
		var newMerchants = JSON.parse(merchantsFromStore);
		this.assignMerchants(newMerchants, SBExtension.totalMerchantsReloadInProgress, newCountry);
	}
  } catch(err) {
	SBExtension.alert_debug('setMerchants: ' + err.message, err);
  }
	return false;
};

SBExtension.TabStateHandler.prototype.onCheckState = function(stateData) {
	SBExtension.bannerComponent.setSpecialCase();
	SBExtension.bannerComponent.setBannerCategory();
	SBExtension.popupComponent.setSearchPopup();
	
	if (stateData.hashAffiliate && stateData.hashAffiliate != SBExtension.config.hashAffiliate) {
		SBExtension.config.hashAffiliate = stateData.hashAffiliate;
		SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - BEFORE SBExtension.tabStateHandler.setAffNetworks!!!");
		this.setAffNetworks(true);
		SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - AFTER SBExtension.tabStateHandler.setAffNetworks!!!");
	}
	if (stateData.totalMerchantHash) {
		// New (multi-country) branch
		var needToSetMerchants = false;
		var dataHashes = stateData.totalMerchantHash;
		if (typeof dataHashes == "string")
			dataHashes = JSON.parse(dataHashes);
		if (SBExtension.config.totalMerchantHash) {
			var oldHashes  = SBExtension.config.totalMerchantHash;
			for (var country in dataHashes) {
				if (dataHashes[country] != oldHashes[country]) {
					needToSetMerchants = true;
					break;
				}
			}
			for (var country in oldHashes) {
				if (dataHashes[country] != oldHashes[country]) {
					needToSetMerchants = true;
					break;
				}
			}
		} else {
			needToSetMerchants = true;
		}
		if (needToSetMerchants) {
			this.setMerchants(true, dataHashes);
		}
	} else if (stateData.hashMerchant  &&  stateData.hashMerchant != SBExtension.config.hashMerchant) {
		// Old (single-country) branch
		SBExtension.config.hashMerchant = stateData.hashMerchant;
		this.setMerchants(true, stateData.hashMerchant);
		SBExtension.alert_debug ("IN SBExtension.UpdateController.prototype.intervalEvent - AFTER SBExtension.tabStateHandler.setMerchants!!!");
	}
};

SBExtension.TabStateHandler.prototype.isMerchantListInitialized = function() {
	if (!this.merchantList)
		return false;
	for (var merchantName in this.merchantList) {
		if ( this.merchantList.hasOwnProperty( merchantName ) ) {
			return true;
		}
	}
	return false;
}

SBExtension.TabStateHandler.prototype.assignMerchants = function(newMerchants, totalMerchantsReloadInProgress, newCountry) {
try {
	if (totalMerchantsReloadInProgress) {
		for (var merchantName in newMerchants) {
			var m = newMerchants[merchantName];
			if (merchantName != "se_coupons") {
				m.country = newCountry;
			}
			oldMerchant = totalMerchantsReloadInProgress[merchantName];
			if (oldMerchant) {
				if (merchantName == "se_coupons") {
					var curCountry = (SBExtension.network.memberInfo) ? SBExtension.network.memberInfo.country : null;
					if (!curCountry) {
						curCountry = (SBExtension.globalState.memberInfo) ? SBExtension.globalState.memberInfo.country : null;
					}
					if (!curCountry) {
						curCountry = SBExtension.store.retrieveGlobalKey("SE_COUNTRY");
					}
					totalMerchantsReloadInProgress[merchantName] = (curCountry && newCountry==curCountry) ? m.concat(oldMerchant) : oldMerchant.concat(m);
				} else {
					SBExtension.log_debug("Duplicate merchant " + merchantName + " in " + newCountry + " and " + oldMerchant.country);
					if (oldMerchant.length) {
						oldMerchant.push(m);
					} else {
						oldMerchant = [oldMerchant, m];
						totalMerchantsReloadInProgress[merchantName] = oldMerchant;
					}
				}
			} else {
				totalMerchantsReloadInProgress[merchantName] = m;
			}
		}
		return;
	}
	
	var mainMerchants = {};
	var specMerchnts = {};
	this.merchantsByID = {};
	this.merchantsByIDSpec = {};
	this.merchantsStartFinalSpecUrl = {};
	this.merchantList = {};
	var storeCouponByIndex = [];
	var featuredMerchant = {};
	var featuredMerchantOrder = {};
	var zeroActivationMerchantIDs = {};
	for (var merchantName in newMerchants) {
	  var mArray = newMerchants[merchantName];
	  var mSz = mArray.length;
	  if (!mSz) {
	    mArray = [mArray];
	    mSz = 1;
	  }
	  for (var mIdx=0; mIdx<mSz; mIdx++) {
		var m = mArray[mIdx];
		if (newCountry && !m.country) {
			m.country = newCountry;
		}
		if (merchantName == "se_coupons") {
			storeCouponByIndex = m;
			continue;
		}
		if (m.aFlag==0) {
			zeroActivationMerchantIDs[m.mID] = true;
			continue;
		}

		if (typeof m.showSearchHint === "undefined") {
			m.showSearchHint = true;
		} else {
			m.showSearchHint = parseInt(m.showSearchHint);
		}

		if (merchantName.indexOf('spec_') > -1) {
			var newMerchantName = merchantName.replace('spec_','');
			specMerchnts[newMerchantName] = m;
			m.nameMerchant = newMerchantName;
			this.merchantsByIDSpec[m.mID] = m;
		} else {
			if (m.hosts && m.hosts.length > 0) {
				for (var index in m.hosts) {
					var host = m.hosts[index];
					var mmArray = mainMerchants[host];
					if (!mmArray) {
						mmArray = m;
					} else {
						if (mmArray.length) {
							mmArray.push(m);
						} else {
							mmArray = [mmArray, m];
						}
					}
					mainMerchants[host] = mmArray;
					SBExtension.tabStateHandler.setMerchantObject(host, m, 0);
				}
			}
			var mmArray = mainMerchants[merchantName];
			if (!mmArray) {
				mmArray = m;
			} else {
				if (mmArray.length) {
					mmArray.push(m);
				} else {
					mmArray = [mmArray, m];
				}
			}
			mainMerchants[merchantName] = mmArray;
			SBExtension.tabStateHandler.setMerchantObject(merchantName, m, 0);
			m.nameMerchant = merchantName;
			if (m.featured > 0) {
				featuredMerchant[m.mID] = m;
				var mOrder = m.featured;
				while (featuredMerchantOrder[mOrder]) {
					mOrder++;
				}
				featuredMerchantOrder[mOrder] = m;
			}
			if (m.dependency == "" || typeof m.dependency == "undefined") {
				this.merchantsByID[m.mID] = m;
			}
			if (m.affStartUrl && m.affFinalUrl) {
				this.merchantsStartFinalSpecUrl[merchantName] = m;
			}
		}
	  }
	}
	var storeCoupon = [];
	for (var idx in storeCouponByIndex) {
		var cpn = storeCouponByIndex[idx];
		var merchant = this.merchantsByID[cpn.mID];
		if (cpn.mID && zeroActivationMerchantIDs[cpn.mID] || !merchant)
			continue;
		cpn.country = merchant.country;
		storeCoupon.push(cpn);
	}
	SBExtension.store.storeGlobalKey("SEFeatureCoupon", JSON.stringify(storeCoupon));

	SBExtension.store.storeGlobalKey("merchantFeatureByOrder", JSON.stringify(featuredMerchantOrder));
	SBExtension.store.storeGlobalKey("merchantFeatureByID", JSON.stringify(featuredMerchant));
	SBExtension.store.storeGlobalKey("merchantByID", JSON.stringify(this.merchantsByID));

	var merchantsSpec = specMerchnts;
	var merchants = mainMerchants;
	this.merchantsByURL = {};
	this.merchantsByURLSpec = {};
	this.lastMerchantAssigned = new Date();
	this.merchantCount = 0;
	var mer = {};
	for (var merchantName in merchants) {
	  var mArray = merchants[merchantName];
	  var mSz = mArray.length;
	  if (!mSz) {
	    mArray = [mArray];
	    mSz = 1;
	  }
	  for (var mIdx=0; mIdx<mSz; mIdx++) {
		var merchant = mArray[mIdx];
		if (!merchant.mURL) {
			continue;
		}
		if (merchant.checkURL && merchant.checkURL.length > 0) {
			mer[merchant.checkURL] = merchantName;
		}
		this.merchantCount++;

		var url = merchant.mURL.trim();
		url = url.replace(/([&?][a-z]*url[a-z]*=[^&]*)/i,'');
		this.merchantsByURL[url] = merchant;
		if (merchant.sURL) {
			url = merchant.sURL.trim();
			url = url.replace(/([&?][a-z]*url[a-z]*=[^&]*)/i,'');
			this.merchantsByURL[url] = merchant;
		}

		url = merchantName;
		SBExtension.tabStateHandler.setMerchantObject(url, merchant, 0);
	  }
	}

	for (var mIndx in mer) {
		var merchantName = mer[mIndx];
		var m = merchants[mIndx];
		if (m) {
			m.dependency = merchantName;
		}
	}
	
	mer = {};
	for (var merchantName in merchantsSpec) {
		var merchant = merchantsSpec[merchantName];
		if (!merchant.mURL) {
			continue;
		}
		if (merchant.checkURL && merchant.checkURL.length > 0) {
			mer[merchant.checkURL] = merchantName;
		}
		this.merchantCountSpec++;
		var urls = merchant.mURL.split(",");
		for (var idx in urls) {
			url = urls[idx].trim().replace(/([&?][a-z]*url[a-z]*=[^&]*)/i,'');
			this.merchantsByURLSpec[url] = merchant;
		}
		if (merchant.sURL) {
			urls = merchant.sURL.split(",");
			for (var idx in urls) {
				url = urls[idx].trim().replace(/([&?][a-z]*url[a-z]*=[^&]*)/i,'');
				this.merchantsByURLSpec[url] = merchant;
			}
		}
		urls = merchantName.split(",");
		for (var idx in urls) {
			merchantsSpec[urls[idx].trim()] = merchant;
			var match = urls[idx].match(/[.]/g);
			var count = (match==null) ? 0 : match.length;
			if (count > 1) {
				//this.merchantHostsSpec[urls[idx].trim()] = merchant;
				this.setMerchantObject(urls[idx].trim(), merchant, 0);
			}
			match = urls[idx].match(/[/]/g);
			count = (match==null) ? 0 : match.length;
			var match2 = urls[idx].match(/:[/][/]/g);
			var count2 = (match2==null) ? 0 : match2.length;
			if (urls[idx].indexOf("?") > 0 || count > 2*count2) {
				//this.merchantURLSpec[urls[idx].trim()] = merchant;
				this.setMerchantObject(urls[idx].trim(), merchant, 0);
			}
		}
	}
	for (var mIndx in mer) {
		var merchantName = mer[mIndx];
		var m = merchantsSpec[mIndx];
		if (m) {
			m.dependency = merchantName;
			////merchantsSpec[mIndx] = m;
			//var matchedBy = mIndx.split(".").length-1;
			this.setMerchantObject(mIndx.trim(), m, 0); //matchedBy);
		}
	}
	SBExtension.MTester.onMercnahtsAssigned(merchants);
} catch(err) {
	SBExtension.alert_debug("assignMerchants: err=" + err, err);
}
};

SBExtension.TabStateHandler.prototype.getMatchedBy = function(url) {
	if (url.indexOf('/')>=0) {
		return 3;
	}
	if (this.getDomainnameFromHost(url) == url) {
		return 1;
	}
	return 2;
}

SBExtension.TabStateHandler.prototype.setMerchantObject = function(url, merchant, matchedBy) {
	if (!matchedBy) {
		matchedBy = this.getMatchedBy(url);
	}
	var domain = SBExtension.tabStateHandler.getDomainname(url);
	//var domain1 = SBExtension.tabStateHandler.getDomainname(url);
	
	var merchantObject = this.merchantList[domain];
	if (!merchantObject) {
		merchantObject = {};
	}
	switch(matchedBy) {
		case 1:
			var merchObj0 = merchantObject[0];
			if (!merchObj0) {
				merchantObject[0] = merchant;
			} else {
				var merchants = [];
				if (!merchObj0.length) {
					if (merchObj0 == merchant) {
						break;
					}
					if (merchObj0.nameMerchant==merchant.nameMerchant && merchObj0.mID==merchant.mID && merchObj0.country==merchant.country) {
						var jsonOld = JSON.stringify(merchObj0);
						var jsonNew = JSON.stringify(merchant);
						if (jsonOld!=jsonNew) {
							SBExtension.log_debug("Merchant " + merchant.nameMerchant + " replaced. Old = " + jsonOld + "; New = " + jsonNew);
						}
						merchantObject[0] = merchant;
						break;
					}
					merchants.push(merchObj0);
					merchants.push(merchant);
				} else {
					var mer = null;
					for (var idx in merchObj0) {
						mer = merchObj0[idx];
						if (mer == merchant) {
							break;
						}
						if (mer.nameMerchant==merchant.nameMerchant && mer.mID==merchant.mID && mer.country==merchant.country) {
							var jsonOld = JSON.stringify(mer);
							var jsonNew = JSON.stringify(merchant);
							if (jsonOld!=jsonNew) {
								console.log("Merchant " + merchant.nameMerchant + " replaced. Old = " + jsonOld + "; New = " + jsonNew);
							}
							merchObj0[idx] = merchant;
							mer = merchant;
							break;
						}
					}
					if (mer == merchant) {
						break;
					}
					merchants = merchObj0;
					merchants.push(merchant);
				}
				merchantObject[0] = merchants;
			}
			break;
		case 2:
			var hosts = merchantObject[1];
			if (!hosts) {
				hosts = {};
			}
			for (var host in hosts) {
				if (url == host) {
					return;
				}
			}
			hosts[url] = merchant;
			merchantObject[1] = hosts;
			break;
		case 3:
			var urls = merchantObject[2];
			if (!urls) {
				urls = {};
			}
			for (var urlStr in urls) {
				if (url == urlStr) {
					return;
				}
			}
			urls[url] = merchant;
			merchantObject[2] = urls;
			break;
	}

	this.merchantList[domain] = merchantObject;
}

SBExtension.TabStateHandler.prototype.getNewTab = function(tabId, url, frameId) {
	if (frameId != 0) {
		return;
	}
	var tab = this.getTabByTabId(tabId, url);
	if (tab) {
		tab.clean();
		tab.setUrl(url);
		tab.saveInStore();
	}
};

SBExtension.TabStateHandler.prototype.setTabToObj = function(tabId, url) {
	var domain = this.getDomainname(url);
	if (domain.indexOf("data:image") == 0 || domain == "about:blank") {
		return;
	}
	var tab = this.getTabByTabId(tabId, "");
	if (!url) {
		url = "";
	}
	if (tab) {
		tab.setUrl(url);
		tab.save();
	}
};

SBExtension.TabStateHandler.prototype.fetchTabReferrer = function(tabId) {
	var tab = this.getTabByTabId(tabId, "");
	if (tab) {
		tab.getReferrer(tabId);
	}
};

SBExtension.TabStateHandler.prototype.setTabReferrer = function(tabId, url) {
	var referrer = this.getDomainname(url);
	if ( referrer == SBExtension.config.sbDomainName ) {
		var tab = this.getTabByTabId(tabId, "");
		tab.referrer = referrer;
		tab.saveInStore();
	}
};

SBExtension.TabStateHandler.prototype.setAffToTab = function(tabId, url) {
	var domain = this.getDomainname(url);
	if (domain.indexOf("data:image") == 0 || domain == "about:blank" || SBExtension.config.isDomainNameReserved(domain)) {
		return;
	}
	var tab = this.getTabByTabId(tabId, "");
	if (tab) {
		var old = tab;
		tab.addAff(domain);
		tab.saveInStore();
	}
};

SBExtension.TabStateHandler.prototype.getObjectByHost = function(urlDomain, urlURL, tab, urlHost, matchedBy) {
	var url;
	if (!urlHost && urlURL) {
		urlHost = this.getHostname(urlURL);
	}
	var domainMatchedBy = (matchedBy) ? ((matchedBy.matchedByURL) ? 3 : ((matchedBy.matchedByHost) ? 2 : ((matchedBy.matchedByDomain) ? 1 : 0))) : 0;
	if (tab) {
		if (domainMatchedBy == 0 && tab.matchedBy > 0) {
			domainMatchedBy = tab.matchedBy;
		}
		var host = tab.host;
		var merchant =  SBExtension.tabStateHandler.getMerchantByID(tab.merchantID);
		var merchantMatchedBy = 0;
		if (!merchant) {
			var merchantMatchedByObj = {};
			merchant = SBExtension.tabStateHandler.getMerchantByUrl(urlURL, ((urlHost) ? urlHost : urlDomain), urlDomain, merchantMatchedByObj);
			if (merchant) {
				merchantMatchedBy = (merchant.matchedBy) ? merchant.matchedBy : (merchantMatchedByObj.matchedByURL) ? 3 : ((merchantMatchedByObj.matchedByHost) ? 2 : ((merchantMatchedByObj.matchedByDomain) ? 1 : 0));
			}
		}
		var checkMerchant = null;
		if (merchant && merchant.checkURL) {
			//checkMerchant = this.merchants[merchant.checkURL];
			checkMerchant = SBExtension.tabStateHandler.getMerchantByUrl(null, merchant.checkURL);
		}
		var dependencyMerchant = null;
		if (merchant && merchant.dependency) {
			//dependencyMerchant = this.merchants[merchant.dependency];
			dependencyMerchant = SBExtension.tabStateHandler.getMerchantByUrl(null, merchant.dependency);
		}
		
		if (merchant && merchant.checkURL && !checkMerchant) {
			var mhost = SBExtension.tabStateHandler.getHostname(merchant.checkURL);
			var domain =  SBExtension.tabStateHandler.getDomainnameFromHost(mhost);
			var checkMerchant = SBExtension.tabStateHandler.getMerchantByUrl("", mhost, domain);
			var mUrl = merchant.nameMerchant;
			if (mUrl[mUrl.length-1] == '/') {
				mUrl = mUrl.substr(0, mUrl.length-1);
			}
			
			var index = -1;
			if (urlURL) {
				index = urlURL.indexOf(mUrl);
			} else {
				index = tab.url.indexOf(mUrl);
			}
			
			if (!checkMerchant && index > 0 && index < 13) {
				merchantMatchedBy = merchant.matchedBy ? merchant.matchedBy : merchantMatchedBy;
				urlDomain = (!merchantMatchedBy || merchantMatchedBy==1) ? merchant.nameMerchant : "";
				urlHost = (!merchantMatchedBy || merchantMatchedBy==2) ? merchant.nameMerchant : "";
				urlURL = (!merchantMatchedBy || merchantMatchedBy==3) ? merchant.nameMerchant : "";
				domainMatchedBy = merchantMatchedBy;
			}
		} else if (merchant && urlURL && (checkMerchant || dependencyMerchant) 
		           && (merchant.checkURL.indexOf('affiliatetechnology') >= 0 || merchant.nameMerchant.indexOf('affiliatetechnology') >= 0) 
		           && (merchant.dependency == urlURL || merchant.checkURL == urlURL || merchant.nameMerchant == urlURL)) {
			//urlDomain = urlURL;
			domainMatchedBy = 3;
		}
	}
	
	var obj = null;
	if (urlURL && (!domainMatchedBy || domainMatchedBy==3)) {
		var mUrl = merchant ? merchant.nameMerchant : urlURL;
		obj = SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixObj + mUrl);
		if (obj) {
			domainMatchedBy = 3;
		}
	}
	if (!obj && urlHost && (!domainMatchedBy || domainMatchedBy==2)) {
		if (merchant && merchant.hosts && merchant.hosts.indexOf(urlHost)>=0) {
			obj = SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixObj + merchant.nameMerchant);
		}
		if (!obj) {
			obj = SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixObj + urlHost);
		}
		if (obj)
			domainMatchedBy = 2;
	}
	if (!obj && urlDomain && (!domainMatchedBy || domainMatchedBy==1)) {
		obj = SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixObj + urlDomain);
		if (obj)
			domainMatchedBy = 1;
	}
	domObj = new SBExtension.Domain(urlDomain, urlHost, urlURL, domainMatchedBy, obj, (merchant) ? merchant.mID : undefined);
	if (merchant && domainMatchedBy==3)
		domObj.mUrl = merchant.nameMerchant;
	return domObj;
};

SBExtension.TabStateHandler.prototype.getObjectByHostDependency = function(urlDomain, urlURL, mID) {
	var obj = null;
	var matchedBy = 0;
	if (urlURL) {
		obj = SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixObj + urlURL);
		matchedBy = 3;
	}
	if (!obj) {
		var urlHost = this.getHostname(urlURL);
		obj = SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixObj + urlHost);
		matchedBy = 2;
	}
	if (!obj) {
		obj = SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixObj + urlDomain); // Now - by domain !!!
		matchedBy = 1;
	}
	var domObj = null;
	if (obj) {
		// TODO -- check that it's OK to set isFirstGreen and specAffStartUrl attrs inside the constructor...
		domObj = new SBExtension.Domain(urlDomain, urlHost, urlURL, matchedBy, obj, mID);
	}
	return domObj;
};

SBExtension.TabStateHandler.prototype.getTabByTabId = function(tabId, url, callback) {
	var tab = SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixTab + tabId);
	//SBExtension.alert_debug("#### SBExtension.TabStateHandler.prototype.getTabByTabId: tabId=" + tabId + "; url = " + JSON.stringify(url) + "; tab = " + JSON.stringify(tab), new Error());
	var tb;
	if (!tab && url != "") {
		tab = new SBExtension.TabObject(tabId);
		tab.saveInStore();
		this.getNewTab(tabId, url, 0)
		tb = tab;
	} else {
		if (!tab) {
			tb = null;
		} else {
			tb = new SBExtension.TabObject(tabId);
			tb.instanceID = tab.instanceID;
			tb.url = tab.url;
			tb.host = tab.host;
			tb.domain = tab.domain;
			tb.matchedBy = tab.matchedBy
			tb.oldHost = tab.oldHost;
			tb.referrer = tab.referrer;
			tb.dirty = tab.dirty;
			tb.affMerch = tab.affMerch;
			tb.store = tab.store;
			tb.forceGreenState = tab.forceGreenState;
			tb.initialization = tab.initialization;
			
			tb.lastUserSelTS = tab.lastUserSelTS;
			tb.lastUserSelMenuItem = tab.lastUserSelMenuItem;
			tb.lastVisitedPageTS = tab.lastVisitedPageTS;
			tb.lastVisitedPageMenuItem = tab.lastVisitedPageMenuItem;
			tb.currentMenuSubItem = tab.currentMenuSubItem;
			tb.stateArray = tab.stateArray;
			
			tb.merchantID = tab.merchantID;
			tb.under_section = tab.under_section;
			tb.section = tab.section;
			
			tb.selectionPriority = tab.selectionPriority; 
			tb.selectionMethod = tab.selectionMethod; 
			tb.curMenuItemIndex = tab.curMenuItemIndex;
			tb.bannerEnabled = tab.bannerEnabled;
			tb.isMainFrameMerchant = tab.isMainFrameMerchant;
		}
	}
	if (callback) {
		callback(tb);
	}
	return tb;
};

SBExtension.TabStateHandler.prototype.getStateByTabId = function(tabId, tabActivated, loginStateChanged, curMsgID, doc, click) {
	// Store "Live" cookie first!
	this.reportLiveState();
	var tab = this.getTabByTabId(tabId, "");
	if (tab && tab.host) {
		var domObj = this.getObjectByHost(tab.domain, tab.url, tab, tab.host, tab.matchedBy);
		var mustSend = true;
		var nowTS = (new Date()).getTime();
		if (!this.lastTabStateSent[tabId]) {
			this.lastTabStateSent[tabId] = {};
		} else {
			var lastTabStateSent = this.lastTabStateSent[tabId];
			if (nowTS-lastTabStateSent.ts<1000 && lastTabStateSent.domObj==JSON.stringify(domObj) && lastTabStateSent.tabActivated==tabActivated && lastTabStateSent.loginStateChanged==loginStateChanged && lastTabStateSent.click==JSON.stringify(click)) {
				mustSend = false;
			}
		}
		this.lastTabStateSent[tabId] = {ts:nowTS, domObj:JSON.stringify(domObj), tabActivated:tabActivated, loginStateChanged:loginStateChanged, click:JSON.stringify(click)};
		if (mustSend) domObj.sendState(tabId, tabActivated, SBExtension.globalState.loginState, true, undefined, curMsgID, doc, click);
		return domObj.state;
	} else {
		var domObj = this.getObjectByHost("");
		domObj.sendState(tabId, tabActivated, (loginStateChanged) ? SBExtension.globalState.loginState : undefined, undefined, undefined, curMsgID, doc);
		return -1;
	}
};

SBExtension.TabStateHandler.prototype.getClickStateByTabId = function(tabId) {
	var tab = this.getTabByTabId(tabId, "");
	if (!tab) {
		return 0;
	}
	var domObj = this.getObjectByHost(tab.domain, tab.url, tab, tab.host,tab.matchedBy);
	if (!domObj) {
		return 0;
	}
	return domObj.state;
};

SBExtension.TabStateHandler.prototype.getClickAffByTabId = function(tabId) {
	var tab = this.getTabByTabId(tabId, "");
	var domObj = this.getObjectByHost(tab.host, tab.url);
	return domObj.isAffiliate;
};

SBExtension.TabStateHandler.prototype.getClickRestoreByTabId = function(tabId) {
	var tab = this.getTabByTabId(tabId, "");
	var domObj = this.getObjectByHost(tab.host, tab.url);
	return domObj.restore;
};

SBExtension.TabStateHandler.prototype.getMerchantByTabId = function(tabId) {
	var tab = this.getTabByTabId(tabId, "");
	var mer = this.getMerchantByTab(tab);
	return mer;
};

SBExtension.TabStateHandler.prototype.getMerchantByTab = function(tab) {
	var mer;
	if (tab && tab.url) {
		mer = this.getMerchantByUrl(tab.url);
	}
	//if (tab && !mer) {
	//	url = tab.host;
	//	mer = this.merchants[url];
	//}
	return mer;
};

SBExtension.TabStateHandler.prototype.getMid = function(tabId) {
	var mer = this.getMerchantByTabId(tabId);
	if (mer && mer.aFlag != 0) {
		return mer.mID;
	}
	return 0;
};

SBExtension.TabStateHandler.prototype.getStartUrl = function(tabId) {
	var tab = this.getTabByTabId(tabId, "");
	var domObj = this.getObjectByHost(tab.host, tab.url);
	if (domObj) {
		return domObj.urlAff;
	}
	return "";
};

SBExtension.TabStateHandler.prototype.getBackgroundURL = function(tabId) {
	var tab = this.getTabByTabId(tabId, "");
	var mer = this.getMerchantByTab(tab);
	var domObj = this.getObjectByHost(tab.host, tab.url);
	if (domObj && mer && mer.param.length > 0) {
		var params = mer.param.split('@');
		var pUrl = "";
		
		if (params.length > 0) {
			for (var i in params) {
				pUrl += '&' + params[i];
			}
			var url = '';
			if (pUrl.indexOf('?') > -1) {
				url = 'http://' + domObj.host + '/' + pUrl.substring(1);
			} else {
				url = 'http://' + domObj.host + '/?' + pUrl.substring(1);
			}
			return url;
		}
	}
	return "";
};

SBExtension.TabStateHandler.prototype.getMUrl = function(tabId) {
	var mer = this.getMerchantByTabId(tabId);
	if (mer) {
		return mer.mURL;
	}
	return null;
};

SBExtension.TabStateHandler.prototype.removeTabId = function(tabId) {
	var tab = this.getTabByTabId(tabId, "");
	if (tab && tab.host) {
		var obj = this.getObjectByHost(tab.host, tab.url);
		var old = obj;
		obj.removeTab(tabId);
		obj.save();
		tab.remove();
	}
};

SBExtension.TabStateHandler.prototype.onRequestStarted = function(request, curTabID, requestURL, id) {
	if (!SBExtension.config.debugIsEnabled)
		return;
	var realID = curTabID+'@'+requestURL;
	activeRequests[realID] = request;
	return realID;
};

SBExtension.TabStateHandler.prototype.getRequestID = function(request, curTabID, requestURL) {
	return curTabID+'@'+requestURL;
};

SBExtension.TabStateHandler.prototype.onRequestStopped = function(id, curTabID, requestURL) {
	if (!SBExtension.config.debugIsEnabled)
		return;
	delete activeRequests[curTabID+'@'+requestURL];
};

SBExtension.TabStateHandler.prototype.getRequest = function(id, url) {
	var reqObj = SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixRequest + id);
	var req;
	if (reqObj) {
		req = new SBExtension.Request(reqObj.id, reqObj.startURL, reqObj.redirect);
		req.tabId = reqObj.tabId;
		req.altTabId = reqObj.altTabId;
		req.type = reqObj.type;
	} else {
		req = new SBExtension.Request(id, url, []);
	}
	return req;
};

SBExtension.TabStateHandler.prototype.getMerchantFromSBUrl = function(url) {
	if (!url) {
		return null;
	}
	var domain = SBExtension.tabStateHandler.getDomainname(url);
	if (SBExtension.config.sbDomainName != domain) {
		return null;
	}
	var parts = url.split('?');
	if (parts.length < 2) {
		return null;	
	}
	var params = parts[1].split('&');
	for (var ind in params) {
		var param = params[ind];
		var p = param.split('=');
		if (p[0] == "merchant" || p[0] == "merchantID") {
			var id = parseInt(p[1]);
			if (id > 0) {
				return this.merchantsByID[id];
			}
		}
	};
}

SBExtension.TabStateHandler.prototype.calculateState = function(req) {
	var matchedBy = {};
	var merchant = this.getMerchantFromSBUrl(req.startURL);
	var merchantMatchedBy = this.getMerchantByUrl(req.finalURL, req.finalURLhost, req.finalURLdomain, matchedBy);
	merchant = merchant || merchantMatchedBy;
	if (!merchant) {
		var domain = this.getObjectByHost(req.finalURLdomain);
		domain.calculateState(req);
	} else {
		var tab = this.getTabByTabId(req.tabId);
		var altTab;
		if (req.altTabId) {
			altTab = this.getTabByTabId(req.altTabId);
			if (altTab && altTab.merchantID) {
				tab = altTab;
			}
		}
		var domain = this.getObjectByHost(req.finalURLdomain, req.finalURL, tab, req.finalURLhost, matchedBy); //this.getObjectByHost(req.finalURLhost, url, tab);
		domain.calculateState(req);
	}
};

SBExtension.TabStateHandler.prototype.reportLiveState = function(callback) {
    if (callback || !SBExtension.browser.executeAjaxCallCount) {
        this.doReportLiveState(callback);
    } else {
        var this_ = this;
        setTimeout(function () {
            this_.doReportLiveState();
        }, 0);
    }
};

SBExtension.TabStateHandler.prototype.doReportLiveState = function(callback) {
  	SBExtension.alert_debug('!!! SBExtension.TabStateHandler.prototype.reportLiveState - STARTED!!!');
	SBExtension.browser.getVersion(function(version) {
  		SBExtension.alert_debug('!!! SBExtension.TabStateHandler.prototype.reportLiveState - SBExtension.browser.getVersion callback with version=' + version);
		var cookie = {};
		cookie.url = "http://" + SBExtension.config.cookieHostName;
		cookie.value = "Live@" + ((new Date()).getTime()/1000) + "@" + version;
		var cookie0 = {};
		cookie0.url = "http://" + SBExtension.config.cookieHostName;
		// Store short-lived (30sec) extn presence cookie for Toolbar (SE_Live) - so we can catch installs/uninstalls WITHIN toolbar!
		cookie0.name = ((SBExtension.config) ? SBExtension.config.keyPrefixCookie : "SE_") + "Live";
		cookie0.value = "Live@" + ((new Date()).getTime()/1000) + "@" + version;
		cookie0.expirationDate = (new Date().getTime()/1000) + 31;
		SBExtension.browser.setCookie(cookie0, true);
  		SBExtension.alert_debug('!!! SBExtension.TabStateHandler.prototype.reportLiveState - SBExtension.browser.getVersion callback WILL STORE SE_LAST_LIVE_TS with value ' + cookie.value);
		SBExtension.store.storeGlobalKey("SE_LAST_LIVE_TS", cookie.value);

		// Expire the cookie that we are NOT using anymore...
		cookie.name = "SE_LastLiveTS";
		cookie.expirationDate = (new Date().getTime()/1000) - 1;
		SBExtension.browser.setCookie(cookie, true);

		// Now - store GLOBAL STATE record (SSE_LastLiveTS, containing both TS and TBID) - to catch installs and uninstalls and send them to the server
		var standAlone = 8;
		var stateRecord = {
			ts: Math.floor(((new Date()).getTime()/1000)),
			version: version,
			tbid: SBExtension.store.getTbUID(),
			flag: 4|standAlone|SBExtension.browser.getBrowserStatsFlag()|((SBExtension.network.getCurrentMemberID()>0)?1:0)
		};
		SBExtension.store.storeGlobalKey("SSE_LastLiveTS", stateRecord);
		var standAlone = 0;
		SBExtension.browser.getConduitToolbarAddonsToUninstall(
			function(addonsToRemove) {
				standAlone = (addonsToRemove.length>0) ? 0 : 8;
				stateRecord.flag = 4|standAlone|SBExtension.browser.getBrowserStatsFlag()|((SBExtension.network.getCurrentMemberID()>0)?1:0);
				SBExtension.store.storeGlobalKey("SSE_LastLiveTS", stateRecord);
				if (callback)
					callback(cookie);
			}, true);
	});
};

SBExtension.TabStateHandler.prototype.LoadAffMerchantsNow = function() {
	//this.initMerchants(true);
	var merchantsNextLoadTS = SBExtension.store.retrieveGlobalKey("merchantsNextLoadTS");
	var delta = merchantsNextLoadTS-new Date().getTime();
	if (isNaN(delta) || delta < 15000)
		delta = 15000;
	var this_ = this;
	setTimeout(function() {this_.LoadAffMerchants()}, delta);
};

SBExtension.TabStateHandler.prototype.LoadAffMerchants = function() {
	var merchantsNextLoadTS = SBExtension.store.retrieveGlobalKey("merchantsNextLoadTS");
	var this_ = this;
	if (!merchantsNextLoadTS || merchantsNextLoadTS <= new Date().getTime())
		this.LoadAffMerchantsNow();
	else
		setTimeout(function() {this_.LoadAffMerchantsNow()}, merchantsNextLoadTS-new Date().getTime());
};

SBExtension.TabStateHandler.prototype.init = function() {
	if (SBExtension.cookiesInitialized) {
		this.LoadAffMerchants();
	}
};

SBExtension.tabStateHandler = new SBExtension.TabStateHandler();
SBExtension.tabStateHandler.init();
SBExtension.tabStateHandler.setAffNetworks(true);
