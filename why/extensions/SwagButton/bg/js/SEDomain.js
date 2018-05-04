// This is the domain/url -related object

SBExtension.Domain = function(domain, host, url, matchedBy, obj, mID) {
	this.count = 0; //(obj) ? obj.count : 0;
	this.restore = (obj) ? obj.restore : 0;
	this.cookie = (obj) ? obj.cookie : false;
	this.isFirstGreen = (obj) ? obj.isFirstGreen : false;
	this.isFirstGreenAcked = (obj) ? obj.isFirstGreenAcked : undefined;
	this.intervalId = (obj) ? obj.intervalId : null;
	this.urlAff = (obj) ? obj.urlAff : "";
	this.isAffiliate = (obj) ? obj.isAffiliate : 0;
	this.mUrl = (obj) ? obj.mUrl : null;
	mID = (!mID && obj) ? obj.mID : mID;
	if (obj) {
		this.setHost(obj.domain, obj.host, obj.urlURL, obj.matchedBy, mID);
	} else {
		this.setHost(domain, host, url, matchedBy, mID);
	}
	this.greenPopUp = (obj) ? obj.greenPopUp : false;
	this.everGreen = (obj) ? obj.everGreen : false;
	this.setStateValue((obj) ? obj.state : 0);
	this.tabs = (obj) ? obj.tabs : [];
	this.reload = (obj) ? obj.reload : true;
	this.setTimeoutTime = (obj) ? obj.setTimeoutTime : 0;
	this.specAffStartUrl = (obj) ? obj.specAffStartUrl : null;
};

SBExtension.Domain.prototype.setStateValue = function(stateValue) {
	this.state = stateValue;
};

SBExtension.Domain.prototype.setHost = function(domain, host, url, matchedBy, mID) {
	this.mID = mID;
	if (!matchedBy && !host) {
		this.host = domain;
		this.domain = domain;
		delete this.urlURL;
		this.matchedBy = 0;
	} else {
		this.host = (host) ? host : ((url) ? SBExtension.tabStateHandler.getHostname(url) : ((domain) ? domain : host));
		this.domain = (domain) ? domain : ((url) ? SBExtension.tabStateHandler.getDomainname(url) : ((host) ? SBExtension.tabStateHandler.getDomainnameFromHost(host) : domain));
		this.urlURL = url;
		this.matchedBy = matchedBy; // 1, 2, 3 - domain, host, url; 0 - no match
	}
};

SBExtension.Domain.prototype.getDomain = function() {
	return this.domain;
}

SBExtension.Domain.prototype.getHost = function() {
	return this.host;
}

SBExtension.Domain.prototype.getMatch = function() {
	switch(this.matchedBy) {
		case 1:
			return this.domain;
		case 2:
			return this.host;
		case 3:
			return this.mUrl ? this.mUrl : this.urlURL;
		default:
			return this.host;
	}
};

SBExtension.Domain.prototype.addTab = function(tabId) {
	if (this.tabs.indexOf(tabId) < 0) {
		this.tabs.push(tabId);
	}
};

SBExtension.Domain.prototype.removeTab = function(tabId) {
	if (this.tabs.indexOf(tabId)  > -1) {
		this.tabs.splice(this.tabs.indexOf(tabId),1);
	}
};

SBExtension.Domain.prototype.save = function() {
	if (this.state=="0") {
		return;
	}
	SBExtension.store.storeGlobalKey(SBExtension.config.keyPrefixObj + this.getMatch(), this);
};

SBExtension.Domain.prototype.reSetMerchant = function(merchant){
	this.mID = merchant.mID;
	for (var i in this.tabs) {
		var tabId = this.tabs[i];
		var tb = SBExtension.tabStateHandler.getTabByTabId(tabId, "");
		if(tb){
			tb.merchantID = merchant.mID;
			tb.saveInStore();
		}
	}
};

SBExtension.Domain.prototype.syncDomainState = function() {
	SBExtension.browser.syncDomainState();
};

SBExtension.Domain.prototype.calculateState = function(req) {
    // FIRST - the stupid brain-dead way to deal with those idiotic fantom tabs that IE may create and use...
    // [God bless their souls there in Seattle...]
    var altTabId = req.altTabId;
    if (altTabId && altTabId > 0 && altTabId != req.tabId) {
        this.doCalculateState(req, altTabId);
    }
    // Now - the "normal" way...
    this.doCalculateState(req, req.tabId);
};

SBExtension.Domain.prototype.checkSwagbuckMerchantLink = function(req, merchant, tb){
    var res = (req.finalURLdomain==this.domain && (!merchant || !tb || (req.type=="main_frame" || this.domain==tb.domain || merchant.dependency==tb.domain))) &&
           (SBExtension.config.sbDomainName != this.domain || req.finalURLdomain != SBExtension.config.sbDomainName);
    return res;
}

SBExtension.Domain.prototype.doCalculateState = function(req, tabId) {
	var tb = SBExtension.tabStateHandler.getTabByTabId(tabId);
	var matchedBy = {};

	var merchant = SBExtension.tabStateHandler.getMerchantFromSBUrl(req.startURL);
	if (!merchant) {
		merchant = SBExtension.tabStateHandler.getMerchantByUrl(req.finalURL, req.finalURLhost, req.finalURLdomain, matchedBy, req.startURL, req);
	}
	if (merchant && !this.checkSwagbuckMerchantLink(req, merchant, tb)) {
		merchant = null;
	}

	var startMerchant = null;
	var tbMerchantID = tb.merchantID;

	var isSetMerch = false;
	var oldState;
	if(tb && merchant){
		merchant.type = req.type;
		var checkURL = merchant.checkURL;
		if(checkURL){
			var domain =  SBExtension.tabStateHandler.getDomainname(checkURL);
			var host = SBExtension.tabStateHandler.getHostname(checkURL);
			var checkMerchant = SBExtension.tabStateHandler.getMerchantByUrl("", host, domain);
			var mUrl = merchant.nameMerchant;
			if(mUrl[mUrl.length-1] == '/'){
				mUrl = mUrl.substr(0, mUrl.length-1);
			}
			var index = this.getMatch().indexOf(mUrl);
			if (!checkMerchant && index > 0 && index < 13) {
				var merchantMatchedBy = (matchedBy.matchedByURL) ? 3 : ((matchedBy.matchedByHost) ? 2 : ((matchedBy.matchedByDomain) ? 1 : 0));
				if (merchantMatchedBy==3) {
					var merchantDomain =  SBExtension.tabStateHandler.getDomainname(merchant.nameMerchant);
					var merchantHost = SBExtension.tabStateHandler.getHostname(merchant.nameMerchant);
					this.setHost(merchantDomain, merchantHost, merchant.nameMerchant, merchantMatchedBy, merchant.mID);
				} else if (merchantMatchedBy==2) {
					var merchantDomain = SBExtension.tabStateHandler.getDomainnameFromHost(merchant.nameMerchant);
					this.setHost(merchantDomain, merchant.nameMerchant, undefined, merchantMatchedBy, merchant.mID);
				} else if (merchantMatchedBy==1) {
					var merchantDomain = SBExtension.tabStateHandler.getDomainnameFromHost(merchant.nameMerchant);
					this.setHost(merchant.nameMerchant, merchant.nameMerchant, undefined, merchantMatchedBy, merchant.mID);
				} else {
					this.setHost(merchant.nameMerchant);
					this.mID = merchant.mID;
				}
			}
		}
		if(req.startURL){
			startMerchant = SBExtension.tabStateHandler.getSwagbuckMerchantLink(req.startURL);
			var changedMerchantID = tb.setMerchantByDomainObject(merchant, this, true);
			var tabMerchant =  SBExtension.tabStateHandler.getMerchantByID(changedMerchantID); //tb.merchantID);
			if(merchant && merchant.dependency != undefined && tabMerchant.mID == merchant.mID && merchant.dependency.length > 0){
				merchant = merchant;
			} else
			if(startMerchant){
				merchant = startMerchant;
				if (req.type == 'main_frame') {
					tb.hardSetMerchant(merchant);
					tb.saveInStore();
				}
				isSetMerch = true;
				oldState = this.state;
				this.reload = true;
				this.setStateValue(merchant.aFlag);
			}
		}
		if (!isSetMerch) {
			var shouldAssignMerchantToTab = (req.type=="main_frame"); // || (req.type == "sub_frame" && req.startURL && req.startURL.indexOf("/shopredir?merchant="+merchant.mID)>=0));
			//var shouldAssignMerchantToTab = false;
			var changedMerchantID = tb.setMerchantByDomainObject(merchant, this, !shouldAssignMerchantToTab);
			if (tbMerchantID != changedMerchantID && req.type == 'main_frame') { //tb.merchantID) {
				tb.saveInStore();
			}
			var tabMerchant =  SBExtension.tabStateHandler.getMerchantByID(changedMerchantID); //tb.merchantID);
			if (tabMerchant) {
				if (merchant && merchant.dependency != undefined && tabMerchant.mID == merchant.mID && merchant.dependency.length > 0) {
					merchant = merchant;
				} else {
					merchant = tabMerchant;
				}
			}
		}
		
	}
	var state = 0;
	var syncDomainStateIsNeeded = false;
	var mainframeReqTabId = (req.type == 'main_frame') ? tabId : -1;
	var host = this.getHost();
	var iconActivated = false;
	if (merchant && this.matchedBy > 0) { //(merchant.nameMerchant == host || merchant.dependency == host)) {
		SBExtension.store.storeGlobalKey(SBExtension.config.keyPrefixActivate + merchant.mID, 0);
		if(this.specAffStartUrl != null){
			req.redirect.push(this.specAffStartUrl);
			this.specAffStartUrl = null;
		}
		var stateObj = new SBExtension.MerchantStats().getState();
		var oldAffiliate = this.isAffiliate;
		if(req.startURL && SBExtension.tabStateHandler.isSwagbuckMerchantLink(req.startURL, merchant)){
			this.reSetMerchant(merchant);
			this.restore = 0;
			state = 7;
			SBExtension.store.storeGlobalKey(SBExtension.config.keyPrefixActivate + merchant.mID, 1);
			mainframeReqTabId = tabId;
			if(this.state + '' != merchant.aFlag || isSetMerch && oldState + '' != merchant.aFlag ) {
				iconActivated = this.calculateGlobalTransition(mainframeReqTabId, merchant.mID, state);
			}
			if(merchant.aFlag == this.state || this.state == 0 || isSetMerch && (merchant.aFlag == oldState || oldState == 0)) {
				stateObj.addActivation(-100, state, this.isAffiliate, oldAffiliate, null, this.restore, merchant.mID, this.urlAff);
			}
			this.urlAff = "";
			this.isAffiliate = 0;
			syncDomainStateIsNeeded = true;
		}else{
			if (req.startURL)
				req.redirect.push(req.startURL);
			else
				req.startURL = '';
			for (var i in req.redirect) {
				redir = SBExtension.tabStateHandler.getHostname(req.redirect[i]);
				var redirAff = SBExtension.tabStateHandler.affiliate[redir];
				if (!redirAff) {
					redir = SBExtension.tabStateHandler.getDomainname(req.redirect[i]);
					redirAff = SBExtension.tabStateHandler.affiliate[redir];
				}
				if (!redirAff) {
					for (var affUrlDB in SBExtension.tabStateHandler.affiliate) {
						if (req.redirect[i].indexOf(affUrlDB) != -1) {
							redirAff = req.redirect[i];
							break;
						}
					}
				}
				if (redirAff) {
					var startDomainName = SBExtension.tabStateHandler.getDomainname(req.startURL);
					var startIsSwagbucksDomain = SBExtension.config.isSwagbucksDomainName(startDomainName);
					mainframeReqTabId = tabId;
					state = (startIsSwagbucksDomain) ? 7 : 1
					if (state == 1) {
						this.isAffiliate = 1;
						this.urlAff = req.startURL;
						if (merchant.aFlag == this.state || this.state == 0 || isSetMerch && (merchant.aFlag == oldState || oldState == 0)) {
							var stTB = -100;
							if (this.state == 7 || isSetMerch && (oldState == 7)) {
								stTB = 7;
							}
							if (merchant.aFlag == 0) {
								state = 0;
							}
							stateObj.addActivation(stTB, state, oldAffiliate, this.isAffiliate, null, this.restore, merchant.mID, this.urlAff);
						}else{
							stateObj.addActivation(this.state, state, this.isAffiliate, 1, null, this.restore, merchant.mID, this.urlAff);
						}
						syncDomainStateIsNeeded = true;
					}else{
						if(mainframeReqTabId > 0  &&  (this.state + '' != merchant.aFlag && this.state != 5) || (isSetMerch && (oldState + '' != merchant.aFlag && oldState != 5))){
							iconActivated = this.calculateGlobalTransition(mainframeReqTabId, merchant.mID, state);
						}
					}
					SBExtension.store.storeGlobalKey(SBExtension.config.keyPrefixActivate + merchant.mID, state == 7 ? 1 : 0);
					break;
				}
			}
		}
		if (this.state == 0 && state == 0 && (merchant.aFlag == this.state || this.state == 0)  ||  isSetMerch && (oldState == 0 && state == 0 && (merchant.aFlag == oldState || oldState == 0))) {
			var st = merchant.aFlag;
			if(this.state + '' == '0'){
				st = (merchant.aFlag==7) ? 5 : merchant.aFlag;
			}
			stateObj.addActivation(-100, st, this.isAffiliate, oldAffiliate, null, this.restore, merchant.mID, null);
			syncDomainStateIsNeeded = true;
		}
		
		if (state == 7 && (this.state != 7 || isSetMerch && (oldState != 7))) {
			// We will RELOAD all tabs with THAT domain - to ensure we can safely set the [new] state to GREEN inside them !!!
			SBExtension.store.storeGlobalKey(SBExtension.config.keyPrefixActivate + merchant.mID, 1);
			this.restore = 0;
			this.setStateValue(state);
			mainframeReqTabId = tabId;
			if (mainframeReqTabId > 0)
				iconActivated = this.calculateGlobalTransition(mainframeReqTabId, merchant.mID, state);
			this.save();
			if(merchant.dependency){
				this.reload = false;
			}
			if (this.reload) {
				this.reload = false;
				var this_ = this;
				setTimeout(function(){
					var host = this_.getHost();
					for (var i in this_.tabs) {
						var tbId = this_.tabs[i];
						var t = SBExtension.tabStateHandler.getTabByTabId(tbId, "");
						if(!t){
							this_.removeTab(tbId);
							continue;
						}
						if(tbId != mainframeReqTabId && t.host == host){
							this_.reloadTab(tbId)
						}
					}
				},150);
			}
			if (mainframeReqTabId>0) {
				this.sendState(mainframeReqTabId, undefined, undefined, true);
			}
			if(merchant.dependency){
				var dom = SBExtension.tabStateHandler.getObjectByHostDependency(merchant.dependency, undefined, merchant.mID);
				var domDep = null;
				if(!dom){
					if(tb.url.indexOf(merchant.dependency) > -1){
						dom =  SBExtension.tabStateHandler.getObjectByHost(tb.url);
						domDep = dom;
					}else{
						dom = SBExtension.tabStateHandler.getObjectByHost(merchant.dependency);
					}
				}
				dom.setStateValue(7);
				if (dom.reload) {
					dom.reload = false;
					var this_ = dom;
					setTimeout(function(){
						var host = this_.getHost();
						for (var i in this_.tabs) {
							var tbId = this_.tabs[i];
							var t = SBExtension.tabStateHandler.getTabByTabId(tbId, "");
							if(!t){
								this_.removeTab(tbId);
								continue;
							}
							if(tbId != mainframeReqTabId && t.host == host){
								this_.reloadTab(tbId)
							}
						}
					},150);
				}
				if (mainframeReqTabId>0) {
					if(domDep == null){
						dom.sendState(mainframeReqTabId, undefined, undefined, true);
					}else{
						dom.sendState(mainframeReqTabId, undefined, undefined, true, merchant);
					}
				}
				dom.save();
			}
			this.syncDomainState();
			return this.activateIconIfNeeded(mainframeReqTabId, iconActivated);
		}
		if (this.state == 7 && state != 1) {
			SBExtension.store.storeGlobalKey(SBExtension.config.keyPrefixActivate + merchant.mID, 1);
			this.restore = 0;
			if (mainframeReqTabId > 0  &&  this.state + '' != merchant.aFlag) {
				iconActivated = this.calculateGlobalTransition(mainframeReqTabId, merchant.mID, this.state);
			}
			this.save();
			if(merchant.dependency){
				var dom = SBExtension.tabStateHandler.getObjectByHostDependency(merchant.dependency, undefined, merchant.mID);
				var domDep = null;
				if(!dom){
					if(tb.url.indexOf(merchant.dependency) > -1){
						var dom =  SBExtension.tabStateHandler.getObjectByHost(tb.url);
						domDep = dom;
					}else{
						dom = SBExtension.tabStateHandler.getObjectByHost(merchant.dependency);
					}
				}
				if(dom.state == 7){
					return this.activateIconIfNeeded(mainframeReqTabId, iconActivated);
				}
				dom.setStateValue(7);
				if (dom.reload) {
					dom.reload = false;
					var this_ = dom;
					setTimeout(function(){
						var host = this_.getHost();
						for (var i in this_.tabs) {
							var tbId = this_.tabs[i];
							var t = SBExtension.tabStateHandler.getTabByTabId(tbId, "");
							if(!t){
								this_.removeTab(tbId);
								continue;
							}
							if(tbId != mainframeReqTabId && t.host == host){
								this_.reloadTab(tbId)
							}
						}
					},150);
				}
				if (mainframeReqTabId>0) {
					if(domDep == null){
						dom.sendState(mainframeReqTabId, undefined, undefined, true);
					}else{
						dom.sendState(mainframeReqTabId, undefined, undefined, true, merchant);
					}
				}
				dom.save();
			}
			this.syncDomainState();
			// If old state was GREEN, we only need to handle transition to RED. Otherwise - exit...
			return this.activateIconIfNeeded(mainframeReqTabId, iconActivated);
		}
		
		// From now on, we will allow reloading the tab again (it was previously set to 'false' to ensure we don't have eternal loop!!!)
		this.reload = true;
		if (this.state == 1 && state != 7) {
			this.greenPopUp = false;
			// If old state was RED, we only need to handle transition to GREEN. Otherwise - save and exit...
			this.save();
			return this.activateIconIfNeeded(mainframeReqTabId, iconActivated);
		}
		if (state == 0) {
			// If calculated value is undefined, set NEW state to the MERCHANT-defined value !!!
			if(mainframeReqTabId > 0  &&  this.state + '' != merchant.aFlag && merchant.aFlag != '7' && merchant.aFlag != '5' && merchant.aFlag != 0){
				iconActivated = this.calculateGlobalTransition(mainframeReqTabId, merchant.mID, merchant.aFlag);
			}
			if(this.state + '' == '2' && merchant.aFlag + '' == '7'){
				this.save();
				return this.activateIconIfNeeded(mainframeReqTabId, iconActivated);
			}
			if(this.state + '' == '0'){
				this.setStateValue((merchant.aFlag==7) ? 5 : merchant.aFlag);
				if(merchant.aFlag > 0){
					iconActivated = this.calculateGlobalTransition(tabId, merchant.mID, this.state);
				}
			}
		} else {
			// Otherwise - set NEW state to the CALCULATED value!!!
			if(mainframeReqTabId > 0  &&  this.state + '' != merchant.aFlag && this.state != '5'){
				iconActivated = this.calculateGlobalTransition(mainframeReqTabId, merchant.mID, state);
			}
			this.setStateValue(state);
			if(this.state != '7' && this.state != '5'){
					this.greenPopUp = false;
			}
		}
	} else if(!merchant) {
		if(req.type == 'main_frame'){
			this.setStateValue(state);
		} else if(req.type == 'sub_frame'){
			this.setStateValue(this.state);
		}
		//SBExtension.tabStateHandler.checkSpecialCases(this.getHost(), tabId, req);
	}

	this.save();
	
	if (syncDomainStateIsNeeded)
		this.syncDomainState();
	return this.activateIconIfNeeded(mainframeReqTabId, iconActivated);
};

SBExtension.Domain.prototype.activateIconIfNeeded = function(mainframeReqTabId, iconActivated) {
	if (!iconActivated && mainframeReqTabId>0) {
		SBExtension.actionHandler.onUserAction("AnimateReActive", mainframeReqTabId);
	}
};

SBExtension.Domain.prototype.calculateGlobalTransition = function(tabId, mID, hostState) {
	var res = false;
	if (tabId < 1) {
		return;
	}
	var winID = SBExtension.browser.getCurrentWindowID();
	var state = new PopupExtnState();
	state.init(tabId, winID, SBExtension.globalState.globalType, SBExtension.globalState.loginState);
	var willBlockAnimation = false;
	var willAllowPlus = false;
	if (mID > 0) {
		state.changeTransition(new Date().getTime(),"shop");
		state.setPriority(1, 0);
		SBExtension.globalState.stateSEActiveArray[winID] = 1;
		SBExtension.store.storeGlobalState(SBExtension.globalState);
		
		SBExtension.browser.executeForAllPopups(
			function(popup) {
				popup.SBExtension.popupUIMain.setStateChange();
			},
			["browserPopup.onGlobalStateChanged", true]
		);
		
		state.merchantID = mID;
		willBlockAnimation = (hostState==1 && !SBExtension.config.isCompetitorIconAlive);
		if (willBlockAnimation) {
			var merchant = SBExtension.tabStateHandler.getMerchantByID(mID);
			if (merchant && parseInt(merchant.aFlag)==1) {
				willAllowPlus = true;
			}
		} else {
			SBExtension.actionHandler.onUserAction("AnimateTrans", tabId, {param:mID});
			res = true;
		}
	} else {
		state.merchantID = 0;
		state.changeTransition(0,"");
	}
	state.save();
	if (willBlockAnimation && willAllowPlus) {
		SBExtension.actionHandler.onUserAction("AnimateReActive", tabId, {param:hostState});
		res = true;
	}
	return res;
};

SBExtension.Domain.prototype.sendState = function(tabId, tabActivated, loginState, affNetworkActivated, merchant, curMsgID, doc, click) {
    if (SBExtension.lastDomainStateSent && SBExtension.lastDomainStateSent.obj && SBExtension.lastDomainStateSent.obj.mID==this.mID && SBExtension.lastDomainStateSent.obj.state==this.state) {
        // Fighting deadly loops in E10s ...
        return;
    }
    var mID = merchant && merchant.mID;
    if (click && mID) {
        var intervalNameClick = "intervalSE_" + mID + "_click";
        SBExtension.store.storeGlobalKey(intervalNameClick, click);
    }
    if (SBExtension.lastDomainStateSent && SBExtension.lastDomainStateSent.ts && ((new Date()).getTime()-SBExtension.lastDomainStateSent.ts) < 250 && (SBExtension.lastDomainStateSent.tabId==tabId) && (tabActivated && SBExtension.lastDomainStateSent.tabActivated)) {
        return;
    }
    var this_ = this;
    setTimeout(
        function() {
            if (doc && (!doc.body || !doc.domIsReady)) {
                return;
            }
            // var obj = SBExtension.tabStateHandler.getObjectByHost(this_.host);
            var tab = SBExtension.tabStateHandler.getTabByTabId(tabId);
            var obj = SBExtension.tabStateHandler.getObjectByHost(this_.getDomain(), this_.urlURL, tab, this_.getHost(), this_.matchedBy);
            SBExtension.lastDomainStateSent = {
                ts: (new Date()).getTime(),
                tabId: tabId,
                tabActivated: tabActivated
            };
            try {
              SBExtension.lastDomainStateSent.obj = obj;
            obj.doSendState(tabId, tabActivated, loginState, affNetworkActivated, merchant, curMsgID, doc, click);
              delete SBExtension.lastDomainStateSent.obj;
            } catch(err) {delete SBExtension.lastDomainStateSent.obj;}
            delete SBExtension.lastDomainStateSent;
        });
}

SBExtension.Domain.prototype.doSendState = function(tabId, tabActivated, loginState, affNetworkActivated, merchant, curMsgID, doc, click, tab) {
  try {
	if (doc && (!doc.body || !doc.domIsReady)) {
		return;
	}
	if (tab != this) {
		tab = SBExtension.tabStateHandler.getTabByTabId(tabId);
		if (!merchant || !merchant.mID) {
			merchant = SBExtension.tabStateHandler.getMerchantByID(tab.merchantID);
		}
		var obj = SBExtension.tabStateHandler.getObjectByHost(this.getDomain(), this.urlURL, tab, this.getHost(), this.matchedBy);
		obj.doSendState(tabId, tabActivated, loginState, affNetworkActivated, merchant, curMsgID, doc, click, obj);
		return;
	}
	var mID = merchant && merchant.mID;
	var intervalName = "intervalSE_" + mID;
	var willSetTimeout = false;
	var thisStateNum = parseInt(this.state);
	var merFlag = (merchant) ? parseInt(merchant.aFlag) : 0;
	var timeout = window[intervalName];
	if (affNetworkActivated && (thisStateNum==7 || (thisStateNum==1 && merFlag>1)) && !SBExtension.browser.testGreenCrossOver) {
		if (timeout) {
			var intervalNameClick = intervalName+"_click";
			if (!click) {
				click = SBExtension.store.retrieveGlobalKey(intervalNameClick);
			}
			if (thisStateNum==1  ||  click && [2,5].indexOf(click.state)>=0) {
				SBExtension.store.clearKey(intervalNameClick, true);
				window.clearTimeout(timeout);
				willSetTimeout = true;
			}
		}
		else {
			willSetTimeout = true;
		}
	} else {
		if (thisStateNum!=7 && thisStateNum!=1) {
			this.setTimeoutTime = 0;
			if (timeout) {
				window.clearTimeout(timeout);
			}
			timeout = window[intervalName] = null;
		}
	}
	if (thisStateNum == 7) {
		SBExtension.browser.executeForSelectedTab(null, function(tab) {
			var activeTabID = SBExtension.browser.getTabID(tab);
			SBExtension.bgPage.reActivateTabByID(activeTabID);
		});
	}
	if (willSetTimeout) {
		this.setTimeoutTime = new Date().getTime();
		this.merFlag = merFlag;
		this.stateNum = thisStateNum;
		this.save();
		var hostObj = this;
		var tabPageId = tabId;
		var intervalNameClick = intervalName+"_click";
		window[intervalName] = setTimeout( function() {
			SBExtension.store.clearKey(intervalNameClick, true);
			var tab = SBExtension.tabStateHandler.getTabByTabId(tabPageId);
			var dom = SBExtension.tabStateHandler.getObjectByHost(tab.domain, tab.url, tab, tab.host, tab.matchedBy);
			if (dom) {
				dom.merFlag = hostObj.merFlag;
				dom.stateNum = hostObj.stateNum;
				hostObj = dom;
			}
			var hostObjState = parseInt(hostObj.state);
			if (hostObjState==7 || hostObjState==1) {
				var restoredState = (hostObj.stateNum==1 && hostObj.merFlag!=7) ? hostObj.merFlag : 2;
				var stateObj = new SBExtension.MerchantStats().getState();
				hostObj.reload = true;
				hostObj.setStateValue(restoredState);
				hostObj.restore = 1;
				hostObj.setTimeoutTime = 0;
				hostObj.save();
				
				var state = {};
				if(tabPageId != -1){
					state.state = hostObj.state;
				}else{
					state.state = 0;
				}
				
				var mer;
				var merchantID = mID || 0;
				SBExtension.store.storeGlobalKey(SBExtension.config.keyPrefixActivate + merchantID, 0);
				var tabs = SBExtension.browser.getMerchantTabs(merchantID);
				if (!tabs)
					tabs = {};
				for (var tbId in tabs) {
					var tab = SBExtension.tabStateHandler.getTabByTabId(tbId, "");
					if(tab){
						if (tab.merchantID != merchantID) {
							continue;
						}
						mer = merchant;
						var tabState = SBExtension.store.retrieveGlobalKey("popUpSE_" + tbId);
						if (tabState) {
							tabState = tabState.split("@");
							if (tabState.length>2 && (tabState[2]==(""+mer.mID))) {
								SBExtension.store.clearKey("popUpSE_" + tbId);
							}
						}
						stateObj.addActivation(hostObjState, -restoredState, null, null, null, hostObj.restore,mer.mID, null);
						state.mName = mer.mName;
						state.mTerms = mer.mTerms;
						state.mSB = mer.mSB;
						state.mID = mer.mID;
						state.mURL = mer.mURL;
						state.upTo = mer.upTo;
						var checkMerchant = SBExtension.tabStateHandler.getMerchantByUrl(mer.dependency);
						if(mer.dependency && !merchant && checkMerchant && !checkMerchant.dependency){
							return;
						}
					
						state.name = "sendState";
						state.tabId = tbId;
						state.message = true;
						state.restore = hostObj.restore;
						state.loginState = loginState;
						state.loginCode = SBExtension.config.loginCode;
						state.showSrvyProjID = SBExtension.config.showSrvyProjID;
						var memberInfoStr = SBExtension.store.retrieveGlobalKey("SBmemberInfo");
						var memberInfo = (memberInfoStr) ? JSON.parse(memberInfoStr) : false;
						state.lastCountry = SBExtension.store.retrieveGlobalKey("SE_COUNTRY");
						state.memberCountry = (memberInfo && memberInfo.country) ? memberInfo.country : 0;
						state.country = (state.memberCountry) ? state.memberCountry : 1;
						state.mCountry = mer.country;
						state.couponCount = mer.coupons;
					
						SBExtension.browser.tabsSendMessage(parseInt(tbId), state);
						SBExtension.browser.executeForSelectedTab(null, function(tab) {
							var activeTabID = SBExtension.browser.getTabID(tab);
							SBExtension.bgPage.reActivateTabByID(activeTabID);
						});
					}
				}
			}
		}, SBExtension.config.getGreenClearState() * 1000);
	}
	
	var state = {};
	if(tabId != -1){
		state.state = this.state;
	}else{
		state.state = 0;
	}

	var mer;
	var tab = SBExtension.tabStateHandler.getTabByTabId(tabId, "");
	if(tab){
		if(merchant){
			mer = merchant;
		}else{
			mer =  SBExtension.tabStateHandler.getMerchantByID(tab.merchantID);
			if (!mer || (mer.nameMerchant != this.host && mer.nameMerchant != this.domain && (!this.url || this.url && this.url.indexOf(mer.nameMerchant) >= 0))) {
				mer = SBExtension.tabStateHandler.getMerchantByUrl(this.urlURL, this.host, this.domain, this.matchedBy);
			}
		}
		if(tab.initialization){
			if(mer){
				state.mName = mer.mName;
				state.mTerms = mer.mTerms;
				state.mSB = mer.mSB;
				state.mID = mer.mID;
				state.mURL = mer.mURL;
				state.upTo = mer.upTo;
				state.mCountry = mer.country;
				state.couponCount = mer.coupons;
				if (mer.checkURL=="#NOIFRAME#") {
					state.forcingNonIframe = true;
				}
				var checkMerchant = SBExtension.tabStateHandler.getMerchantByUrl(mer.dependency);
				if(mer.dependency && !merchant && checkMerchant && !checkMerchant.dependency){
					return;
				}
			}
			
			if(
			  !(this.isFirstGreen && this.isFirstGreenAcked && this.isFirstGreenAcked[tabId]==this.mID) &&
			  this.state == "5" && SBExtension.globalState.loginState == "1") {
				this.sendActivationClick(tabId, this.mID, tab.url, 0);
			}
			
			var everGreen = this.everGreen;
			if (state.state == 7  &&  ((curMsgID && this.lastMsgID==curMsgID) || this.greenPopUp == false)){
				if (curMsgID) {
					this.lastMsgID = curMsgID;
				} else {
					this.greenPopUp = true;
					state.grPopUp = false;
					this.everGreen = true;
					state.firstGreen = this.everGreen && !everGreen;
					this.save();
				}
			} else if (this.greenPopUp == true) {
				state.grPopUp = true;
				state.firstGreen = this.everGreen && !everGreen;
			} else {
				state.grPopUp = false;
			}
			state.name = "sendState";
			state.tabId = tabId;
			state.restore = this.restore;
			state.loginState = loginState;
			state.loginCode = SBExtension.config.loginCode;
			state.showSrvyProjID = SBExtension.config.showSrvyProjID;
			state.everGreen = everGreen;
			state.count = this.count++;
			var memberInfoStr = SBExtension.store.retrieveGlobalKey("SBmemberInfo");
			var memberInfo = (memberInfoStr) ? JSON.parse(memberInfoStr) : false;
			state.lastCountry = SBExtension.store.retrieveGlobalKey("SE_COUNTRY");
			state.memberCountry = (memberInfo && memberInfo.country) ? memberInfo.country : 0;
			state.country = (state.memberCountry) ? state.memberCountry : 1;
			SBExtension.browser.tabsSendMessage(parseInt(tabId), state);
		}
	}
  } catch(err) {
	SBExtension.alert_debug("### !!! REAL !!! ERROR when sending state from SBExtension.Domain.prototype.sendState: err=" + err + "; tabId=" + tabId + "; tabActivated=" + tabActivated + "; loginState=" + JSON.stringify(loginState) + "; affNetworkActivated=" + affNetworkActivated + "; merchant=" + JSON.stringify(merchant), err);
  }
};

SBExtension.Domain.prototype.sendActivationClick = function(tabId, mID, tabURL, count) {
	if (count==0 && !this.isFirstGreenAcked) {
		this.isFirstGreenAcked = {};
		this.isFirstGreenAcked[tabId] = {mID:((mID) ? -this.mID : this.mID), tabURL:tabURL}
		this.isFirstGreen = true;
		this.save();
	} else {
		if (count>25 || count==0) {
			return;
		}
		var isFirstGreenAcked = this.isFirstGreenAcked;
		if (isFirstGreenAcked && isFirstGreenAcked[tabId]) {
			isFirstGreenAcked = isFirstGreenAcked[tabId];
		}
		if (!isFirstGreenAcked) {
			return;
		}
		if (this.state!=5 || !mID || isFirstGreenAcked.mID==mID) {
			if (tabURL == isFirstGreenAcked.tabURL) {
				return;
			}
			isFirstGreenAcked.tabURL = tabURL;
			isFirstGreenAcked.mID = (mID) ? -this.mID : this.mID;
			this.save();
		}
	}
	SBExtension.actionHandler.onUserAction("SEClickBtn", tabId);
	var this_ = this;
	SBExtension.browser.isActivatingInSameTab(
		function() {
			//setTimeout(function() {
			//	var tab = SBExtension.tabStateHandler.getTabByTabId(tabId, "");
			//	if (!tab || !tab.merchantID || mID!=tab.merchantID) {
			//		return;
			//	}
			//	var obj = SBExtension.tabStateHandler.getObjectByHost(tab.domain, tab.url, tab, tab.host, tab.matchedBy);
			//	count = count+1;
			//	if (obj) {
			//		obj.sendActivationClick(tabId, mID, tab.url, count);
			//	}
			//}, 400);
		},
		function() {
			var tab = SBExtension.tabStateHandler.getTabByTabId(tabId, "");
			if (tab && tab.merchantID && mID==tab.merchantID) {
				tabURL = tab.url;
			}
			this_.isFirstGreenAcked[tabId] = {mID: this_.mID, tabURL:tabURL};
			this_.save();
		}
	);
};

SBExtension.Domain.prototype.reloadTab = function(tabId) {
	var state = {};
	state.state = this.state;
	state.name = "reloadTab";
	SBExtension.browser.tabsSendMessage(tabId, state);
	//chrome.tabs.sendMessage(tabId, state);
};
