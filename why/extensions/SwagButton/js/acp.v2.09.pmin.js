window.acpObj = {
	acp_searchbox_id: "saw_input",                      
	acp_search_form_id: "search_win_container",
	acp_suggestions: "7",
	acp_api: 'http://api.sggstr.com',
	acp_l:  "en",
	acp_c:  "US"
};

if (!window.acpObj.acp_showOnDocumentClick) {
    window.acpObj.acp_showOnDocumentClick = "on"
}
if (!window.acpObj.acp_sig) {
    window.acpObj.acp_sig = "on"
}
if (!window.acpObj.acp_user_history) {
    window.acpObj.acp_user_history = "on"
}
if (!window.acpObj.acp_sig_html) {
    window.acpObj.acp_sig_html = ""
}
if (!window.acpObj.acp_suggestions) {
    window.acpObj.acp_suggestions = 10
}
if (!window.acpObj.acp_l || window.acpObj.acp_l == "auto") {
    var userLang = (navigator.language) ? navigator.language : navigator.userLanguage;
    window.acpObj.acp_l = userLang.substring(0, 2)
}
if (window.acpObj.acp_c && window.acpObj.acp_c == "auto") {
    window.acpObj.acp_c = null
}
if (!window.acpObj.acp_api) {
    window.acpObj.acp_api = "http://api.cmpltr.com"
}
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "")
    }
}

function getCookieDocument(){
	var doc = document;
	if(!document.cookie && window.content && window.content.document){
		doc = window.content.document
	}
	return doc;
}

function ltrim2(str) {
    for (var k = 0; k < str.length && isWhitespace(str.charAt(k)); k++) {
    }
    return str.substring(k, str.length)
}
function isWhitespace(charToCheck) {
    var whitespaceChars = " \t\n\r\f";
    return (whitespaceChars.indexOf(charToCheck) != -1)
}

(function() {
    function m(a) {
        return 10 > a ? "0" + a : a
    }
    function r(a) {
        s.lastIndex = 0;
        return s.test(a) ? '"' + a.replace(s, function(a) {
            var c = u[a];
            return "string" === typeof c ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + a + '"'
    }
    function p(a, l) {
        var c, d, h, q, g = e, f, b = l[a];
        b && ("object" === typeof b && "function" === typeof b.toJSON) && (b = b.toJSON(a));
        "function" === typeof k && (b = k.call(l, a, b));
        switch (typeof b) {
            case "string":
                return r(b);
            case "number":
                return isFinite(b) ? String(b) : "null";
            case "boolean":
            case "null":
                return String(b);
            case "object":
                if (!b) {
                    return "null"
                }
                e += n;
                f = [];
                if ("[object Array]" === Object.prototype.toString.apply(b)) {
                    q = b.length;
                    for (c = 0; c < q; c += 1) {
                        f[c] = p(c, b) || "null"
                    }
                    h = 0 === f.length ? "[]" : e ? "[\n" + e + f.join(",\n" + e) + "\n" + g + "]" : "[" + f.join(",") + "]";
                    e = g;
                    return h
                }
                if (k && "object" === typeof k) {
                    for (q = k.length, c = 0; c < q; c += 1) {
                        "string" === typeof k[c] && (d = k[c], (h = p(d, b)) && f.push(r(d) + (e ? ": " : ":") + h))
                    }
                } else {
                    for (d in b) {
                        Object.prototype.hasOwnProperty.call(b, d) && (h = p(d, b)) && f.push(r(d) + (e ? ": " : ":") + h)
                    }
                }
                h = 0 === f.length ? "{}" : e ? "{\n" + e + f.join(",\n" + e) + "\n" + g + "}" : "{" + f.join(",") + "}";
                e = g;
                return h
        }
    }
    "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + m(this.getUTCMonth() + 1) + "-" + m(this.getUTCDate()) + "T" + m(this.getUTCHours()) + ":" + m(this.getUTCMinutes()) + ":" + m(this.getUTCSeconds()) + "Z" : null
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
        return this.valueOf()
    });
    var t = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, s = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, e, n, u = {"\b": "\\b","\t": "\\t","\n": "\\n","\f": "\\f","\r": "\\r",'"': '\\"',"\\": "\\\\"}, k;
    "function" !== typeof JSON.stringify && (JSON.stringify = function(a, l, c) {
        var d;
        n = e = "";
        if ("number" === typeof c) {
            for (d = 0; d < c; d += 1) {
                n += " "
            }
        } else {
            "string" === typeof c && (n = c)
        }
        if ((k = l) && "function" !== typeof l && ("object" !== typeof l || "number" !== typeof l.length)) {
            throw Error("JSON.stringify")
        }
        return p("", {"": a})
    });
    "function" !== typeof JSON.parse && (JSON.parse = function(a, e) {
        function c(a, d) {
            var g, f, b = a[d];
            if (b && "object" === typeof b) {
                for (g in b) {
                    Object.prototype.hasOwnProperty.call(b, g) && (f = c(b, g), void 0 !== f ? b[g] = f : delete b[g])
                }
            }
            return e.call(a, d, b)
        }
        var d;
        a = String(a);
        t.lastIndex = 0;
        t.test(a) && (a = a.replace(t, function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
            return d = JSON.parse(a), "function" === typeof e ? c({"": d}, "") : d
        }
        throw new SyntaxError("JSON.parse")
    })
})();
var profanity_words = null;
function is_profanity(c) {
    try {
        if (profanity_words == null) {
            profanity_words = ["porn", "pthc", "boob ", "jizz", "orgy", "bdsm", "2g1c", "a2m ", "ass ", "bbw ", "cum ", "tit ", "pussy", "negro", "aryan", "bitch", "dildo", "juggs", "yiffy", "fuck", "titty", "pubes", "anal ", "clit ", "cock ", "kama ", "kike ", "milf ", "poof ", "shit ", "slut ", "smut ", "spic ", "twat ", "wank ", "cunt ", "bimbos", "goatse", "hooker", "rectum", "sodomy", "vagina", "goatcx", "faggot", "rimjob", "femdom", "dommes", "honkey", "incest", "licked", "nympho", "tranny", "voyeur", "spooge", "raping", "gokkun", "blow j", "feltch", "hentai", "sadism", "boner ", "nigga ", "queaf ", "twink ", "cocks ", "twinkie", "r@ygold", "cocaine", "neonazi", "strapon", "bukkake", "jigaboo", "asshole", "cuckold", "redtube", "nig nog", "camgirl", "gay boy", "gay sex", "humping", "schlong", "swinger", "camslut", "raghead", "figging", "pegging", "shemale", "kinbaku", "shibari", "nawashi", "fisting", "pisspig", "bondage", "rimming", "titties", "upskirt", "handjob", "preteen", "footjob", "tubgirl", "wetback", "squirt ", "darkie", "nigger", "orgasm", "sleazy d", "bunghole", "butthole", "genitals", "taste my", "knobbing", "huge fat", "kinkster", "pedobear", "swastika", "futanari", "omorashi", "goregasm", "clitoris", "bisexual", "assmunch", "daterape", "bangbros", "camwhore", "frotting", "tub girl", "arsehole", "bareback", "blumpkin", "hand job", "birdlock", "tentacle", "goo girl", "ball gag", "big tits", "bulldyke", "ponyplay", "mr hands", "strap on", "piss pig", "creampie", "jailbait", "pre teen", "jerk off", "babeland", "cumming ", "dolcett ", "gay dog", "gay man ", "sodomize", "prolapsed", "big black", "dog style", "bung hole", "fingering", "strappado", "rosy palm", "goodvibes", "servitude", "two girls", "date rape", "fapserver", "urophilia", "anilingus", "camel toe", "group sex", "hard core", "threesome", "tribadism", "dp action", "poopchute", "zoophilia", "phone sex", "bastinado", "girl on g", "throating", "gang bang", "jail bait", "ball sack", "fellatio", "jack off", "jiggaboo", "slanteye", "stormfront", "submissive", "black cock", "masturbate", "eat my ass", "bi curious", "buttcheeks", "circlejerk", "autoerotic", "giant cock", "bestiality", "poop chute", "muffdiving", "scissoring", "transexual", "asian babe", "deepthroat", "doggystyle", "dominatrix", "muff diver", "sadie lune", "sasha grey", "jiggerboo", "pedophile", "towelhead", "violet wand", "ejaculation", "nsfw images", "nimphomania", "coprophilia", "tea bagging", "violet blue", "bullet vibe", "blue waffle", "clusterfuck", "doggiestyle", "interracial", "foot fetish", "fudgepacker", "spread legs", "tongue in a", "how to kill", "blow your l", "deep throat", "doggy style", "girl on top", "nymphomania", "style doggy", "beaver lips", "pole smoker", "venus mound", "double dong", "nonconsent ", "paedophile ", "sultry women", "crossdresser", "ball kicking", "big knockers", "stileproject", "motherfucker", "spunky teens", "fuck buttons", "ethical slut", "stickam girl", "vorarephilia", "doggie style", "donkey punch", "fudge packer", "ball licking", "ball sucking", "shaved pussy", "urethra play", "raging boner", "white power ", "cunnilingus ", "blonde action", "rapping women", "dirty sanchez", "women rapping", "golden shower", "piece of shit", "dirty pillows", "how to murder", "carpetmuncher", "jackie strano", "madison young", "shaved beaver", "male squirting", "yellow showers", "acrotomophilia", "rusty trombone", "linda lovelace", "menage a trois", "electrotorture", "beaver cleaver", "carpet muncher", "mound of venus", "pleasure chest", "ducky doolittle", "reverse cowgirl", "brunette action", "barenaked ladies", "babes in toyland", "bianca beauchamp", "wartenberg wheel", "courtney trouble", "female squirting", "one cup two girls", "new pornographers", "two girls one cup", "leather restraint", "chocolate rosebuds", "double penetration", "female desperation", "wartenberg pinwheel", "missionary position", "consensual intercourse", "leather straight jacket", "blonde on blonde action", "rosy palm and her 5 sisters"]
        }
        for (var d = 0; d < profanity_words.length; d++) {
            if (0 <= c.indexOf(profanity_words[d])) {
                return true
            }
        }
    } catch (f) {
    }
    return false
}
function addToLocalHistory(latest_sub) {
    if (typeof (Storage) == "undefined") {
        return
    }
    if (window.acpObj.acp_user_history2 && window.acpObj.acp_user_history2 != "on") {
        return
    }
	var acp_user_history2 = SBExtension.store.retrieveGlobalKey("acp_user_history2");
    if (acp_user_history2 == null) {
        acp_user_history2 = new Array()
    } else {
        acp_user_history2 = JSON.parse(acp_user_history2)
    }
    if (latest_sub != null && latest_sub != "") {
        var my_term = latest_sub.trim();
        if (is_profanity(my_term)) {
            return
        }
        var cur_seconds = new Date().getTime() / 1000;
        var found_it = false;
        for (var i = 0; i < acp_user_history2.length; i++) {
            var item = acp_user_history2[i];
            if (typeof item == "undefined" || item == null || typeof item.term == "undefined" || item.term == null) {
                continue
            }
            if (item.term.toLowerCase() == my_term.toLowerCase()) {
                item.count += 1;
                item.time = cur_seconds;
                found_it = true;
                break
            }
        }
        if (!found_it) {
            var newObj = new Object();
            newObj.time = parseInt(cur_seconds, 10);
            newObj.term = my_term;
            newObj.count = 1;
            acp_user_history2.unshift(newObj)
        }
        SBExtension.store.storeGlobalKey("acp_user_history2", JSON.stringify(acp_user_history2));
    }
}
var MAX_LOCAL_OLD_HISTORY_SEC = 60 * 60 * 24 * 30;
function getFromLocaHistory(prefix, max_results, server_res) {
    var ret_list = new Array();

	if (typeof SBExtension.store == "undefined" || typeof JSON == "undefined") {
        return server_res
    }
    var acp_user_history2 = SBExtension.store.retrieveGlobalKey("acp_user_history2");
    if (acp_user_history2 == null) {
        acp_user_history2 = new Array()
    } else {
        acp_user_history2 = JSON.parse(acp_user_history2)
    }
    if (acp_user_history2 != null && max_results >= 1) {
        var cur_seconds = new Date().getTime() / 1000;
        var prefix = prefix.toLowerCase();
        var changed_history = false;
        var match_loc = -1;
        var cur_term = "";
        for (var i = 0; i < acp_user_history2.length; i++) {
            if (acp_user_history2[i] == null) {
                continue
            }
            if (acp_user_history2[i].term == null || cur_seconds - acp_user_history2[i].time > MAX_LOCAL_OLD_HISTORY_SEC) {
                delete (acp_user_history2[i]);
                changed_history = true;
                continue
            }
            cur_term = acp_user_history2[i].term.toLowerCase();
            match_loc = cur_term.indexOf(prefix);
            if (match_loc == 0 || (prefix.length > 2 && match_loc > 2 && cur_term[match_loc - 1] == " ")) {
                var newObj = new Object();
                newObj.term = acp_user_history2[i].term;
                newObj.count = acp_user_history2[i].count;
                ret_list.push(newObj)
            }
        }
        if (ret_list.length == 0) {
            return server_res
        }
        ret_list.sort(function(a, b) {
            return b.count - a.count
        });
        ret_list = ret_list.slice(0, max_results);
        var ret_final = new Array();
        for (var i = 0; i < ret_list.length; i++) {
            ret_final.push(ret_list[i].term)
        }
        ret_list = ret_final;
        if (changed_history) {
            localStorage.acp_user_history2 = JSON.stringify(acp_user_history2)
        }
    }
    for (var j = 0; j < server_res.length; j++) {
        var found_it = false;
        for (var i = 0; i < ret_list.length; i++) {
            if (server_res[j] == ret_list[i]) {
                found_it = true;
                break
            }
        }
        if (found_it == false) {
            ret_list.push(server_res[j])
        }
    }
    return ret_list
}
function getInternetExplorerVersion() {
    var docMode = getCookieDocument().documentMode;
    if (docMode === undefined) {
        docMode = 9
    }
    return docMode;
    var rv = 9;
    if (navigator.appName == "Microsoft Internet Explorer") {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) != null) {
            rv = parseFloat(RegExp.$1)
        }
    }
    return rv
}
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != "function") {
        window.onload = func
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload()
            }
            func()
        }
    }
}
if (!window.acpObj.acp_vl) {
    window.onpageshow = function() {
        pushSubmitTerm()
    }
}
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString()
    } else {
        var expires = ""
    }
	getCookieDocument().cookie = name + "=" + value + expires + "; path=/"
}
function readCookie(name) {
    var nameEQ = name + "=";
	var ca = getCookieDocument().cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1, c.length)
		}
		if (c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length, c.length)
		}
	}
    return null
}
function eraseCookie(name) {
    createCookie(name, "", -1)
}
var cookN = "acp_swr_" + window.acpObj.acp_partner;
function setToBeCalledParams() {
    var q = document.getElementById(window.acpObj.acp_searchbox_id).value;
    addToLocalHistory(q);
    var exist = 0;
    if (window.acpObj.exist) {
        exist = 1
    }
    createCookie(cookN, "q=" + encodeURIComponent(q) + "&p=" + window.acpObj.acp_partner + "&e=" + exist, 2)
}
function pushSubmitTerm() {
    if (window.acpObj.vl) {
        return
    }
    var params = readCookie(cookN);
    if (params == null) {
        return
    }
    eraseCookie(cookN);
    var sUrl = window.acpObj.acp_api + "/vl?" + params;
    var s = getCookieDocument().createElement("script");
    s.setAttribute("type", "text/javascript");
    s.setAttribute("id", "stJSON");
    s.setAttribute("src", sUrl);
    var oldCall = $$("stJSON");
    var head = getCookieDocument().getElementsByTagName("head").item(0);
    if (oldCall) {
        oldCall.parentNode.removeChild(oldCall)
    }
    head.appendChild(s)
}

function addLoadEventCallback(){
    var obj = $('#'+window.acpObj.acp_searchbox_id)[0];
    var ieVer = getInternetExplorerVersion();
    if (ieVer < 8) {
        obj.onkeyup = function() {
            window.acpObj.ac.s(event, this)
        };
        obj.onkeydown = function() {
            window.acpObj.ac.s_enter(event, this)
        };
        var s = getCookieDocument().createElement("table");
        s.className = "acp_ltr acp_ltr_ie";
        s.style.display = "none"
    } else {
        obj.onkeyup = null;
        obj.onkeydown = null;
        $(obj).keyup(function(event){
            window.acpObj.ac.s(event,this);
        });
        $(obj).keydown(function(event){
            window.acpObj.ac.s(event,this);
        });
        var s = getCookieDocument().createElement("table");
        s.setAttribute("class", "acp_ltr");
        s.setAttribute("style", "display:none")
    }
    obj.setAttribute("autocomplete", "off");
    s.setAttribute("cellspacing", "0");
    s.setAttribute("cellpadding", "0");
    s.setAttribute("id", "suggest");
    var tbody = getCookieDocument().createElement("tbody");
    tbody.setAttribute("id", "suggestions");
    s.appendChild(tbody);
    obj.parentNode.appendChild(s);
    if (window.acpObj.acp_sig == "on") {
        tfoot = getCookieDocument().createElement("tfoot");
        tr = getCookieDocument().createElement("tr");
        td = getCookieDocument().createElement("td");
        SBExtension.browserPopup.setInnerHTML(td, window.acpObj.acp_sig_html, getCookieDocument());
        tr.appendChild(td);
        tfoot.appendChild(tr);
        s.appendChild(tfoot)
    }
    setTimeout(function() {
        pushSubmitTerm()
    }, 1111)
}

addLoadEvent(addLoadEventCallback);
function $$(sId) {
    return document.getElementById(sId);
}
var oRequest;
(function() {
    var focus = {y: -1,table: $$("suggestions")};
    function focusOn(focus, row) {
        for (var i = focus.table.rows.length - 1; i >= 0; i--) {
            focus.table.rows[i].cells[0].style.backgroundColor = "#ffffff"
        }
        if (row === undefined) {
            focus.table.rows[focus.y].cells[0].style.backgroundColor = "#D5E2FF";
            $$(window.acpObj.acp_searchbox_id).value = focus.table.rows[focus.y].cells[0].innerHTML.replace(/(<([^>]+)>)/ig, "").replace("&amp;", "&");
            var clientType = $$("clientType");
            if (clientType) {
                clientType.value = "1"
            }
        } else {
            row.cells[0].style.backgroundColor = "#D5E2FF";
            focus.y = row.getAttribute("sugID")
        }
    }
    function changecss(myclass, element, value) {
        var CSSRules;
        if (getCookieDocument().all) {
            CSSRules = "rules"
        } else {
            if (getCookieDocument().getElementById) {
                CSSRules = "cssRules"
            }
        }
        var ss = getCookieDocument().styleSheets;
        for (var i = 0; i < getCookieDocument().styleSheets[ss.length - 1][CSSRules].length; i++) {
            if (getCookieDocument().styleSheets[ss.length - 1][CSSRules][i].selectorText == myclass) {
                getCookieDocument().styleSheets[ss.length - 1][CSSRules][i].style[element] = value;
                return
            }
        }
    }
    function request(q) {
        if (q.length < 1) {
            return
        }
        var q2 = ltrim2(q);
        if (!focus.table) {
            focus.table = $$("suggestions");
            var obj = getCookieDocument().getElementById(window.acpObj.acp_searchbox_id)
        }
        var sCountry = "";
        if (window.acpObj.acp_c) {
            sCountry = "&c=" + window.acpObj.acp_c.toLowerCase()
        }
        var sUrl = window.acpObj.acp_api + "/?q=" + encodeURIComponent(q2) + "&l=" + window.acpObj.acp_l + sCountry + "&callback=acp_new";
        this.c(sUrl)
    }
    function call(sUrl) {
        $.get( sUrl, function( data ) {});
    }
    function suggest_enter(e, q) {
        var e = e || event;
        if (e.keyCode == 13) {
            setToBeCalledParams();
            if (window.acpObj.acp_search_form_id) {
                $$(window.acpObj.acp_search_form_id).submit()
            }
            if (window.acpObj.acp_search_form_name) {
                getCookieDocument().forms[window.acpObj.acp_search_form_name].submit()
            }
        }
        if (e.keyCode == 9 && focus.y >= 0 && focus.table) {
            if (focus.table.rows.length > 0) {
                $$(window.acpObj.acp_searchbox_id).value = focus.table.rows[focus.y].cells[0].innerHTML.replace(/(<([^>]+)>)/ig, "").replace("&amp;", "&")
            }
            if (e.preventDefault) {
                e.preventDefault()
            }
            return false
        }
    }
    var lastSuggestValue = null;
    var lastSuggestTS = 0;
    var lastKeyCode = 0;

    function hideSuggestBox() {
        $$("suggest").style.display = "none";
    }

    function exposeSuggestBox() {
        $$("suggest").style.display = "block";
        //$("#wnd_main_content").unbind('click')
        $(document).unbind('click')
                              .bind('click', function(e) {
            //alert("WILL CLOSE!");

            var eX = e.pageX;
            var eY = e.pageY;
            var inputElem = $("#saw_input_container");
            var inputElemPos = inputElem.offset();
            var inputElemW = inputElem.outerWidth();
            var inputElemH = inputElem.outerHeight() + $("#suggest").outerHeight();
            var posX = inputElemPos.left;
            var posY = inputElemPos.top;
            if (eX<posX || eY<posY || eX>posX+inputElemW || eY>posY+inputElemH) {
                $(document).unbind('click');
                hideSuggestBox();
            }
        });
    }

    function suggest(e, q) {
        var curTS = (new Date()).getTime();
        if ((curTS-lastSuggestTS<100) && lastSuggestValue==q.value && e.keyCode==lastKeyCode) {
            return;
        }
        if ((e.keyCode==38 || e.keyCode==40) && ((curTS-lastSuggestTS<20) && e.keyCode==lastKeyCode || e.type!="keydown")) {
            lastSuggestTS = curTS;
            return;
        }
        lastSuggestValue = q.value;
        lastSuggestTS = curTS;
        lastKeyCode = e.keyCode;
        var clientType = $$("clientType");
        if (clientType) {
            clientType.value = "0"
        }
        if (q.value.length == 0) {
            window.acpObj.ac.n();
            return
        }
        var e = e || event;
        switch (e.keyCode) {
            case 38:
                focus.y--;
                window.acpObj.exist = true;
                break;
            case 40:
                focus.y++;
                window.acpObj.exist = true;
                break;
            case 13:
            case 39:
            case 37:
                window.acpObj.ac.n();
                return;
                break;
            case 27:
                window.acpObj.ac.n();
                return;
            default:
                window.acpObj.exist = false;
                this.r(q.value);
                focus.y = -1;
                return
        }
        if (focus.table) {
            if (focus.y < 0) {
                focus.y = focus.table.rows.length - 1
            }
            if (focus.y >= focus.table.rows.length) {
                focus.y = 0
            }
            if (focus.y >= focus.table.rows.length) {
                focus.y = 0
            }
            this.f(focus)
        }
    }
    function draw(str) {
        var tbody = $$("suggestions");
        if (str.query != ltrim2($$(window.acpObj.acp_searchbox_id).value.toLowerCase())) {
            return
        }
        str.items = getFromLocaHistory(str.query, 3, str.items);
        var suggest = String(str.items).split(",");
        suggest = suggest.slice(0, parseInt(window.acpObj.acp_suggestions, 0));
        while (tbody.rows && tbody.rows.length) {
            tbody.deleteRow(-1)
        }
        for (s in suggest) {
            if (suggest[s] == "") {
                continue
            }
            var row = tbody.insertRow(-1);
            var cell = row.insertCell(0);
            if (str.query == suggest[s].substr(0, str.query.length)) {
                var data = str.query + "<b>" + suggest[s].substr(str.query.length, suggest[s].length) + "</b>"
            } else {
                var data = "<b>" + suggest[s] + "</b>"
            }
            SBExtension.browserPopup.setInnerHTML(cell, data, getCookieDocument());
            cell.style.width = "";
            row.setAttribute("sugID", s);
            row.onmouseover = function() {
                window.acpObj.ac.f(focus, this)
            };
            row.onclick = function(event) {
                window.acpObj.ac.n();
                $$(window.acpObj.acp_searchbox_id).value = this.cells[0].innerHTML.replace(/(<([^>]+)>)/ig, "").replace("&amp;", "&");
                var clientType = $$("clientType");
                if (clientType) {
                    clientType.value = "1"
                }
                window.acpObj.exist = true;
                setToBeCalledParams();
                if (window.acpObj.acp_search_form_id) {
                    $$(window.acpObj.acp_search_form_id).submit()
                }
                if (window.acpObj.acp_search_form_name) {
                    getCookieDocument().forms[window.acpObj.acp_search_form_name].submit()
                }
                event.stopPropagation();
            }
        }
        if ($$("suggest").style.display == "none") {
            window.acpObj.ac.e();
        }
        if (tbody.rows.length == 0) {
            window.acpObj.ac.n();
        }
        if (window.acpObj.acp_showOnDocumentClick != "on") {
            getCookieDocument().onclick = function(e) {
                window.acpObj.ac.n();
            }
        }
    }
    window.acpObj.ac = {s: suggest,s_enter: suggest_enter,h: draw,r: request,c: call,f: focusOn,css: changecss, n: hideSuggestBox, e: exposeSuggestBox}
})();
function acp_new(str) {
    window.acpObj.ac.h(str)
}
;
