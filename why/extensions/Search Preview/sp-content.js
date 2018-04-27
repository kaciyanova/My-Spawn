
// (C) 2016 Prevoow UG & Co. KG, Edward Ackroyd, Paderborn, Germany
if(!com) var com={};
if(!com.searchpreview) com.searchpreview={};
if(!com.searchpreview.core) com.searchpreview.core={};

com.searchpreview.core = {
GP_VERSION: 840,
GP_BROWSER: (typeof chrome=="object" ? "Chrome" : (typeof safari=="object" ? "Safari" : "Firefox")),
GP_BEST_IMAGE_SERVER: "",
GP_LOCALE: "",
MAX_IMAGES_PER_PAGE: 25,
GP_DOCUMENT: null,

SP_REQ_NAME: "preview", 
SP_REQ_OPTS: "000",

SP_OPT_SHOW_PREVIEWS: true,
SP_OPT_SHOW_RANKS: true,
SP_OPT_SHOW_RELATED: true,

SP_STRING_LOADING_RANK: "Loading site popularity rank...",
SP_STRING_RANK: "Site popularity rank",
SP_STRING_NO_RANK: "No popularity rank",
SP_STRING_RELATED_LABEL: "SearchPreview Related Link",

TIMEZONE_OFFSET: new Date().getTimezoneOffset(),
LOGIT: false,

//pixel and site warning images:
GPI_PIXEL: "data:image/gif,GIF89a%01%00%01%00%80%00%00%FF%FF%FF%00%00%00!%F9%04%01%00%00%00%00%2C%00%00%00%00%01%00%01%00%00%02%02D%01%00%3B",
GPI_PREVIEW_WARN: "data:image/gif,GIF89ao%00R%00%E6%00%00%F4%0B%0B%F0%F3%F1fff%C4_Z%CC33%C4%B0%AC%AA%24%24%C3%A5%A0%C9%3E%3A%D8%D5%D3%FF_%5E%FF%24%24%FF%3A%3A%CC%CC%CC%DE()%FF%8B%8B%FF%A5%A3%FFRR%DF%24%24%BE%86%80%C8TR%FF33%EA%EC%E9%FA%8D%8B%FF%BC%BB%FFff%D6%8C%8B%F1%A9%A8%EF()%FE%F6%F5%F3PN%F1%DC%DA%FFII%E4%C7%C4%FF%99%99%C0sr%D5IF%F0%2F.%FF))%CBzy%FF%E6%E4%FF%7C%7C%FF%AC%AB%E1%BB%B9%FF%CC%CC%EF%3B%3A%E8%8F%8D%FF%5C%5B%E5%2F-%FFB%3A%CCff%DF%81%80%FA%24%24%CC%99%99%F6)*%F5%F3%F1%E4%D2%CF%F8%CC%CA%E8()%C7EC%F4%B5%B2%FF%DE%DB%FFts%EF%F2%F0%CC%87%85%F9%F2%F1%FF%93%91%C5%80%7B%CF%B0%AD%C3XW%C2rq%FF%FF%FF%EC%93%92%F8%FB%F9%FA%92%90%CF%40%3F%B3%24%24%FF%B4%B3%FF%AA%A7%CCff%DF%DB%D9%EB%E9%E6%CC%99%99%C6%88%85%FFff%FF%A1%9F%FF%5E_%FFAA%EF%F7%F7%FF%80%7F%FF%ED%EC%C5%B5%AD%D0%3E%3B%D3%D1%CE%E7%24%24%F2%C8%C6%BFzu%F8..%D2on%F4%F7%F5%CE%8C%84%FF%99%99%CF%B3%AE%F7%94%94%CEJB%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%04%14%00%FF%00%2C%00%00%00%00o%00R%00%00%07%FF%80G%82%83%84%85%86%87%88%89%8A%8B%8C%8D%8E%8F%90%91%92%93%94%95%96%97%98%99%9A%9B%9C%9D%9E%9F%A0%A1%8C%3D%18N%22%A7%109%A2%AB%A0%2C%10%0F)%19%19%0AV%B5V%22%9F%00%00%AC%9CZ*%0F%19%11W%0C%C4%C4W%20%C8%AA%8A%BA%85%BB%89%CC%BC%99(U%3E%11%0C%15%D8a%DA%D8%15%C4a%3C%CB%D0G%E2%87%E4%D1%94Z%22%3E%20%D8%26%26%DC%15%EE%F0%26_%CF%BA%BB%F7%83%F7%CE%E3%CE%CC%FF%FC%F6%E9%C3G%D0%DC%26j%EC*%2CP%10a%01%B6%85%0D%E11%E8%80%A8%60%3FC%D02%12%BC%D8%CC%DF%3E%8D%9EX%A4%88%F00%83%20%10%0B%16%9Et%D8%CEEEA%1E%07%E6%E3%08%90c%BF%99%E2%3E%F2%DB%F4%40%C15%13%3E%08%81P%40%E8%85%3Bw-%82%94%EB%083%26%CD%8D%20%9F%0E%0C%85b%DD%C3%26%8A%90%B0%AC%60c%C5RBQ%A3JmJ%D6f%CEN%18%14%5C%E1f%02%EB%A1%1AL%FF%B4i%B3%A1%E1%EB%D4%A68%03%3A%C5%2B%F6%E6NMU%AC%B1%A5%01%C1%10%10%03%3A%E0%D9%10s%AE1%22!%20%AEq%5B%10%B4P%11%2F%F0%B8%CAp%CC%99%90%10%C9%0F%B3%20%CA%B0%B5%02%07%C6%9D%3B%3B%99%F7%40%91%8F%A3%26t%00%89f%F0Q%EDH%3D%DE%3D%ACB%C8H%DDA3hds%40%24u%A4%DB%91%40%C0%5E%80%EB%C8%08%26%12%94%08%02%13W%1B%87%25P%CAA%DD)%F0%22%C0%BC%7C%B9w%BF%7Bi%83%EE%87JNT_pA%BD%DC0%12%A6%24%D1%EE%FD%2F%D9%8FR%C3%3A5%87%3C%92%87%F3%0AI%10%C6d%02%CA%A5%C3%0E%09T%B4%1DX%02%91%03%92~e%F1g%1F%25%1F%94%00%60f%99q%40%40%01%F6%D4wWM%1Fn4V_6a%12%02%0C6%0C%88!7a%E8%40%C0%01%01%84SV%84%22%D28%E2~%13r%82%03%09%3A%A4%A8b%05rq%20%C1%0E%05%FC%B0%08%89%F89%18%13%FF%84%E11%C5%C9%0D5p%E1%80%0E%1CTY%A5%03%08L%D0%C5%7C%C61%D2%1F'Q%981%C4%00%14P0%00%18%07t%11c%97%E1%7C%F9I%00%16%C49%06%9Bt%D6i%E7%9Dx%E6%A9%E7%9E%7C%F6%E9%E7%9F%80%06*%E8%A0%84%16j%E8%A1%96%08%20%00%A2%A0(%EA%A8%A3G(j%88%A4%91PJ)%A3%97F%BAh'%99%1E%9A%E9%A3%9Bj%3A%C8%A3%93B*)%A8%82%90Z%08%AA%90%8E%DA%AA%A5%A1r%1A%2B%AC%A9n%DA%A9%AB%84%D0Z%EB%AE%B9%DA%EAk%A9%A2%06%EB%C9%A7%BF%06%ABj%AF%BA%5E%0Aj%AC%C6%16%AB%E9%AB%AD~B%2C%AF%CAF%EB%EA%A9%CE%DE%8Ak%B3%D4%FA%AA%AD%26%D3r%DB%2B%22%D8%F2*%2C%B3%C9%16%5B%AD(%E1%A6%7B%AB%AA%D5z%CB%AC%B8%F1%AE%CBh4%DF%DE%2B%ED%BC%AB%E4%AB%AF%AC%FF%F2%E2o%C0%E0%1Ek%F0%A2%CB%22%AC%AD%BB%EA%FE%3A%B0%C0%CEv%8B%AA%B8%E3%8AJ%2B%94%C3%FC%3A%86%B1%B9%E9%1E%02%AF%C3%0D%DFyq%C8%DD%9A%8Bl%C8%1D%DB9r%C9%2C%7Fko%B9%14%D3%B9%F1%B9%24%03%7Bm%A8%13%3FL%B0%C9%3B%0F%9Bq%CF%40%17%AAs%D0%92%0C%BD%E7%C7%F5*%8C%F3%C7%BB%E6%0C%AD%B0*%CFJr%CA0%EB%CA%ED%C4%22K%DD%F2%D4%0A%B3%FC%AC%A9%3F%B3%D9.%D7%25%A7%0C%F5%D9YWL5%CA5%2B%0B%B5%D1%AC%20%BD%F4%D6%D1b%0D%AD%D5h%DF%0B7%D1%8E%EC%CD%F7%DF%80%07.%F8%E0%84%17n%F8%E1%88'%AEx(%81%00%00%3B",

log: function(m) {
	if (this.LOGIT) {
		if (this.GP_BROWSER=="Firefox") {
			dump(m + "\n");
		}
		else {
			console.log(m);
		}
	}
},

GP_setDocument: function() {
	this.GP_DOCUMENT = this.GP_BROWSER == "Firefox" ? content.document : document; //!!TODO: Test in Chrome and Safari (changed for FF)
},

getDocument: function() {
  return this.GP_DOCUMENT;
},

getRealGoogleUrl: function(href) {
    var realUrl2 = href.match(/https?:\/\/(?:www\.)?google\.[^\/]+\/url\?.*url=(https?:.+)$/i);
    if (realUrl2) {
    	var maybeUrl = realUrl2[1];
    	var iamp = maybeUrl.indexOf("&");
    	if (iamp > 0) {
    		maybeUrl = maybeUrl.substring(0, iamp);
    	}            				
    	return unescape(maybeUrl);	
    }

    var realUrl = href.match(/https?:\/\/(?:www\.)?google\.[^\/]+\/url\?.*q=(https?:.+)$/i);
    if (realUrl) {
    	var maybeUrl = realUrl[1];
    	var iamp = maybeUrl.indexOf("&");
    	if (iamp > 0) {
    		maybeUrl = maybeUrl.substring(0, iamp);
    	}            				
    	return unescape(maybeUrl);	
    }
    return href;
},

getRealGoogleUrlAjax: function(href) {
    var realUrl = href.match(/https?:\/\/(?:www\.)?google\.[^\/]+\/url\?.*url=(https?:.+)$/i);
    if (realUrl) {
    	var maybeUrl = realUrl[1];
    	var iamp = maybeUrl.indexOf("&");
    	if (iamp > 0) {
    		maybeUrl = maybeUrl.substring(0, iamp);
    	}    
    	return unescape(maybeUrl);	
    }
    return href;
},

GP_addStyle: function(styleString, _doc) {
	var styleElement = _doc.createElement("style");
	styleElement.type = "text/css";
	styleElement.appendChild(_doc.createTextNode(styleString));
	_doc.getElementsByTagName("head")[0].appendChild(styleElement);		
},

getGPSub: function(href) {
	if (this.GP_BEST_IMAGE_SERVER && this.GP_BEST_IMAGE_SERVER.length > 0) {
		return this.GP_BEST_IMAGE_SERVER;
	}
	var d = new Date();
    var soff = Math.max(new Date(d.getFullYear(), 0, 1).getTimezoneOffset(), new Date(d.getFullYear(), 6, 1).getTimezoneOffset());
    if (soff >= 420) {
    	this.GP_BEST_IMAGE_SERVER = "sfo"; 
    }
    else if (soff >= 180) {
    	this.GP_BEST_IMAGE_SERVER = "nyc";
    }
    else if (soff <= -420) {
    	this.GP_BEST_IMAGE_SERVER = "jp";
    }
    else {
    	this.GP_BEST_IMAGE_SERVER = "eu1";
    }
    this.log("SP: Best image server: " + this.GP_BEST_IMAGE_SERVER);
    return this.GP_BEST_IMAGE_SERVER;
},

isSSL: function(_doc) {
	return _doc.location && _doc.location.toString().indexOf("https") == 0;
},

getImageURL: function(href, _doc) {
    //bad soft warning
    var mw = href.match(/https?:\/\/www\.google\..*\/interstitial\?url=/i);
    if (mw) {
        return this.GPI_PREVIEW_WARN;
    }

    var fullDomain = this.getFullDomain(href);
    var protocol = "unknown";
    
    var site = fullDomain;
    if (site.indexOf("http://") == 0) {
        site = site.substring(7, site.length);
        protocol = "http://";
    } 
    else if (site.indexOf("https://") == 0) {
        site = site.substring(8, site.length);
        protocol = "https://";
    }
    
    //site is already in IDN punycode in Safari and Chrome, but not in Firefox!
    
    var idnasite = this.GP_BROWSER == "Firefox" ? sendSyncMessage("searchpreview.de-idna", {"site" : site}) : site;
	var spProt = "https://"; //always HTTPS
    var preview = spProt+this.getGPSub(idnasite)+".searchpreview.de/"+this.SP_REQ_NAME+"?s=" + protocol + idnasite + "&ua="+this.GP_BROWSER+"&ver="+this.GP_VERSION+"&opts="+this.SP_REQ_OPTS;
	return preview;
},

getFullDomain: function(href) {
    var domain = href.match(/http(?:s)?:\/\/[^\/]+/i);
    return domain ? domain[0].toLowerCase() : href;
},

getRealURL: function(href)
{
   if (this.getFullDomain(href).match(/(.*wrs|\.rds|rds)\.yahoo\.com/i)) {
        var nhref = href.match(/\*\*.+$/);
        if (nhref) {
            href = unescape(nhref[0].substr(2));
            //de does some special click through
            if (href.match(/http.*\.yahoo.com\/click/i)) {
                href = unescape(href.match(/u=(.*)&y=/)[1]);
            }
        }
    }
   
    if (this.getFullDomain(href).match(/ri?\.search\.yahoo\.com/i)) {
    	var nhref = href.match(/.*RU=([^\/]*)/);
        if (nhref) {
            href = unescape(nhref[1]);
        }
    }
    return href;
},

createThumbnail: function(href, a, _doc) {
	href = this.getRealURL(href);
    var thumb = this.getDocument().createElement("img");
    thumb.setAttribute("align", "left");	
	thumb.setAttribute("src", this.getImageURL(href, _doc));
    thumb.style.width = "111px";
    thumb.style.height = "82px";
    thumb.style.backgroundPosition = "center";
	thumb.style.backgroundRepeat = "no-repeat";
	thumb.style.border = "1px solid #BBBBBB";
	thumb.style.margin = "2px 4px 5px 0px";
    return thumb;
},

createProductPreview: function(href, imageSource) {
    var thumb = this.getDocument().createElement("img");
    thumb.setAttribute("align", "left");	
	thumb.setAttribute("src", imageSource);
	thumb.style.border = "0px solid #BBBBBB";
	thumb.style.margin = "0px 10px 0px 7px";
	thumb.style.maxWidth = "111px";
	thumb.style.maxHeight = "82px";
    return thumb;
},

createThumbLink: function(thumb, a, doc) {
	var linka = doc.createElement("a");
	linka.href = a.href;
	linka.insertBefore(thumb, linka.firstChild);	
	return linka;
},

clearAndPadTop: function(xpath, padLIParent, ignoreStyle, _doc) {
    var notModifiedGs = _doc.evaluate(xpath, _doc, null, this.window.XPathResult.ANY_TYPE, null);
    var g = notModifiedGs.iterateNext();
    var gs = new Array();
    while (g) {
        gs.push(g);
        g = notModifiedGs.iterateNext();
    }
    for(var gi=0; gi<gs.length; gi++) {
        if (gs[gi].getAttribute("style") == null || ignoreStyle) {
            gs[gi].style.clear = "left";
            gs[gi].style.paddingTop = "10px";    	
            
            if (padLIParent) {
            	var li = gs[gi].parentNode;
            	if (li.tagName == "LI") {
            		li.style.clear = "left";
            		li.style.paddingTop = "10px";
            	}
            }	
        }
    }	
},

thumbshots: function(url) {
	this.log("*** THUMBSHOTS url:"+url);
	var head = this.getDocument().getElementsByTagName("head")[0];
	if (head.getAttribute("done") == "done")
		return;
	
	var t = 0;	
	if (this.isYahoo(url)) { //just com
		var i = 0;
		var links = this.getDocument().getElementsByTagName("a");
		var a = links[i++];
		while (a != null && t < this.MAX_IMAGES_PER_PAGE) {
			var href = a.href;
			if (href.indexOf("http://") == 0 || href.indexOf("https://") == 0) {
				var aParent = a.parentNode;
				var li = a.parentNode.parentNode.parentNode.parentNode;
				
				if ((((a.getAttribute("class") != null && a.getAttribute("class").indexOf("yschttl") >= 0) || a.getAttribute("class") == "rt" || ((a.getAttribute("class") != null && a.getAttribute("class").indexOf("td-hu") ==-1) && a.parentNode.getAttribute("class") == "title")) && li.nodeName == "LI") && a.getAttribute("done") != "done") {
					var oldStyle = (a.getAttribute("class") != null && a.getAttribute("class").indexOf("yschttl") >= 0);
					
					var mediaThere = this.fetchElement(this.getDocument(), ".//div[contains(@class,'sm-media')]", li);			
					if (!mediaThere && (a.text != null && a.text.length > 0)) {
	                    var thumb = this.createThumbnail(href, a, this.getDocument());
	  					var linka = this.createThumbLink(thumb, a, this.getDocument());
	  					
	  					var insertNode = oldStyle ? aParent : li;
	  					insertNode.insertBefore(linka, insertNode.firstChild);
	  					insertNode.parentNode.style.clear = "left";
	  					a.setAttribute("done", "done");
	  					t++;
  						var smi = this.fetchElement(this.getDocument(), ".//div[contains(@class,'sm-i')]", li);
  						if (smi) {
  							smi.style.cssFloat = "none";
  						}
  						var smr = this.fetchElement(this.getDocument(), ".//div[contains(@class,'sm-r')]", li);
  						if (smr) {
  							smr.style.cssFloat = "none";
  						}
					}
                }
			}
			a = links[i++];
		}
	}
	else if (this.isBing(url)) { 
        this.GP_addStyle(".sm-r {float:none;}", this.getDocument());
		var i = 0;
		var links = this.getDocument().getElementsByTagName("a");
		var a = links[i++];
		
		while (a != null && t < this.MAX_IMAGES_PER_PAGE) {
			var href = a.href;
			if (href.indexOf("http://") == 0 || href.indexOf("https://") == 0) {
				var aParent = a.parentNode;
                var aDiv = a.parentNode.parentNode;
                var li = a.parentNode.parentNode.parentNode;//.parentNode;
				var rDiv = a.parentNode.parentNode.parentNode.parentNode.parentNode;//.parentNode;
				//check for li
				if (rDiv && li.nodeName != "LI") {
					li = li.parentNode;
					rDiv = rDiv.parentNode;
				}
				//again (for new "social" bing search
				if (rDiv && li.nodeName != "LI") {
					li = li.parentNode;
					rDiv = rDiv.parentNode;
				}
                
				if (aParent && aParent.nodeName == "H3" && aDiv && aDiv.getAttribute("class") == "sb_tlst" && rDiv && rDiv.getAttribute("id") == "results" && li && li.nodeName == "LI" && a.getAttribute("done") != "done") {
					if (a.text != null && a.text.length > 0) {
                    var thumb = this.createThumbnail(href, a, this.getDocument());
  					var linka = this.createThumbLink(thumb, a, this.getDocument());
  					li.insertBefore(linka, li.firstChild);
  					li.style.clear = "left";
                    aDiv.style.display = "block";
                    a.style.display = "block";
  					a.setAttribute("done", "done");
  					t++;
  					if (t > 1 == null) {
                       li.style.paddingTop = "10px";                                 					
                    }
				  }
                }
				else if (a.getAttribute("done") != "done") { //new bing format US only at the moment
					li = a.parentNode.parentNode; //could also be one more parent
					if (li.nodeName != "LI") {
						li = li.parentNode;
					}
					
					if (li.getAttribute("class") == "b_algo" && a.parentNode.className.indexOf("b_suffix") == -1) {
						var richCaption = this.fetchElement(this.getDocument(), "./div[contains(@class,'b_rich')]", li);
						if (!richCaption) {
							var thumb = this.createThumbnail(href, a, this.getDocument());
							var linka = this.createThumbLink(thumb, a, this.getDocument());
							li.insertBefore(linka, li.firstChild);
	  						li.style.clear = "left";
	  						a.setAttribute("done", "done");
	  						t++;
						}
					}
				}
			}
			a = links[i++];
		}
	}
	else if(this.isDDGHtml(url)) {
		this.log("DDG-HTML");
		var document = this.getDocument();
        var links = this.fetchElement(document, ".//div[@id='links']", document);
        if (links) {
            var serpNodes = links.childNodes;
            for (var i = 0; i < serpNodes.length; ++i) {
                var serpNode = serpNodes[i];              
                var serpAnchor = this.fetchElement(document, "./div/a[@class='large']", serpNode);
                if (serpAnchor) {
                    var serpURL = serpAnchor.getAttribute("href");
                    if (serpURL && serpURL.indexOf("http") == 0) {
                        var previewImage = document.createElement("img");
                        previewImage.style.cssFloat = "left";
                        previewImage.style.margin = "4px 5px 0px 2px";
                        previewImage.style.width = "111px";
                        previewImage.style.height = "82px";
                        previewImage.setAttribute("src", this.getImageURL(serpURL, document));
                        previewImage.style.border = "1px solid #BBBBBB";
                        var linka = document.createElement("a");
                        linka.href = serpURL;
            	        linka.insertBefore(previewImage, linka.firstChild);
                        serpNode.insertBefore(linka, serpAnchor.parentNode);
                        
                        var snippet = this.fetchElement(document, ".//div[@class='snippet']", serpNode);
                        if (snippet) {
                            snippet.style.clear = "none";
                        }
                    }
                }
            }
        }
	}

	if (t > 0) {
	   	head.setAttribute("done", "done");	
    }
},

isGoogleComTLD: function(href) {
	return href.match(/https?:\/\/(www|ipv6|encrypted)(|[0-9])\.(|l\.)google\.com.*/i);
},

isGoogleDeTLD: function(href) {
	return href.match(/https?:\/\/(www|encrypted)(|[0-9])\.(|l\.)google\.de.*/i);
},

isYahoo: function(href) {
    return href.match(/https?:\/\/.*search\.yahoo\.com\/(|yhs\/)search/i);
},

isBing: function(href) {
    return href.match(/https?:\/\/(www|.?.?)\.bing\.com\/search/i);
},

isDDG: function(href) {
	return href.match(/https?:\/\/(next\.)?duckduckgo.com\/.*/i);
},

isDDGHtml: function(href) {
	return href.match(/https?:\/\/duckduckgo.com\/html.*/i);
},

isEngine: function(href) {
    return href.match(/https?:\/\/(www|ipv6|encrypted)(|[0-9])\.(|l\.)google\..*\/.*/i) || this.isYahoo(href) || this.isBing(href) || this.isDDG(href); 
},


getNodeValue: function(node, name) {
    var elems = node.getElementsByTagName(name);
    if (!elems) {
        return "";
    }
    var elem = elems[0];
    var value = (elem && elem.childNodes[0]) ? elem.childNodes[0].nodeValue : "";
    return value;
},

getGoogleQ: function(doc) {
	var url = doc.location + "&";
	var q = url.match(/.*(\&|\?)q=(.*?)\&/)[2];
	q = decodeURIComponent(q);
	q = q.replace(/\+/g," ");
	this.log("q:" + q + "\n");
	return q;
},

getQParam: function(url) {
	var q = url.match(/.*(\&|\?)q=(.*?)\&/)[2];
	q = decodeURIComponent(q);
	q = q.replace(/\+/g," ");
	return q;
},

getStartParam: function(url) {
	try {
		var s = url.match(/.*(\&|\?)start=([0-9]*)/)[2];
		s = decodeURIComponent(s);
		s = s.replace(/\+/g," ");
		return s;
	} catch (e) {
		return "0";
	}
},

firstUpperCase: function(s) {
	if (s == null)
		return null;
	if (s.length == 1) {
		return s.toUpperCase();
	}
	if (s.length > 1) {
		return s.charAt(0).toUpperCase() + s.substring(1, s.length);
	}
	return s;
},

GP_main: function() 
{ 	
	var url = this.GP_DOCUMENT.location.href;
		
	if (!this.isEngine(url)) {
		return;
	}	

	//Old style Bing, Yahoo and DDG
	if ((this.isYahoo(url) || this.isBing(url) || this.isDDGHtml(url))) {
		this.thumbshots(url);
	}
},

forceReload:function(img) {
	var l = img.getAttribute("src");
	img.setAttribute("src", this.GPI_PIXEL);
	img.setAttribute("src", l);	
},

fetchElement:function(doc, filter, start) {
	var elems = doc.evaluate(filter, start, null, this.window.XPathResult.ANY_TYPE, null);
	var elem = elems.iterateNext();
	return elem;
},

processGoogleLiTag:function(li, doc, t, isGoogleCardLayout) {
	if (li == null || !li.getAttribute || (li.getAttribute("id") && li.getAttribute("id").indexOf("box") >= 0) || li.getAttribute("class") == null || (li.getAttribute("class").charAt(0) != 'g' && li.getAttribute("class") != "tl")) return false;
	//Fixed: +1ed sites did not get a preview
	if (doc.evaluate(".//table[@class='ts']//img[@width!=24 and @height!=24]", li, null, this.window.XPathResult.ANY_TYPE, null).iterateNext() != null) return false;
	
	//for video results no preview, but fake an insertion so it still gets a rank popularity
	if (doc.evaluate(".//div[contains(@class, 'th')]", li, null, this.window.XPathResult.ANY_TYPE, null).iterateNext() != null) {
		var h3 = this.fetchElement(doc, ".//h3[@class='r']", li);
		if (h3 == null) return false;
		var h3Parent = h3.parentNode;
		if (!(h3Parent.getAttribute("class") == "vsc" || h3Parent.getAttribute("class") == "rc")) return false;
		var fakeInsertionForRank = new Object();
		fakeInsertionForRank.a = h3.firstChild;
		fakeInsertionForRank.previewInserted = true;
		return fakeInsertionForRank; 
	}

	//table class="ts" but with no image
	var tableTS = doc.evaluate(".//table[@class='ts']", li, null, this.window.XPathResult.ANY_TYPE, null).iterateNext()
	if (tableTS != null) {
		//may not be first sub node of li
		if (doc.evaluate("./table[@class='ts']", li, null, this.window.XPathResult.ANY_TYPE, null).iterateNext() != null) {
			return false;
		}
		tableTS.style.clear = "none";
	}
	
	var pWidth = "111";
	var pHeight = "82";
	
	//smaller preview images for question answer area in search results
	var rqParent = li.parentNode;
	while (rqParent) {
		if (rqParent.className == "related-question-pair") {
			pWidth = "56";
			pHeight = "41";
			break;
		}
		rqParent = rqParent.parentNode;
	}
			
	li.style.clear = "left";
	var h3 = this.fetchElement(doc, ".//h3[@class='r']", li);
	if (h3 == null) return false;
	var h3Parent = h3.parentNode;
	if (!(h3Parent.getAttribute("class") == "vsc" || h3Parent.getAttribute("class") == "rc")) return false;
	
	//Google experimental "hover to init Google's own result previews"
	h3.style.display = "inline";
	
	var a = h3.firstChild;
	if (a == null) return false;
	
	if (!(a instanceof this.window.HTMLAnchorElement) && h3.childNodes.length >= 2) { //try next h3 child (for example pdf results)
		a = h3.childNodes[1];
	}
	
	if (!(a instanceof this.window.HTMLAnchorElement) /*|| a.getAttribute("class") == null || a.getAttribute("class").indexOf("l") != 0*/) return false;
	
	var isNoJSVersion = (a.getAttribute("class") == null || a.getAttribute("class").indexOf("l") != 0) ? true : false; 
	var href = a.href;
	href = isNoJSVersion ? this.getRealGoogleUrl(href) : this.getRealGoogleUrlAjax(href);
	var result = new Object();
	result.a = a;
	if (href.indexOf("http://") == 0 || href.indexOf("https://") == 0) {					
		if ("done" != a.getAttribute("done") && a.text != null && a.text.length > 0) {
			result.previewInserted = true;				
			if (!this.SP_OPT_SHOW_PREVIEWS) {
				return result;
			}
			var thumb;					
            thumb = doc.createElement("img");
            thumb.setAttribute("align", "left");	
            thumb.setAttribute("src", this.GPI_PIXEL);
            thumb.style.width = pWidth + "px";
            thumb.style.height = pHeight + "px";
			thumb.setAttribute("width", pWidth);
			thumb.setAttribute("height", pHeight);
            thumb.style.backgroundPosition = "center";
            thumb.style.backgroundRepeat = "no-repeat";
            thumb.style.border = "1px solid #BBBBBB";
            thumb.style.margin = isGoogleCardLayout ? "4px 4px 0px 0px" : "4px 4px 5px 0px";
			
			var linka = this.createThumbLink(thumb, a, doc);

			thumb.setAttribute("src", this.getImageURL(href, doc));
			a.setAttribute("done", "done");
			
			//new table style
			var table = doc.createElement("table");
			table.setAttribute("class", "ts");
			table.style.width = "100%";
			
			var tbody = doc.createElement("tbody");
			table.appendChild(tbody);
			
			var tr1 = doc.createElement("tr");
			tbody.appendChild(tr1);
			
			var td1 = doc.createElement("td");
			td1.setAttribute("colspan", "2");
			tr1.appendChild(td1);
			td1.appendChild(h3Parent.removeChild(h3));
					
			var tr2 = doc.createElement("tr");
			tbody.appendChild(tr2);
			
			var td2 = doc.createElement("td");
			td2.setAttribute("valign", "top");
			td2.setAttribute("width", "1");
			tr2.appendChild(td2);
			td2.appendChild(linka);
			
			var td3 = doc.createElement("td");
			td3.setAttribute("valign", "top");
			tr2.appendChild(td3);
			
			var VSCChildrenToMove = new Array();
			var VSCChildNodes = h3Parent.childNodes;
			for(var i=0; i<VSCChildNodes.length; i++) {
				if (!VSCChildNodes[i].getAttribute || VSCChildNodes[i].getAttribute("class") != "vspib") {
					VSCChildrenToMove.push(VSCChildNodes[i]);
				}
			}
			
    		for(var ci=0; ci<VSCChildrenToMove.length; ci++) {
    			td3.appendChild(h3Parent.removeChild(VSCChildrenToMove[ci]));
    		}

			h3Parent.appendChild(table);
			
		}
	}
	if (!isGoogleCardLayout) {
		doc.getElementById("center_col").style.width = "550px";
		doc.getElementById("center_col").style.marginLeft = "80px";
	}
    return result;
},

updatePreviewImage: function(previewUrl) {
	var i = previewUrl.indexOf("s=http");
	if (i > 0) {
		var proto = previewUrl.indexOf("https") == 0 ? "https" : "http";
		var updateUrl = proto + "://update.searchpreview.de/update?" + previewUrl.substring(i) + "&retpic=true";
		
		var doc = this.GP_BROWSER == "Firefox" ? content.document : document;
		var affected =  doc.evaluate("//img[@src='"+previewUrl+"']", doc, null, this.window.XPathResult.ANY_TYPE, null);
		var runner = affected.iterateNext();
		var changeArray = new Array();
		
		while (runner != null ) {
			changeArray.push(runner);
			runner = affected.iterateNext();
		}
		
		for(var ci=0; ci<changeArray.length; ci++) {	
			var url = ci == 0 ? updateUrl : (proto + "://update.searchpreview.de/up-req.gif");
			changeArray[ci].setAttribute("src", url);	    			
			changeArray[ci].style.backgroundImage = "url("+previewUrl+")";
			changeArray[ci].style.backgroundSize = "111px 82px";
		}
	}
},

shorten: function(s, max) {
	if (s && s.length > max) {
		return s.substring(0, max-1) + "...";
	}
	return s;
},

decodeHTMLEntities: function(s) {
	if (s == null)
		return null;
	s = s.replace(/&amp;/g, "&");
	s = s.replace(/&gt;/g, ">");
	s = s.replace(/&lt;/g, "<");
	s = s.replace(/&quot;/g, "\"");
	s = s.replace(/&nbsp;/g, " ");
	s = s.replace(/&#39;/g, "\'");

	return s = s.replace(/&agrave;/g, "À");
},

getRelatedLI: function(title, text, displayUrl, clickUrl, citeUrl, nMore, isDE, imageUrl, trackUrl, sls) {
	var _doc = this.getDocument();
	var li = _doc.createElement("li");
	li.className = "foo g";
	li.style.clear = "left";
	//li.style.paddingBottom = "12px";
	li.style.maxWidth = "47em";
	//li.style.backgroundColor = "#fffae7";
	li.style.minHeight = "80px";
	
	li.style.marginBottom = "10px";
	li.style.paddingBottom = "4px";
	li.style.paddingLeft = "5px";
	//li.style.borderTop = "1px solid #DDD";
	//li.style.borderBottom = "1px solid #EEE";
	
	var a = _doc.createElement("a");
	a.href = clickUrl;

    if (imageUrl && imageUrl.length > 0) {
        a.appendChild(this.createProductPreview(displayUrl, imageUrl));
    }
    else {	        
    	var thumb = this.createThumbnail(displayUrl, a, _doc);
    	thumb.style.width = "74px";
    	thumb.style.height = "55px";
        a.appendChild(thumb);
    }
	
    var h3 = _doc.createElement("h3");
    h3.className = "r";
    //always inline
    h3.style.display = "inline";
    h3.style.whiteSpace = "normal";
    
    var h3a = _doc.createElement("a");
    h3a.className = "l sp-rel-link";
    h3a.textContent = title;
    h3a.href = clickUrl;
    
    var div = _doc.createElement("div");
    div.className = "s";
    var marker = this.GP_BROWSER == "Firefox" ?  (isDE ? "SearchPreview Anzeige" : this.SP_STRING_RELATED_LABEL) : this.SP_STRING_RELATED_LABEL;
    
    var tu = (trackUrl && trackUrl.length > 0) ? _doc.createElement("img") : null; 

    div.textContent = text;
    div.appendChild(_doc.createElement("br"));
    var cite = _doc.createElement("cite");
    cite.textContent = citeUrl;
    div.appendChild(cite);
    
    if (tu != null) {
    	tu.setAttribute("width", "1");
    	tu.setAttribute("height", "1");
    	tu.setAttribute("border", "0");
    	tu.setAttribute("src", trackUrl);
    	div.appendChild(tu);
    }
    
    //SiteLinks
    if (sls && sls.length > 0) {
    	var slDiv = _doc.createElement("div");
    	//slDiv.style.paddingTop = "2px";
    	for (var si = 0; si < sls.length; si++) {
    		var slA = _doc.createElement("a");
    		slA.className = "sp-rel-link";
    		slA.style.fontSize = "small";
    		slA.style.paddingRight = "20px";
    		slA.textContent = sls[si].text;
    		slA.href = sls[si].url;
    		slDiv.appendChild(slA);
    	}
    	div.appendChild(slDiv);
    }
    
    var markerDiv = _doc.createElement("div");
    markerDiv.textContent = marker;
    markerDiv.setAttribute("class", "f");
    markerDiv.style.fontSize = "12px";
    markerDiv.style.textAlign = "right";
    markerDiv.style.paddingRight = "4px";
    markerDiv.style.color = "rgba(128, 128, 128, 0.7)";

    
    h3.appendChild(h3a);
    
    li.appendChild(markerDiv);
    li.appendChild(a);
    li.appendChild(h3);
    li.appendChild(div);	
   
    li.setAttribute("id", "-_-gpad-_-");
    return li;
},

relatedRender: function(xml, qParam, isDE, responseInMs, _q) {
	var _doc = this.getDocument();
	this.log("relatedRender responseInMs: " + responseInMs);
	var existing = _doc.getElementById("-_-gpad-_-");
	if (existing) {
		existing.parentNode.removeChild(existing);
	}
	var RENDER_TOP_MAX_MS = 1300;
	//check if its still the right page
	if (!_q) {
		var qCurrent = this.getGoogleQ(_doc);
		if (qCurrent != qParam ) {	
			return;
		}
	}

	var parser = new this.window.DOMParser();
	var doc = parser.parseFromString(xml,"text/xml"); 
	var adPos = 0;
	var adsTag = doc.getElementsByTagName("ads");
	if (!adsTag || adsTag.length != 1) {
		return;
	}

	var posAtt = adsTag[0].getAttribute("pos");
	if (posAtt) {
		var tempPos = parseInt(posAtt);
		if (tempPos >= 0 && tempPos < 9) {
			adPos = tempPos;
		}
	}
	var ssl = this.isSSL(_doc);
	var ads = doc.getElementsByTagName("ad");
	if (ads && ads.length > 0) {	
		var ols = _doc.evaluate("//ol[@id='rso']", _doc, null, this.window.XPathResult.ANY_TYPE, null);		
        var olToAddTo = ols.iterateNext();
		if (!olToAddTo) {
			ols = _doc.evaluate("//div[@id='res']/span/div/ol", _doc, null, this.window.XPathResult.ANY_TYPE, null);
			olToAddTo = ols.iterateNext();
		}
		if (!olToAddTo) {
			ols = _doc.evaluate("//div[@id='res']/div/div/ol", _doc, null, this.window.XPathResult.ANY_TYPE, null);
			olToAddTo = ols.iterateNext();
		}
		if (!olToAddTo) {
			ols = _doc.evaluate("//div[@id='res']/div/ol", _doc, null, this.window.XPathResult.ANY_TYPE, null);
			olToAddTo = ols.iterateNext();
		}

        var restContainer;        
        var maxAds = Math.min(ads.length, 1);
        
		for (var i = 0; i < maxAds; i++) {
			var sls = [];
			
			var clickUrl = this.getNodeValue(ads[i], "clickUrl");
			var title = this.getNodeValue(ads[i], "title");
			var displayUrl = this.getNodeValue(ads[i], "displayUrl");
			var text = this.getNodeValue(ads[i], "text");			
			var imageUrl = this.getNodeValue(ads[i], "imageUrl");
			var trackUrl = this.getNodeValue(ads[i], "trackUrl");
			
			if (ssl) {
				if (imageUrl && imageUrl.indexOf("https") != 0) {
					imageUrl = "";
				}
				if (trackUrl && trackUrl.indexOf("https") != 0) {
					trackUrl = "";
				}
			}
			
			title = this.decodeHTMLEntities(title);
			text = this.decodeHTMLEntities(text);
			
			text = this.shorten(text, 150);
			title = this.shorten(title, 70);
			displayUrl = this.shorten(displayUrl, 100);
			displayUrl = displayUrl.toLowerCase();
			if (displayUrl.indexOf("http://") == -1) {
				displayUrl = "http://" + displayUrl;
			}
			
			var citeUrl = displayUrl.indexOf("http://") == 0 ? displayUrl.substring(7,displayUrl.length) : displayUrl;					
			if (citeUrl.indexOf("/") == -1) {
				citeUrl += "/";
			}
			
			var slsNodes = ads[i].getElementsByTagName("siteLinks");
			if (slsNodes && slsNodes.length == 1) {
				var siteLinkNodes = slsNodes[0].childNodes;
				for (var sl = 0; sl < siteLinkNodes.length; sl++) {
					if (siteLinkNodes[sl].nodeType == doc.ELEMENT_NODE) {
						var siteLink = new Object();
						siteLink.text = this.decodeHTMLEntities(this.getNodeValue(siteLinkNodes[sl], "text"));
						siteLink.url = this.getNodeValue(siteLinkNodes[sl], "url");
						//this.log("FOUND SL: " + siteLink.text + " : " + siteLink.url);
						sls.push(siteLink);
					}
				}
			}
			
			var adAddedBefore;
			
			if (i == 0) {
				var li = this.getRelatedLI(title, text, displayUrl, clickUrl, citeUrl, maxAds - 1, isDE, imageUrl, trackUrl, sls);   
				if (responseInMs > RENDER_TOP_MAX_MS) {
					//SC in the house
					if (_doc.getElementById("scInsertPoint") != null) {
						olToAddTo.insertBefore(li, olToAddTo.lastChild);
					}
					else {
						//normal case, no SC   					
	            		olToAddTo.appendChild(li);
	            	}	
	            }
	            else {
					if (adPos == 0) {	
						var taw = _doc.getElementById("center_col");
						if (taw) {
							var newOl = _doc.createElement("ol");
							taw.insertBefore(newOl, taw.firstChild);
							olToAddTo = newOl;
						}

						olToAddTo.insertBefore(li, olToAddTo.firstChild);
					}
					else {
						//find adPos'th li
						var children = olToAddTo.childNodes;
						var liNum = 0;
						for (var ci = 0; ci < children.length; ci++) {
							if (children[ci].nodeName == "LI") {
								liNum++;
								if (liNum == adPos) {
									adAddedBefore = children[ci];
									olToAddTo.insertBefore(li, adAddedBefore);
									break;
								}
							}
						}
						
					}
	            }
            }
    	}
	}	
},

showRelated: function(_q) {
	this.log("showRelated");
	var q;
	var _doc = this.getDocument();
	
	if (!_q) {
		q = this.getGoogleQ(_doc);
	}
	else {
		q = _q;
	}
	this.log("showRelated q: " + q);
	if (q) {	
		if (_doc.location.href.indexOf("start=") > 0 && _doc.location.href.indexOf("start=0") == -1) {
			this.log("showRelated page > 1");
			return;
        }
		var location = _doc.location.href;
		var isDE = this.isGoogleDeTLD(location) ? true : false;
		var isCOM = this.isGoogleComTLD(location) ? true : false;
		var isINT = !isDE && !isCOM;
	
		var qParam = encodeURIComponent(q);
		//TODO: Ad Cache?
		var ref = location;
		var refi = ref.indexOf("#");
		if (refi  > 0) {
			ref = location.substring(0, refi);
		}	
		ref = encodeURIComponent(ref);

		var googleInstant = _q ? true : false;
        var serviceURL = "https://" + this.getGPSub("") + ".searchpreview.de/related/global?sl=1&q=" +qParam + "&gi=" + googleInstant + "&ref=" + ref;       
		this.log("Related serviceURL: "+serviceURL);		
	
		var ziss = this;
		var startTime = new Date().getTime();
		
		if (this.GP_BROWSER=="Firefox") {	
			var messageId = "searchpreview.de-related-return:" + new Date().getMilliseconds();
			addMessageListener(messageId, function handle(message) {
				ziss.log(message.data);
				ziss.relatedRender(message.data, q, isDE, new Date().getTime() - startTime, _q);
				removeMessageListener(messageId, handle);
			});
			sendAsyncMessage("searchpreview.de-http", {url: serviceURL, callbackId: messageId});
		}
		else if (this.GP_BROWSER=="Chrome") {
			chrome.runtime.sendMessage({command: "http-get", url: serviceURL}, function(response) {
				if (response.xml && response.xml.length > 10) {
					ziss.log(response.xml);
					ziss.relatedRender(response.xml, q, isDE, new Date().getTime() - startTime, _q);
				}
			});	
		}
	}
},

initPrefs: function(pas) {
	this.log("SP-initPrefs");
	this.SP_OPT_SHOW_PREVIEWS = pas.prefs.insertpreviews;
	this.SP_OPT_SHOW_RANKS = pas.prefs.insertranks;
	this.SP_OPT_SHOW_RELATED = pas.prefs.insertrelated;
	this.log("* Options *");
	this.log("* SP_OPT_SHOW_PREVIEWS: " + this.SP_OPT_SHOW_PREVIEWS);
	this.log("* SP_OPT_SHOW_RANKS: " + this.SP_OPT_SHOW_RANKS);
	this.log("* SP_OPT_SHOW_RELATED: " + this.SP_OPT_SHOW_RELATED);
	var opts = this.SP_OPT_SHOW_PREVIEWS ? "1" : "0";
	opts += this.SP_OPT_SHOW_RELATED ? "1" : "0";
	opts += this.SP_OPT_SHOW_RANKS ? "1" : "0";
	this.SP_REQ_OPTS = opts;
},

ff_handleUpdatePreview: function(message) {
	com.searchpreview.core.log("---update-preview");
	com.searchpreview.core.log(message.data.previewUrl);
	com.searchpreview.core.updatePreviewImage(message.data.previewUrl);
},

ff_handleApplyPrefs: function(message) {
	com.searchpreview.core.log("---applyPrefs");
	com.searchpreview.core.initPrefs(message.data.pas);
},

initPrefsAndStrings: function(pas) {
	this.log("SP-initPrefsAndStrings");
	this.initPrefs(pas);
	
	this.SP_STRING_LOADING_RANK = pas.strings.loadingRank;
	this.SP_STRING_RANK = pas.strings.rank;
	this.SP_STRING_NO_RANK = pas.strings.noRank;
	this.SP_STRING_RELATED_LABEL = pas.strings.relatedLabel;
	this.log("* Strings *");
	this.log("* SP_STRING_LOADING_RANK: " + this.SP_STRING_LOADING_RANK);
	this.log("* SP_STRING_RANK: " + this.SP_STRING_RANK);
	this.log("* SP_STRING_NO_RANK: " + this.SP_STRING_NO_RANK);
	this.log("* SP_STRING_RELATED_LABEL: " + this.SP_STRING_RELATED_LABEL);	 
	this.log("");
	
	if (this.GP_BROWSER == "Firefox") {
		this.SP_REQ_NAME =  content.document.defaultView.devicePixelRatio >= 1.5 ? "x2" : "preview";
		addMessageListener("searchpreview.de-updatePreview", this.ff_handleUpdatePreview);
		addMessageListener("searchpreview.de-applyPrefs", this.ff_handleApplyPrefs);
	}
	else {
		this.SP_REQ_NAME =  document && document.defaultView.devicePixelRatio >= 1.5 ? "x2" : "preview";
	}
	this.log("* Request Name: " + this.SP_REQ_NAME);
	this.log("");
},
}

//Setup browser messaging:
if (typeof chrome == "object") { //Chrome 
	com.searchpreview.core.window = window;
	com.searchpreview.core.initDoc = document;
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	    if (request.method == "updatePreview") {	
	    	com.searchpreview.core.updatePreviewImage(request.sourceUrl);
	    }
	    else if (request.method == "applyPrefs") {	
	    	chrome.storage.local.get(["insertrelated", "insertpreviews", "insertranks"], function(items) {
	    		var prefsAndStrings = new Object();
	    		prefsAndStrings.prefs = new Object();
	    		prefsAndStrings.prefs.insertpreviews = items.insertpreviews;
	    		prefsAndStrings.prefs.insertranks = items.insertranks;
	    		prefsAndStrings.prefs.insertrelated = items.insertrelated;
	    		com.searchpreview.core.initPrefs(prefsAndStrings);
	    	});	
	    }
	});
	
	chrome.storage.local.get(["insertrelated", "insertpreviews", "insertranks"], function(items) {
		var prefsAndStrings = new Object();
		prefsAndStrings.prefs = new Object();
		prefsAndStrings.prefs.insertpreviews = items.insertpreviews;
		prefsAndStrings.prefs.insertranks = items.insertranks;
		prefsAndStrings.prefs.insertrelated = items.insertrelated;
		
		prefsAndStrings.strings = new Object();
		prefsAndStrings.strings.relatedLabel = chrome.i18n.getMessage("ex_related");
		prefsAndStrings.strings.loadingRank = chrome.i18n.getMessage("ex_loadingRank");
		prefsAndStrings.strings.rank = chrome.i18n.getMessage("ex_rank");
		prefsAndStrings.strings.noRank = chrome.i18n.getMessage("ex_noRank");		
		
		com.searchpreview.core.initPrefsAndStrings(prefsAndStrings);
	});
}
else if (typeof safari == "object") { //Safari
	com.searchpreview.core.window = window;
	com.searchpreview.core.initDoc = document;
	
	var prefsAndStrings = new Object();
	prefsAndStrings.prefs = new Object();
	prefsAndStrings.prefs.insertpreviews = true;
	prefsAndStrings.prefs.insertranks = false;
	prefsAndStrings.prefs.insertrelated = false;
	
	prefsAndStrings.strings = new Object();
	com.searchpreview.core.initPrefsAndStrings(prefsAndStrings);
	
	safari.self.addEventListener("message", function(messageEvent) {
	    if (messageEvent.name === "update-image") {
	    	com.searchpreview.core.updatePreviewImage(messageEvent.message);
	    }
	}, false);

	document.addEventListener("contextmenu", function (event) {
		var showUpdateinContextMenu = event.target.nodeName == "IMG" && event.target.getAttribute("src").indexOf(".searchpreview.de/" + com.searchpreview.core.SP_REQ_NAME) >= 4;
	    safari.self.tab.setContextMenuEventUserInfo(event, {showMenuEntry : showUpdateinContextMenu, src: event.target.getAttribute("src") });
	}, false);
}
else { //Firefox - do a very light init for Firefox, this script gets executed a lot (not like once per tab in Chrome/Safari)
	com.searchpreview.core.window = content.document.defaultView;
	com.searchpreview.core.initDoc = content.document;
}

var checkDoc = com.searchpreview.core.initDoc;
if (!(typeof checkDoc === 'undefined') && !checkDoc._sp_x_loaded && checkDoc.nodeName == "#document") { //TODO: Check Safari / Chrome
	addEventListener("DOMContentLoaded", function(evt) { //!!TODO: removed document. for FF, check Chrome and Safari?
		var doc = evt.target; 
		if (doc._sp_x_loaded) return;
		var spCore = com.searchpreview.core;
		doc._sp_x_loaded = true;
		
		if (doc.location == null) return;
		var u = doc.location.toString();
		if (! (u.match(/https?:\/\/(www|ipv6|encrypted)(|[0-9])\.(|l\.)google\..*\/.*/i) 
				|| spCore.isBing(u) 
				|| spCore.isYahoo(u)
				|| spCore.isDDG(u))) {
			return;
		}
		
		if (spCore.GP_BROWSER == "Firefox") {
			spCore.initPrefsAndStrings(sendSyncMessage("searchpreview.de-prefs-and-strings")[0]);
		}
		spCore.log("doc: " + u);
		spCore.GP_setDocument();
		spCore.GP_main();
		
		var insertImages = spCore.SP_OPT_SHOW_PREVIEWS;
		//DDG javascript version
		if (insertImages && spCore.isDDG(u) && !spCore.isDDGHtml(u)) {
			//spCore.GP_addStyle(".result__menu {display: inline-block}", doc);
			spCore.GP_addStyle(".result__snippet {min-height: 55px;}", doc);
		    var observer = new spCore.window.MutationObserver(function(mutations) {  
		        mutations.forEach(function(mutation) {   
		            if (mutation.target.nodeName == "DIV" && mutation.target.getAttribute("id") == "links") {
		                for (var i = 0; i < mutation.addedNodes.length; ++i) {
		                    var serpNode = mutation.addedNodes[i];
		                    spCore.log("SERPNODE: " + serpNode + ", " + serpNode.getAttribute("id"));
		                    serpNode.style.clear = "left";
		                    var serpAnchor = spCore.fetchElement(doc, ".//h2/a", serpNode);
		                    if (serpAnchor) {
		                        var serpURL = serpAnchor.getAttribute("href");
		                        if (serpURL && serpURL.indexOf("http") == 0) {
		                            var previewImage = doc.createElement("img");
		                            previewImage.style.cssFloat = "left";
		                            previewImage.style.margin = "5px 5px 0px 2px";
		                            previewImage.style.width = "111px";
		                            previewImage.style.height = "82px";
		                            previewImage.setAttribute("src", spCore.getImageURL(serpURL, doc));;
		                	        previewImage.style.border = "1px solid #BBBBBB";
		                            serpNode.insertBefore(previewImage, serpAnchor.parentNode.parentNode);
		                            
		                            var snippet = spCore.fetchElement(doc, ".//div[@class='snippet']", serpNode);
		                            if (snippet) {
		                                snippet.style.clear = "none";
		                            }
		                            else { //next.duckduckgo.com
		                            	serpAnchor.parentNode.style.display = "block"; //h2
		                            }
		                        }
		                    }
		                }
		            }
		        });
		    });
		    observer.observe(doc, {
		        attributes: false, 
		        childList: true, 
		        characterData: false,
		        subtree: true
		    });    
		}
	
		if (!u.match(/https?:\/\/(www|ipv6|encrypted)(|[0-9])\.(|l\.)google\..*\/.*/i)) return;
		
		spCore.GP_addStyle(".sp-rel-link {text-decoration:none;}", doc);
		spCore.GP_addStyle(".sp-rel-link:visited {color: #1A0DAB;}", doc);
		spCore.GP_addStyle("#rhs_block {margin-left: 20px;}", doc);
	
		var t = 0;
		var ignore = false;
		var imagesLink = "";
		var imagesHref = "";
		var realQ = "";
		
		var handleMutatedNode = function(targetNode) {
			if (ignore) {
				return;
			}
			//spCore.log("TARGET NODE: " + targetNode);	
			
			var popRanks;
			
			if (t==0 && (targetNode instanceof spCore.window.HTMLBodyElement || targetNode instanceof spCore.window.HTMLDivElement)) {
				var isGoogleCardLayout = false;
				var lis = doc.evaluate("//*[@class='g' and not(@__sp_done)]", targetNode, null, spCore.window.XPathResult.ANY_TYPE, null);
				var li = lis.iterateNext();
				
				if (!li) {
					lis = doc.evaluate("//*[@class='g card-section' and not(@__sp_done)]", targetNode, null, spCore.window.XPathResult.ANY_TYPE, null);
					li = lis.iterateNext();
					if (li) {
						spCore.log("Found Google card layout");
						isGoogleCardLayout = true;
					}
				}
				
				if (li) {
					popRanks = (true && (typeof PopularityRanks == "object" || typeof PopularityRanks == "function")) ? new PopularityRanks(spCore) : undefined;
					spCore.log("popRanks: " + popRanks + "\n");
				    var liArray = new Array();
				    while (li) {
				        liArray.push(li);
				        li = lis.iterateNext();
				    }
				    //spCore.log("FOUND LIS: " + liArray.length + "\n");
				    for(var liIndex=0; liIndex<liArray.length; liIndex++) {
				    	var result = spCore.processGoogleLiTag(liArray[liIndex], doc, t, isGoogleCardLayout);
						if (result && result.previewInserted) {
							ignore = true;
							t++;
							
							if (spCore.SP_OPT_SHOW_RANKS && popRanks) {
								popRanks.initOne(doc, result, liArray[liIndex]);
							}
							
						}						
						//Mark it
						liArray[liIndex].setAttribute("__sp_done", "X");
				    }
				    ignore = false;
				}	
				else {
					//spCore.log("No Google search result hooks found");
				}
			}
						
			if (t > 0) { //images were inserted
				t = 0;			
				imagesLink = doc.getElementById("gb_2");
				if (imagesLink == null) {
					imagesLink = doc.getElementById("pnnext");
				}
				if (imagesLink == null) {
					imagesLink = spCore.fetchElement(doc, ".//div[@class='hdtb_mitem']/a[@class='q qs']", doc);
				}
				
				spCore.log("imagesLink="+imagesLink);
				if (imagesLink != null) {
					imagesHref = imagesLink.href;
					realQ = spCore.getQParam(imagesHref);
				}
				else {
					realQ = doc.getElementsByName("q")[0].value;
				}
				spCore.log("realQ="+realQ);	
				if (spCore.SP_OPT_SHOW_RELATED) {
					spCore.log("** Start get related *** : "+realQ);
					ignore = true;
					try {
						spCore.showRelated(realQ);
					} 
					catch(err) {}
					finally {
						ignore = false;
					}
				}

				if (spCore.SP_OPT_SHOW_RANKS && popRanks) {				
					popRanks.getAndRender(doc, realQ);
				}	
			}			
		}
	
		spCore.log("SP: MutationObserver");
		var observer = new spCore.window.MutationObserver(function(mutations) {  
	    mutations.forEach(function(mutation) {
	        handleMutatedNode(mutation.target);      
	    });
	    
		});
		observer.observe(doc, {attributes: false, childList: true, characterData: false,subtree: true}); 
		
	});
}

//*********************************************************************************************************
//********* PopRank Code
//*********************************************************************************************************

//(C) 2014 Prevoow UG & Co. KG, Edward Ackroyd, Paderborn, Germany
SP_RANK_CONSTANTS = {
	//Images for site popularity:
	SPI_RANK_0: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%20IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%0FE%80%04%BC%3CT%7D(f%02%00%9DD%22Cj%F9%D8%86%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_1: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00!IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%1B%0A%07%09xy%A8%FAP%CC%04%00%07%A3%24%3BmG6%1F%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_2: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%22IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%FF5%14%06%12%F0%F2P%F5%A1%98%09%00lG%26!%FB%F6%9F%FD%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_3: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%23IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%FF%FFj(%14%24%E0%E5%A1%EAC1%13%00%C0%7D'%BF%E9%85%81%ED%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_4: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%23IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%FF%FF%7F(%14%24%E0%E5%A1%EAC1%13%00%DA%15(%3D%88%B5%B1%C5%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_5: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%24IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%FF%FF%FF%DFP%08H%C0%CBC%D5%87b%26%00%3E%8C*5%7F%04%2B%B6%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_6: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%23IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%0F%04_C%C1%20%01%2F%0FU%1F%8A%99%00%9D~%2C%1B4%19%AA%E5%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_7: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%23IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%0F%02WCA%20%01%2F%0FU%1F%8A%99%00%EC%DA-%B9O%7C%AC%80%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_8: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%22IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%0F%06%A1%20%90%80%97%87%AA%0F%C5L%00%05%07.7%04%2Fj%BB%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_9: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%23IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%0F%06%7FC%81%20%01%2F%0FU%1F%8A%99%00c%870%2F%AD%CC6%8D%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_a: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%24IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%0F%01_CCC%13%F0%F2P%F5%A1%98%09%00%BC%C72%15%5D%9E%9C%A8%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_b: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%23IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%0F%05WCC%13%F0%F2P%F5%A1%98%09%00%07X3%B3zkMN%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_c: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%22IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%0F%03%A1%A1%09xy%A8%FAP%CC%04%00%1D%FC41%87%D3%A9k%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_d: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%22IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%0F%03%7FC%13%F0%F2P%F5%A1%98%09%00v%946)%F7s%B3%94%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_e: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%0CPLTE%FF%FF%FF%FF%FF%FF%CC%CC%CC%A7%D3%A7Mz%23%09%00%00%00%04tRNS%00%FF%FF%FF%B3-%40%88%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00!IDAT%08%99ch%60%60%00%22%05(Z%85%04%160%EC%FF%0F%07_%13%F0%F2P%F5%A1%98%09%00%CA%228%0F%2C%AA%AF%0E%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_f: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%09PLTE%FF%FF%FF%CC%CC%CC%A7%D3%A76%95%C8%84%00%00%00%03tRNS%00%FF%FFDP%D6!%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%1FIDAT%08%99cp%60%60%00%22%01(%0AE%02%01%0CY%AB%10%60%02%5E%1E%AA%3E%143%01%AB%7C%22%D1%AA%A9%EFt%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_x: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%09PLTE%FF%FF%FF%DD%DD%DD%CC%CC%CC%18%82%05%FD%00%00%00%03tRNS%00%FF%FFDP%D6!%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%D2%DD~%FC%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%20IDAT%08%99ch%60%60%00%22%05(Z%85%04%160L%0DE%80%04%BC%3CT%7D(f%02%00%822!%C5%0E%86%22%0A%00%00%00%00IEND%AEB%60%82",
	SPI_RANK_loading: "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%002%00%00%00%07%02%03%00%00%007%E6%F6%3C%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%09PLTE%FF%FF%FF%CC%CC%CC%A7%D3%A76%95%C8%84%00%00%00%09pHYs%00%00%0A%F0%00%00%0A%F0%01B%AC4%98%00%00%00%18tEXtSoftware%00Adobe%20FireworksO%B3%1FN%00%00%00%16tEXtCreation%20Time%0005%2F01%2F08%FA%82'%90%00%00%00%24IDAT%08%99cp%60%60%00%22%01(%0AE%02%01%20%098%10%60%F0%E8h%40%E2%A1%CAa%E8C%98%09%00V%CC%0B%F9Q%26h*%00%00%00%00IEND%AEB%60%82",
}


function PopularityRanks(spCore) {
	this.spCore = spCore;
	this.pInsertionPoints = new Array();
	this.pParams = "";
	spCore.log("Creating new PopularityRanks object");
}

PopularityRanks.prototype.gpr_format = function(n)
{
	if ( ! n ) return "0"; 
	var x = n.length % 3 ;
	var a = !x ? [] : [ n.substr(0,x) ];
	for ( var i = x ; i < n.length ; i += 3 )
		a[a.length] = n.substr(i,3);	
	return a.join(',');
};


PopularityRanks.prototype.rankToImage = function(number)
{
    number = +number;
    return number ==      0 ? SP_RANK_CONSTANTS.SPI_RANK_0
         : number <=    100 ? SP_RANK_CONSTANTS.SPI_RANK_f
         : number <=    180 ? SP_RANK_CONSTANTS.SPI_RANK_e
         : number <=    320 ? SP_RANK_CONSTANTS.SPI_RANK_d
         : number <=    560 ? SP_RANK_CONSTANTS.SPI_RANK_c
         : number <=   1000 ? SP_RANK_CONSTANTS.SPI_RANK_b
         : number <=   1800 ? SP_RANK_CONSTANTS.SPI_RANK_a
         : number <=   3200 ? SP_RANK_CONSTANTS.SPI_RANK_9
         : number <=   5600 ? SP_RANK_CONSTANTS.SPI_RANK_8
         : number <=  10000 ? SP_RANK_CONSTANTS.SPI_RANK_7
         : number <=  18000 ? SP_RANK_CONSTANTS.SPI_RANK_6
         : number <=  32000 ? SP_RANK_CONSTANTS.SPI_RANK_5
         : number <=  56000 ? SP_RANK_CONSTANTS.SPI_RANK_4
         : number <= 100000 ? SP_RANK_CONSTANTS.SPI_RANK_3
         : number <= 180000 ? SP_RANK_CONSTANTS.SPI_RANK_2
         : number <= 320000 ? SP_RANK_CONSTANTS.SPI_RANK_1
         :                    SP_RANK_CONSTANTS.SPI_RANK_0
         ;
};

PopularityRanks.prototype.insertRankImage = function(node, doc) {
	var popImage = doc.createElement("img");
	popImage.setAttribute("src", SP_RANK_CONSTANTS.SPI_RANK_loading);
	popImage.style.paddingRight = "7px";
	popImage.style.paddingLeft = "1px";
	popImage.setAttribute("width", "50");
	popImage.setAttribute("height", "7");
	popImage.setAttribute("gptag", "_gp_rank_img_");
	popImage.setAttribute("title", this.spCore.SP_STRING_LOADING_RANK);
	node.insertBefore(popImage, node.firstChild);
	return popImage;
};

PopularityRanks.prototype.insertRankBars = function(ranksString, insertions) {
	this.spCore.log("* insertRankBars *");
	var ranks = ranksString.split(",");
	for(var i=0; i<insertions.length; i++) {
		var rank = parseInt(ranks[i]);
		var image = this.rankToImage(rank);						
		insertions[i].setAttribute("src", image);		
		if (rank > 0) {
			insertions[i].setAttribute("title",this.spCore.SP_STRING_RANK + ": #" + this.gpr_format(""+rank));			
		}
		else {
			insertions[i].setAttribute("title",this.spCore.SP_STRING_NO_RANK);			
		}
	}	
	this.pInsertionPoints = new Array();
};

PopularityRanks.prototype.getAndRenderRanks = function(serviceURL) {
	var ziss = this;
	this.spCore.log("* SENDING RANK SERVICE * params: " + this.pParams);
	var closurePInsertionPoints = this.pInsertionPoints.slice();
	
	if (typeof safari == "object") { //Safari

	}
	else if (typeof chrome == "object") { //Chrome
		chrome.runtime.sendMessage({command: "http-post", url: serviceURL, params : this.pParams}, function(response) {
			if (response.xml && response.xml.length > 0) {
				ziss.spCore.log(response.xml);
				ziss.insertRankBars(response.xml, closurePInsertionPoints);
			}
		});			
	} 
	else { //Firefox 
		var messageId = "searchpreview.de-poprank-return:" + new Date().getMilliseconds();
		addMessageListener(messageId, function handle(message) {
			ziss.spCore.log("RESPONSE: " + message.data);
			if (message.data.length > 0) {
				ziss.insertRankBars(message.data, closurePInsertionPoints);
			}
			removeMessageListener(messageId, handle);
		});
		sendAsyncMessage("searchpreview.de-http-post", {url: serviceURL, callbackId: messageId, params : this.pParams});
	}
	this.pParams = "";
};

PopularityRanks.prototype.initOne = function(doc, result, liElement) {
	var cdiv = this.spCore.fetchElement(doc, ".//div[starts-with(@class, 's')]", liElement);
	if (cdiv != null) {
		var cite = this.spCore.fetchElement(doc, ".//cite", cdiv); 
		if(cite != null) {
			var img = this.insertRankImage(cite, doc);
			this.spCore.forceReload(img); 
			this.pInsertionPoints.push(img); 
			var im = result.a.href.match(/https?:\/\/www\.google\..*\/interstitial\?url=(.*)/i);
			if (im && im[1]) {
				this.pParams += im[1] + "\n";
			}
			else {
				var realHref = result.a.getAttribute("orighrefGP") ? result.a.getAttribute("orighrefGP") : result.a.href;
				realHref = this.spCore.getRealGoogleUrlAjax(realHref);
				this.pParams += realHref + "\n";
			}
		}
	}
};

PopularityRanks.prototype.getAndRender = function(doc, realQ) {
	if (this.pInsertionPoints.length <= 0) {
		this.spCore.log("No insertions points!");
		return;
	}
	var loc = doc.location.toString();
	var ref = "http://www.google.com";
	var start = "";
	var uq = "&uq=";
	var ts = "&ts=";
	try {
		ts += encodeURIComponent(new Date().getTime());
		var m = loc.match(/(https?:\/\/.*)\/.*/);
		if (m && m[1]) {
			ref = m[1];
		}
		this.spCore.log("* loc: " + loc);
		var s = this.spCore.getStartParam(loc);
		if (s && s != "0") {
			start = "&start=" + encodeURIComponent(s);
			this.spCore.log("* Start: " + start);
		}
		var nuq = doc.evaluate("//div[@class='lst']", doc, null, XPathResult.ANY_TYPE, null);
		if (nuq && nuq.iterateNext()) {
			uq += encodeURIComponent(nuq.iterateNext().innerHTML);
		}
	} catch (e) {}
	ref += "/search?q=" + encodeURIComponent(realQ) + start + uq + ts + "&t=4&lb=" + encodeURIComponent(loc);
	this.spCore.log("* Rank-ref: "+ref);	
	
    var serviceURL = "https://widgets.alexa.com/traffic/rankr/?ref=" + encodeURIComponent(ref);
	this.getAndRenderRanks(serviceURL);
};

