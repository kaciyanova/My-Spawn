SBExtension.PopupUINotification = function() {}

SBExtension.PopupUINotification.prototype.init = function () {
	var allAlerts = SBExtension.store.loadAlerts();
	$('#notification-content').text('');
	var seenFlagModifiedAlerts = [];
	var allHtml = "";
	var allAlertsCount = 0;
	if (Object.keys(allAlerts).length != 0) {
		for (var popup_id in allAlerts) {
			var typeAlerts = allAlerts[popup_id];
			for (var id in typeAlerts) {
				var item = typeAlerts[id];
				if (item.tsRemoved > 0) {
					continue;
				}
				allAlertsCount++;
			}
		}
	}
	if (allAlertsCount == 0) {
		allHtml = '<div class="no-alert">' + SBExtension.browserPopup.getLocalizedString('noAlert') + '</div>';
		SBExtension.browserPopup.setInnerHTML($('#notification-content', document)[0], allHtml, document);
		return;
	}
	var mbSurveyAlerts = {};
	var fulcrumSurveyIDs = [];
	for (var popup_id in allAlerts) {
		var typeAlerts = allAlerts[popup_id];
		if (popup_id==SBExtension.POPUP_ID_ANSW) {
			typeAlerts = SBExtension.convertAlertsToPopupArray(typeAlerts);
			var sz = (typeAlerts&&typeAlerts.length) ? typeAlerts.length : 0;
			for (var idx=0; idx<sz; idx++) {
				var surveyAlert = typeAlerts[idx];
				var surveyAlertParent = surveyAlert;
				if (surveyAlert && surveyAlert.data) {
					surveyAlert = surveyAlert.data;
				}
				if (surveyAlert && !(surveyAlertParent.tsRemoved>0)) {
				  if (surveyAlert.dwId && surveyAlert.srvId) {
					if (mbSurveyAlerts[surveyAlert.srvId]) {
						continue;
					}
					mbSurveyAlerts[surveyAlert.srvId] = surveyAlert;
					if (SBExtension.checkMBSurveyAvailabilityLoop[surveyAlert.srvId]) {
						continue;
					}
					SBExtension.networkPopup.checkMBSurveyAvailability(surveyAlert.dwId, surveyAlert.srvId, -SBExtension.getMBCheckPeriodSecs(),
						function(data) {
							if (!$('#notification-content').is(':visible')) {
								return;
							}
							// Ajax request succeeded => check the result...
							var sz = data.length;
							var removedCount = 0;
							for (var dataIdx=0; dataIdx<sz; dataIdx++) {
								var surveyChkRes = data[dataIdx];
								if (surveyChkRes.wanted!=false) {
									continue;
								}
								var campaignId = surveyChkRes.campaignId;
								var alertDataToRemove = mbSurveyAlerts[campaignId];
								var alertId = alertDataToRemove.prjId;
								var alertToRemove = SBExtension.getAlert(SBExtension.POPUP_ID_ANSW, alertId);
								if (!alertToRemove) {
									continue;
								}
								removedCount++;
								alertToRemove.markRemoved();
								delete SBExtension.checkMBSurveyAvailabilityLoop[surveyAlert.srvId];
								SBExtension.popupUI[SBExtension.POPUP_ID_NOTIFICATION].init();
							}
							return (removedCount<sz);
						}, function(data) {
							// Ajax request failed => NO OP
					});
				  }
				  else if (surveyAlert.prjId) {
					fulcrumSurveyIDs.push(surveyAlert.prjId);
				  }
				}
			}
			if (fulcrumSurveyIDs.length > 0) {
				var surveyIDs = fulcrumSurveyIDs;
				var sz = surveyIDs && surveyIDs.length || 0;
				if (!sz) return false;
				surveyIDs = surveyIDs.sort();
				var surveyIDsStr = "";
				for (var idx=0; idx<sz-1; idx++) {
					surveyIDsStr += surveyIDs[idx] + ",";
				}
				surveyIDsStr += surveyIDs[sz-1];
				if (!SBExtension.checkFulcrumSurveyAvailabilityLoop[surveyIDsStr]) {
				  SBExtension.networkPopup.checkFulcrumSurveyAvailability(surveyIDsStr, -SBExtension.getFulcrumCheckPeriodSecs(),
					function(data) {
						if (!$('#notification-content').is(':visible')) {
							return;
						}
						// Ajax request succeeded => check the result...
						var removedCount = 0;
						if (data.length == sz) {
							return;
						}
						for (var dataIdx=0; dataIdx<sz; dataIdx++) {
							var alertId = surveyIDs[dataIdx];
							if (data.indexOf(alertId) >= 0) {
								continue;
							}
							var alertToRemove = SBExtension.getAlert(SBExtension.POPUP_ID_ANSW, alertId);
							if (!alertToRemove) {
								continue;
							}
							removedCount++;
							alertToRemove.markRemoved();
						}
						if (removedCount > 0) {
							delete SBExtension.checkFulcrumSurveyAvailabilityLoop[surveyIDsStr];
							SBExtension.popupUI[SBExtension.POPUP_ID_NOTIFICATION].init();
						}
						return (removedCount<sz);
					}, function(data) {
						// Ajax request failed => NO OP
				  });
				}
			}
		}
		for (var id in typeAlerts) {
			var item = typeAlerts[id];
			if (item.tsRemoved > 0) {
				continue;
			}
				
			var className ='notification-row';
			var classNameActive ='notification-nonactive';
			if (item.tsClicked > 0) {
				className ='notification-row ntf-disabled';
			}
			if (item.tsSeen == 0) {
				classNameActive ='notification-active';
				item.markSeen(true);
				seenFlagModifiedAlerts.push(item);
			}
			
			var html = 
				'<div class="'+className+'">' +
					'<div class="notification-data '+classNameActive+'">' +
						'<div class="notification-header">' +
							SBExtension.headerByPosition(parseInt(popup_id), item, SBExtension.browserPopup) +
						'</div>' +
						'<div class="notification-text">' +
							SBExtension.textByPosition(parseInt(popup_id), item, SBExtension.browserPopup) +
							SBExtension.urlByPosition(parseInt(popup_id), item, SBExtension.browserPopup) +
						'</div>' +
					'</div>' +
					'<div data-id="'+item.id+'" data-index="'+popup_id+'" class="notification-close"></div>' +
				'</div>';
			allHtml += html;
		}
	}
	SBExtension.browserPopup.setInnerHTML($('#notification-content', document)[0], allHtml, document);

	if (seenFlagModifiedAlerts.length > 0)
		SBExtension.store.saveAlerts(seenFlagModifiedAlerts);
	
	$('.notification-close').unbind('click');
	$('.notification-close').bind('click', function() {
		var alert = SBExtension.popupUI[SBExtension.POPUP_ID_NOTIFICATION].getAlertData(this);
		alert.markRemoved();
		SBExtension.popupUI[SBExtension.POPUP_ID_NOTIFICATION].init();
	});
	
	$('.action-link').unbind('click');
	$('.action-link').bind('click', function() {
		var alert = SBExtension.popupUI[SBExtension.POPUP_ID_NOTIFICATION].getAlertData(this);
		alert.markClicked();
		SBExtension.popupUI[SBExtension.POPUP_ID_NOTIFICATION].init();
	});
	//loading notification...
}

SBExtension.PopupUINotification.prototype.getAlertData = function(element){
		var id = $(element).data('id');
		var index = $(element).data('index');
		return SBExtension.getAlert(index, id);
}

if (!SBExtension.popupUI) {
	SBExtension.popupUI = [];
}
SBExtension.popupUI[SBExtension.POPUP_ID_NOTIFICATION] = new SBExtension.PopupUINotification();

$( document ).ready(function(){
	//SBExtension.popupUI[SBExtension.POPUP_ID_NOTIFICATION].init();
});
