if (SBExtension.browserInject) {

function SBStatePopups() {}
	
SBStatePopups.prototype = SBExtension.extend(SBPopupBase.prototype, SBStatePopups);

SBStatePopups.prototype.initState = function(jqSB, doc, tabId) {
	this.init(jqSB, doc, tabId);
	this.POPUP_SC_NOTIF_DISABLED = false;
	this.POPUP_BALANCE_NOTIF_DISABLED = false; //true;
	this.POPUP_OTHER_NOTIF_DISABLED = false;
	var addElement = doc.getElementsByTagName("head");
		if(addElement == undefined || addElement == null || addElement.length == 0){
			addElement = doc.getElementsByTagName('body');
		}

	jqSB("#sestylePopup", doc).remove();
	    //for special terms
	    style = doc.createElement("style");
	    style.type = "text/css";
	    style.id = "sestylePopup";
	
	    if (style.styleSheet) {
		style.styleSheet.cssText = SBExtension.injectPage.cssPopop;
	} else {
		style.appendChild(doc.createTextNode(SBExtension.injectPage.cssPopop));
	}
	var addElement = doc.getElementsByTagName("head");
	if(addElement == undefined || addElement == null || addElement.length == 0){
		addElement = doc.getElementsByTagName('body');
	}
	if(addElement && addElement.length > 0){
		addElement[0].appendChild(style);
	}
	this.curPopupIdOld = this.curPopupId;
	this.curPopupObjectsOld = this.curPopupObjects;
	this.curPopupLengthOld = this.curPopupLength;
	this.curPopupId = {};
	this.curPopupObjects = {};
	this.curPopupLength = {};
}

SBStatePopups.prototype.markAlertAsShown = function(alertType, alertId) {
	SBExtension.store.storeGlobalKey("SSE_AlertShown_"+alertType+"_"+alertId, 1);
}

SBStatePopups.prototype.filterAlreadyShownPopups = function(arrayState, allAlerts, callback, alreadyShownAlerts) {
	alreadyShownAlerts = alreadyShownAlerts || {};
	for (var alertType in allAlerts) {
		var typeAlertsAlready = alreadyShownAlerts[alertType];
		if (!typeAlertsAlready) {
			typeAlertsAlready = alreadyShownAlerts[alertType] = {};
		}
		var typeAlerts = allAlerts[alertType];
		for (var alertId in typeAlerts) {
			var alertStatus = typeAlertsAlready[alertId];
			if (!alertStatus) {
				alertStatus = typeAlertsAlready[alertId] = {};
				var this_ = this;
				this_.retrievePopupAlreadyShown(alertType, alertId, function(val) {
					alertStatus.shown = val;
					this_.filterAlreadyShownPopups(arrayState, allAlerts, callback, alreadyShownAlerts);
				});
				return;
			}
		}
	}
	callback(alreadyShownAlerts);
}

SBStatePopups.prototype.retrievePopupAlreadyShown = function(alertType, alertId, callback) {
	var callbackCalled = false;
	var alreadyShown = SBExtension.store.retrieveGlobalKey("SSE_AlertShown_"+alertType+"_"+alertId, function(val) {
		callbackCalled = true;
		callback(val);
	});
	if ((typeof alreadyShown == "undefined") || callbackCalled) {
		return;
	}
	callback(alreadyShown);
}

SBStatePopups.prototype.isPopupAlreadyShown = function(alertType, alertId, alreadyShownAlerts) {
	return alreadyShownAlerts && alreadyShownAlerts[alertType] && alreadyShownAlerts[alertType][alertId] && alreadyShownAlerts[alertType][alertId].shown;
}

SBStatePopups.prototype.wasPopupOnPageNotRefreshed = function(alertType, alertId) {
	var wasOn = false;
	var typeArray = this.curPopupObjectsOld && this.curPopupObjectsOld[alertType];
	var sz = typeArray && typeArray.length;
	for (var idx=0; idx<sz; idx++) {
		var alert = typeArray[idx];
		if (!alert || alert.id!=alertId) continue;
		wasOn = true;
		break;
	}
	return wasOn;
}

SBStatePopups.prototype.filterHiddenRemovedClickedAlerts = function(alertArray, alertType, alreadyShownAlerts) {
	var lastClosedTS = SBExtension.store.retrieveGlobalKey("SEAlerts_lastPopupClosedTSByType_" + alertType);
	var filteredAlertArray = {};
	var filteredAlertArrayEmpty = true;
	var lastCreatedTS = 0;
	for (var idx in alertArray) {
		var alert = alertArray[idx];
		var alertIsHidden = this.isAlertHidden(alert);
		if (alertIsHidden) {
			continue;
		}
		var alertTypeWasShownPageNotRefreshed = this.wasPopupOnPageNotRefreshed(alertType, alert.id);
		if (!alertTypeWasShownPageNotRefreshed && this.isPopupAlreadyShown(alertType, alert.id, alreadyShownAlerts)) {
			continue;
		}
		if (alert.tsCreated > lastCreatedTS) {
			lastCreatedTS = alert.tsCreated;
		}
		filteredAlertArray[alert.id] = alert;
		filteredAlertArrayEmpty = false;
	}
	if (filteredAlertArrayEmpty || lastClosedTS && lastCreatedTS<lastClosedTS) {
		filteredAlertArray = null;
	}
	return filteredAlertArray;
}
	
SBStatePopups.prototype.isAlertHidden = function(alert) {
	return (alert.tsHidden || alert.tsRemoved || alert.tsClicked);
}

SBStatePopups.prototype.createPopup = function(arrayState, allAlerts, alreadyShownAlerts) {
	try {
		var this_ = this;
		if (!arrayState) {
			arrayState = [1, 1, 1, 1, 1, 1, 1, 1];
		}
		if (!allAlerts) {
			var callbackCalled = false;
			allAlerts = SBExtension.store.loadAlerts(function(allAlerts) {
				callbackCalled = true;
				if(allAlerts != null){
					this_.filterAlreadyShownPopups(arrayState, allAlerts, function(alreadyShownAlerts) {
						this_.createPopup(arrayState, allAlerts, alreadyShownAlerts);
					});
				}
			});
			if ((typeof allAlerts == "undefined") || callbackCalled) {
				return;
			}
			this_.filterAlreadyShownPopups(arrayState, allAlerts, function(alreadyShownAlerts) {
				this_.createPopup(arrayState, allAlerts, alreadyShownAlerts);
			});
			return;
		}
		var jqSB = this.jqSB;
		var doc = this.doc;
		var isUrlSecure = (doc.location.href.indexOf("https:")==0);
		if (this.POPUP_SC_NOTIF_DISABLED && this.POPUP_BALANCE_NOTIF_DISABLED && this.POPUP_OTHER_NOTIF_DISABLED)
			return;

		for (var i in arrayState) {
			var popup = doc.getElementById('notifySEId' + i);

			var objects = allAlerts[i];
			objects = this.filterHiddenRemovedClickedAlerts(objects, i, alreadyShownAlerts);
			if (!objects) {
				if (popup) {
					SBExtension.statePopups.clearPopup(doc, i);
				}
				continue;
			}
			
			if (i==SBExtension.POPUP_ID_SCDE && this.POPUP_SC_NOTIF_DISABLED
						|| i==SBExtension.POPUP_ID_ACCT && this.POPUP_BALANCE_NOTIF_DISABLED
						|| this.POPUP_OTHER_NOTIF_DISABLED && i!=SBExtension.POPUP_ID_SCDE&&i!=SBExtension.POPUP_ID_ACCT) {
				continue;
			}

			if (arrayState[i] == 1) {
				if (i==SBExtension.POPUP_ID_ANSW) {
					objects = SBExtension.convertAlertsToPopupArray(objects);
				}
			
				if (!objects)
					objects = [];

				var length = (objects.length) ? objects.length : Object.keys(objects).length;

				SBExtension.statePopups.curPopupId[i] = 1;
				SBExtension.statePopups.curPopupObjects[i] = objects;
				SBExtension.statePopups.curPopupLength[i] = length;

				var j = 0;
				var top = 0;
				if (!popup) {
					j = jqSB('.notifySEClass', doc).length;
					popup = doc.createElement("div");
					top = j * 84 + 5;
					popup.setAttribute("id", "notifySEId" + i);
					popup.setAttribute("class", "notifySEClass");
				}
				jqSB(popup, doc).css('display', 'block');
				var k = 1;
				var popupInnerHTML = "";
				var fulcrumSurveyIDs = [];
				for (var id in objects) {
					var item = objects[id];
					if (item.data) {
						if (item.data.srvId && item.data.dwId) {
							var checkObject = {};
							checkObject.data = item.data;
							checkObject.arrayState = arrayState;
							SBExtension.browserInject.sendBgMessage("CheckSurveyNotification", '', JSON.stringify(checkObject))
						}
						else if (item.data.prjId) {
							fulcrumSurveyIDs.push(item.data.prjId);
						}
					}
					if (item.id) this.markAlertAsShown(i, item.id);

					popupInnerHTML += 
						'<div id="SBStatePopup' + i + '_' + item.id + '" ' + (k != 1 ?  'class="SBStatePopupHide"' : 'class="SBStatePopup"') +'>' +
							'<div class="SBStateImageContainer">' +
								'<img src="'+ this.imageByPosition(parseInt(i), isUrlSecure) +'"/>' +
							'</div>' +
							'<div style="display: table; height: 100%;">' +
							  '<div class="SBStateTextContainer">' +
								'<div id="sbNotifCloseBtn'+parseInt(i)+'" class="SBStatePopupClose" data-index="'+i+'" data-id="'+item.id+'" data-tabId="'+this.tabId+'"></div>' +
								'<div class="SBStateTextElement">' + SBExtension.headerByPosition(parseInt(i), item) + '</div>' +
								'<div id="clickViewText">' + 
									SBExtension.textByPosition(parseInt(i), item) + 
									SBExtension.urlByPosition(parseInt(i), item) +
								'</div>' +
								( length > 1 ? // && k == 1 ?
									'<div class="sbNotifViewMore">' +
									'  <button class="sbNotifViewMorePrev' + (k==1 ? ' sbNotifViewMoreDisabled' : '') + '" data-index="'+i+'" data-id="'+item.id+'" data-tabId="'+this.tabId+'"></button>' +
									'  <span class="sbNotifViewMoreCurrent">' + k + '</span>' +
									'  of' +
									'  <span class="sbNotifViewMoreMax">' + length + '</span>' +
									'  <button class="sbNotifViewMoreNext' + (k==length ? ' sbNotifViewMoreDisabled' : '') + '" data-index="'+i+'" data-id="'+item.id+'" data-tabId="'+this.tabId+'"></button>' +
									'</div>'
									: 
									"") +
							  '</div>' +
							'</div>' +
						'</div>';
					k++;
				}
				if (fulcrumSurveyIDs.length > 0) {
					SBExtension.browserInject.sendBgMessage("CheckFulcrumSurveyValidity", '', JSON.stringify(fulcrumSurveyIDs))
				}
				SBExtension.browserInject.setInnerHTML(popup, popupInnerHTML, doc);
				doc.getElementsByTagName("HTML")[0].appendChild(popup);
				if(top > 0){
					doc.getElementById("notifySEId"+i).style.top = top + 'px';
				}
				
				jqSB("#notifySEId"+parseInt(i)+" .sbNotifViewMorePrev", doc).bind('click', function(e){
					var index = jqSB(this, doc).data('index');
					if (jqSB(this, doc).hasClass('sbNotifViewMoreDisabled2')) {
						return;
					}
					//var id = this.parentNode.parentNode.parentNode.parentNode.id;
					var curPopupIdx = SBExtension.statePopups.curPopupId[index];
					var objects = SBExtension.statePopups.curPopupObjects[index];
					if (curPopupIdx<=1) {
						return;
					}
					var alertId = objects[curPopupIdx-1].id;
					curPopupIdx--;
					var alertId2 = objects[curPopupIdx-1].id;
					jqSB('#SBStatePopup' + index + '_' + alertId  + ' .sbNotifViewMorePrev', doc).addClass('sbNotifViewMoreDisabled2');
					jqSB('#SBStatePopup' + index + '_' + alertId  + ' .sbNotifViewMoreNext', doc).addClass('sbNotifViewMoreDisabled2');
					jqSB('#SBStatePopup' + index + '_' + alertId2 + ' .sbNotifViewMorePrev', doc).addClass('sbNotifViewMoreDisabled2');
					jqSB('#SBStatePopup' + index + '_' + alertId2 + ' .sbNotifViewMoreNext', doc).addClass('sbNotifViewMoreDisabled2');
					setTimeout(function() {
						jqSB('#SBStatePopup' + index + '_' + alertId  + ' .sbNotifViewMorePrev', doc).removeClass('sbNotifViewMoreDisabled2');
						jqSB('#SBStatePopup' + index + '_' + alertId  + ' .sbNotifViewMoreNext', doc).removeClass('sbNotifViewMoreDisabled2');
						jqSB('#SBStatePopup' + index + '_' + alertId2 + ' .sbNotifViewMorePrev', doc).removeClass('sbNotifViewMoreDisabled2');
						jqSB('#SBStatePopup' + index + '_' + alertId2 + ' .sbNotifViewMoreNext', doc).removeClass('sbNotifViewMoreDisabled2');
					}, 800);
					//jqSB('#SBStatePopup' + index + '_' + alertId, doc).attr('class','SBStatePopupHide');
					jqSB('#SBStatePopup' + index + '_' + alertId, doc).fadeOut(750).css('display','none')
					//jqSB('#SBStatePopup' + index + '_' + alertId2, doc).attr('class','SBStatePopup');
					jqSB('#SBStatePopup' + index + '_' + alertId2, doc).css('display','none').attr('class','SBStatePopup');
					jqSB('#SBStatePopup' + index + '_' + alertId2, doc).fadeIn(750).css('display','table');
					SBExtension.statePopups.curPopupId[index] = curPopupIdx;
				});

				jqSB("#notifySEId"+parseInt(i)+" .sbNotifViewMoreNext", doc).bind('click', function(e){
					if (jqSB(this, doc).hasClass('sbNotifViewMoreDisabled2')) {
						return;
					}
					var index = jqSB(this, doc).data('index');
					//var id = this.parentNode.parentNode.parentNode.parentNode.id;
					var curPopupIdx = SBExtension.statePopups.curPopupId[index];
					var length = SBExtension.statePopups.curPopupLength[index];
					if (curPopupIdx>=length) {
						return;
					}
					var objects = SBExtension.statePopups.curPopupObjects[index];
					var alertId = objects[curPopupIdx-1].id;
					curPopupIdx++;
					var alertId2 = objects[curPopupIdx-1].id;
					jqSB('#SBStatePopup' + index + '_' + alertId  + ' .sbNotifViewMorePrev', doc).addClass('sbNotifViewMoreDisabled2');
					jqSB('#SBStatePopup' + index + '_' + alertId  + ' .sbNotifViewMoreNext', doc).addClass('sbNotifViewMoreDisabled2');
					jqSB('#SBStatePopup' + index + '_' + alertId2 + ' .sbNotifViewMorePrev', doc).addClass('sbNotifViewMoreDisabled2');
					jqSB('#SBStatePopup' + index + '_' + alertId2 + ' .sbNotifViewMoreNext', doc).addClass('sbNotifViewMoreDisabled2');
					setTimeout(function() {
						var curPopupIdx = SBExtension.statePopups.curPopupId[index];
						jqSB('#SBStatePopup' + index + '_' + alertId  + ' .sbNotifViewMorePrev', doc).removeClass('sbNotifViewMoreDisabled2');
						jqSB('#SBStatePopup' + index + '_' + alertId  + ' .sbNotifViewMoreNext', doc).removeClass('sbNotifViewMoreDisabled2');
						jqSB('#SBStatePopup' + index + '_' + alertId2 + ' .sbNotifViewMorePrev', doc).removeClass('sbNotifViewMoreDisabled2');
						jqSB('#SBStatePopup' + index + '_' + alertId2 + ' .sbNotifViewMoreNext', doc).removeClass('sbNotifViewMoreDisabled2');
					}, 800);
					//jqSB('#SBStatePopup' + index + '_' + alertId, doc).attr('class','SBStatePopupHide');
					jqSB('#SBStatePopup' + index + '_' + alertId, doc).fadeOut(750).css('display','none')
					//jqSB('#SBStatePopup' + index + '_' + alertId2, doc).attr('class','SBStatePopup');
					jqSB('#SBStatePopup' + index + '_' + alertId2, doc).css('display','none').attr('class','SBStatePopup');
					jqSB('#SBStatePopup' + index + '_' + alertId2, doc).fadeIn(750).css('display','table');
					SBExtension.statePopups.curPopupId[index] = curPopupIdx;
				});

				jqSB("#notifySEId"+parseInt(i), doc).unbind('click').bind('click', function(e){
					e.stopPropagation();
				});
			}
		}
			
		jqSB('.action-link', doc).unbind('click').bind('click', function() { 
			var id = jqSB(this, doc).data('id');
			var index = jqSB(this, doc).data('index');
			var clickedElem = this;
				
			SBExtension.store.loadAlerts(function(allAlerts) { 
				if(allAlerts != null) {
					var typeAlerts = allAlerts[index];
					var alert = typeAlerts[id];
					if (!alert || alert.isRemovableOnClick()) {
						SBExtension.statePopups.closeNotificationPopup(clickedElem.parentNode, clickedElem, doc);
						return;
					}
					alert.markClicked(true);
					SBExtension.store.saveAlerts(allAlerts, true);
					//SBExtension.popupUI[SBExtension.POPUP_ID_NOTIFICATION].init();
					SBExtension.statePopups.createPopup();
				}
			});
		});

		jqSB(".SBStatePopupClose", doc).bind('click', function(e){
			SBExtension.statePopups.closeNotificationPopup(this, null, doc);
		});
	} catch(err) {
		SBExtension.alert_debug("createPopup -- Error: " + err, err);
	}
}

SBStatePopups.prototype.closeNotificationPopup = function(popup, clickedElem, doc) {
	var jqSB = this.jqSB;
	var elementId = popup.parentNode.parentNode.parentNode.parentNode.id;
	if (!clickedElem) {
		clickedElem = popup;
	}
	var clickedElemJq = jqSB(clickedElem, doc);
	var id = clickedElemJq.data('id');
	var tabId = clickedElemJq.data('tabid');
	var length = jqSB('#'+elementId+' div[id^=SBStatePopup]', doc).length;
	var lengthView = jqSB('#'+elementId+' div[id^=SBStatePopup]:visible', doc).length;

	var ids = [id];

	var type = elementId.replace('notifySEId', '');
	var data = {tabId : tabId, type : type};
	if (lengthView == 1 && length > 1) {
		data.method = 'all';
		jqSB('#'+elementId+' div[id^=SBStatePopup]', doc).each(function(k,v){
			var underscoreIdx = v.id.indexOf('_');
			var popupId = (underscoreIdx>0) ? v.id.substring(0,underscoreIdx+1) : 'SBStatePopup';
			ids.push(v.id.replace(popupId, ''));
		});
	} else if (lengthView == 1 && length == 1) {
		ids = [id];
	} else {
		return;
	}

	(elem = popup.parentNode.parentNode.parentNode.parentNode).parentNode.removeChild(elem);
	SBExtension.store.loadAlerts(function(allAlerts) {
		var typeAlerts = allAlerts[type];
		var marked = false;
		for (var idx in ids) {
			var alert = typeAlerts[ids[idx]];
			if (!alert) {
				continue;
			}
			alert.markHidden(true);
			alert.markSeen(true);
			if (alert.isRemovableOnClick()) {
				alert.markRemoved(true);
			}
			marked = true;
		}
		if (marked) {
			SBExtension.store.saveAlerts(allAlerts, true);
		}
		SBExtension.statePopups.createPopup();
	});
}

SBStatePopups.prototype.clearPopup = function(doc, pos) {
	if (pos > 0) {
		var element = doc.getElementById('notifySEId' + pos);
		if (element && element.parentNode) {
			element.parentNode.removeChild(element);
		}
	} else {
		for (var i = 0; i < 8; i++) {
			var element = doc.getElementById('notifySEId' + i);
			if (element && element.parentNode) {
				element.parentNode.removeChild(element);
			}
		}
	}
}

SBStatePopups.prototype.clearPCodeNotification = function(doc){
	var element = doc.getElementById('notifySEId6');
	if (element && element.parentNode) {
		element.parentNode.removeChild(element);
	}
}

SBExtension.statePopups = new SBStatePopups();

}
