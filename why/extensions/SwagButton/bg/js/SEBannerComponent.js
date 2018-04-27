SBExtension.BannerComponent = function() {
	this.specialCases = {};
	this.specialCaseViewNames = {};
	this.bannerCategories = {};
};

SBExtension.BannerComponent.prototype.setSpecialCase = function(forceReload) {
	// TODO : uncomment lines below after making it all dynamic
	//var specialCaseStore = SBExtension.store.retrieveGlobalKey("specialCase");
	//var specialCaseViewNameStore = SBExtension.store.retrieveGlobalKey("specialCaseViewName");	
	//if (specialCaseStore && !forceReload) {
	//	this.specialCases = specialCaseStore;
	//	this.specialCaseViewNames = specialCaseViewNameStore;
	//	return;
	//}

	var json =
	'{ "data" : [' +
		'{ "header": "Shopping at DELL?", "prompt": "Activate Dell Home or Business to earn SB",' +
		'  "domainNames" : ["Dell.com"],' +
		'    "merchants" : [{ "id" : 13, "viewName": "Dell Home"},{ "id" : 14, "viewName": "Dell Business"}]}' +
		', { "header": "InterContinental (IHG)", "prompt": "Activate an IHG Brand <br> to earn SB",' +
		'    "domainNames" : ["Ihg.com"],' +
		'    "merchants" : [{ "id" : 2254, "viewName": "InterContinental Hotels and Resorts"},{ "id" : 2255, "viewName": "Crowne Plaza"},{ "id" : 2256, "viewName": "Hotel Indigo"},{ "id" : 2257, "viewName": "EVEN Hotels"},{ "id" : 2258, "viewName": "Holiday Inn"},{ "id" : 2259, "viewName": "Holiday Inn Express"},{ "id" : 2260, "viewName": "Staybridge Suites"},{ "id" : 2261, "viewName": "Candlewood Suites"}]}'
		//+ ', { "header": "Watch and Earn!", "prompt": "Earn SB by checking out these videos and slideshows",' +
		//'    "domainNames" : ["Youtube.com", "Vimeo.com", "Netflix.com", "Facebook.com"],' +
		//'    "links" : [{ "viewName" : "Entertainment", "url_id":7, "cta" : "Get the latest news", "earn":"Earn 2 SB"},{ "viewName" : "Lifestyle", "url_id":1, "cta" : "Healthy living tips", "earn":"Earn 2 SB"},{ "viewName" : "Discovery", "url_id":3, "cta" : "Mystery videos", "earn":"Earn 2 SB"}]}'
		//+ ', { "header": "Ready to travel?", "prompt": "Earn SB when you book your trip with our partners",' +
		//'    "domainNames" : ["United.com","Aa.com","Delta.com","Kayak.com","Vegas.com","StarwoodHotels.com","Hilton.com","Motel6.com","flyfrontier.com","Marriott.com","Usairways.com"],' +
		//'    "merchants" : [{ "id" : 17},{ "id" : 24},{ "id" : 45},{ "id" : 1323},{ "id" : 38}]}'
	+ ']}';
	
	var data = null;
	json = json.replace('\t',' ');
	data = JSON.parse(json);
	
	var specialCases = {};
	var specialCaseViewNames = {};
	data = data['data'];
	for(var index in data){
		var  item = data[index];
		var domainNames = item['domainNames'];
		var mIds = [];
		var merchants = item['merchants'];
		var links;
		if (!merchants && (links=item['links'])) {
			for (var idx in domainNames) {
				var domainName = domainNames[idx];
				specialCases[domainName.toLowerCase()] = {links:links, header:item['header'], prompt:item['prompt']};
			}
			continue;
		}
		for (var ind in merchants) {
			var merchant = merchants[ind];
			var mID = merchant['id'];
			var viewName = merchant['viewName'];
			if (viewName) {
				specialCaseViewNames[mID] = viewName;
			}
			mIds.push(mID);
		}
		for (var idx in domainNames) {
			var domainName = domainNames[idx];
			specialCases[domainName.toLowerCase()] = {mIds:mIds, header:item['header'], prompt:item['prompt']};
		}
	}
	this.specialCases = specialCases;
	this.specialCaseViewNames = specialCaseViewNames;
	SBExtension.store.storeGlobalKey("specialCase", specialCases);
	SBExtension.store.storeGlobalKey("specialCaseViewName", specialCaseViewNames);
};

SBExtension.BannerComponent.prototype.checkSpecialCases = function(url, tab){
	var tabStateHandler = SBExtension.tabStateHandler;
	var domainName = tabStateHandler.getDomainname(url);
	var specialCase = this.specialCases[domainName];
	//var merchantURL = tabStateHandler.merchantURL;
	var merObj = SBExtension.tabStateHandler.getMerchantByUrl(url);
	if (specialCase) {
		if (!tab || tab.MerchantID > 0) {
			return;
		}
 		if (merObj) {
			return;
		}		
		var links = [];
		var merchants = [];
		var prompt = specialCase.prompt;
		var header = specialCase.header;
		var mIds = specialCase.mIds;

		if (!mIds) {
			links = specialCase.links;
			if (!links) {
				return;
			}
			// TODO : Remove the "if" below after the data is server-based!)
			if (!SBExtension.globalState.memberInfo || SBExtension.globalState.memberInfo.country != 1) {
				return;
			}
		}

		for (var index in mIds) {
			var id = mIds[index];
			var merchant = tabStateHandler.merchantsByID[id];
			var viewName = this.specialCaseViewNames[id];
			if (viewName) {
				merchant.viewName = viewName;
			}
			if(merchant){
				merchants.push(merchant);
			}
		}
	
		var state = {};
		state.name = "specialCase";
		state.tabId = tab.tabId;//tabId;
		state.memberID = SBExtension.network.memberInfo.memberID;
		state.domain = domainName;
		state.loginState = SBExtension.globalState.loginState;
		state.merchants = merchants;
		state.prompt = prompt;
		state.header = header;
		state.links = links;
		var sendMessageFunction = function(adBlockIsPresent) {
			if (adBlockIsPresent) {
				state.domain = "adblockplus.org";
			}
			setTimeout(function(){
				SBExtension.browser.tabsSendMessage(parseInt(tab.tabId), state);
			});
		};
		SBExtension.browser.isActivatingInSameTab(function(){sendMessageFunction(false);}, function(){sendMessageFunction(true);});
	}
}

SBExtension.BannerComponent.prototype.setBannerCategory = function(forceReload) {
	// TODO : uncomment logic below and finish dev/testing when needed...
	/*
	var json = 
	'{ "data" : [' +
		'{' +
			'"text": "Earn SB for answering surveys on Swagbucks",' +
			'"callToAction": "Take Surveys Now",' +
			'"clickURL": "http://www.swagbucks.com/surveys",' +
			'"uRLs": [' +
				'"ipoll.com",' +
				'"surveymonkey.com",' +
				'{' +
					'"domain": "mysurvey.com",' +
					'"Text": "Earn SB for answering surveys on Swagbucks",' +
					'"callToAction": "Take Surveys Now!",' +
					'"clickURL": "http://www.swagbucks.com/surveys"' +
				'}' +
			']' +
		'},' +
		'{' +
			'"text": "Earn SB for booking with our partners",' +
		        //'"header": "Ready to travel?", "prompt": "Earn SB when you book your trip with our partners",' +
			'"callToAction": "Start Shopping",' +
			'"clickURL": "http://www.swagbucks.com/shop/stores/12/travel-vacations",' +
			'"uRLs": [' +
				'"kayak.com",' +
				'"cheapflights.com",' +
				'"bookingbuddy.com",' +
				'"vayama.com"' +
			']' +
		'}' +
	']}';
	
	var data = null;
	json = json.replace('\t',' ');
	data = JSON.parse(json);
	
	var categories = {};
	data = data['data'];
	for(var index in data){
		var item = data[index];
		
		var text = item.text;
		var callToAction = item.callToAction;
		var clickURL = item.clickURL;
		var uRLs = item.uRLs;
		
		for(var ind in uRLs){
		
			var textValue = text;
			var callToActionValue = callToAction;
			var clickURLValue = clickURL;
			var domain = uRLs[ind];
			if(typeof domain == "object"){
				if(domain.text){
					textValue = domain.text;
				}
				if(domain.callToAction){
					callToActionValue = domain.callToAction;
				}
				if(domain.clickURL){
					clickURLValue = domain.clickURL;
				}
				domain = domain.domain;
			}
			
			categories[domain] = {
				'text':textValue,
				'callToAction':callToActionValue,
				'clickURL':clickURLValue
			};
		}
	}
		
	this.bannerCategories = categories;
	SBExtension.store.storeGlobalKey("bannerCategories", categories);
	*/
};

SBExtension.BannerComponent.prototype.checkBannerCategory = function(url, tab){
	if (!tab || tab.MerchantID > 0) {
		return;
	}
	var tabStateHandler = SBExtension.tabStateHandler;
	var mer = tabStateHandler.getMerchantByUrl(url);
	if (mer) {
 		return;
	}
	var domainName = tabStateHandler.getDomainname(url);
	var bannerCategories = this.bannerCategories[domainName];
	if(bannerCategories){
		var state = {};
		state.name = "bannerCategories";
		state.tabId = tab.tabId;//tabId;
		state.memberID = SBExtension.network.memberInfo.memberID;
		state.domain = domainName;
		state.loginState = SBExtension.globalState.loginState;
		state.text = bannerCategories.text;
		state.callToAction = bannerCategories.callToAction;
		state.clickURL = bannerCategories.clickURL;
		setTimeout(function(){
			SBExtension.browser.tabsSendMessage(parseInt(tab.tabId), state);
		});
	}
};

SBExtension.bannerComponent = new SBExtension.BannerComponent();
SBExtension.bannerComponent.setSpecialCase();
