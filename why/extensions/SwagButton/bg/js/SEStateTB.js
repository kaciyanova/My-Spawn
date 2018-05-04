// This is the state ported from ToolBar

SBExtension.Stats = function() {
	this.tbUID = SBExtension.store.getTbUID();
	this.logIn = 0;
	this.logOut = 0;
	this.mID = SBExtension.network.getCurrentMemberID();
	this.newMID = 0;
	this.isChangeMember = 0;
	this.lastSentTS = null;
	this.tbFlag = -1;
	this.extInst = 0;
	this.extInstAdd = 0;
	this.extInstDel = 0;
	this.clickAddExt = 0;
	this.isFlagChanged = 0;
};

SBExtension.Stats.prototype.clear = function(){
	var date = SBExtension.bgPage.getServerDate();
	this.currDate = date.getTime();
	this.tbUID = SBExtension.store.getTbUID();
	this.logIn = 0;
	this.logOut = 0;
	this.lastSentTS = date.getTime();
	this.tbFlag = -1;
	this.extInst = 0;
	this.extInstAdd = 0;
	this.extInstDel = 0;
	this.clickAddExt = 0;
	this.isFlagChanged = 0;
	this.save();
};

SBExtension.Stats.prototype.getState = function(){
	var obj = SBExtension.store.retrieveGlobalKey(SBExtension.config.StateTB);
	var date = SBExtension.bgPage.getServerDate();
	if(!obj){
		this.currDate = date.getTime();
		return this;
	}
	this.tbUID = SBExtension.store.getTbUID();
	this.logIn = obj.logIn;
	this.currDate = obj.currDate;
	if(this.currDate == null){
		this.currDate = date.getTime();
	}
	this.logOut = obj.logOut;
	this.mID = obj.mID;
	this.newMID = obj.newMID;
	this.loginChange = obj.loginChange;
	this.lastSentTS = obj.lastSentTS;
	this.tbFlag = obj.tbFlag; 
	this.extInst = obj.extInst;
	this.extInstAdd = obj.extInstAdd;
	this.extInstDel = obj.extInstDel;
	this.clickAddExt = obj.clickAddExt;
	this.isFlagChanged = obj.isFlagChanged;
	this.isChangeMember = obj.isChangeMember;
	return this;
};

SBExtension.Stats.prototype.save = function(){
	SBExtension.store.storeGlobalKey(SBExtension.config.StateTB, this);
};

SBExtension.Stats.prototype.saveMemberToStore = function(mId){
	var members = SBExtension.store.retrieveGlobalKey(SBExtension.config.LoginMembers);
	if(!members){
		members = {};
	}
	var member = members[mId];
	var cd = new Date(this.currDate);
	cd.setHours(0);
	cd.setMinutes(0);
	cd.setSeconds(0);
	cd.setMilliseconds(0);
	
	if(!member){
		member = [];
		member.push(cd.getTime());
		members[mId] = member;
	}else{
		if(member.indexOf(cd.getTime()) == -1){
			member.push(cd.getTime());
		}
		members[mId] = member;
	}
	SBExtension.store.storeGlobalKey(SBExtension.config.LoginMembers,	members);
};

SBExtension.Stats.prototype.setLogin = function(mId, oldMid){
	if (!mId) {
		mId = 0;
	}
	if (!oldMid) {
	    oldMid = 0;
	}
	if ((this.mID == 0 || oldMid == 0) && mId > 0) {
		// Member is logged in
		this.mID = 0;
		this.saveMemberToStore(mId);
		this.newMID = mId;
		this.isChangeMember = 1;
		this.isFlagChanged = 1;
	} else
	if (mId == 0 && (this.mID > 0 || oldMid > 0)) {
		// Member is logged out
		if (!this.mID && oldMid > 0) {
			this.mID = oldMid;
		}
		this.newMID = mId;
		this.saveMemberToStore(mId);
		this.isFlagChanged = 1;
		this.isChangeMember = 1;
	} else
	if(mId == 0 && this.mID == 0){
		this.saveMemberToStore(mId);
	} else
	if (this.mID != mId || oldMid && oldMid != mId) {
		// Different members
		this.newMID = mId;
		this.mID = 0;
		this.logOut++;
		this.isFlagChanged = 1;
		this.isChangeMember = 1;
	}
	if (this.isChangeMember) {
	    SBExtension.store.storeGlobalKey("SELastMemberID", this.newMID);
	}
	this.checkState();
};

SBExtension.Stats.prototype.addClick = function(){
	this.checkState();
	this.clickAddExt++;
	this.isFlagChanged = (this.clickAddExt == 1) ? 1 : 0;
	this.checkState();
};

SBExtension.Stats.prototype.checExt = function() {
	if(true){
		if(this.extInst == 0){
			this.isFlagChanged = 1;
			this.extInstAdd++;
		}
		this.extInst = 1;
	}else{
		if(this.extInst == 1){
			this.extInstDel++;
		}
		this.extInst = 0;
	}
	this.save();
};

SBExtension.Stats.prototype.checkState = function(oldTBID) {
	var this_ = this;
	setTimeout(function() {
		if (typeof(oldTBID) != "undefined")
			this.doCheckState(oldTBID);
		else {
			SBExtension.browser.getConduitToolbarAddonsToUninstall(
			function(addonsToRemove){
				this_.isTBPresent = addonsToRemove.length>0;
				this_.doCheckState();
			}, true, true);
		}
	});
};

SBExtension.Stats.prototype.doCheckState = function(oldTBID) {
	var date = SBExtension.bgPage.getServerDate();		
	if(this.lastSentTS == null || oldTBID){
		this.isFlagChanged = 1;
		this.lastSentTS = date.getTime();
		if (oldTBID)
			this.sendState(3, oldTBID);
	}
	var nextSend = null;
	if(this.lastSentTS != null){
		nextSend = new Date(this.lastSentTS + 24*60*60000); // FOR TEST: replace with half-hour (TODO)
		nextSend.setHours(0); // FOR TEST   --    TODO : comment back for "live"...
	}
	
	var cd = new Date(this.currDate);
	cd.setHours(0);
	cd.setMinutes(0);
	cd.setSeconds(0);
	cd.setMilliseconds(0);
	var isDailyTimeSend = (date > nextSend || this.lastSentTS == null);
	//0 - all send
	//1 - member change
	//2 - change required field
	if (isDailyTimeSend && (!SBExtension.handleDailyWinTS || (new Date().getTime() - SBExtension.handleDailyWinTS) >= 24 * 60 * 60000)) {
	    this.sendState(0);
	    var inst = this.extInst;
	    this.clear();
	    this.mID = SBExtension.network.getCurrentMemberID();
	    this.isFlagChanged = 1;
	    this.extInst = inst;
	    this.lastSentTS = date.getTime();
	    this.isChangeMember = 0;
	    this.newMID = 0;
	    SBExtension.handleDailyWinTS = new Date().getTime();
	    SBExtension.network.handleDailyWin();
	} else {
	    this.checExt();
	    var thisMID = this.mID;
	    if (!this.isChangeMember && thisMID && SBExtension.lastStatsSentMid != thisMID) {
	        this.newMID = thisMID;
	        thisMID = this.mID = 0;
	        this.isChangeMember = 1;
	    }
	    if (this.isChangeMember == 1) {
	        //id -> 0			
	        if (this.newMID == 0 && thisMID > 0) {
	            this.logOut++;
	        }
	        this.checExt();
	        var inst = this.extInst;
	        //this.sendState(1);
	        this.clear();
	        this.extInst = inst;
	        //0 -> id
	        if (this.newMID > 0 && thisMID == 0) {
	            this.logIn++;
	        }
	        this.mID = this.newMID;
	        this.newMID = 0;
	        this.checExt();
	        this.sendState(1);
	        this.isChangeMember = 0;
	        this.isFlagChanged = 0;
        }
	    else
	    if (this.isFlagChanged == 1) {
	        if (oldTBID)
	            this.sendState(3, 0);
	        else {
	            this.sendState(2);
	            this.isFlagChanged = 0;
	        }
	    }
	}
	this.save();
};

SBExtension.Stats.prototype.getDateYyyymmdd = function(date) {
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString();
	var dd  = date.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]);
};

//0 - all send
//1 - member change
//2 - change required field	
//3 - Toolbar was un-installed	
SBExtension.Stats.prototype.sendState = function(flag, oldTBID){
	var forceFlag = false;
	if (this.tbFlag==-1) {
		this.tbFlag = 0;
		forceFlag = true;
	}
	var objSend = {};
	objSend.tbUID = (flag==3) ? ((oldTBID) ? oldTBID : this.tbUID) : this.tbUID;
	objSend.mID = this.mID;
	objSend.flag = flag;
	objSend.currDate = this.currDate;
	objSend.lastSent = this.lastSentTS;
	
	var cd = new Date(this.currDate);
	cd.setHours(0);
	cd.setMinutes(0);
	cd.setSeconds(0);
	cd.setMilliseconds(0);
	var data = SBExtension.store.retrieveGlobalKey(SBExtension.config.Members + "_" + cd.getTime() + "_" + this.mID);
	if(!data){
		data = {};
		data.tbUID = SBExtension.store.getTbUID();
		data.logIn = 0;
		data.logOut = 0;
		data.mID = 0;
		data.newMID = 0;
		data.isChangeMember = 0;
		data.lastSentTS = this.lastSentTS;
		data.tbFlag = this.tbFlag;
		data.mID = this.mID;
		data.extInst = 0;
		data.extInstAdd = 0;
		data.extInstDel = 0;
		data.clickAddExt = 0;
		data.isFlagChanged = 0;
		SBExtension.store.storeGlobalKey(SBExtension.config.Members + "_" + cd.getTime() + "_" + this.mID, data);
	}
	if(flag == 0 || flag == 1){
		data.logIn = data.logIn + this.logIn;
		data.logOut = data.logOut + this.logOut;
		data.extInstAdd = data.extInstAdd + this.extInstAdd;
		data.extInstDel = data.extInstDel + this.extInstDel;
		data.clickAddExt = data.clickAddExt + this.clickAddExt;
		SBExtension.store.storeGlobalKey(SBExtension.config.Members + "_" + cd.getTime() + "_" + this.mID, data);
	}
	var tempFlag = 0;
	if(this.mID != 0){
		tempFlag |= 1;
	}
	if(this.extInstAdd > 0 || this.extInst == 1){
		tempFlag |= 4;
	}
	if(this.clickAddExt > 0){
		tempFlag |= 2;
	}

	// Flag for standalone Extension
	if (!this.isTBPresent || oldTBID>=0)
		tempFlag |= 8;

	// Flag for Toolbar uninstall or Extension being uninstalled/disabled
	if (flag==3)
		tempFlag |= 32;

	tempFlag |= SBExtension.browser.getBrowserStatsFlag();

	var willSend = true;
	var lastDataName = null;
	if(flag != 0){
		if(!forceFlag && data.tbFlag == tempFlag){
			return;
		}
		objSend.tbFlag = tempFlag;
		data.tbFlag = tempFlag;
		SBExtension.store.storeGlobalKey(SBExtension.config.Members + "_" + cd.getTime() + "_" + this.mID, data);
		var curDate = this.getDateYyyymmdd(new Date());
		lastDataName = "SSE_last" + ((objSend.tbFlag&1!=0) ? "Login" : "Logout") + "_" + objSend.mID + "_" + curDate;
		var lastData = SBExtension.store.retrieveGlobalKey(lastDataName);
		if (lastData && lastData.tbUID==objSend.tbUID && lastData.mID==objSend.mID && lastData.flag==objSend.flag && lastData.tbFlag==objSend.tbFlag) {
			willSend = false;
		}
	}
	else{
		objSend.currDate = this.lastSentTS;
		if(data.tbFlag != tempFlag){
			data.tbFlag = tempFlag;
		}
		SBExtension.store.storeGlobalKey(SBExtension.config.Members + "_" + cd.getTime() + "_" + this.mID, data);
		objSend.tbFlag = data.tbFlag;
		objSend.logIn = data.logIn;
		objSend.logOut = data.logOut;
		objSend.extInstAdd = data.extInstAdd;
		objSend.extInstDel = data.extInstDel;
		objSend.clickAddExt = data.clickAddExt;
		SBExtension.store.clearKey(SBExtension.config.Members + "_" + cd.getTime() + "_" + this.mID, true);
		
	}
	
	if (willSend) {
		this.sendAjaxCall(objSend, function() {
			if (lastDataName) {
				SBExtension.store.storeGlobalKey(lastDataName, objSend);
			}
		});
	}
	
	if (flag == 0) {
	  var members = SBExtension.store.retrieveGlobalKey(SBExtension.config.LoginMembers);
	  if (members) {
		for(var mId in members){
			var dates = members[mId];
			for(var d in dates){
				var date = dates[d];
				var obj = SBExtension.store.retrieveGlobalKey(SBExtension.config.Members + "_" + date + "_" + mId);
				if(obj){
					var objPrevSend = {};
					objPrevSend.tbUID = obj.tbUID;
					objPrevSend.mID = mId;
					objPrevSend.flag = 0;
					objPrevSend.currDate = date;
					objPrevSend.tbFlag = obj.tbFlag;
					objPrevSend.logIn = obj.logIn;
					objPrevSend.logOut = obj.logOut;
					objPrevSend.extInstAdd = obj.extInstAdd;
					objPrevSend.extInstDel = obj.extInstDel;
					objPrevSend.clickAddExt = obj.clickAddExt;

					this.sendAjaxCall(objPrevSend);

					SBExtension.store.clearKey(SBExtension.config.Members + "_" + date + "_" + mId, true);
					dates.splice(dates.indexOf(date),1);
				}
			}
			members[mId] = null;
		}
		SBExtension.store.storeGlobalKey(SBExtension.config.LoginMembers, members);
	  }
	}
};

SBExtension.Stats.prototype.sendAjaxCall = function(objSend, callback) {
	var ajaxCall = {
	    type: 'POST',
	    url: "http://" + SBExtension.config.sbHostName + "/?cmd=tbf-jx-tb-member&ext=1",
	    data: objSend,
	    success: function (resp) {
	    		if (objSend.flag) {
	    			SBExtension.lastStatsSentMid = objSend.mID;
	    		}
	    		if (callback) {
	    			callback();
	    		}
	    },
	    error: function (data) {
	    }
	};
	SBExtension.getAvailableBrowser().addSecurityFieldsToAjaxCall(ajaxCall, { xhrFields: { withCredentials: true } });
	if (SBExtension.getAvailableBrowser().executeAjaxCall) {
	    SBExtension.getAvailableBrowser().executeAjaxCall(ajaxCall);
	} else {
	    $.ajax(
	        ajaxCall
	    );
	}
};