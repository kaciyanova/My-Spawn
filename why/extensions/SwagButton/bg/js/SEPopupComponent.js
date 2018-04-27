SBExtension.PopupComponent = function() {
	this.searchPopup = {};
	this.answerPopup = null;
};

SBExtension.PopupComponent.prototype.setSearchPopup = function(json) {
	// TODO: Implement server side and then uncomment to enable...
	//json = json.replace('\t',' ');
	json = '{}';

	var domains = JSON.parse(json);
	
	for (var domain in domains) {
		var object = domains[domain];
		
		var rx = new RegExp(object.rx);
		var data = object.data;
		var search = object.search;
		var items = [];
		
		for (var ind in data) {
			var item = data[ind];
			items.push({
				"keyword": search + item.keyword,
				"text": item.text,
				"url": item.url,
				"rx": rx
			});
		}
		this.searchPopup[domain] = items;
	}
		
	SBExtension.store.storeGlobalKey("searchPopup", this.searchPopup);
}

SBExtension.PopupComponent.prototype.checkSearchPopup = function(url, tab) {
	if (!tab) {
		return;
	}
	var tabId = tab.tabId;
	var domainName = SBExtension.tabStateHandler.getDomainname(url);
	var searchPopup = this.searchPopup[domainName];
	if (searchPopup) {
		for (var index in searchPopup) {
			var item = searchPopup[index];
			if (item.rx.test(url) && url.search(item.keyword) > 1) {
				var state = {};
				state.name = "searchPopup";
				state.tabId = tabId;
				state.memberID = SBExtension.network.memberInfo.memberID;
				state.domain = domainName;
				state.loginState = SBExtension.globalState.loginState;
				state.text = item.text;
				state.clickURL = item.url;
				setTimeout(function() {
					SBExtension.browser.tabsSendMessage(parseInt(tabId), state);
				});
			
				break;
			}
			
		}
	}
};

SBExtension.popupComponent = new SBExtension.PopupComponent();
