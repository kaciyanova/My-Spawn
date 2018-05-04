// Content injection/management on the client page:

if (SBExtension.browserInject) {

if (!window.jqSB) {
	var jqSB = SBExtension.$ || window.$;
}

//handle messages from extension back end.
SBExtension.injectPage = {
	loginState: "0",
	hardReload: true,
	reload: true,
	tbIsPresent: false,
	usingShortNotion: true, // false - remove altogether...
	usingSameTabForNonIFrameActivation: true,
	settings: [{
            "domain": "swagbucks.com",
            "rx": new RegExp("swagbucks[.]com/[?](q=|.=.*&q=)"),
            "pattern": "#mainResults a.resultTitle",
            "matchURL": "ru="
            , "matchTOP": "true"
        },{
            "domain": "search.yahoo.com",
            "rx": new RegExp("/search.*(fr=|hspart=prodege|hspart=mozilla).*"),
            "pattern": "#main a.spt",
            "matchURL": "RU="
            //, "matchTOP": "false"
        },{
            "domain": "search.yahoo.com",
            "rx": new RegExp("search.yahoo.com/search;"),
            "pattern": "#main div.algo a",
            "matchURL": "RU="
            //, "matchTOP": "true"
        },{
            "domain": "www.bing.com",
            "rx": new RegExp("/?search"),
            "pattern": "#b_results li.b_algo, #b_results li, #b_results h2 a, div[class=\"sb_tlst\"] a"
        },{
            "domain": "google.com",
            "rx": new RegExp("^https?://(?:www.|encrypted.)?google.com/.*(?:(?:[&?#]q=)|(?:(?:search|webhp|sclient|hl|output|newwindow|[?]gws_rd=ssl).*[&?#]q=))"),
            "pattern": "h3.r a",
            "rx2": new RegExp("^(http|https)://www.google.com/uds/afs.*client=infospace-syn-prodege.*"),
            "pattern2": "div.resultTitlePane a"
        }],
	fixed_element: [],
	activate: (SBExtension.injectPageActivated) ? SBExtension.injectPageActivated : SBExtension.browserInject.isInjectPagePreActivated(), //true
	getDocument: function(tabId) {
		if (tabId) {
			var resDoc = SBExtension.injectPage.getDocumentByID(tabId);
			if (resDoc) {
				return resDoc;
			}
		}
		if (typeof document == "undefined" && window.document && window.document.body) {
			document = window.document;
		}
		return document;
	},
	refreshDoc: function(oldDoc, tabId, forced) {
		var doc;
		try {
			doc = ((forced && (tabId>0)) || !oldDoc || !oldDoc.body) ? null : oldDoc;
		} catch(err) {}
		if (!doc) {
			doc = this.getDocument(tabId);
		}
		return doc;
	},
	onSearchPageActivation: function(curDoc, settings, isTopFrame) {
		var href = (curDoc && curDoc.location && curDoc.location.href) ? curDoc.location.href : ((curDoc && curDoc.URL) ? curDoc.URL : "");
		var isUrlSecure = (curDoc.location.href.indexOf("https:")==0);
		jqSB.each(settings, function(key, settings) {
			var rx2 = null;
			if ( ((typeof settings.matchTOP == "undefined") || (!isTopFrame&&settings.matchTOP=="false" || isTopFrame&&settings.matchTOP=="true"))
                           &&(0 <= href.indexOf(settings.domain) && (settings.rx.test(href) || (rx2=settings.rx2) && rx2.test(href)))) {
				var merchant_objects = {};
				var urls = [];
				var pattern = (rx2) ? settings.pattern2 : settings.pattern;
				var curDoc2 = (rx2) ? curDoc.defaultView.top.document : curDoc; //window.top.document : curDoc;
				var url, url2;
				var matchURL = (settings.matchURL) ? new RegExp(settings.matchURL + "([^&]+)") : null; //, "i") : null;
				jqSB(pattern, curDoc2).each(function() {
					if (this.getAttribute("href") && 0 == this.getAttribute("href").indexOf("http") && "true" != this.getAttribute("sbSearchUsed")) {
						url = this.getAttribute("href");
						url2 = null;
						if (url.indexOf("url=http") > 0) {
							url2 = unescape(url.match(/url=([^&]+)/).pop());
						}
						if (!url2 && settings.matchURL && url.indexOf(settings.matchURL)>0) {
							url2 = unescape(url.match(matchURL).pop());
						}
						if (url2) {
							url = url2;
						}
						merchant_objects[url] = this;
						urls.push(url);
						this.setAttribute("sbSearchUsed", "true");
					}
				});
				
				if (urls.length > 0) {
					SBExtension.browserInject.sendBgMessage("CheckMerchants", '', JSON.stringify(urls), function(merchants) { 
						var uCountry = merchants['country'];
						var spanElems = [];
						for (var url in merchants) {
							if (url == "country") {
								continue;
							}
							var element = merchant_objects[url];
							var merchant = merchants[url];

							var flagHtml = "";
							if (uCountry && merchant.country!=uCountry || !uCountry && merchant.country!=merchants['lastCountry']) {
								var flag = SBExtension.getFlagSuffix(merchant.country);
								flagHtml = SBExtension.browserInject.getURL("img/shopearn/flag-"+flag+".png", isUrlSecure);
							}

							var img = SBExtension.browserInject.createTag(curDoc2, "img");
							SBExtension.browserInject.setAttribute(img, "src", SBExtension.browserInject.getURL("img/sb.svg", isUrlSecure));
							SBExtension.browserInject.setAttribute(img, "style", "margin:0;float:left");
							
							var div = jqSB("<div/>",{style:"display:table;"});
							div.append(img);
							var currency = SBExtension.getCurrencyForCountry(merchant.country);
							var spanNode = null;
							var cashBackTextLong = parseInt(merchant.mSB) + " SB " + SBExtension.browserInject.getLocalizedString("per") + " " + currency; //TIX-1477 + " Cash Back";
							var currencySymbol = SBExtension.getCurrencySymbolForCountry(merchant.country);
							var cashBackTextShort = merchant.mSB + " SB/" + currencySymbol;
							var spanElem = jqSB("<span />", curDoc2).css({"font-family": "Helvetica, Arial, sans-serif","margin-left": "3px","margin-right": "3px","font-size": "14px",color: "rgb(255, 0, 0)",display: "inline-block","text-decoration": "none !important", "float": "left","padding-top": "1px"}).text(cashBackTextLong);
							div.append(spanElem);
							spanNode = {elem:spanElem, cbAltTxt:cashBackTextShort, parentDiv:div};
							spanElems.push(spanNode);
							if (flagHtml != '') {
								//div.append(jqSB("<img />", curDoc2).css({'src': flagHtml}));
								var img2 = SBExtension.browserInject.createTag(curDoc2, "img");
								SBExtension.browserInject.setAttribute(img2, "src", flagHtml);
								SBExtension.browserInject.setAttribute(img2, "style", "margin-left: 5px;margin-bottom: 1px;");	
								div.append(img2);
								if (spanNode) {
									spanNode.flag = img2;
								}
							}
							div.append(jqSB("<div />", curDoc2).css({clear: "both"}));
							jqSB(element, curDoc2).prepend(div);
						}
						SBExtension.injectPage.tweakSpanElements(spanElems, curDoc2);
						setTimeout(function() {
							SBExtension.injectPage.tweakSpanElements(spanElems, curDoc2);
						}, 100);
					});
				}
				
			}
		});
	},
	tweakSpanElements: function(spanElems, doc) {
		for (var idx in spanElems) {
			var spanNode = spanElems[idx];
  			var spanElem = spanNode.elem;
      			if (spanElem.height() > 30) {
   				if (SBExtension.injectPage.usingShortNotion) {
					SBExtension.browserInject.setInnerHTML(spanElem[0], spanNode.cbAltTxt, doc);
   					spanElem.css("padding-top", "0px");
   					var img2 = spanNode.flag;
   					if (img2) {
						SBExtension.browserInject.setAttribute(img2, "style", 'display:none');
   					}
 				} else {
  					SBExtension.browserInject.setAttribute(spanNode.parentDiv, "style", 'display:none');									
  				}
 			}
		}
	},
	//handle callback upon "DocumentComplete".
	onDocumentComplete: function (curDoc, firstPageLoadAfterInstallTabId, isTopFrame) {
		//SBExtension.prvLastAnimateShowPopUpData = SBExtension.lastAnimateShowPopUpData || SBExtension.prvLastAnimateShowPopUpData;
		SBExtension.lastAnimateShowPopUpData = null;
		var tabId;
		if (firstPageLoadAfterInstallTabId<0) {
			tabId = -firstPageLoadAfterInstallTabId;
			firstPageLoadAfterInstallTabId = null;
		} else {
			tabId = firstPageLoadAfterInstallTabId;
		}
		if (!curDoc)
			curDoc = SBExtension.injectPage.getDocument();
		var settings = this.settings;
		var onSearchPageActivation = this.onSearchPageActivation;
		var _document = document;
		window.setTimeout(function() {
			var newCurDoc = (curDoc && curDoc!=_document && tabId && isTopFrame) ? SBExtension.injectPage.getDocumentByID(tabId) : null;
			if (newCurDoc)
				curDoc = newCurDoc;
			onSearchPageActivation(curDoc, settings, isTopFrame);
		});
		window.setInterval(function() {
			if (!curDoc)
				curDoc = SBExtension.injectPage.getDocument();
			else if (tabId && isTopFrame) {
				curDoc = SBExtension.injectPage.getDocumentByID(tabId);
				if (!curDoc)
					curDoc = SBExtension.injectPage.getDocument();
			}
			onSearchPageActivation(curDoc, settings, isTopFrame);
		}, 1500)
		var curHostname = curDoc.location.hostname;
		var sbDomainIdx = curHostname.indexOf(SBExtension.config.sbDomainName);
		var visitingSBDomain = true;
		if (sbDomainIdx<0) {
			visitingSBDomain = false;
		}
		else if (curHostname!=SBExtension.config.sbHostName) {
			if (sbDomainIdx+SBExtension.config.sbDomainName.length!=curHostname.length || sbDomainIdx!=0 && curHostname.charAt(sbDomainIdx-1)!='.') {
				visitingSBDomain = false;
			}
		}

		var href = curDoc.location.href;
		var urlToNavigatingUponInstall = SBExtension.store.retrieveGlobalKey("NAVIGATING_TO_UPON_INSTALL");
		if (urlToNavigatingUponInstall && href==urlToNavigatingUponInstall) {
			firstPageLoadAfterInstallTabId = tabId;
			SBExtension.store.clearKey("NAVIGATING_TO_UPON_INSTALL", true);
		}

		if (!visitingSBDomain && !firstPageLoadAfterInstallTabId)
			return;

		var urlToNavigateUponInstall = SBExtension.store.retrieveGlobalKey("NAVIGATE_TO_UPON_INSTALL");
		if (visitingSBDomain && href.indexOf(SBExtension.config.sbDomainName+"/extension") >= 0 && !(firstPageLoadAfterInstallTabId && (urlToNavigateUponInstall || urlToNavigatingUponInstall))) {
			var data = {name:"ExtensionPage", tabId:firstPageLoadAfterInstallTabId};
			SBExtension.injectPage.contentHandle(firstPageLoadAfterInstallTabId, data, curDoc);
		}
		else if (firstPageLoadAfterInstallTabId) {
			if (href.indexOf(SBExtension.config.sbDomainName+"/?cmd=gn-search-instructions")>=0) {
				return true; // Signal that the banner was SKIPPED!!!
			}
			if (!urlToNavigateUponInstall || href == urlToNavigateUponInstall) { // || (!visitingSBDomain || urlToNavigateUponInstall.indexOf(SBExtension.config.sbDomainName+"/extension")>=0) {
				var data = {name:"JustInstalled", tabId:firstPageLoadAfterInstallTabId};
				SBExtension.injectPage.contentHandle(firstPageLoadAfterInstallTabId, data, curDoc);
			} else {
				// Remember to bring the banner up and then - navigate to urlToNavigateUponInstall...
				SBExtension.store.clearKey("NAVIGATE_TO_UPON_INSTALL", true);
				SBExtension.store.storeGlobalKey("NAVIGATING_TO_UPON_INSTALL", urlToNavigateUponInstall);
				curDoc.location.href = urlToNavigateUponInstall;
			}
		}
		if (!SBExtension.browserInject.isInjectPagePreActivated() || SBExtension.getIEVersion()) {
			var tbUID = SBExtension.store.getTbUID();
			SBExtension.browserInject.getVersion(function(versionID) {
				SBExtension.injectPage.injectTbUIDOnPage(curDoc, tbUID, versionID);
			});
		} else {
			SBExtension.store.getTbUID(function(tbUID) {
				SBExtension.browserInject.getVersion(function(versionID) {
					SBExtension.injectPage.injectTbUIDOnPage(curDoc, tbUID, versionID);
				});
			});
		}
	},
	
	injectTbUIDOnPage: function(curDoc, tbUID, versionID) {
		var script = "SBExtensionUID = " + tbUID + ";  SBExtensionVersion = " + versionID + ";" +
		         "if (window.onSBExtensionPresent) {window.onSBExtensionPresent();}"; //alert('SBExtensionUID=' + SBExtensionUID);"; //
		SBExtension.injectPage.injectScriptOnPage(curDoc, script);
	},

	injectScriptOnPage: function(curDoc, script) {
		var s = curDoc.createElement("SCRIPT");
		s.type = "text/javascript";
		s.text = script;
		curDoc.getElementsByTagName("HTML")[0].appendChild(s);
	},

	refreshSeqNumber: function() {
		if (!SBExtension.browserInject.seqNumber) {
			if (SBExtension.browserInject.dynamicScriptLoading) {
				var seqNumber = sendSyncMessage("shopearn@prodege.com:get-seq-number", {});
				SBExtension.browserInject.seqNumber = seqNumber;
			} else {
				SBExtension.browserInject.seqNumber = SBExtension.browser && SBExtension.browser.seqNumber;
			}
		}
	},

	//handle messages from extension back end.
	contentHandle: function (tabId, data, cDoc, state, idx) {
		if (SBExtension.injectPage.initialized || (SBExtension.browserInject.initialized && (!SBExtension.browserInject.isDomReady || SBExtension.browserInject.isDomReady())) || SBExtension.browserInject.seqNumber&&SBExtension.store.retrieveGlobalKey("popUpSE_BrowserInitialized" + SBExtension.browserInject.seqNumber) || idx>8) {
			SBExtension.injectPage.initialized = true;
			SBExtension.injectPage.doContentHandle(tabId, data, cDoc, state);
		} else {
			if (!idx) idx = 1; else idx++;
			SBExtension.injectPage.refreshSeqNumber();
			setTimeout(function() {
				SBExtension.injectPage.refreshSeqNumber();
				SBExtension.injectPage.contentHandle(tabId, data, cDoc, state, idx);
			}, 125);
		}
	},

	doContentHandle: function (tabId, data, cDoc, state) {
	  var res = false;
	  try {
		if (!state && data && ["sendState","SEClick","TBClick"].indexOf(data.name)>=0) {
			state = SBExtension.store.retrieveGlobalKey("popUpSE_" + data.tabId, function(state) {
				if (data.mID && data.state==7) {
					SBExtension.store.retrieveGlobalKey(SBExtension.config.keyPrefixActivate + '@' + data.mID, function(hiddenActivatedState) {
						// {tabId:tabId, state:state, ts:(new Date()).getTime()}
						if (hiddenActivatedState && (hiddenActivatedState.state==7 || (stateArray=state.split("@")) && stateArray.length>1 && stateArray[1]==7) && (new Date()).getTime()-hiddenActivatedState.ts<1800000) { // && hiddenActivatedState.tabId!=tabId) {
							// Ignoring hidden green for 30 min...
							return;
						}
						return SBExtension.injectPage.doContentHandle(tabId, data, cDoc, (state) ? state : -1);
					});
					return;
				}
				return SBExtension.injectPage.doContentHandle(tabId, data, cDoc, (state) ? state : -1);
			});
			if (SBExtension.browserInject.isInjectPagePreActivated() && !SBExtension.getIEVersion()) {
				return res;
			}
		}
		if (state == -1) {
			state = null;
		}
		var doc = (cDoc) ? cDoc : null;
		if (data.name!='JustInstalled' && data.name!='ExtensionPage') {
			if (!SBExtension.browserInject.isInjectPagePreActivated()) {
				if(!SBExtension.injectPage.activate) {
					return;
				}
				//tabId = chromeListener.getWinIDAndTabIndexFromTabID(tabId)[1];
				if (!doc) {
					doc = SBExtension.injectPage.getDocumentByID(tabId);
				}
				if (!doc) return;
				var loginState = SBExtension.store.retrieveGlobalKey("popUpSE_loginState", function(res) {
					SBExtension.injectPage.loginState = res;
				});
				if (!SBExtension.browserInject.isInjectPagePreActivated() || SBExtension.getIEVersion())
					SBExtension.injectPage.loginState = loginState;
				var loginCode = SBExtension.store.retrieveGlobalKey("popUpSE_loginCode", function(res) {
					SBExtension.config.loginCode = parseInt(res);
				});
				if (!SBExtension.browserInject.isInjectPagePreActivated() || SBExtension.getIEVersion())
					SBExtension.config.loginCode = parseInt(loginCode);
				var showSrvyProjID = SBExtension.store.retrieveGlobalKey("popUpSE_showSrvyProjID", function(res) {
					SBExtension.config.showSrvyProjID = res;
				});
				if (!SBExtension.browserInject.isInjectPagePreActivated() || SBExtension.getIEVersion())
					SBExtension.config.showSrvyProjID = showSrvyProjID;
			}
			
			if(SBExtension.injectPage.reload) {
				SBExtension.injectPage.reload = false;
				if (!SBExtension.browserInject.isInjectPagePreActivated()) {
					SBExtension.store.storeGlobalKey("popUpSE_reload", false);
				}
				if (state) {
					var stateArray = state.split('@');
					if (stateArray[0] + '' == '3') {
						state = 1 + '@' + stateArray[1] + ((stateArray.length>2) ? '@' + stateArray[2] : '');
						SBExtension.store.storeGlobalKey("popUpSE_" + data.tabId, state);
					}
					if (stateArray[0] + '' == '5') {
						state = 4 + '@' + stateArray[1] + ((stateArray.length>2) ? '@' + stateArray[2] : '');
						SBExtension.store.storeGlobalKey("popUpSE_" + data.tabId, state);
					}
				}
			}
		}

		doc = SBExtension.injectPage.refreshDoc(doc);
		if (!doc.body || !doc.domIsReady) {
			return;
		}
		var isUrlSecure = (doc.location.href.indexOf("https:")==0);
		var httpPrefix = (isUrlSecure) ? "https://" : "http://";
		switch (data.name) {
			case 'JustInstalled':
				//SBExtension.browserInject.sendBgMessage("OpenTutorial", data.tabId);
				//SBExtension.injectPage.injectPopUpStyle('red',0, doc);
				//SBExtension.injectPage.injectHoorayBanner(doc);
				break;
			case 'ReloadExtention':
				if (!SBExtension.browserInject.isInjectPagePreActivated()) {
					SBExtension.injectPage.tbIsPresent = SBExtension.store.retrieveGlobalKey("popUpSE_tbIsPresent") == "true" ? true : false;
					SBExtension.injectPage.reload = SBExtension.store.retrieveGlobalKey("popUpSE_reload") == "true" ? true : false;
					SBExtension.injectPage.loginState = SBExtension.store.retrieveGlobalKey("popUpSE_loginState");
					SBExtension.config.loginCode = parseInt(SBExtension.store.retrieveGlobalKey("popUpSE_loginCode"));
					SBExtension.config.showSrvyProjID = SBExtension.store.retrieveGlobalKey("popUpSE_showSrvyProjID");
					SBExtension.injectPage.hardReload = true;
				}
				break;
			case 'ExtensionPage':
				//SBExtension.injectPage.injectPopUpStyle('red',0, doc, true);
				//SBExtension.injectPage.injectHoorayBanner(doc, true);
				break;
			case 'sendState':
				var oldLoginState = SBExtension.injectPage.loginState;
				var forceShowPopup = false;
				var forceHidePopup = false;
				if (!SBExtension.browserInject.isInjectPagePreActivated()) {
					data.loginState = SBExtension.globalState.loginState;
					data.loginCode = SBExtension.globalState.loginCode;
					data.showSrvyProjID = SBExtension.globalState.showSrvyProjID;
					if (SBExtension.injectPage.hardReload) {
						data.loginState = SBExtension.injectPage.loginState;
						data.loginCode = SBExtension.config.loginCode;
						data.showSrvyProjID = SBExtension.config.showSrvyProjID;
						SBExtension.injectPage.hardReload = false;
					}
				}
				if (data.loginState!=undefined) {
					SBExtension.injectPage.loginState = data.loginState == '1' ? '1' : '0';
					SBExtension.store.storeGlobalKey("popUpSE_loginState", SBExtension.injectPage.loginState);
					SBExtension.config.loginCode = data.loginCode;
					SBExtension.config.showSrvyProjID = data.showSrvyProjID;
					SBExtension.store.storeGlobalKey("popUpSE_loginCode", SBExtension.config.loginCode);
					SBExtension.store.storeGlobalKey("popUpSE_showSrvyProjID", SBExtension.config.showSrvyProjID);
	 				if (SBExtension.injectPage.loginState!=oldLoginState) {
						if (SBExtension.injectPage.loginState == "1")
							forceShowPopup = true;
						else
							forceHidePopup = true;
						//if (!SBExtension.browserInject.isInjectPagePreActivated()) { // || SBBrowserInjectMSIE.browserInject.getNativeLocalStorage()) {
						//	for (key in SBExtension.store.localStorage) {
						//		if (key.indexOf('popUpSE_')==0 && 0 > ["popUpSE_loginState","popUpSE_tbIsPresent","popUpSE_reload"].indexOf(key)) {
						//			SBExtension.store.clearKey(key,true);
						//		}
						//	}
						//}
					}
				}
				//spopUpSE -> tabId + @ + stateShow
				//stateShow
				//0 - show after click by TB
				//1 - show
				//2 - hide
				//3 - hide green
				//4 - special domain
				//5 - hide special domain
				var element = doc.getElementById('popUpSEToolbar');
				var btn = doc.getElementById('actionBtnAction');
				var newStateArray = (state) ? state.split('@') : null;
				var stateArray;
				if (newStateArray && (newStateArray.length<3 || newStateArray[2]!=data.mID)) {
					state = null;
					newStateArray = null;
					SBExtension.store.clearKey("popUpSE_" + data.tabId);
					if (data.mID && data.state>1) {
						stateArray = [1, 0, data.mID];
					}
				}
				else if (state && !forceHidePopup && !forceShowPopup) {
					stateArray = newStateArray;
				}

				//if (!SBExtension.lastAnimateShowPopUpData && SBExtension.prvLastAnimateShowPopUpData) {
				//	SBExtension.lastAnimateShowPopUpData = SBExtension.prvLastAnimateShowPopUpData;
				//}
				var oldAnimateShowPopUpData = SBExtension.lastAnimateShowPopUpData;
				var newAnimateShowPopUpData = {ts:(new Date()).getTime(), data:JSON.stringify(data), stateArray:JSON.stringify(stateArray)};
				
				if (oldAnimateShowPopUpData 
					&& (newAnimateShowPopUpData.ts-oldAnimateShowPopUpData.ts)<=8000 
					&& //(oldAnimateShowPopUpData.stateArray==newAnimateShowPopUpData.stateArray)&& 
					(
				 		oldAnimateShowPopUpData.data.replace(/Green":true/g,'Green":false').replace(/"grPopUp":true/g,'"grPopUp":false')
				 		==
				 		newAnimateShowPopUpData.data.replace(/Green":true/g,'Green":false').replace(/"grPopUp":true/g,'"grPopUp":false')
					) ) {
						return;
				}
				SBExtension.lastAnimateShowPopUpData = newAnimateShowPopUpData;

				if (stateArray && (stateArray.length<3 || stateArray[2] == data.mID) && !forceHidePopup && !forceShowPopup) {
					if(stateArray[0] == 0 && stateArray[1] == data.state && !element) {
							res = SBExtension.injectPage.showPopUp(data, 0, doc, state);
					}
					else if(stateArray[0] == 0 && stateArray[1] != data.state && !element) {
						state = 1 + '@' + data.state + '@' + data.mID;
						SBExtension.store.storeGlobalKey("popUpSE_" + data.tabId, state);
					}
					else if(stateArray[0] == 1 && stateArray[1] == data.state && !element) {
						state = 1 + '@' + data.state + '@' + data.mID;
						SBExtension.store.storeGlobalKey("popUpSE_" + data.tabId, state);
						res = SBExtension.injectPage.showPopUp(data, data.state == 7 ? 1 : 0, doc, state);
					}
					else if(stateArray[0] == 2 && stateArray[1] == data.state && element) {
						SBExtension.injectPage.forceRemoveBanner(doc);
						res = true;
					} else if(stateArray[1] != data.state || btn && btn.innerHTML == SBExtension.browserInject.getLocalizedString("clickToLogin") && stateArray[1] == data.state && SBExtension.injectPage.loginState == "1") {
						if (element) {
							SBExtension.injectPage.forceRemoveBanner(doc, true);
						}
						state = 1 + '@' + data.state + '@' + data.mID;
						SBExtension.store.storeGlobalKey("popUpSE_" + data.tabId, state);
						res = SBExtension.injectPage.showPopUp(data, 1, doc, state);

					}
					else if(stateArray[0] == 1 && stateArray[1] == data.state && btn && btn.innerHTML != SBExtension.browserInject.getLocalizedString("clickToLogin") && SBExtension.injectPage.loginState == '0') {
						if (element) {
							SBExtension.injectPage.forceRemoveBanner(doc, true);
						}
						var datas = data;
						setTimeout(function() {
							SBExtension.injectPage.showPopUp(datas, 1, doc, state);
						},600);
						res = true;
					}
				} else {
					if (!forceHidePopup) {
						var hr = true;
						if (state) {
							var stateArray = state.split('@');
							if (stateArray[0] == 3 || stateArray[0] == 2) {
								hr = false;
							}
						}
						if (hr) {
							var newState = 1 + '@' + data.state + '@' + data.mID;
							SBExtension.store.storeGlobalKey("popUpSE_" + data.tabId, newState);
							var force = data.state == 7 ? 1 : 0;
							if (state) {
								state = newState;
								res = SBExtension.injectPage.showPopUp(data, force, doc, state);
							} else if(data.state != 0 && data.state != 5) {
								state = newState;
								res = SBExtension.injectPage.showPopUp(data, force, doc, state);
							}
						}
					} else {
						SBExtension.injectPage.hidePopUp(data, true, doc);
						res = true;
					}
				}
				break;
			case 'reloadTab':
				SBExtension.injectPage.reloadPage(doc);
				break;
			case 'TBPresence':
				SBExtension.injectPage.tbIsPresent = true;
				SBExtension.store.storeGlobalKey("popUpSE_tbIsPresent", true);
				break;
			case 'TBClick':
				var element = doc.getElementById('popUpSEToolbar');
				if (state) {
					var stateArray = state.split('@');
					if (stateArray[0] == 1 && stateArray[1] == data.state && data.state == '7') {
						state = 0 + '@' + data.state + '@' + data.mID;
						SBExtension.store.storeGlobalKey("popUpSE_" + data.tabId, state);
					}
					else if (stateArray[0] == 3 && stateArray[1] == data.state && data.state == '7' && element) {
						state = 2 + '@' + data.state + '@' + data.mID; //3 + '@' + data.state + '@' + data.mID;
						SBExtension.store.storeGlobalKey("popUpSE_" + data.tabId, state);
					}
					else if (stateArray[0] > 1 && stateArray[1] == data.state && data.state == '7') {
					}
					else if (stateArray[0] == 1 && stateArray[1] == data.state && data.state != '7') {
						state = 1 + '@' + data.state + '@' + data.mID;
						SBExtension.store.storeGlobalKey("popUpSE_" + data.tabId, state);
					}
					else if (stateArray[0] > 1 && stateArray[1] == data.state && data.state != '7') {
						state = 1 + '@' + data.state + '@' + data.mID;
						SBExtension.store.storeGlobalKey("popUpSE_" + data.tabId, state);
					}
				}
			
				if (element  ||  data.state == 5  ||  data.state == 1 || data.state == 2) {
					if (data.state == 1) {
						var url = httpPrefix + SBExtension.config.sbHostName + "/shop?merchid=" + data.mID + "&setb=1";
						SBExtension.browserInject.jumpToURL(doc, url);
					}
					else if (data.state == 2  ||  data.state == -2  ||  data.state == 5) {
						var locExtra = "";
						if (data.mCountry) {
							locExtra = ("&loc=" + data.mCountry);
						}
						var url = httpPrefix + SBExtension.config.sbHostName + "/g/shopredir?merchant=" + data.mID + "&setb=1" +
							"&memberid=" + data.memberID +
							"&currdate=" + data.currDate +
							"&state=" + data.state +
							"&merchantID=" + data.mID +
							"&count=" + data.count +
							"&startUrl=" + data.startUrl +
							"&redirTimeout=" + (SBExtension.config.forcingNonIFrameActivation ? "2" : "0") +
							locExtra;
						SBExtension.injectPage.activateContent(url, data.tabId, doc, data.mID, data.forcingNonIframe, data.mUrl);
						if (data.state == 5) {
							SBExtension.browserInject.sendBgMessage("ChangeState", data.tabId, {url:url, mID:data.mID});
						}
					}
				}
				else if (data.state == 0) {
					var url = httpPrefix + SBExtension.config.sbHostName + "/shop";
					SBExtension.browserInject.jumpToURL(doc, url);
				}
				break;
			case "activateState":
				if (jqSB('#main #scene #step2 .dot').length > 0) {
					return;
				}			
				SBExtension.statePopups.initState(jqSB, doc, data.tabId);
				SBExtension.statePopups.createPopup(data.arrayState);
				//SBExtension.injectPage.viewNotify(data.arrayState, doc);
				break;
			case "clearNotification":
				SBExtension.statePopups.clearPopup(doc);
				//SBExtension.injectPage.clearNotify(doc);
				break;	
			case "clearPCodeNotification":
				SBExtension.statePopups.clearPCodeNotification(doc);
				//SBExtension.injectPage.clearPCodeNotification(doc);
				break;
			case "specialCase":
				SBExtension.specialCaseBanner.initSpecialCase(jqSB, doc, data.tabId);
				SBExtension.specialCaseBanner.createBanner(data, state);	
				//SBExtension.injectPage.createSpecialCaseBanner(data, doc);
				break;
			case "bannerCategories":
				var onKeyRetrieved = function(state) {
					SBExtension.categoriesBanner.initCategories(jqSB, doc, data.tabId);
					SBExtension.categoriesBanner.createBanner(data, state);			
				};
				var state = SBExtension.store.retrieveGlobalKey("popUpBC_" + data.tabId, function(state) {
					onKeyRetrieved(state);
				});
				if (!SBExtension.browserInject.isInjectPagePreActivated() || SBExtension.getIEVersion()) {
					onKeyRetrieved(state);
				}
				break;
			case "searchPopup":
				SBExtension.searchPopups.initSearch(jqSB, doc, data.tabId);
				SBExtension.searchPopups.createPopup(data);
				break;
		}
	  } catch (err2) {
		SBExtension.alert_debug('Error in contentHandle!!! ' + err2, err2);
	  }
	  return res;
	},
	getDocumentByID: function(tabId) {
		//window.alert("@@@@ INJECT!!! @@@@ getDocumentByID is called: tabId=" + JSON.stringify(tabId));
		return SBExtension.browserInject.getDocumentByID(tabId);
	},
	sendBackground: function(eventName, tabId) {
		//window.alert("@@@@ INJECT!!! @@@@ sendBackground is called: eventName=" + JSON.stringify(eventName) + "; tabId=" + JSON.stringify(tabId));
		SBExtension.browserInject.sendBgMessage(eventName, tabId);
	},
	processPageMessage: function(msgType, msgBody) {
		if (Object.prototype.toString.call(msgBody) == "[object String]") {
			msgBody = JSON.parse(msgBody);
		}
		switch(msgType) {
			case 'GoldSurveyIDs':
				var surveyIds = msgBody;
				SBExtension.browserInject.sendBgMessage("CheckSurveyValidity", '', surveyIds, function(response) {});
				break;
			case 'DefaultSBBtnSearch':
				var defaultParams = msgBody;
				SBExtension.browserInject.sendBgMessage("DefaultSBBtnSearch", '', defaultParams, function(response) {});
				break;
			case 'SEFinishTutorial':
				var defaultParams = msgBody;
				SBExtension.store.clearKey("popUpSE_MustBeClosed", true);
				SBExtension.store.clearKey("SETutorialStarted", true);
				SBExtension.browserInject.sendBgMessage("TutorialFinished", '', defaultParams, function(response) {});
				break;
			case 'SESwitchTutorialURL':
				var defaultParams = msgBody;
				SBExtension.store.clearKey("popUpSE_MustBeClosed", true);
				SBExtension.store.clearKey("SETutorialStarted", true);
				SBExtension.browserInject.sendBgMessage("TutorialUrlSwitched", '', defaultParams, function(response) {});
				break;
		}
	},
	contentListener: function(evt) {
		//console.log("@@@@ INJECT!!! @@@@ contentListener is called: evt=" + JSON.stringify(evt));
		if (evt.sbPageMsgType) {
			SBExtension.injectPage.processPageMessage(evt.sbPageMsgType, evt.sbPageMsgBody);
			return;
		}
		var tabId = evt.tabId;
		var state = evt.state;
		var seType = evt.seType;
		var mid = evt.seMID;
		var doc = SBExtension.injectPage.getDocumentByID(tabId);
		var isUrlSecure = (doc.location.href.indexOf("https:")==0);
		var httpPrefix = (isUrlSecure) ? "https://" : "http://";
		if (!doc || typeof state == "undefined") return;
		
		if (seType == "SEClose") {
			SBExtension.store.storeGlobalKey("popUpSE_" + tabId, 2 + '@' + state + '@' + mid);
			if (state==7) SBExtension.store.storeGlobalKey(SBExtension.config.keyPrefixActivate + '@' + mid, {tabId:tabId, state:state, ts:(new Date()).getTime()});
			SBExtension.injectPage.forceRemoveBanner(doc);
		} else
		if (seType == "SESCClose") {
			if (isNaN(mid)) {
				var closeExpirationTS = new Date();
				if (SBExtension.config.encraveLinkCloseStartNewDay) {
					// Just make the day start at 4AM - to ensure people who stay up around and after midnight don't get expiration too soon (right at midnight)
					closeExpirationTS.setHours(4); //0);
					closeExpirationTS.setMinutes(0);
					closeExpirationTS.setSeconds(0);
					closeExpirationTS.setMilliseconds(0);
				}
				closeExpirationTS = closeExpirationTS.getTime() + SBExtension.config.encraveLinkCloseExpirationMinutes * 60000;
				SBExtension.store.storeGlobalKey("popUpSC_" + mid, 2 + '@' + state + '@' + closeExpirationTS);
				setTimeout(function() {
					var onGlobalStateRetrieved = function(globalState) {
						var memberID = (globalState && globalState.memberInfo && globalState.memberInfo.memberID) ? globalState.memberInfo.memberID : 0;
						var img = jqSB('<img/>', {id:"sb_offers", style:"display:none", src:"//sboffers.swagbucks.com/aff_i?offer_id=4867&aff_id=34&url_id=9&aff_sub=" + memberID + "&ts=" + new Date().getTime()});
						jqSB(divSE, doc).append(img);
						globalState.onGlobalStateRetrievedAndProcessed = true;
					}
					var globalState = SBExtension.store.retrieveGlobalState(onGlobalStateRetrieved);
					if (globalState && !globalState.onGlobalStateRetrievedAndProcessed) {
						onGlobalStateRetrieved(globalState);
					}
				},100);
			} else {
				SBExtension.store.storeGlobalKey("popUpSC_" + tabId, 2 + '@' + state + '@' + mid);
			}
			SBExtension.injectPage.forceRemoveSCBanner(doc);
		} else
		if (seType == "SECBClose") {
			SBExtension.store.retrieveGlobalKey("popUpBC_" + tabId, function(state) {
				var stateArray = state.split('@');
				SBExtension.store.storeGlobalKey("popUpBC_" + tabId, 2 + '@' + stateArray[1] + '@' + stateArray[2]);
			});
			SBExtension.categoriesBanner.removeBanner(doc, jqSB);
		} else
		if(seType == "SEClick") {
			if(SBExtension.injectPage.loginState == '0') {
				SBExtension.browserInject.openNewTab(httpPrefix + "www.swagbucks.com/p/login");
				// The next line ensures that the banner stays...
				return;
			}
			else{
			    SBExtension.injectPage.sendBackground('SEClickBtn', tabId);
			}
			SBExtension.injectPage.forceRemoveBanner(doc);
			SBExtension.store.storeGlobalKey("popUpSE_" + tabId, 2 + '@' + state + '@' + mid); //3 + '@' + state + '@' + mid);
		}
	},
	showPopUp: function(data, force, doc, state) {
	    var errComment = "";
	    var res = false;
	    try {
		res = SBExtension.injectPage.doShowPopUp(data, force, doc, state);
	    } catch(e) {
	    	SBExtension.alert_debug('Error in showPopUp!!! ' + errComment, e);
	    }
	    return res;
	},
	doShowPopUp: function(data, force, doc, state) {
		if (!data.mName) {
			return false;
		}
		var isUrlSecure = (doc.location.href.indexOf("https:")==0);
		var addingCouponsLink = (data.couponCount>0);
		var addingTerms = (data.mTerms != '');
		if (SBExtension.injectPage.loginState == "0" && data.mID > 0 && data.state + '' != '1') {
			SBExtension.injectPage.injectPopUpStyle('red',data.state, doc, false, addingCouponsLink, addingTerms);
			var res = SBExtension.injectPage.injectPopUpHtml(SBExtension.browserInject.getLocalizedString("clickToLogin"), 'none', data, doc, state);
			return res;
		} else if (SBExtension.injectPage.loginState == "0") {
			return false;
		}
		
		var res = false;
		switch(data.state + '') {
		case '1':
			break;
		case '2':
				jqSB("#popUpSEToolbar", doc).remove();
				SBExtension.injectPage.injectPopUpStyle('red',data.state, doc, false, addingCouponsLink, addingTerms);
				res = SBExtension.injectPage.injectPopUpHtml(SBExtension.browserInject.getLocalizedString("clickToActivate"), 'blue', data, doc, state);
			break;
		case '7':
			if(state) {
				var stateArray = state.split('@');
				if (stateArray[0] == 2) {
					jqSB("#popUpSEToolbar", doc).remove();
					return true;
				}
			}
			var element = doc.getElementById('popUpSEToolbar');
			if (element) {
				SBExtension.injectPage.hidePopUp(data.tabId, true, doc);
				res = true;
			}
			else {
				SBExtension.injectPage.injectPopUpStyle('green',data.state, doc, false, addingCouponsLink, addingTerms);
				data.force = force;
				res = SBExtension.injectPage.injectPopUpHtml(SBExtension.browserInject.getLocalizedString("youActivated"), 'green', data, doc, state);
			}
			break;
		default:
			SBExtension.store.clearKey("popUpSE_" + data.tabId, true);
			break;
		}
		return res;
	},
	onHidePopUpRetrieval: function(tabId, ignoreState, doc, state, mid, fromHide) {
		if (mid && !fromHide && !state) {
			SBExtension.injectPage.hidePopUp(tabId, ignoreState, doc, mid);
			return;
		}

		if (state) {
			// When state is present => hiding green...
			var stateArray = state.split('@');
			// Uncomment/replace 3 to allow for repeat greens...
			state = 2 + '@' + stateArray[1] + '@' + stateArray[2]; //3 + '@' + stateArray[1] + '@' + stateArray[2];
			SBExtension.store.storeGlobalKey("popUpSE_" + tabId, state);
			SBExtension.store.storeGlobalKey(SBExtension.config.keyPrefixActivate + '@' + mid, {tabId:tabId, state:state, ts:(new Date()).getTime()});
		}
		if (mid) {
				//No popup hiding here...
				return;
		}
		var element = doc.getElementById('popUpSEToolbar');
		if (element) {
				SBExtension.injectPage.forceRemoveBanner(doc);
		}
	},
	hidePopUp: function(tabId, ignoreState, doc, mid) {
		var state;
		if (!ignoreState) {
			state = SBExtension.store.retrieveGlobalKey("popUpSE_" + tabId, function(res) {
				SBExtension.injectPage.onHidePopUpRetrieval(tabId, ignoreState, doc, res, mid, true);
			});
		}
		if (!SBExtension.browserInject.isInjectPagePreActivated() || SBExtension.getIEVersion()) {
			SBExtension.injectPage.onHidePopUpRetrieval(tabId, ignoreState, doc, state, mid, true);
		}
	},
	reloadPage:function(doc) {
		doc.location.reload();
	},
	forceRemoveSCBanner:function(doc) {
		var element = doc.getElementById('popUpSpecialCaseToolbar');
		
		if (element) {
			jqSB(element, doc).remove();
			//document.body.style.marginTop='0px';
		}
	},
	forceRemoveBanner:function(doc, removingImmediately) {
		var element = doc.getElementById('popUpSEToolbar');
		var element1 = doc.getElementById('popUpSEToolbarCart');
		var element2 = doc.getElementById('popUpSEToolbarInner');
		
		if (element || element1 || element2) {
			if (removingImmediately) {
				jqSB(element2, doc).remove();
				jqSB(element1, doc).remove();
				jqSB(element, doc).remove();
				return;
			}
			this.animateHidePopUp(jqSB(element, doc), doc);
		}
	},
	injectPopUpStyle: function(color, state, doc, onExtensionPage, addingCouponsLink, addingTerms) {
	    var isUrlSecure = (doc.location.href.indexOf("https:")==0);
	    jqSB("#sestyle1", doc).remove();
	    hoorayWidth = (onExtensionPage) ? 600 : 800;
	    var buttonWidth = (addingCouponsLink) ? 230 : 400;
	    var stateNumber = Number(state);
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
		"font-family: Helvetica, Arial, sans-serif; \n" +
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
		"#popUpSEToolbar h3, #popUpSEHooray h3  \n" +
		"{ \n" +
		"   display: block !important; font-family:Helvetica, Arial, sans-serif !important; box-sizing: inherit !important;\n" +
		"} \n" +
		"\n" +
		"#popUpSEToolbar span, #popUpSEHooray span {\n" +
		"   font-family:Helvetica, Arial, sans-serif !important; box-sizing: inherit !important;\n" +
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

		"#popUpSEToolbar {display: block !important; font-family:Helvetica, Arial, sans-serif !important; box-sizing: border-box !important; height:68px;width:100%;min-width:1050px;position:fixed;top:0px;left:0px;z-index:2147483645;box-shadow: 0 1px rgba(0, 0, 0, 0.64);color:#FFFFFF;background-color:#6DB8D8;repeat-x scroll 0 0 transparent;cursor:default;}" +
		"#popUpSEToolbarMain {height:58px;margin: 5px 50px 5px 70px;background-color:#60ACCC !important;border-radius:5px;}" +
		"#popUpSEHooray  {height:68px;width:100%;                 position:fixed;top:0px;left:0px;z-index:2147483645;box-shadow: 0 1px rgba(0, 0, 0, 0.64);color:#FFFFFF;background-color:#4669B6;repeat-x scroll 0 0 transparent;cursor:default;}" +
		"#popUpSpecialCaseToolbar {height:68px;width:100%;min-width:1028px;position:fixed;top:0px;left:0px;z-index:2147483645;box-shadow: 0 1px rgba(0, 0, 0, 0.64);color:#FFFFFF;background-color:#6DB8D8;repeat-x scroll 0 0 transparent;cursor:default;}" +
		"#popUpSEHoorayInnerWrap {width:" + hoorayWidth + "px; margin: 0 auto;}" +
		"#popUpSEToolbarInner{text-align:left;font-family:Helvetica, Arial, sans-serif;color:#fff;height:36px;min-width:150px;margin:15px 0px 0px 30px;float:left;width:334px;}" + 
		"#popUpSEHoorayInner{text-align:left;font-family:Helvetica, Arial, sans-serif;color:#fff;height:36px;min-width:150px;margin:15px 0px 0px auto;float:left;width:950px;}" + 
		"@media only screen and (max-width: 1180px){ #popUpSEToolbarInner { width:" + (addingTerms ? 277: 334) + "px; margin-left: 5px;}  #popUpSEToolbarLink {margin-right: 10px;} #actionBtnAction {margin-left: 5px;} #popUpSEToolbarButton {width: auto !important} }" +
		
		"#popUpSEToolbarCoupon{float:left;margin-top:-1px;position:relative}" +
		"#popUpSEToolbarButton{float:left;margin-top:0px;width:" + ((stateNumber==5||stateNumber==7) ? buttonWidth+40 : buttonWidth) + "px;}" +
		"#popUpSEHoorayButton{margin-top: -15px;margin-left: 0px;width: 260px; float:left;}" +
		"#popUpSEHoorayCartWrap{float:left;width: 510px;}" +
		"#popUpSEHoorayBannerArrowWrap{float:left;}" +
		"#popupSEClickPrompt{font-size:18px;font-weight:bold;color: white !important;}" +
		"#popupSEMerchant {font-size:14px;margin-top:5px;color: white !important;}" +
		"#popUpSEToolbarLink{font-size:12px;color:#fff;font-weight:normal;text-decoration:underline;font-family:Helvetica, Arial, sans-serif; margin-left:25px;margin-top:22px;margin-right:30px;right:25px;position:absolute;float:right;cursor:pointer;}" +
		"#popUpSEToolbarLinkWrap{display:block;float:none;}" +
		"#popUpSEToolbarCross{height:19px;width:18px;position:fixed;top:12px;right:15px;}" +
		"#popUpSEToolbarCart{height:42px;width:43px;position:fixed;top:15px;left:15px;}" +
		"#popUpSEHoorayCart{height:42px;width:43px;position:relative;top:-5px;left:-20px;float:left;}" +

		"#popUpSEToolbar #popUpSEInfo3 {content: '';position: absolute;margin: -1px 0 0 5px;width: 14px;height: 14px;background: url('" + SBExtension.browserInject.getURL('img/pops/i-icon.svg', isUrlSecure) + "') no-repeat;opacity: 0.8}" +
		"#popUpSEToolbar #popUpSEInfo3:hover {opacity: 1}" +

		"#popUpSEToolbar #popUpSEInfo3 span {display: none;color: #fff;line-height: 20px;background: rgba(51,51,51,0.9);padding: 8px 12px;border-radius: 4px;-moz-border-radius: 4px;-webkit-border-radius: 4px;text-align: left;position: absolute;top: -10px;left: 20px;min-height: 35px;z-index: 100;white-space: nowrap;font-size: 12px;}"+
		"#popUpSEToolbar #popUpSEInfo3 span:before {content: '';display: block;width: 0;height: 0;position: absolute;border-top: 8px solid transparent;border-bottom: 8px solid transparent;border-left: 8px solid transparent;border-right: 10px solid rgba(51,51,51,0.9);top: 10px;left: -15px;}"+
		"#popUpSEToolbar #popUpSEInfo3:hover span {display: block;}";




	    var marginLeft = 10;
	    var scissorsOffset = 12;

	    switch(stateNumber) {
		case 2:
		default:
			css += "#actionBtnAction {width: 190px;display: block;margin-top: 10px;color: #60ACCC;font-family:sans-serif;font-size: 14px;font-weight: bold;line-height: 40px;text-align: center;border-radius: 4px;cursor: pointer;text-decoration: none;background-color: rgba(255,255,255,0.9);margin-left: " + marginLeft + "px;}" +
				"#actionBtnAction:hover {background-color: #fff;}" +
				"#actionBtnAction:active {background-color: #fff;}";
			break;
		case 5:
		case 7:
			if (addingCouponsLink) {
				marginLeft -= 20;
				scissorsOffset -= 20;
			}
			css += "#actionBtnAction {width: 240px;display: block;margin-top: 10px;color:#fff;font-family:sans-serif;font-size: 14px;font-weight: bold;line-height: 40px;text-align: center;border-radius: 4px;cursor: pointer;text-decoration: none;margin-left: " + marginLeft + "px;border: 1px solid white;}";
				//"#actionBtnAction:hover {background: #96b942 !important;}" +
				//"#actionBtnAction:active {background: linear-gradient(to bottom,  #92b04b 0%,#a3c453 97%,#c3db86 98%);background: #91ae4a !important;}";
			break;
	    }
	
	    css += ("#couponBtnAction {display: block;margin-top: 10px;color: #fff;font-family:sans-serif;font-size: 14px;font-weight: normal;line-height: 40px;text-align: center;border-radius: 4px;cursor: pointer;text-decoration: none;background-color: rgba(255,255,255,0.1);margin-left: " + marginLeft + "px !important; padding-left: 55px !important; padding-right:10px !important;border: 1px solid white;}" +
		    "#couponBtnAction:hover {background-color: #60ACCC;}" +
		    "#couponBtnAction:active {background-color: #60ACCC;}" +
		    "#popUpSEToolbar .scissors {width: 58px; height: 25px; margin:20px 7px 0px 7px; background: no-repeat !important; background-image: url('" + SBExtension.browserInject.getURL('img/pops/scissors.svg', isUrlSecure) + "') !important; position: absolute; top: 0px; left: " + scissorsOffset + "px; }");

	    jqSB("#sestyle2", doc).remove();
	    var style = doc.createElement("style");
	    style.type = "text/css";
	    style.id = "sestyle1";
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
	    jqSB("#sestyle2", doc).remove();
	    //for special terms
	    style = doc.createElement("style");
	    style.type = "text/css";
	    style.id = "sestyle2";
	
	    if (style.styleSheet) {
		style.styleSheet.cssText = SBExtension.injectPage.cssCT;
	    } else {
		style.appendChild(doc.createTextNode(SBExtension.injectPage.cssCT));
	    }
	    if (addElement && addElement.length > 0) {
		addElement[0].appendChild(style);
	    }
	},
	checkBodyMargin:function(doc, tabId, toolbarId, toolbarHeight) {
		if (!toolbarId) {
			toolbarId = "popUpSEToolbar";
		}
		if (!toolbarHeight) {
			toolbarHeight = 68;
		}
		var marginTop = toolbarHeight+2;
		try {
			// Firefox - fighting dead objects...
			doc = SBExtension.injectPage.refreshDoc(doc, tabId);
			var popUpSEToolbar = doc.getElementById(toolbarId);
			if (popUpSEToolbar && popUpSEToolbar.style.height == "0px") {
				popUpSEToolbar.style.height = toolbarHeight + "px";
			}
			if (popUpSEToolbar && (parseInt(doc.body.style.marginTop) == 0 || isNaN(parseInt(doc.body.style.marginTop)) || parseInt(doc.body.style.marginTop) > marginTop)) {
				doc.body.style.marginTop = marginTop + 'px';
				doc.body.stylePositionOld = doc.body.style.position;
				doc.body.style.position='relative';
				SBExtension.injectPage.setFixedElement(doc.body.childNodes, doc, marginTop);
			} else if( !popUpSEToolbar && parseInt(doc.body.style.marginTop) == marginTop) {
				doc.body.style.marginTop = '0px';
				doc.body.style.position = doc.body.stylePositionOld;
				SBExtension.injectPage.setUnFixedElement();
				SBExtension.injectPage.fixed_element = [];
			}
		} catch(e) {
			SBExtension.alert_debug('Error in injectPopUpHtml -> checkBodyMargin()', e);
		}
		if (doc) {
			setTimeout(function() {
				SBExtension.injectPage.checkBodyMargin(doc, tabId, toolbarId, toolbarHeight);
			}, 500);
		}
	},
	setFixedElement:function(childs, doc, marginTop) {
		doc = SBExtension.injectPage.refreshDoc(doc);
		jqSB.each(childs, function(k,v) {
			try{
				if ( 0 > [ 'popUpSEToolbar', 'popUpSEHooray', 'notifySEId0', 'notifySEId1', 'notifySEId2', 'notifySEId3', 'notifySEId4', 'notifySEId5', 'notifySEId6', 'notifySEId7', 'helpTab' ].indexOf( v.id ) ) {
					var element = jqSB(v, doc);
					var bottom = parseInt(element.css('bottom'));
					bottom = isNaN(bottom) ? 0 : bottom;
					if (bottom > 0) {
						return true;
					}
					var top = parseInt(element.css('top'));
					top = isNaN(top) ? 0 : top;
					var position = element.css('position');
					if ((position == 'fixed') && top < marginTop) {
						console.log(v.id);
						v.fixed_top = top;
						if (SBExtension.injectPage.fixed_element.indexOf(v) == -1) {
							SBExtension.injectPage.fixed_element.push(v);
						}
						v.style.top = (top + marginTop) + "px";
						if (parseInt(doc.body.style.marginTop) < (top + marginTop)) {
							//doc.body.style.marginTop = (top + marginTop) + "px";
						}
					}
					if (v.childNodes.length > 0) {
						SBExtension.injectPage.setFixedElement(v.childNodes, doc, marginTop);
					}
				}
			} catch (e) {}
		});
	},
	setUnFixedElement:function() {
		jqSB.each(SBExtension.injectPage.fixed_element, function(k,v) {
			try {
				v.style.top = v.fixed_top + "px";
			} catch (e) {}
		});
	},
	checkBodyHoorayMargin:function(doc) {
		setTimeout(function() {
		  doc = SBExtension.injectPage.refreshDoc(doc);
		  try {
			var popUpSEHooray = doc.getElementById("popUpSEHooray");
			if (popUpSEHooray) {
				SBExtension.injectPage.setFixedElement(doc.body.childNodes, doc, 70);
			}
			if (popUpSEHooray && (parseInt(doc.body.style.marginTop) == 0 || isNaN(parseInt(doc.body.style.marginTop)))) {
				doc.body.style.marginTop='70px';
				doc.body.style.position='relative';
				SBExtension.injectPage.setFixedElement(doc.body.childNodes, doc, 70);
			} else if( !popUpSEHooray) {// && parseInt(doc.body.style.marginTop) == 70) {
				doc.body.style.marginTop='0px';
				doc.body.style.position='';
				SBExtension.injectPage.setUnFixedElement();
				SBExtension.injectPage.fixed_element = [];
			}
			SBExtension.injectPage.checkBodyHoorayMargin(doc);
		  } catch(e) {
			SBExtension.alert_debug('Error in injectHoorayBanner -> checkBodyHoorayMargin()', e);
		  }
		}, 500);
		
	},
	animateShowPopUp: function(popup, doc, data, state) {
		var tbID = data.tabId;
		var force = data.force;
		var mID = data.mID;
		var animationStartTS = (new Date()).getTime();
		var timersIdx = (jqSB.timers) ? jqSB.timers.length : 0;
		var durationMillis = 500;

		jqSB(doc.body, doc).css({
			"margin-top": "0px"
		});

		popup.css({
			'height': "0px",
			'display': "inline-block"
		});


		if (SBExtension.browserInject.isUsingLongLocale()) {
		  for (var i = 0; i < 68; i++) {
			if (parseInt(popup.css('height')) > 68) {
				break;
			}
			setTimeout(function() {
				if (parseInt(popup.css('height')) < 68) {
					popup.css({
						'height': "+=1"
					});

					jqSB(doc.body, doc).css({
						"margin-top": "+=1"
					});
				} else {
					popup.css({
						'height': "68px"
					});
				}
			}, 8 * i);
		  }
		} else {
		  setTimeout(function() {
			jqSB(doc.body, doc).animate({
				"margin-top": "68px"
			}, durationMillis);
		  });
		  setTimeout(function() {
			popup.animate({
				"height": "68px"
			}, durationMillis);
		  });
		}

		var stateArray;
		if (state && (stateArray=state.split('@')).length>1 && stateArray[1]==7) {
			SBExtension.injectPage.onHidePopUpRetrieval(tbID, false, doc, null, mID);
		}

		setTimeout(function() {
			doc = SBExtension.injectPage.refreshDoc(doc, tbID);
			if (force == 1) {
				var greenBannerRemovalTimeout = (data.couponCount>0) ? 5000 : 2500;
				setTimeout(function() {
					/*setTimeout(function() {
					if (parseInt(doc.body.style.marginTop) > 0) {
							doc.body.style.marginTop = "0px";
					}
					}, 350);*/
					SBExtension.injectPage.hidePopUp(tbID, false, doc);
					if (state) {
						var stateArray = state.split('@');
						// hide permanently ...
						if (stateArray.length>=3 && stateArray[0]==3 && stateArray[1]==7 && stateArray[2]==mID) {
							SBExtension.store.storeGlobalKey("popUpSE_" + tbID, 2 + '@' + stateArray[1] + '@' + stateArray[2]);
						}
					}
				},greenBannerRemovalTimeout);
			}

			if (parseInt(doc.body.style.marginTop) > 68) {
				doc.body.style.marginTop = "68px";
			}
		},durationMillis);


				
	},
	animateHidePopUp: function(popup, doc) {
		setTimeout(function() {
			popup.remove();
		},400);

		setTimeout(function() {
			popup.animate({
				"height": "0px"
			}, 350);
		});
		setTimeout(function() {
			jqSB(doc.body, doc).animate({
				"margin-top": "0px"
			}, 350);
		});


	},
	injectPopUpHtml:function(pref, color, data, doc, state) {
		var isUrlSecure = (doc.location.href.indexOf("https:")==0);
		var httpPrefix = (isUrlSecure) ? "https://" : "http://";
		var res = false;
		setTimeout(function(){
			SBExtension.injectPage.checkBodyMargin(doc, data.tabId);
		}, 600)
		try {
			var popUpSEToolbar = doc.getElementById("popUpSEToolbar");
			if (popUpSEToolbar && popUpSEToolbar.style.display == '') {
				return true;
			}
			jqSB('div[id=popUpSEToolbar]', doc).remove();
			jqSB('div[id=SESpecialTerms]', doc).remove();
		} catch(e) {
			SBExtension.alert_debug('Error in injectPopUpHtml -> remove()', e);
		}
		try {
			var eventClose = SBExtension.browserInject.createEventInjectionCode({
				seType :'SEClose',
				seTabID:data.tabId,
				seState:data.state,
				seMID: data.mID
			});
			var eventClick = SBExtension.browserInject.createEventInjectionCode({
				seType :'SEClick',
				seTabID:data.tabId,
				seState:data.state,
				seMID: data.mID
			});
		} catch(e) {
			SBExtension.alert_debug('Error in injectPopUpHtml -> createEventInjectionCode()', e);
		}
	
		var btnText = "";
		var currencySymbol = SBExtension.getOneCurrencySymbolForCountry(data.mCountry);
		var upTo = (data.upTo) ? SBExtension.browserInject.getLocalizedString("upTo") + " " : "";
		var earn = SBExtension.browserInject.getLocalizedString("earn");
		var per = SBExtension.browserInject.getLocalizedString("per");
		var cashBack = SBExtension.browserInject.getLocalizedString("cashBack");
		var bannerText = earn + " " + upTo + data.mSB + " SB " + per + " " + currencySymbol;
		var perText = earn + " " + upTo + data.mSB + "% " + cashBack + " ";
		
		switch(color) {
			case "none":
				btnText = SBExtension.browserInject.getLocalizedString("clickToLoginPrompt");
				break;
			case "green":
				btnText = '<img style="width:20px;height:16px;display:inline;margin-bottom: -2px;" src="' + SBExtension.browserInject.getURL("img/banner/ok.svg", isUrlSecure) + '"/>&nbsp;&nbsp;&nbsp;' + SBExtension.browserInject.getLocalizedString("activated");
				upTo = (data.upTo) ? SBExtension.browserInject.getLocalizedString("upTo") + " " : "";
				earn = SBExtension.browserInject.getLocalizedString("earning");
				bannerText = earn + " " + upTo + data.mSB + " SB " + per + " " + currencySymbol;
				perText = earn + " " + upTo + data.mSB + "% " + cashBack + " "; //" Cash Back ";
				break;
			case "red":
				btnText = SBExtension.browserInject.getLocalizedString("activateShopEarn");
				break;
			case "blue":
				btnText = SBExtension.browserInject.getLocalizedString("activateShopEarn");
				break;
		}
		
		var flagHtml = "";
		var memberCountry = data.memberCountry;
		if (memberCountry && data.mCountry!=memberCountry || !memberCountry && data.mCountry==data.lastCountry) {
			var flag = SBExtension.getFlagSuffix(data.mCountry);
			flagHtml = '<span>&nbsp;&nbsp;'
						+ '<img src="'+SBExtension.browserInject.getURL("img/shopearn/flag-"+flag+".png", isUrlSecure)+'">'
						+ '</span>';
		}
		
		try {
			var info = '<span id="popUpSEInfo2" title="'+bannerText+'"></span><span id="popUpSEInfo3"><span id="popUpSEInfo">'+bannerText+'</span></span>';
			var divSE = doc.createElement("div");
			divSE.setAttribute("id", "popUpSEToolbar");
			divSE.setAttribute("style", "height:0px");
			var divSEInnerHTML = '<div id="popUpSEToolbarCart">' +
					'<img src="' + SBExtension.browserInject.getURL("img/banner/sb_logo.svg", isUrlSecure) + '"/>' +
				'</div>' +
				'<div id="popUpSEToolbarMain">' +
				'<div id="popUpSEToolbarInner">' +
					'<div id="popupSEClickPrompt">' + perText + info + '</div>' +
					'<div id="popupSEMerchant">' + SBExtension.browserInject.getLocalizedString('at') + ' ' + data.mName
						+ flagHtml
					+ '</div>' +
				'</div>' +
				'<div id="popUpSEToolbarButton">' +
					'<a id="actionBtnAction">' + btnText + '</a>' +
				'</div>' +
				((data.couponCount>0) ? (
				  '<div style="float:initial">' +
					'<div id="popUpSEToolbarCoupon">' +
						'<div class="scissors"></div>' +
						'<a id="couponBtnAction">' + SBExtension.browserInject.getLocalizedString("seeAvailableCoupons") + '</a>' +
					'</div>' +
				  '</div>'
				 ) : '') +
				((data.mTerms == '') ? '' :
					'<div id="popUpSEToolbarLinkWrap"><a id="popUpSEToolbarLink">' + SBExtension.browserInject.getLocalizedString("seeSpecialTerms") + '</a></span>'
				) +
				'</div>' +
				'<div id="popUpSEToolbarCross">' +
					'<a href="#" id="sbHidePopUp" onclick="">' +
						'<img src="' + SBExtension.browserInject.getURL("img/banner/cross.svg", isUrlSecure) + '"/>' +
					'</a>' +
				'</div>';
			SBExtension.browserInject.setInnerHTML(divSE, divSEInnerHTML, doc);
			doc.getElementsByTagName("HTML")[0].appendChild(divSE);
			if ((color=="green"||color=="none") && $(window).width() < 1200) {
				setTimeout(function() {
					$("#actionBtnAction", doc).attr('style', function(i,s) { return (s|"") + '; width: 200px !important; margin-left: 0px !important;' });
					$("#popUpSEToolbarButton", doc).attr('style', function(i,s) { return (s|"") + '; width: 215px !important;' });
				},250);
			}
			var popUpSEToolbar = doc.getElementById("popUpSEToolbar");
			if (!popUpSEToolbar) {
				if (console && console.log) console.log("popUpSEToolbar FAILED to be created!!!");
			}

			res = (doc.getElementById("popUpSEToolbar") != null);
			setTimeout(function() {
				var img = jqSB('<img/>', {id:"sb_quantserve", style:"display:none", src:httpPrefix + "pixel.quantserve.com/pixel/p-b15U9CAASyBMc.gif?labels=Swagbucks+Browser+Extension&ts=" + new Date().getTime()});
				jqSB(divSE, doc).append(img);
			},100);
			setTimeout(function() {
				var img = jqSB('<img/>', {id:"sb_comscore", style:"display:none", src:httpPrefix + "b.scorecardresearch.com/p?c1=7&c2=15366183&c3=1&cv=2.0&cj=1&ts=" + new Date().getTime()});
				jqSB(divSE, doc).append(img);
			},100);
		} catch(e) {
			if (console && console.log) console.log("popUpSEToolbar FAILED to be created!!! err=" + err + "; err.stack=" + err.stack);
			SBExtension.alert_debug('Error in injectPopUpHtml -> settings popUpSEToolbar div content', e);
		}

		try {
			this.animateShowPopUp(jqSB(divSE, doc), doc, data, state);
		} catch(e) {
			SBExtension.alert_debug('Error in injectPopUpHtml -> settings popUpSEToolbar div dynamic content', e);
		}
		
		try {
			var sbHidePopUp = doc.getElementById('sbHidePopUp');
			//sbHidePopUp.setAttribute('onclick', eventClose);
			jqSB(sbHidePopUp, doc).click(function() {
				SBExtension.injectPage.contentListener({
					seType :'SEClose',
					tabId:data.tabId,
					state:data.state,
					seMID: data.mID});
				});

			var btn = doc.getElementById('actionBtnAction'); 
			//btn.setAttribute('onclick', eventClick);
			jqSB(btn, doc).click(function() {
				SBExtension.injectPage.contentListener({
				seType :'SEClick',
				tabId:data.tabId,
				state:data.state,
				seMID: data.mID});
			});
			var cpn = doc.getElementById('couponBtnAction'); 
			jqSB(cpn, doc).click(function() {
				var url = httpPrefix + SBExtension.config.sbHostName + "/shop/store/" + data.mID + "?page=104#topSec";
				SBExtension.browserInject.openNewTab(url);
			});
		} catch(e) {
			SBExtension.alert_debug('Error in injectPopUpHtml -> adding event', e);
		}

		if (data.mTerms == '') {
			return res;
		}
		
		try {
			jqSB("#SESpecialTerms", doc).remove();
			divSE = doc.createElement("div");
			divSE.setAttribute("id", "SESpecialTerms");
			var divSEInnerHTML = 
			'<div id="seTermsPopupWrap" class="sePopupWrap">' +
			'	<div id="seTermsPopupTitle"><span id="termsPopupStoreName"></span></div>' +
			'	<div id="seTermsPopupSubTitle">' + SBExtension.browserInject.getLocalizedString("specialTerms") + '</div>' +
			'	<div id="seTermsPopupStoreCont">' +
			'		<div id="seTermsPopupStoreSubTitle" class="seTermsPopupStoreSubTitle">' + SBExtension.browserInject.getLocalizedString("storeWideSpecialTerms") + '</div>' +
			'		<div id="seTermsPopupTermsWrap"></div>' +
			'	</div>' +
			'	<div id="seTermsPopupBtnWrap">' +
			'		<div class="seTermsPopupBtn seTermsPopupBtnBlue" id="seTermsPopupCancelBtn" >' + SBExtension.browserInject.getLocalizedString("close") + '</div>' +
			'	</div>' +
			'</div>';
			SBExtension.browserInject.setInnerHTML(divSE, divSEInnerHTML, doc);

			doc.getElementsByTagName("HTML")[0].appendChild(divSE);
		} catch(e) {
			SBExtension.alert_debug('Error in injectPopUpHtml -> adding terms', e);
		}
		
		jqSB("#popUpSEToolbarLink", doc).click(function() {
			var locExtra = "";
			if (data.mCountry) {
				locExtra = ("&loc=" + data.mCountry);
			}
			SBExtension.injectPage.showTermsPop(JSON.parse('[' + data.mTerms.replace(/(\')/gm,'"')+']'), httpPrefix + SBExtension.config.sbHostName + "/g/shopredir?merchant="+data.mID+"&page=-1"+locExtra, data.mName, false, false, doc);
		});
		
		jqSB("#sePopupCloseBtn, #seTermsPopupCancelBtn", doc).click(function() {
			SBExtension.injectPage.closeTermsPop(doc);
		});
		return res;
	},
	injectHoorayBanner:function(doc, hidingButton) {
		var isUrlSecure = (doc.location.href.indexOf("https:")==0);
		var httpPrefix = (isUrlSecure) ? "https://" : "http://";
		try {
			SBExtension.injectPage.checkBodyHoorayMargin(doc);
		} catch(e) {
			SBExtension.alert_debug('Error in injectHoorayBanner -> checkBodyMargin()', e);
		}
		try {
			var popUpSEHooray = doc.getElementById("popUpSEHooray");
			if (popUpSEHooray && popUpSEHooray.style.display == '') {
				return;
			}
			jqSB('div[id=popUpSEHooray]', doc).remove();
		} catch(e) {
			SBExtension.alert_debug('Error in injectHoorayBanner -> remove()', e);
		}
	
		try {
			var divSE = doc.createElement("div");
			divSE.setAttribute("id", "popUpSEHooray");
			var divSEInnerHTML = 
				'<div id="popUpSEHoorayInnerWrap"> <div id="popUpSEHoorayInner">' +
					'<div id="popUpSEHoorayCartWrap">' +
					'<div id="popUpSEHoorayCart">' +
						'<img src="' + SBExtension.browserInject.getURL("img/banner/sb_logo.svg", isUrlSecure) + '"/>' +
					'</div>' +
					'<div id="popupSEClickPrompt">' + SBExtension.browserInject.getLocalizedString("hoorayAddedSwagbutton") + '</div>' +
					'<div id="popupSEMerchant">' + SBExtension.browserInject.getLocalizedString("getGcFaster") + '</div>' +
				'</div>' +
				'<div id="popUpSEHoorayBannerArrowWrap">' +
					'<img src="' + SBExtension.browserInject.getURL("img/banner/arrow.png", isUrlSecure) + '"/>' +
				'</div>' +
				((hidingButton)
				  ? ''
				  : ('<div id="popUpSEHoorayButton">' +
					'<a target="_blank" href="' + httpPrefix + SBExtension.config.sbHostName + '/extension" id="actionBtnAction" >' + SBExtension.browserInject.getLocalizedString("learnMore") + '</a>' +
				     '</div>')
				) +
				'</div>' +
				'<div id="popUpSEToolbarCross">' +
					'<a href="#" id="sbHidePopUp">' +
						'<img src="' + SBExtension.browserInject.getURL("img/banner/cross.svg", isUrlSecure) + '"/>' +
					'</a>' +
				'</div></div>';
			SBExtension.browserInject.setInnerHTML(divSE, divSEInnerHTML, doc);

			doc.getElementsByTagName("HTML")[0].appendChild(divSE);

			jqSB("#actionBtnAction", doc).click(function() {
				doc = SBExtension.injectPage.refreshDoc(doc);
				var popUpSEHooray = doc.getElementById('popUpSEHooray');
				popUpSEHooray.parentNode.removeChild(popUpSEHooray);
				doc.body.style.marginTop = '0px';
			});
			jqSB("#sbHidePopUp", doc).click(function() {
				doc = SBExtension.injectPage.refreshDoc(doc);
				var popUpSEHooray = doc.getElementById('popUpSEHooray');
				popUpSEHooray.parentNode.removeChild(popUpSEHooray);
				doc.body.style.marginTop='0px';
				return false;
			});
		} catch(e) {
			SBExtension.alert_debug('Error in injectHoorayBanner -> settings popUpSEHooray div content', e);
		}
	},
	closeTermsPop:function(doc) {
		var termsData = {
			termsPopupWrap: jqSB("#seTermsPopupWrap",doc),
			termRowsOuterWrap: jqSB("#seTermsPopupTermsWrap",doc)
		};
		if(!jqSB("#seTermsPopupWrap",doc).length) return;
		if (!SBExtension.browserInject.isLocalStoragePreset || SBExtension.browserInject.isLocalStoragePreset()) {
			termsData.termsPopupWrap.hide(600);
		} else {
			termsData.termsPopupWrap.hide();
		}
		if (!jqSB("#seTermsPopupWrap",doc).length)
			return;
		//termsData.termsPopupWrap.hide(600);
		doc.getElementById('seTermsPopupWrap').style.display = 'none';
		jqSB("#fadeCover",doc).hide();
	},
	showTermsPop:function(terms, link, storeName, fromCoupn, coupnRestrict, doc) {
	var termsData = {
		termsPopupWrap: jqSB("#seTermsPopupWrap", doc),
		termRowsOuterWrap: jqSB("#seTermsPopupTermsWrap", doc)
	};
 
	var filteredTerms = [];
	for (var i = 0; i < terms.length; i++) {
		if(terms[i][2] > 2) continue;
		filteredTerms.push(terms[i]);
	};
	
	jqSB('#termsPopupCouponCont', doc).remove();
	jqSB('#termsPopupStoreSubTitle', doc).hide();
	if (coupnRestrict) {
		jqSB('#seTermsPopupTitle', doc).after('<div id="termsPopupCouponCont"><div class="termsPopupStoreSubTitle">' + SBExtension.browserInject.getLocalizedString("couponSpecialTerms") + '</div>' + coupnRestrict + '</div>');
	}
	if (filteredTerms.length) {
		var type=-1,html = "";
		for (var i = 0; i < filteredTerms.length; i++) {
			var type = filteredTerms[i][2];
			var isEven = i % 2 == 0;
			html+= '<div class="seTermsPopupRow '+(!isEven ? 'seTermsPopupRowOdd': '')+'">';
			if(type <= 1) {
				html +='<div class="seTermsPopupRowSect">'+filteredTerms[i][0]+'</div>';
				if(type == 0) {
					html += '<div class="seTermsPopupRowSbAmt seTermsPopupRowSect">'+filteredTerms[i][1]+ ' SB ' + SBExtension.browserInject.getLocalizedString("per") + ' ' + SBExtension.browserInject.getLocalizedString("currencyWord") + '</div>';
				}else if(type == 1) {
					html += '<div class="seTermsPopupRowSbAmt seTermsPopupRowSect">'+filteredTerms[i][1]+' SB ' + SBExtension.browserInject.getLocalizedString("flat") + '</div>';
				}	
			}else {
				html +='<div>'+filteredTerms[i][0]+'</div>';
			}
			html += '</div>';
		};
		SBExtension.browserInject.setInnerHTML(termsData.termRowsOuterWrap[0], html, doc);
		if(coupnRestrict) jqSB('#termsPopupStoreSubTitle', doc).show();
		jqSB('#seTermsPopupStoreCont', doc).show();
	}else{
		jqSB('#seTermsPopupStoreCont', doc).hide();
	}
	SBExtension.browserInject.setInnerHTML(doc.getElementById("termsPopupStoreName"), storeName, doc);
	jqSB("#termsPopupShopNowBtn", doc).attr("href", link);
	termsData.termsPopupWrap.css({
		marginTop: -(jqSB("#seTermsPopupWrap", doc).outerHeight()/2) + (jqSB("#topBarOuter", doc).length ? jqSB("#topBarOuter", doc).outerHeight()/2 : 0),
		marginLeft: -(jqSB("#seTermsPopupWrap", doc).outerWidth()/2)
	}).fadeIn("fast").css({"display":"block"});
	return false;
	},
	activateContent:function (url, tabId, doc, mID, forcingNonIframe, merchantURL) {
		forcingNonIframe = forcingNonIframe || SBExtension.config.forcingNonIFrameActivation;
		var ifrms = doc.getElementById("sb-ifrm-activate");
		var isUrlSecure = (doc.location.href.indexOf("https:")==0);
		var ifrm;
		if (ifrms) {
			ifrm = ifrms;
			ifrm.setAttribute("src", '');
		} else {
			//ifrm = doc.createElement([...].indexOf(Number(mID)) >= 0 ? "IMG" : "IFRAME" );
			ifrm = doc.createElement("IFRAME");
			ifrm.setAttribute("id", "sb-ifrm-activate");
			ifrm.style.width = "1px"; //BB ifrm.style.width = "100px";
			ifrm.style.height = "1px"; //BB ifrm.style.height = "100px";
			ifrm.style.position = "absolute";
			ifrm.style.top = "-9999px"; //BB ifrm.style.top = "100px";
			ifrm.style.left = "-9999px"; //BB ifrm.style.left = "100px";
			//ifrm.setAttribute('onload', 'alert("123")');
			doc.getElementsByTagName("HTML")[0].appendChild(ifrm);
		}
		ifrm.setAttribute("src", (isUrlSecure || forcingNonIframe) ? '' : url + '&drctLink=1');
		if (isUrlSecure || forcingNonIframe) {
			url = url.replace(/^https:[/][/]/, "http://");
			if (SBExtension.injectPage.usingSameTabForNonIFrameActivation && (SBExtension.config.forcingNonIFrameActivation || !forcingNonIframe)) {
				if (SBExtension.config.addingDeepLinkURL && merchantURL && merchantURL.match(/=[$][(](arg1|goto)[)]/)) {
					url += ("&dlink=" + encodeURIComponent(doc.location.href));
				}
				doc.location.href = url;
			} else {
				SBExtension.browserInject.openNewTab(url);
			}
		}
	}
}

window.addEventListener("message",
	function(e) {
		try {
			if (e.data=="UninstallExtn") SBExtension.browserInject.sendBgMessage("UninstallExtn");
		} catch(e) {}
	}, false);

/*SEND TO BG*/
//window.addEventListener("message", receiveMessage, false);
SBExtension.browserInject.addWindowEventListener(function(e) { 
	SBExtension.injectPage.contentListener(e);
})
SBExtension.browserInject.addOnBgMessageListener(function(tabId, data, curDoc) { 
	SBExtension.injectPage.contentHandle(tabId, data, curDoc);
})

SBExtension.injectPage.cssCT = '#specialTermsWrap{ margin: 10px 0; font-size: 12px; color: #555555; } ' + 
'#specialTermsTxt { padding: 5px 0; font-size: 12px; text-transform: uppercase; color: #999999; font-weight: bold; font-family: "Myriad Pro", Arial; } ' +
'#specialTermsMrchRowWrap { width: 460px; } ' +
'.specialTermsMrchRow { font-weight: bold; font-size: 11px; padding: 10px 5px; } ' +
'.specialTermsMrchRowOdd { background: #e9e9e9; } ' +
'.specialTermsMrchRowSect { display: inline-block; zoom: 1; width: 49%; *display: inline; } ' +
'.specialTermsMrchSbAmt { color: #e77d28; text-align: right; } ' +
//'.sePopupWrap {position: fixed;top: 50%;left: 50%;background: #F2F2F4 url(' + SBExtension.browserInject.getURL("img/st/sbwatermark.png") + ') right top no-repeat;background: url(' + SBExtension.browserInject.getURL("img/st/sbwatermark.png") + ') no-repeat right top, -webkit-gradient(linear, left top, left bottom, color-stop(0%,#fafafb), color-stop(3%,#fafafb), color-stop(100%,#f1f1f3));background: url(' + SBExtension.browserInject.getURL("img/st/sbwatermark.png") + ') no-repeat right top, -webkit-linear-gradient(top,  #fafafb 0%,#fafafb 3%,#f1f1f3 100%);background: url(' + SBExtension.browserInject.getURL("img/st/sbwatermark.png") + ') no-repeat right top, linear-gradient(top,  #fafafb 0%,#fafafb 3%,#f1f1f3 100%);*background-color: #F2F2F4;*background-position: right top;-moz-border-radius: 6px;-webkit-border-radius: 6px;border-radius: 6px;-moz-box-shadow: rgba(00,00,00, .75) 0 0 10px;-webkit-box-shadow: rgba(00,00,00, .75) 0 0 10px;box-shadow: rgba(00,00,00, .75) 0 0 10px;font-family: Helvetica, Arial, sans-serif;text-shadow: 0 1px 0 rgba(255,255,255, .6);font-size: 12px;color: #555555;padding: 30px 19px 20px;display: none;z-index: 2147483645;zoom: 1;} ' +
'.sePopupWrap {position: fixed;top: 50%;left: 50%;-moz-border-radius: 6px;-webkit-border-radius: 6px;border-radius: 6px;-moz-box-shadow: rgba(00,00,00, .75) 0 0 10px;-webkit-box-shadow: rgba(00,00,00, .75) 0 0 10px;box-shadow: rgba(00,00,00, .75) 0 0 10px;font-family: Helvetica, Arial, sans-serif;text-shadow: 0 1px 0 rgba(255,255,255, .6);font-size: 12px;color: #555555;padding: 30px 19px 20px;display: none;z-index: 2147483645;zoom: 1;background-color:#ffffff} ' +
'#seTermsPopupWrap {width: 518px;margin-left: -260px;} ' +
'.sePopupCloseBtn {position: absolute;top: 5px;right: 5px;width:17px; height:18px;background: url(' + SBExtension.browserInject.getURL("img/st/close.svg") + ') no-repeat center;cursor: pointer;} ' +
'#seTermsPopupTitle { color: #000; font-size: 21px; padding-bottom: 6px; line-height: 24px;} ' +
'#seTermsPopupSubTitle { color: #000; font-size: 21px; padding-bottom: 6px; line-height: 24px;} ' +
'#termsPopupStoreName { color: #000; font-size: 21px; font-weight: bold; padding-bottom: 6px; line-height: 24px;} ' + 
'.seTermsPopupStoreSubTitle { font-weight:bold; font-size:13px; padding-top:16px; display:none} ' +
'#seTermsPopupTermsWrap { margin-top:8px;} ' +
'.seTermsPopupRow { font-weight: bold; } ' +
'.seTermsPopupRowSect { display: inline-block; zoom: 1; width: 50%; *display: inline; vertical-align: middle; } ' +
'.seTermsPopupRowSbAmt { color: #e77d28; text-align: right; } ' +
'#seTermsPopupBtnWrap { margin-top: 15px; } ' +
'#seTermsPopupCancelBtn {margin-right: 10px;  text-shadow: none;} ' +
'.seTermsPopupBtn { font-size: 12px; font-weight: bold; border-radius: 4px; text-decoration: none !important; display: inline-block; *display: inline; zoom:1; cursor: pointer; width: 128px; height: 35px; line-height: 35px; text-align: center; } ' +
'.seTermsPopupBtn.seTermsPopupBtnGreen {	color: #3c5109; text-shadow: 0px 1px 0 rgba(255,255,255,.49); border: 1px solid #6f8b2c; background-color: #a1c152; background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#adcc5e), color-stop(100%,#9ab654)); background: -webkit-linear-gradient(top, #adcc5e 0%,#9ab654 100%); background: linear-gradient(to bottom, #adcc5e 0%,#9ab654 100%); box-shadow: 0px 1px 1px #999; } ' +
'.seTermsPopupBtn.seTermsPopupBtnGreen:active { text-shadow: 0px -1px 1px #bfd97e; background: #9ab654; background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#9ab654), color-stop(100%,#adcc5e)); background: -webkit-linear-gradient(top, #9ab654 0%,#adcc5e 100%); background: linear-gradient(to bottom, #9ab654 0%,#adcc5e 100%); } ' +
'.seTermsPopupBtn.seTermsPopupBtnGray { color: #555555; text-decoration: none; text-shadow: 0px 1px 0 rgba(255,255,255,1); border: 1px solid #ccc; background-color: #e8e8e8; background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#fefefe), color-stop(100%,#e8e8e8)); background: -webkit-linear-gradient(top, #fefefe 0%,#e8e8e8 100%); background: linear-gradient(to bottom, #fefefe 0%,#e8e8e8 100%); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#fefefe", endColorstr="#e8e8e8",GradientType=0 ); box-shadow: 0px 1px 1px #999; } ' +
'.seTermsPopupBtn.seTermsPopupBtnGray:active { background-color: #efefef; background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#e8e8e8), color-stop(100%,#fefefe)); background: -webkit-linear-gradient(top, #e8e8e8 0%,#fefefe 100%); background: linear-gradient(to bottom, #e8e8e8 0%,#fefefe 100%); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#e8e8e8", endColorstr="#fefefe",GradientType=0 ); } ' +
'.seTermsPopupBtn.seTermsPopupBtnBlue { color: #fff; text-decoration: none; background-color: #6DB8D8;} ';

SBExtension.injectPage.cssPopop = '#SESearchPopupId { top:5px;z-index:2147483646;cursor: pointer;right: 20px;position:fixed;text-align:left;color:#fff;font-family:Helvetica, Arial, sans-serif;width:372px;height:60px;border:1px solid #929292;border-radius:4px;background: -moz-linear-gradient(center top , #D9DFDF 0pt, #D9DFDF 3%, #E9E9E9 100%) repeat scroll 0 0 transparent; background: linear-gradient(to top,#D9DFDF 0,#E9E9E9 100%); } ' +
'#SESearchPopupId .SESearchImgContainer { float:left;width:50px;height:70px; } ' +
'#SESearchPopupId .SESearchImgage { width:24px;height:24px; margin-left:10px; margin-top:10px; } ' +
'#SESearchPopupId .SESearchImgage img { width:24px;height:24px; } ' +
'#SESearchPopupId .SESearchContent { float:left;color:#4C4C4C;line-height: 20px;margin-top: 10px; } ' +
'#SESearchPopupId .SESearchContent #sbNotifCloseBtn { position: absolute; top: 5px; right: 5px; width:18px; height:18px; float:tight; background: url(' + SBExtension.browserInject.getURL('img/pops/close.svg') + ') no-repeat center; cursor: pointer; } ' +
'#SESearchPopupId .SESearchContent .SESearchContentText { font-size: 15px;font-weight: bold;width: 320px; } ' +
'#SESearchPopupId .SESearchContent #clickViewText { font-size: 12px; color: #2388af;} ' +
'div[id^="SBStatePopup"] #clickViewText a { font-size: 12px !important; color: #2388af !important; display: table; height: 100%; text-decoration: none; } ' +
'.notifySEClass { z-index:2147483646;right: 20px;position:fixed; padding: 4px; text-align:left;color:#fff;font-family:Helvetica, Arial, sans-serif;width:372px;height:70px;border:1px solid #999;border-radius:4px;background-color:#ffffff;overflow-y: auto;overflow-x: hidden;box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.4); display: block; top: 5px; box-sizing: border-box; } ' + 
'.notifySEClass .SBStatePopup { display: table; height: 100%; } ' + // border-top:1px solid #a6a6a6;height:60px; 
'.notifySEClass .SBStatePopupHide { display: none; height: 100%; } ' + //border-top:1px solid #a6a6a6;display:none;clear: both;position: relative;height:60px; } ' + 
'.SBStateImageContainer { display: table-cell; vertical-align: middle; text-align: center; } ' +
'.notifySEClass .SBStatePopup .SBStateImageContainer, .notifySEClass .SBStatePopupHide .SBStateImageContainer { width:50px; } ' +
//'.notifySEClass .SBStateImageContainer .SBStateImage { width:30px;height:30px; margin-left:5px; margin-top:16px; } ' +
'.notifySEClass .SBStateImageContainer img { width:30px; /*height:30px;*/ } ' +
'.notifySEClass .SBStateTextContainer { /*float:left;*/ color:#4C4C4C; line-height: 20px; margin-top: 2px; vertical-align: middle; display: table-cell; } ' +
'.notifySEClass .SBStateTextContainer .SBStatePopupClose { position: absolute; top: 5px; right: 5px; width:18px; height:18px; float:tight; background: url(' + SBExtension.browserInject.getURL('img/pops/close.svg') + ') no-repeat center; cursor: pointer; } ' +
'.notifySEClass .SBStateTextContainer .SBStateTextElement { font-size: 12px; font-weight: bold; } ' + 
'.notifySEClass .SBStateTextContainer #clickViewText { font-size: 12px; }  ' +
'.notifySEClass .SBStateTextContainer .clickViewAllLink { font-size: 12px;text-decoration: underline;cursor: pointer;position: absolute;bottom: 2px;right: 40px; } ' +
'.sbNotifViewMore { position: absolute; bottom: 5px; right: 5px; font-size: 12px; line-height: 17px;  } ' +
'.sbNotifViewMoreNext, .sbNotifViewMorePrev { background: 0; display: inline-block; cursor: pointer; outline: none; color: #2388af; font-weight: bold;width: 0;height: 0;border-style: solid;border-width: 5px 0 5px 6px; border-color: transparent transparent transparent #69B8D6; line-height: 12px; vertical-align: middle; margin-left: 5px;} ' +
'.sbNotifViewMorePrev { border-width: 5px 6px 5px 0; border-color: transparent #69B8D6 transparent transparent; margin-left: 0; margin-right: 5px; } ' +
'.sbNotifViewMorePrev:hover { border-color: transparent #5cacca transparent transparent;} ' +
'.sbNotifViewMoreNext:hover { border-color: transparent transparent transparent #5cacca;} ' +
'.sbNotifViewMoreDisabled, .sbNotifViewMoreDisabled:hover, .sbNotifViewMoreDisabled2, .sbNotifViewMoreDisabled2:hover { cursor: default; opacity: .5; } ';

}
