SBExtension.PopupUIGame = function () {
    this.gameURL = "http://" + SBExtension.config.sbHostName + "/?cmd=tbf-get-jx-ext-games&ext=1";
    this.prefixFGames = "SEFeatureGames";
    this.expireGame = 5; //min
    this.gameSection = "#game_main_section";
}

//CREATE GAMES
SBExtension.PopupUIGame.prototype.createGames = function(appendElement, game, idx){
	var divMain = SBExtension.browserPopup.createTag(document, "a");
	//divMain.setAttribute("target", "_blank");
	SBExtension.browserPopup.setAttribute(divMain, "class", "game_item new_tab_link");
	SBExtension.browserPopup.setAttribute(divMain, "data-url", "http://www.swagbucks.com" + game.url, "game" + idx);
	//SBExtension.browserPopup.setAttribute(divMain, "href", "javascript:void(0)");
	//SBExtension.browserPopup.setNewTabURLOnClick(divMain, "http://www.swagbucks.com" + game.url, "game" + idx);
		
	var span = $("<span />", { class: 'featured_game_img'}) ;
	var img = SBExtension.browserPopup.createTag(document, "img"); //document.createElementNS("http://www.w3.org/1999/xhtml", "img");
	SBExtension.browserPopup.setAttribute(img, "src", game.img == "" ? "popup/img/play/90x90.jpg" : ((game.img.indexOf("//")==0)?"http:":"") + game.img);
	var div = $("<div />");
	var h5 = $("<h5 />", { text: game.name});
	
	span.append($(img));
	div.append(h5);
	$(divMain).append(span);
	$(divMain).append(div);
	appendElement.append($(divMain));
};

SBExtension.PopupUIGame.prototype.viewGames = function () {
    $(this.gameSection).empty();
    var storeGames = SBExtension.store.retrieveGlobalKey(this.prefixFGames);
    if (storeGames) {
        storeGames = JSON.parse(storeGames);
        if (new Date().getTime() - storeGames.timestamp < this.expireGame * 60 * 1000) {
            for (idx in storeGames.games) {
                var game = storeGames.games[idx];
                this.createGames($(this.gameSection), game, idx);
            }
			SBExtension.browserPopup.clickEventListen('.new_tab_link');
            return;
        } else {
            SBExtension.store.clearKey(this.prefixFGames, true);
        }
    }

    var this_ = this;

    try {
        var url = this.gameURL;
        var inputData = "";
        var ajaxCall = {
            type: 'POST',
            url: url,
            //data: inputData,
            success: function (data) {
                var games = data;
                var loaded = false;
                if (data.length) {
                    data = data.replace('\t', ' ');
                    games = JSON.parse(data);
                }

                var storeGames = {};
                storeGames.timestamp = new Date().getTime();
                storeGames.games = games;
                SBExtension.store.storeGlobalKey(this_.prefixFGames, JSON.stringify(storeGames));
                for (idx in games) {
                    var game = games[idx];
                    this_.createGames($(this_.gameSection), game, idx);
                    var gameId = "game" + idx;
                    if (SBExtension.browserPopup && SBExtension.browserPopup.elemNewTabFunctions && SBExtension.browserPopup.elemNewTabFunctions[gameId]) {
                        game.onclick = SBExtension.browserPopup.elemNewTabFunctions[gameId];
                    }
                }
            },
            error: function (data) {
                SBExtension.alert_debug("ERROR result in SBExtension.PopupUIGame.prototype.viewGames: url=" + url + "; request data=" + JSON.stringify(inputData) + "; response data=" + JSON.stringify(data));
            },
            crossDomain: true
        };
        SBExtension.getAvailableBrowser().addSecurityFieldsToAjaxCall(ajaxCall, { dataType: 'JSON', xhrFields: { withCredentials: true } });
        if (SBExtension.getAvailableBrowser().executeAjaxCall) {
            SBExtension.getAvailableBrowser().executeAjaxCall(ajaxCall);
        } else {
            $.ajax(
				ajaxCall
			);
        }
    } catch (e) {
        SBExtension.alert_debug('ERROR retrieving games in SBExtension.PopupUIGame.prototype.viewGames: ' + e.message, e);
    }
};

if (!SBExtension.popupUI) {
	SBExtension.popupUI = [];
}
SBExtension.popupUI[SBExtension.POPUP_ID_GAME] = new SBExtension.PopupUIGame();
