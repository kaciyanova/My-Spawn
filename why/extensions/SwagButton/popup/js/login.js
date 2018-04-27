// Logic for the "login" popup, shown when the extension is in the "logged out" state

SBExtension.PopupUILogin = function() {
	if (!SBExtension.config.loginCode) {
		SBExtension.config.loginState = SBExtension.store.retrieveGlobalKey("popUpSE_loginState");
		SBExtension.config.loginCode = parseInt(SBExtension.store.retrieveGlobalKey("popUpSE_loginCode"));
		SBExtension.config.showSrvyProjID = SBExtension.store.retrieveGlobalKey("popUpSE_showSrvyProjID");
	}
};

SBExtension.PopupUILogin.prototype.fetchLoginData = function() {
	var loginData = {
		emailAddress : $("#sbx_jx_reg_email", document).val(),
		pswd : $("#sbx_jx_reg_pswd", document).val()
	}
	if (!loginData.emailAddress && !loginData.pswd) {
		$('#div_erlanding_page', document).css('display', 'block')
			                          .text(SBExtension.browserPopup.getLocalizedString("incorrectEmailPwd"));
		return false;
	}
	if ($("#sign_up_remember_me", document).prop("checked")) {
		loginData.persist = "on";
	}
	return loginData;
};

SBExtension.PopupUILogin.prototype.checkStateCallback = function(state, justLoggedOut) {
	try {
		if (state) {
			if (state.globalState)
				state = state.globalState;
			SBExtension.globalState.setFrom(state);
		}
		if (SBExtension.globalState) {
			for (n in SBExtension.globalState) {
				SBExtension.popupUIMain.globalState[n] = SBExtension.globalState[n];
			}
		}
		this.preloaderClose();
		$('.user_data_list, .user_background', document).css("display", "none");
		if (SBExtension.isCriticalUpdateAvailable()) {
			$('#lp_content_wrap', document).hide();
			$('#main', document).hide();
			$('#lp_content_wrap_unsupported', document).hide();
			$('#lp_content_wrap_critical_update', document).show();
			$('#critical_update_submit', document).unbind('click')
			                                      .bind('click', function() {
			        var prompt = SBExtension.browserPopup.getLocalizedString("promptCriticalUpdate");
			        SBExtension.browserPopup.doConfirmUpdate(true, prompt);
			});
			//$('#se_body', document).css('backgroundColor', '#FFFFFF');
		} else if (!SBExtension.popupUIMain.globalState.isCountrySupported()) {
			$('#lp_content_wrap', document).hide();
			$('#main', document).hide();
			$('#lp_content_wrap_critical_update', document).hide();
			$('#lp_content_wrap_unsupported', document).show();
			//$('#se_body', document).css('backgroundColor', '#FFFFFF');
		} else if(!SBExtension.popupUIMain.globalState.loginState || SBExtension.popupUIMain.globalState.loginState == "0" || !SBExtension.popupUIMain.globalState.memberInfo || !SBExtension.popupUIMain.globalState.memberInfo.memberID) {
			var lg = $("#sbx_jx_reg_email", document).val();
			var psw = $("#sbx_jx_reg_pswd", document).val();
			this.viewLoginPage();
			//$('#se_body', document).css('background-color', '#5283AE');
			if (SBExtension.popupUIMain.globalState.isLogin && !justLoggedOut && (lg != "" || psw != "")) {
				if (!state.errorMsg && state.memberInfo && state.memberInfo.error) {
					state.errorMsg = state.memberInfo.error;
				}
				if (state.errorMsg) {
					if (state.errorMsg=="invalid member") {
						// Fallback to the old error string - until the server side is ready to provide the "correct" error messages...
						state.errorMsg = SBExtension.browserPopup.getLocalizedString("incorrectEmailPwd");
					}
					SBExtension.browserPopup.setInnerHTML(document.getElementById('div_erlanding_page'), state.errorMsg, document);
				}
				$('#div_erlanding_page', document).css('display', 'block');
			}
		} else {
			$(document).bind('click', function() {
					SBExtension.popupUILogin.mouseIsClicked = (new Date()).getTime(); $(document).unbind('click');})
			           .bind('keypress', function() {
					SBExtension.popupUILogin.keyIsPressed = (new Date()).getTime(); $(document).unbind('keypress');})
			           ;
			$('#lp_content_wrap', document).css("display", "none");
			$('#lp_content_wrap_unsupported', document).css("display", "none");
			$('#lp_content_wrap_critical_update', document).css("display", "none");
			SBExtension.popupUILogin.beforeMainDisplayTS = (new Date()).getTime();
			$('#main', document).css("display", "block");
			SBExtension.popupUILogin.afterMainDisplayTS = (new Date()).getTime();
			this.setUserData();
			this.viewNotificationCount();
			SBExtension.popupUIMain.startByState();
		}
		SBExtension.popupUIMain.globalState.isLogin = false;
	} catch(e) {
		SBExtension.alert_debug('PopupUILogin.checkStateCallback: ' + e.message, e);
	}
};

SBExtension.PopupUILogin.prototype.viewNotificationCount = function() {
	var count = 0;
	var allAlerts = SBExtension.store.loadAlerts();
	for (var popup_id in allAlerts) {
		var typeAlerts = allAlerts[popup_id];
		if (popup_id==SBExtension.POPUP_ID_ANSW) {
			typeAlerts = SBExtension.convertAlertsToPopupArray(typeAlerts);
		}
		for (var id in typeAlerts) {
			var item = typeAlerts[id];
			if (item.tsSeen == 0) {
				count++;
			}
		}
	}
	if (count == 0) {
		$('#menu_notification #bell_circle').hide();
	} else {
		$('#menu_notification #bell_circle').show();
	}
	$('#menu_notification #bell_circle').text(count);
}

SBExtension.PopupUILogin.prototype.viewLoginPage = function() {
	try{
		this.preloaderClose();
		//$('#se_body', document).css('background-color', '#5283AE');
		
		if (SBExtension.isCriticalUpdateAvailable()) {
			$('#lp_content_wrap', document).hide();
			$('#main', document).hide();
			$('#lp_content_wrap_unsupported', document).hide();
			$('#lp_content_wrap_critical_update', document).show();
			//$('#se_body', document).css('backgroundColor', '#FFFFFF');
		} else if ($('#lp_content_wrap', document).css('display') == 'none') {
			$('#lp_content_wrap_critical_update', document).hide();
			$('#lp_content_wrap_unsupported', document).hide();
			$('#div_erlanding_page', document).css('display', 'none');
			$('#main', document).hide();

			$("#sbx_jx_reg_email", document).val('');
			$("#sbx_jx_reg_pswd", document).val('');

			$('#lp_content_wrap', document).show();
			$(".user_login", document).text('');
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUILogin.viewLoginPage: ' + e.message, e);
	}
	SBExtension.browserPopup.clickEventListen('.new_tab_link');
};

// set account data
SBExtension.PopupUILogin.prototype.setUserData = function() {
	try{
		if (SBExtension.popupUIMain.globalState && SBExtension.popupUIMain.globalState.memberInfo && SBExtension.popupUIMain.globalState.memberID > 0) {
			
			if (SBExtension.popupUIMain.globalState.memberInfo.fName) {
				var fName = SBExtension.popupUIMain.globalState.memberInfo.fName ? SBExtension.popupUIMain.globalState.memberInfo.fName : "";
				var lName = SBExtension.popupUIMain.globalState.memberInfo.lName ? SBExtension.popupUIMain.globalState.memberInfo.lName : "";
				$(".user_login", document).text('');						
				SBExtension.browserPopup.setInnerHTML($(".user_login", document)[0], fName + " " + lName, document);
			}
			if (SBExtension.popupUIMain.globalState.memberInfo.uName) {
				SBExtension.browserPopup.setInnerHTML($(".user_login", document)[0], SBExtension.popupUIMain.globalState.memberInfo.uName, document);
			}
			$('#img_user', document).one('error', function() {
				this.src = 'http://www.swagbucks.com/content/skin-02/images/defaults/profile-lg.jpg';
			});
			if ($('#img_user', document).attr("src") != "http://profileimages.swagbucks.com/profile-lg/"+SBExtension.popupUIMain.globalState.memberID+".jpg") {
				$('#img_user', document).attr("src", "http://profileimages.swagbucks.com/profile-lg/"+SBExtension.popupUIMain.globalState.memberID+".jpg");
			}
			SBExtension.browserPopup.setInnerHTML(document.getElementById('tbar_sb_amount'), SBExtension.popupUIMain.globalState.memberInfo.sBs, document);
		}
	} catch(e) {
		SBExtension.alert_debug('PopupUILogin.setUserData: ' + e.message, e);
	}
};

SBExtension.PopupUILogin.prototype.checkState = function(event) {
	try{
		//this.preloaderInit();
		SBExtension.networkPopup.checkStateBG(
			null,
			function(state) {
				try {
					SBExtension.popupUILogin.checkStateCallback(state);
				} catch(err) {
					SBExtension.alert_debug('PopupUILogin.checkState: ' + err.message, err);
				}
			},
			SBExtension.popupUIMain.globalState);
	} catch(e) {
		SBExtension.alert_debug('PopupUILogin.checkState: ' + e.message, e);
	}
};

SBExtension.PopupUILogin.prototype.preloaderClose = function() {
	try{
		var $preloader = $('#page-preloader', document);
		$spinner   = $preloader.find('.spinner');
		$spinner.fadeOut();
		$preloader.delay(350).fadeOut('slow');
	} catch(e) {
		SBExtension.alert_debug('PopupUILogin.preloaderClose: ' + e.message, e);
	}
};

SBExtension.PopupUILogin.prototype.preloaderInit = function() {
	try{
		var $preloader = $('#page-preloader', document);
		$spinner   = $preloader.find('.spinner');
		$spinner.fadeIn();
		$preloader.delay(350).fadeIn('slow');
	} catch(e) {
		SBExtension.alert_debug('PopupUILogin.preloaderInit: ' + e.message, e);
	}
};

SBExtension.PopupUILogin.prototype.preprocessRegisterLink = function(url) {
	var extraRegistrationParamsString = "";
	if (SBExtension.browserPopup.getExtraRegistrationParams) {
		var extraRegistrationParams = SBExtension.browserPopup.getExtraRegistrationParams();
		if (extraRegistrationParams) {
			if (extraRegistrationParams) {
				// cpagnt = 1 && cpuid = IS => cxid=1-IS
				var cxid = (extraRegistrationParams.cpagnt)
					? ((extraRegistrationParams.cpuid) ? extraRegistrationParams.cpagnt + "-" + extraRegistrationParams.cpuid : extraRegistrationParams.cpagnt)
					: ((extraRegistrationParams.cpuid) ? extraRegistrationParams.cpuid : null);
				if (cxid!=null) {
					extraRegistrationParams.cxid = cxid;
					delete extraRegistrationParams.cpagnt;
					delete extraRegistrationParams.cpuid;
				}
			}
			for (var n in extraRegistrationParams) {
				extraRegistrationParamsString = extraRegistrationParamsString + "&" + n + "=" + extraRegistrationParams[n];
			}
		}
	}
	url = "http://" + SBExtension.config.sbHostName + url + extraRegistrationParamsString;
	return url;
};

SBExtension.PopupUILogin.prototype.sendPwdReminder = function(loginData) {
	var url = "http://" + SBExtension.config.sbHostName + "/?cmd=sb-pswd-reminder&email=" + loginData.emailAddress;
	var br = (SBExtension.browserPopup.getLineBreakTag) ? SBExtension.browserPopup.getLineBreakTag() : "<br/>";
	var data = {};
	var ajaxCall = {
		type: 'POST',
		url: url,
		data: data,
		success: function (result) {
			if (result == 1) {
				$('#div_erlanding_page', document).text( SBExtension.browserPopup.getLocalizedString("passwordReset"))
				                                  .css('display', 'block');
			} else if (result == 2) {
				var errorElem = $('#div_erlanding_page', document);
				SBExtension.browserPopup.setInnerHTML(errorElem[0], SBExtension.browserPopup.getLocalizedString("emailNotFound") + br + SBExtension.browserPopup.getLocalizedString("believeErrorContactCs"), document);
				errorElem.css('display', 'block');
			} else if (result == 3) {
				$('#div_erlanding_page', document).text(SBExtension.browserPopup.getLocalizedString("enterValidEmail"))
				                                  .css('display', 'block');
			} else {
				var errorElem = $('#div_erlanding_page', document);
				SBExtension.browserPopup.setInnerHTML(errorElem[0], SBExtension.browserPopup.getLocalizedString("errorSendingPw") + br + SBExtension.browserPopup.getLocalizedString("errorTryAgainContactCs"), document);
				errorElem.css('display', 'block');
			}
		},
		error: function (data) {
			SBExtension.alert_debug("ERROR result in SBExtension.PopupUISCode.prototype.handleRedeemSc");
		}
	};
	SBExtension.getAvailableBrowser().addSecurityFieldsToAjaxCall(ajaxCall, { dataType: 'html', xhrFields: { withCredentials: true } });
	if (SBExtension.getAvailableBrowser().executeAjaxCall) {
		SBExtension.getAvailableBrowser().executeAjaxCall(ajaxCall);
	} else {
		$.ajax(
			ajaxCall
		);
	}
}

SBExtension.PopupUILogin.prototype.initLogin = function() {
	$("#sbx_jx_reg_email")
		.focusin(function() {
			$('.home_signup_email .input_icon').addClass('input_icon_active');
		})
		.focusout(function() {
			$('.home_signup_email .input_icon').removeClass('input_icon_active');
		});
	$("#sbx_jx_reg_pswd")
		.focusin(function() {
			$('.sbx_pass_wrap .input_icon').addClass('input_icon_active');
		})
		.focusout(function() {
			$('.sbx_pass_wrap .input_icon').removeClass('input_icon_active');
		});

	$("#glbl_welcome_forgot_password", document).unbind('click').click(function() {
		try {
			var loginData = SBExtension.popupUILogin.fetchLoginData();
			if (!loginData) {
				return;
			}
			if (loginData.emailAddress == "") {
				$('#div_erlanding_page', document).text(SBExtension.browserPopup.getLocalizedString("emailAddressPrompt"))
				                                  .css('display', 'block');
				return;
			}
			$('#div_erlanding_page', document).css('display', 'none')
			                                  .text(SBExtension.browserPopup.getLocalizedString("incorrectEmailPwd"));
			SBExtension.popupUILogin.sendPwdReminder(loginData);
		} catch(e) {
			SBExtension.alert_debug('PopupUILogin.initLogin: ' + e.message, e);
		}
	});
	
	$("#login_btn", document).unbind('click').click(function() {
		try{
			$('#div_erlanding_page', document).css('display', 'none')
			                                  .text(SBExtension.browserPopup.getLocalizedString("incorrectEmailPwd"));
			var loginData = SBExtension.popupUILogin.fetchLoginData();
			if (!loginData) {
				return;
			}
			SBExtension.popupUILogin.preloaderInit();
			SBExtension.networkPopup.login(
				loginData,
				function(state) {
					try {
						if (state && state.loginCode) SBExtension.config.onLogin(state.loginState, state.loginCode, state.showSrvyProjID);
						SBExtension.popupUIMain.translate(
							function() {
								try {
									SBExtension.popupUILogin.checkStateCallback(state);
								} catch(err2) {
									SBExtension.alert_debug('PopupUILogin.checkStateCallback: ' + err2.message, err2);
								}
							}
						);
					} catch(err) {
						SBExtension.alert_debug('PopupUILogin.checkState: ' + err.message, err);
					}
				},
				SBExtension.popupUIMain.globalState);
		} catch(e) {
			SBExtension.alert_debug('PopupUILogin.login_btn click: ' + e.message, e);
		}
	});

	$("#tutorial_link", document).unbind('click').click(function() {
		try {
			SBExtension.browserPopup.OpenTutorial();
		} catch(e) {
			SBExtension.alert_debug('PopupUILogin.tutorial_link click: ' + e.message, e);
		}
	});

	$("#logout_btn", document).unbind('click').click(function() {
		try{
			$('#div_erlanding_page', document).css('display', 'none')
			                                  .text(SBExtension.browserPopup.getLocalizedString("incorrectEmailPwd"));
			SBExtension.networkPopup.logout(
				function(state) {
					try {
						if (state && state.loginCode) SBExtension.config.onLogin(state.loginState, state.loginCode, state.showSrvyProjID);
						SBExtension.popupUIMain.translate(
							function() {
								try {
									SBExtension.popupUILogin.checkStateCallback(state, true);
								} catch(err2) {
									SBExtension.alert_debug('PopupUILogin.checkStateCallback: ' + err2.message, err2);
								}
							}
						);
					} catch(err) {
						SBExtension.alert_debug('PopupUILogin.checkState: ' + err.message, err);
					}
				},
				SBExtension.popupUIMain.globalState);
			$('#div_erlanding_page', document).css('display', 'none');
		} catch(e) {
			SBExtension.alert_debug('PopupUILogin.logout_btn click: ' + e.message, e);
		}
	});

	document.getElementById('login_form').onkeypress = function(e) {
		try{
			if(e.which == 13) {
				$('#div_erlanding_page', document).css('display', 'none')
				                                  .text(SBExtension.browserPopup.getLocalizedString("incorrectEmailPwd"));
				var loginData = SBExtension.popupUILogin.fetchLoginData();
				if (!loginData) {
					return;
				}
				SBExtension.networkPopup.login(
					loginData,
					function(state) {
						try {
							if (state && state.loginCode) SBExtension.config.onLogin(state.loginState, state.loginCode, state.showSrvyProjID);
							SBExtension.popupUIMain.translate(
								function() {
									try {
										SBExtension.popupUILogin.checkStateCallback(state);
									} catch(err2) {
										SBExtension.alert_debug('PopupUILogin.checkStateCallback: ' + err2.message, err2);
									}
								}
							);
						} catch(err) {
							SBExtension.alert_debug('PopupUILogin.checkState: ' + err.message, err);
						}
					},
					SBExtension.popupUIMain.globalState);
			}
		} catch(e) {
			SBExtension.alert_debug('PopupUILogin.login_form keypress: ' + e.message, e);
		}
	}
	
	document.getElementById('glbl_welcome_forgot_password').onkeypress = function(e) {
		try {
			if (e.which == 13) {
				var loginData = SBExtension.popupUILogin.fetchLoginData();
				if (!loginData) {
					return;
				}
				if (loginData.emailAddress == "") {
					$('#div_erlanding_page', document).text(SBExtension.browserPopup.getLocalizedString("emailAddressPrompt"))
													  .css('display', 'block');
					return;
				}
				$('#div_erlanding_page', document).css('display', 'none')
								  .text(SBExtension.browserPopup.getLocalizedString("incorrectEmailPwd"));
				SBExtension.popupUILogin.sendPwdReminder(loginData);
			}
		} catch(e) {
			SBExtension.alert_debug('PopupUILogin.login_form keypress: ' + e.message, e);
		}
	}
	
	SBExtension.browserPopup.clickEventListen('.new_tab_link');
};

SBExtension.popupUILogin = new SBExtension.PopupUILogin();

$(function() {
	//SBExtension.alert_debug(" -- WILL CALL initLogin()");
	SBExtension.popupUILogin.initLogin();
});
