/**
 * Default SBBrowserInjectChrome ctor.
 * Creates instance of SBBrowserInjectChrome class that contains ALL Chrome browser-specific implementation  
 *         of the core browser functionality required for the rest of the code.
 *
 * @param {String} siteDomain The domain name of the site.
 */
function SBBrowserInjectChrome(siteHost) {
	this.initSBBrowserInjectChrome(siteHost);
}
	
SBBrowserInjectChrome.prototype = SBExtension.extend(SBBrowserInject.prototype, SBBrowserInjectChrome);

SBBrowserInjectChrome.prototype.isLocalStoragePreset = function() {
	return true;
};

SBBrowserInjectChrome.prototype.getLocalStorage = function() {
	return SBExtension.store.nativeLocalStorage;
};

SBBrowserInjectChrome.prototype.initSBBrowserInjectChrome = function(siteHost) {
	// Call parent class implementation first
	this.initSBBrowserInject(siteHost);
	// TODO : initialize chrome-specific functionality here...
}

SBBrowserInjectChrome.prototype.addOnBgMessageListener = function(onBgMessageListener) { //function(data, sender) {
	chrome.extension.onMessage.addListener(
		function(data, sender) {
			var tabId=data.tabId; 
			onBgMessageListener(tabId, data);
	});
}

SBBrowserInjectChrome.prototype.createTag = function(doc, tagName) {
	return jqSB("<" + tagName + " />", doc);
};

SBBrowserInjectChrome.prototype.setAttribute = function(elem, attrName, attrValue) {
	elem.attr(attrName, attrValue);
};

SBBrowserInjectChrome.prototype.sendBgMessage = function(eventName, tabId, param, callbackFunction) {
	var event = {name: eventName, tabId: tabId, param: param};
	chrome.runtime.sendMessage(event, (callbackFunction) ? callbackFunction : function(){});
}

SBBrowserInjectChrome.prototype.addWindowEventListener = function(windowEventListener) {
	window.addEventListener("message",
		function(evt) {
			if(Object.prototype.toString.call(evt.data) !== "[object String]") {
				windowEventListener(evt.data);
				return;
			}
			var value = evt.data.split('@');
			var tabId = value && value[1];
			if (isNaN(parseInt(tabId))) {
				return;
			}
			var state = value && value[2];
			var seType = value && value[0];
			var seMID = value && value[3];
			var commonEvt = {tabId: tabId, state: state, seType: seType, seMID: seMID};
			windowEventListener(commonEvt);
		}, false);
}

SBBrowserInjectChrome.prototype.getURL = function(filePath) {
	return chrome.extension.getURL((filePath.indexOf("img/pops")==0) ? filePath : "inject/" + filePath);
}

SBBrowserInjectChrome.prototype.createEventInjectionCode = function(message) {
	// {seState: "2", seTabID: 236, seType: "close"}
	var event = "window.postMessage('" + message.seType + "@" + message.seTabID + "@" + message.seState + "@" + message.seMID + "','*');";
	return event;
}

SBBrowserInjectChrome.prototype.isInjectPagePreActivated = function() {
	return true;
}

SBBrowserInjectChrome.prototype.jumpToURL = function(doc, url) {
	window.stop()
	window.location = url;
}

SBBrowserInjectChrome.prototype.getDocumentByID = function() {
	return document;
}

SBBrowserInjectChrome.prototype.openNewTab = function(url) {
	var win=window.open(url, '_blank');
	win.focus();
}

SBBrowserInjectChrome.prototype.getLocalizedString = function(name) {
	if (SBExtension.getCurrentLocale() != this.lastLocaleUsed) {
		this.resetLocale();
	}
	return chrome.i18n.getMessage(name).trim();
}

SBBrowserInjectChrome.prototype.getLocalizedDtdString = function(name) {
	return this.getLocalizedString(name);
}

SBBrowserInjectChrome.prototype.getCurrentLocale = function() {
	return (navigator.language || navigator.browserLanguage || navigator.userLanguage).replace('_','-').split('-')[0];
}

SBBrowserInjectChrome.prototype.isUsingLongLocale = function(name) {
	return false;
}

SBBrowserInjectChrome.prototype.resetLocale = function(fromInit, callback) {
	try {
		SBExtension.resetLocaleCount = (SBExtension.resetLocaleCount) ? SBExtension.resetLocaleCount+1 : 1;
		var prefsLocale;
		try {
			prefsLocale = SBExtension.store.retrieveGlobalKey("SSE_Current_Locale");
		} catch(err) {
		}
		var needReset = false;
		var lastLocaleUsed = SBExtension.getCurrentLocale(prefsLocale);
		if (!prefsLocale  ||  prefsLocale != lastLocaleUsed) {
			SBExtension.store.storeGlobalKey("SSE_Current_Locale", lastLocaleUsed);
			needReset = true;
		}
		if (!fromInit) {
			this.lastLocaleUsed = lastLocaleUsed;
			this.lastLocaleUsedDtd = lastLocaleUsed;
		}
		if (callback) {
			callback();
		}
	} catch(err2) {
		SBExtension.resetLocaleError = err2;
	}
}

SBExtension.SYNC_FS = false;

SBBrowserInjectChrome.prototype.isI18nLocalSame = function(loc1, loc2) {
  return (loc1==loc2 || loc1.replace("_","-").split("-")[0] == loc2.replace("_","-").split("-")[0]);
}

SBBrowserInjectChrome.prototype.resetI18n = function(localeArray, callback) {
  chrome.i18n = (function() {
      function asyncFetch(file, fn) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", chrome.extension.getURL(file), !SBExtension.SYNC_FS);
            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.responseText != "") {
                    fn(this.responseText);
                    if (callback) {
                        callback();
                    }
                }
            };
            xhr.send();
        } catch(err) {
            console.log(err.name + ": " + err.message);
        }
      }

      // Insert substitution args into a localized string.
      function parseString(msgData, args) {
        // If no substitution, just turn $$ into $ and short-circuit.
        if (msgData.placeholders == undefined && args == undefined) {
          return msgData.message.replace(/\$\$/g, '$');
        }

        // Substitute a regex while understanding that $$ should be untouched
        function safesub(txt, re, replacement) {
          var dollaRegex = /\$\$/g, dollaSub = "~~~I18N~~:";
          txt = txt.replace(dollaRegex, dollaSub);
          txt = txt.replace(re, replacement);
          // Put back in "$$" ("$$$$" somehow escapes down to "$$")
          var undollaRegex = /~~~I18N~~:/g, undollaSub = "$$$$";
          txt = txt.replace(undollaRegex, undollaSub);
          return txt;
        }

        var $n_re = /\$([1-9])/g;
        var $n_subber = function(_, num) { return args[num - 1]; };

        var placeholders = {};
        // Fill in $N in placeholders
        for (var name in msgData.placeholders) {
          var content = msgData.placeholders[name].content;
          placeholders[name.toLowerCase()] = safesub(content, $n_re, $n_subber);
        }
        // Fill in $N in message
        var message = safesub(msgData.message, $n_re, $n_subber);
        // Fill in $Place_Holder1$ in message
        message = safesub(message, /\$(\w+?)\$/g, function(full, name) {
          var lowered = name.toLowerCase();
          if (lowered in placeholders) {
            return placeholders[lowered];
          }
          return full; // e.g. '$FoO$' instead of 'foo'
        });
        // Replace $$ with $
        message = message.replace(/\$\$/g, '$');

        return message;
      }

      var l10nData = undefined;

      var theI18nObject = {
        _getL10nData: function(callback) {
          var result = { locales: localeArray };
          // Load all locale files that exist in that list
          result.messages = {};
          var i = 0;
          function setOneLocale(i) {
            var locale = result.locales[i];
            var file = "_locales/" + locale + "/messages.json";
            // Doesn't call the callback if file doesn't exist
            asyncFetch(file, function(text) {
              result.messages[locale] = JSON.parse(text);
              setOneLocaleCB(i);
            });
          }
          function setOneLocaleCB(i) {
              if (++i < result.locales.length) {
                setOneLocale(i);
              } else {
                if (callback)
                  callback();
              }
          }

          setOneLocale(0);

          return result;
        },

        _setL10nData: function(data) {
          l10nData = data;
        },

        getMessage: function(messageID, args) {
          var mappedValue;
          if (l10nData != undefined) {
            var locale = SBExtension.getCurrentLocale();
            var map = l10nData.messages[locale];
            if (map) {
              mappedValue = map[messageID];
            }
          }
          if (typeof mappedValue === "undefined") {
            // Assume that we're not in a content script, because content 
            // scripts are supposed to have set l10nData already
            //chrome.i18n._setL10nData(chrome.i18n._getL10nData());
            return SBExtension.browser.i18nDefault.getMessage(messageID, args);
          }
          if (typeof args == "string") {
            args = [args];
          }
          return parseString(mappedValue, args);
        },

        getUILanguage: function() {
          return SBExtension.getCurrentLocale();
        },

        getAcceptLanguages: function() {
          return SBExtension.browser.availableLocales;
        }
      };

      theI18nObject._setL10nData( theI18nObject._getL10nData(callback));

      return theI18nObject;
    })()
  ;
}

SBBrowserInjectChrome.prototype.initLocales = function(callback) {
	this.getAvailableLocales(function(localeArray) {
		// Back up original i18n value and initialize new i18n object with locale messages for future use...
		SBExtension.browser.i18nDefault = chrome.i18n;
		SBExtension.browser.resetI18n(localeArray, callback);
		SBExtension.browser.availableLocales = localeArray;
		if (callback)
			callback();
	});
}

SBBrowserInjectChrome.prototype.getAvailableLocales = function(callback) {
	this.sendBgMessage("GetAvailableLocales", -1, null, function(res) {
		callback(res);
	});
}

SBBrowserInjectChrome.prototype.getNativeLocalStorage = function() {
	var this_ = this;
	return {
		clear: function() {
			var tabId = -1;
			this_.sendBgMessage("StoreClear", tabId, null);
		},
		getItem: function(key, callback) {
			var tabId = -1;
			var val;
			this_.sendBgMessage("StoreGet", tabId, key, function(res) {
				if (callback) {
					callback(res);
				}
				val = res;
			});
			return val;
		},
		removeItem: function(key, deleting) {
			var tabId = -1;
			this_.sendBgMessage("StoreRemove", tabId, {key:key, deleting:deleting});
		},
		setItem: function(key, value) {
			var tabId = -1;
			this_.sendBgMessage("StoreSet", tabId, {key:key, value:value});
		}
	};
};

SBBrowserInjectChrome.prototype.addSecurityFieldsToAjaxCall = function(ajaxCall, fields) {
        for (var fld in fields) {
                ajaxCall[fld] = fields[fld];
        }
};

SBBrowserInjectChrome.prototype.broadcastStateChange = function(fields) {
};

SBBrowserInjectChrome.prototype.setInnerHTML = function(divSE, innerHTML) {
	divSE.innerHTML = innerHTML;
};

SBExtension.browserInject = new SBBrowserInjectChrome(SBExtension.config.sbHostName);
SBExtension.browser = SBExtension.browserInject;

SBExtension.browserInject.initLocales(function() {
	SBExtension.browserInject.initialized = true;
});
