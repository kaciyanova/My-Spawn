// This is Shop&Earn / Merchant-Activation state

SBExtension.MerchantStats = function() {
	this.mID = 0;
	this.currDate = null;
	this.lastSent = null;
	this.activation = {};
	this.isChanged = 0;
};

SBExtension.MerchantStats.prototype.getState = function(){
	var obj = SBExtension.store.retrieveGlobalKey("SEState");
	var date = SBExtension.bgPage.getServerDate();
	if(!obj){
		this.currDate = date.getTime();
		return this;
	}
	this.mID = obj.mID;
	this.currDate = this.currDate
	if(this.currDate == null){
		this.currDate = date.getTime();
	}
	this.lastSent = obj.lastSent;
	this.merchants = obj.merchants;
	this.affiliate = obj.affiliate;
	this.activation = obj.activation;
	this.isChanged = obj.isChanged;
	return this;
};

SBExtension.MerchantStats.prototype.save = function(){
	SBExtension.store.storeGlobalKey("SEState", this);
};

SBExtension.MerchantStats.prototype.setLogin = function(mId){
	if (!mId) {
		mId = 0;
	}
	this.checkState();
	if(this.mID == 0){
		this.mID = mId;
		this.isChanged = 1;
	}
	
	if(this.mID != mId){
		this.mID = mId;
		this.isChanged = 1;
	}
	this.checkState();
};

SBExtension.MerchantStats.prototype.addActivation = function(oldState, newState, isOldAff, isNewAff, oldRestore, newRestore, merchantID, startURL){
	this.checkState();
	var st = oldState;
	
	if(oldState == 1 && isOldAff == 1){
		oldState = -1//'1H';
	} else if(oldState == 1 && isOldAff == 0){
		oldState = 1;//'1N';
	}
	if(newState == 1 && isNewAff == 1){
		newState = -1;//'1H';
	} else if(newState == 1 && isNewAff == 0){
		newState = 1;//'1N';
	}
	if(oldState == 2 && oldRestore == 1){
		oldState = -2;//'2E';
	} else if(oldState == 2 && oldRestore == 0){
		oldState = 2;//'2N';
	}
	if(newState == 2 && newRestore == 1){
		newState = -2;//'2E';
	} else if(newState == 2 && newRestore == 0){
		newState = 2;//'2N';
	}
	if(newState == oldState || st == -100 && newState == 7){
		return;
	}
	
	var mer = this.activation[merchantID];
	if(!mer){
		mer = {};
	}
	
	var data = mer[oldState + '|' + newState];
	if(!data){
		data = {};
		data.count = '0';
	}
	data.count = (data.count * 1 + 1) + '';
	mer[oldState + '|' + newState] = data;
	this.activation[merchantID] = mer;
	
	var obj = {};
	obj.mID = this.mID;
	obj.merchantID = merchantID;
	obj.currDate = this.currDate;
	obj.newState = newState;
	obj.oldState = oldState;
	obj.count = data.count;
	obj.startURL = startURL;
	
	if(st == -100 && (data.count == '1' || newState == -1)){
		obj.count = '0';
		this.sendActivation(obj, 1);
	} else
	if(st == 1 && newState == null){
		this.sendActivation(obj, 1);
	} else
	if(st != 2 && st != -100 && st != 5 && st != 7){
		this.sendActivation(obj, 1);
	} else
	if(st == 7 && (newState == -1 || data.count == '1')){
		this.sendActivation(obj, 1);
	}
	
	this.isChanged = 1;
	this.checkState();
	this.save();
};

SBExtension.MerchantStats.prototype.sendActivation = function(objSend, method){
	if(this.mID == 0){
		return;
	}
	objSend.method = method;
	
	objSend.tbid = SBExtension.store.getTbUID();
	
	var ajaxCall = {
	    type: 'POST',
	    url: "http://" + SBExtension.config.sbHostName + "/?cmd=tbf-jx-tb-ext-merchant&ext=1",
	    data: objSend,
	    success: function (resp) {
	    },
	    error: function (data) {
	    }
	};
	SBExtension.getAvailableBrowser().addSecurityFieldsToAjaxCall(ajaxCall, { dataType: 'JSON', xhrFields: { withCredentials: true } });
	if (SBExtension.getAvailableBrowser().executeAjaxCall) {
	    SBExtension.getAvailableBrowser().executeAjaxCall(ajaxCall);
	} else {
	    $.ajax(
	        ajaxCall
	    );
	}
};

SBExtension.MerchantStats.prototype.checkState = function() {
	var date = SBExtension.bgPage.getServerDate();
	var nextSend = null;
	if(this.lastSent != null){
		nextSend = new Date(this.lastSent + 86400000);
		nextSend.setHours(0);
		nextSend.setMinutes(0);
		nextSend.setSeconds(0);
		nextSend.setMilliseconds(0);
	}
	
	if(date > nextSend || this.lastSent == null){
		this.sendState();
		this.lastSent = date.getTime();
		this.isChanged = 0;
	}
	this.save();
};

SBExtension.MerchantStats.prototype.sendState = function(flag, merchantID){
	if(this.mID == 0){
		return;
	}
	var date = SBExtension.bgPage.getServerDate();
	var objSend = {};
	
	
	var json = JSON.stringify(this.activation);

	json = '{"SEObject":[{' + json.substring(1, json.length - 1) + '}]}';
	
	objSend.activation = json;
	objSend.method = 0;
	objSend.mID = this.mID;
	objSend.currDate = this.currDate;
	
	objSend.tbid = SBExtension.store.getTbUID();

	this.activation = {};
	this.currDate = date.getTime();
	
	this.sendActivation(objSend, 0);
};

