SBExtension.PopupUISCode = function() {
	this.redeemedScAlready = false;
}

SBExtension.PopupUISCode.prototype.initSC = function () {
    //debugger;
    try {
        this.viewSC();

        var this_ = this;
        $('#sc_check_now', document).click(function () {
            SBExtension.networkPopup.checkForPCode(
            function (stateData, responseData) {
                var data = (responseData) ? ((responseData.responseData) ? responseData.responseData : responseData) : stateData;
                if (data && data.length) {
                    try {
                        data = JSON.parse(data);
                    } catch (err) {
                        SBExtension.alert_debug("SBExtension.PopupUISCode.prototype.initSC: JSON.parse error! stateData=" + stateData + "; responseData=" + responseData + "; err=" + err, err);
                    }
                }
                SBExtension.popupUI[SBExtension.POPUP_ID_SCDE].setPCode(data);
            },
            SBExtension.popupUIMain.globalState
        );
        });

        $('#sb_global_nav_swag_code_submit', document).click(function () {
            this_.handleRedeemSc();
        });

        $('#sb_global_nav_swag_code_input', document).keypress(function (e) {
            if (e.which == 13) {
                this_.handleRedeemSc()
            }
        });

        $('#sc_thanks', document).click(function () {
            $('#sc_one', document).css('display', 'block');
            $('#sc_two', document).css('display', 'none');
            $('#sc_three', document).css('display', 'none');
        });

        $('#sc_thanks', document).keypress(function (e) {
            if (e.which == 13) {
                $('#sc_one', document).css('display', 'block');
                $('#sc_two', document).css('display', 'none');
                $('#sc_three', document).css('display', 'none');
            }
        });
		
		$('.reedem_error_close').click(function() {
			$('#tb_sc_msg_wrap, .reedem_error_close', document).css('display', 'none');
		});
		$('.sc_error_get_close').click(function() {
			$('#sc_error_get, .sc_error_get_close', document).css('display', 'none');
		});
		$('.sc_close').click(function() {
			$('.sc_text, .sc_text_input, .sc_close', document).hide();
			$('.sc_close', document).removeClass('blue');
		});
		
    } catch (e) {
        SBExtension.alert_debug("SBExtension.PopupUISCode.prototype.initSC: Error!!! stateData=" + stateData + "; responseData=" + responseData + "; err=" + err, err);
    }
};

SBExtension.PopupUISCode.prototype.viewSC = function() {
	$('#sc_one', document).css('display', 'block');
	$('#sc_two', document).css('display', 'none');
	$('#sc_three', document).css('display', 'none');
	$('#sc_error_get, .sc_error_get_close', document).css('display', 'none');
	$('#tb_sc_msg_wrap, .reedem_error_close', document).css('display', 'none');
	$('.sc_text, .sc_text_input, .sc_close', document).hide();
	$('.sc_close', document).removeClass('blue');
};

SBExtension.PopupUISCode.prototype.setPCode = function (data) {
    $('#sc_error_get, .sc_error_get_close', document).css('display', 'none');
    if (data.status == 0 || typeof (data.statusPCode) != "undefined" && data.statusPCode == 0) {
		$('#sc_error_get').css('background-color','#ED1C24');
        $('#sc_error_get, .sc_error_get_close', document).css('display', 'block');
		$('#tb_sc_msg_wrap, .reedem_error_close', document).css('display', 'none');
		$('.sc_text, .sc_text_input, .sc_close', document).hide();
		$('.sc_close', document).removeClass('blue');
    } else {
        $('#sc_error_get, .sc_error_get_close', document).css('display', 'none');
        $('#sc_one', document).css('display', 'none');
        $('#sc_two', document).css('display', 'block');

        if (!data.msg) {
            var dataStr = 'data.msg is null in setPCode. data = ' + JSON.stringify(data);
            SBExtension.store.storeGlobalKey("DBG_LAST_PCODE_ERROR", dataStr);
            SBExtension.alert_debug(dataStr, new Error());
            data.msg = '';
        }
        var mas = data.msg.split('~');
        var html = '';
        $('.sc_text, .sc_text_input, .sc_close', document).hide();
		$('#tb_sc_msg_wrap, .reedem_error_close', document).css('display', 'none');
        SBExtension.browserPopup.setInnerHTML($('#sc_check_available', document)[0], mas[0], document);
        $('#sc_check_available', document).css("display","block");
        if (mas.length == 2 && mas[0].length > 0 && mas[1].length > 0) {
            if ( $('#sc_check_available + .survey_go_btn').length ) {
                $('#sc_check_available + .survey_go_btn').remove();
            }
            html = '<a class="survey_go_btn new_tab_link" data-url="' + mas[1] + '">' + SBExtension.browserPopup.getLocalizedString("goNow") + '</a>';
            $('#sc_check_available', document).after(html);
            SBExtension.browserPopup.clickEventListen('.new_tab_link');
        }
    }
};

SBExtension.PopupUISCode.prototype.handleRedeemSc = function() {
	$('#tb_sc_msg_wrap', document).text("").css('display', 'none');
	$('.reedem_error_close').hide();
	if(this.redeemedScAlready) return;
	this.redeemedScAlready = true;
	var redeemScBtn = $('#sb_global_nav_swag_code_submit', document);
	var scInput = $('#sb_global_nav_swag_code_input', document);
	redeemScBtn.fadeTo(300, .5).css("cursor", "default");
	var self = this;
	var val = $.trim(scInput.val());
	if(val == "" || val == scInput.attr("placeholder")) {
		this.redeemedScAlready = false;
		scInput.unbind("keyup.fadeBtn").bind("keyup.fadeBtn", function() {
			if($(this).val() != "" && $(this).val() != scInput.attr("placeholder")) {
				if(redeemScBtn.is(":animated")) return;
				redeemScBtn.fadeTo(300, 1, function() {
					redeemScBtn.css("cursor", "pointer");
				});
			}else {
				redeemScBtn.fadeTo(300, .5).css("cursor", "default");	
			}
		});
		var uiRenderers = $('#tb_sc_msg_wrap', document);
		uiRenderers.text( SBExtension.browserPopup.getLocalizedString("pleaseEnterSwagcode") ).css('display', 'block');
		$('.reedem_error_close').show();
		$('#sc_error_get, .sc_error_get_close', document).css('display', 'none');
		$('.sc_text, .sc_text_input, .sc_close', document).hide();
		$('.sc_close', document).removeClass('blue');
		return false;
	}else {
		var tbid = SBExtension.store.getTbUID();
		var browserStatsFlag = SBExtension.browserPopup.getBrowserStatsFlag();
		// Chrome  (64) -> 3
		// Firefox (16) -> 2
		// MSIE   (128) -> 4
		var sid = (browserStatsFlag&64) ? 3 : ((browserStatsFlag&16) ? 2 : 4);
		var url = "http://" + SBExtension.config.sbHostName + "/?cmd=sb-gimme-jx&sid=" + sid + "&tbid=" + tbid;
		var hash = SBExtension.store.retrieveGlobalKey("SE_HASH");
		var hashTS = SBExtension.store.retrieveGlobalKey("SE_HASH_TS");
		var data = {
			hdnCmd: "sb-gimme",
			pcode: val,
			hash:  hash,
			ts:  hashTS,
			scHash:SBExtension.popupUI[SBExtension.POPUP_ID_SCDE].md5Sum(hash+"~"+val)
		}
		//var this_ = this;
		var ajaxCall = {
		    type: 'POST',
			url: url,
			data: data,
		    success: function (resp) {
		        SBExtension.popupUI[SBExtension.POPUP_ID_SCDE].successSC(resp);
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
};

SBExtension.PopupUISCode.prototype.md5Sum = function(md5ArgStr) {
function md5cycle(x, k) {
var a = x[0], b = x[1], c = x[2], d = x[3];

a = ff(a, b, c, d, k[0], 7, -680876936);
d = ff(d, a, b, c, k[1], 12, -389564586);
c = ff(c, d, a, b, k[2], 17,  606105819);
b = ff(b, c, d, a, k[3], 22, -1044525330);
a = ff(a, b, c, d, k[4], 7, -176418897);
d = ff(d, a, b, c, k[5], 12,  1200080426);
c = ff(c, d, a, b, k[6], 17, -1473231341);
b = ff(b, c, d, a, k[7], 22, -45705983);
a = ff(a, b, c, d, k[8], 7,  1770035416);
d = ff(d, a, b, c, k[9], 12, -1958414417);
c = ff(c, d, a, b, k[10], 17, -42063);
b = ff(b, c, d, a, k[11], 22, -1990404162);
a = ff(a, b, c, d, k[12], 7,  1804603682);
d = ff(d, a, b, c, k[13], 12, -40341101);
c = ff(c, d, a, b, k[14], 17, -1502002290);
b = ff(b, c, d, a, k[15], 22,  1236535329);

a = gg(a, b, c, d, k[1], 5, -165796510);
d = gg(d, a, b, c, k[6], 9, -1069501632);
c = gg(c, d, a, b, k[11], 14,  643717713);
b = gg(b, c, d, a, k[0], 20, -373897302);
a = gg(a, b, c, d, k[5], 5, -701558691);
d = gg(d, a, b, c, k[10], 9,  38016083);
c = gg(c, d, a, b, k[15], 14, -660478335);
b = gg(b, c, d, a, k[4], 20, -405537848);
a = gg(a, b, c, d, k[9], 5,  568446438);
d = gg(d, a, b, c, k[14], 9, -1019803690);
c = gg(c, d, a, b, k[3], 14, -187363961);
b = gg(b, c, d, a, k[8], 20,  1163531501);
a = gg(a, b, c, d, k[13], 5, -1444681467);
d = gg(d, a, b, c, k[2], 9, -51403784);
c = gg(c, d, a, b, k[7], 14,  1735328473);
b = gg(b, c, d, a, k[12], 20, -1926607734);

a = hh(a, b, c, d, k[5], 4, -378558);
d = hh(d, a, b, c, k[8], 11, -2022574463);
c = hh(c, d, a, b, k[11], 16,  1839030562);
b = hh(b, c, d, a, k[14], 23, -35309556);
a = hh(a, b, c, d, k[1], 4, -1530992060);
d = hh(d, a, b, c, k[4], 11,  1272893353);
c = hh(c, d, a, b, k[7], 16, -155497632);
b = hh(b, c, d, a, k[10], 23, -1094730640);
a = hh(a, b, c, d, k[13], 4,  681279174);
d = hh(d, a, b, c, k[0], 11, -358537222);
c = hh(c, d, a, b, k[3], 16, -722521979);
b = hh(b, c, d, a, k[6], 23,  76029189);
a = hh(a, b, c, d, k[9], 4, -640364487);
d = hh(d, a, b, c, k[12], 11, -421815835);
c = hh(c, d, a, b, k[15], 16,  530742520);
b = hh(b, c, d, a, k[2], 23, -995338651);

a = ii(a, b, c, d, k[0], 6, -198630844);
d = ii(d, a, b, c, k[7], 10,  1126891415);
c = ii(c, d, a, b, k[14], 15, -1416354905);
b = ii(b, c, d, a, k[5], 21, -57434055);
a = ii(a, b, c, d, k[12], 6,  1700485571);
d = ii(d, a, b, c, k[3], 10, -1894986606);
c = ii(c, d, a, b, k[10], 15, -1051523);
b = ii(b, c, d, a, k[1], 21, -2054922799);
a = ii(a, b, c, d, k[8], 6,  1873313359);
d = ii(d, a, b, c, k[15], 10, -30611744);
c = ii(c, d, a, b, k[6], 15, -1560198380);
b = ii(b, c, d, a, k[13], 21,  1309151649);
a = ii(a, b, c, d, k[4], 6, -145523070);
d = ii(d, a, b, c, k[11], 10, -1120210379);
c = ii(c, d, a, b, k[2], 15,  718787259);
b = ii(b, c, d, a, k[9], 21, -343485551);

x[0] = add32(a, x[0]);
x[1] = add32(b, x[1]);
x[2] = add32(c, x[2]);
x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
a = add32(add32(a, q), add32(x, t));
return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
txt = '';
var n = s.length,
state = [1732584193, -271733879, -1732584194, 271733878], i;
for (i=64; i<=s.length; i+=64) {
md5cycle(state, md5blk(s.substring(i-64, i)));
}
s = s.substring(i-64);
var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
for (i=0; i<s.length; i++)
tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
tail[i>>2] |= 0x80 << ((i%4) << 3);
if (i > 55) {
md5cycle(state, tail);
for (i=0; i<16; i++) tail[i] = 0;
}
tail[14] = n*8;
md5cycle(state, tail);
return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) { /* I figured global was faster.   */
var md5blks = [], i; /* Andy King said do it this way. */
for (i=0; i<64; i+=4) {
md5blks[i>>2] = s.charCodeAt(i)
+ (s.charCodeAt(i+1) << 8)
+ (s.charCodeAt(i+2) << 16)
+ (s.charCodeAt(i+3) << 24);
}
return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n)
{
var s='', j=0;
for(; j<4; j++)
s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
+ hex_chr[(n >> (j * 8)) & 0x0F];
return s;
}

function hex(x) {
for (var i=0; i<x.length; i++)
x[i] = rhex(x[i]);
return x.join('');
}

function md5(s) {
return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
return (a + b) & 0xFFFFFFFF;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
function add32(x, y) {
var lsw = (x & 0xFFFF) + (y & 0xFFFF),
msw = (x >> 16) + (y >> 16) + (lsw >> 16);
return (msw << 16) | (lsw & 0xFFFF);
}
}

return md5(md5ArgStr);

};

SBExtension.PopupUISCode.prototype.successSC = function(resp) {
	var redeemScBtn = $('#sb_global_nav_swag_code_submit', document);
	var scInput = $('#sb_global_nav_swag_code_input', document);
	var uiRenderers = $('#tb_sc_msg_wrap', document);
	if (resp.charAt(0) == "0") {
		uiRenderers.text( SBExtension.browserPopup.getLocalizedString("somethingWrongTryLater") ).css('display', 'block');
		return false;
	} else {
		var respInfo = JSON.parse(resp);
		var msgCodeStr = respInfo[1].toString();
		var msgCode = msgCodeStr.indexOf("&") ? msgCodeStr.substring(0, msgCodeStr.indexOf("&") ) : respInfo[1];
		if(msgCode == 1) {
			if (respInfo[0] && (respInfo[0]=respInfo[0].trim()).length>0) {
				respInfo[0] = respInfo[0].replace("@sb@", respInfo[2]);
				SBExtension.browserPopup.setInnerHTML(document.getElementById('congratsYouEarnedXSbs'), respInfo[0], document);
			} else {
				SBExtension.browserPopup.setInnerHTML(document.getElementById('scSB'), respInfo[2], document);
			}
			$('#sc_one', document).css('display', 'none');
			$('#sc_two', document).css('display', 'none');
			$('#sc_three', document).css('display', 'block');
			
			var this_ = this;
			setTimeout(function() {
				//eventHandlers.handlePopoverClose();
				uiRenderers.text("").css('display', 'none');
				scInput.val("");
				this_.redeemedScAlready = false;
				redeemScBtn.delay(500).fadeTo(300, 1,function() {
					
				}).css("cursor", "pointer");
			}, 4000);
		} else {
			$('#sc_error_get, .sc_error_get_close', document).css('display', 'none');
			$('.sc_text, .sc_text_input, .sc_close', document).hide();
			SBExtension.browserPopup.setInnerHTML(uiRenderers[0], respInfo[0], document);
			uiRenderers.css('display', 'block');
			$('.reedem_error_close', document).css('display', 'block');
			this.redeemedScAlready = false;
			var redeemScBtn = $('#sb_global_nav_swag_code_submit', document);
			var this_ = this;
			redeemScBtn.delay(500).fadeTo(300, 1, function() {
				redeemScBtn.css("cursor", "pointer");
				this_.redeemedScAlready = false;
			})
		}
	}
};

if (!SBExtension.popupUI) {
	SBExtension.popupUI = [];
}
SBExtension.popupUI[SBExtension.POPUP_ID_SCDE] = new SBExtension.PopupUISCode();
