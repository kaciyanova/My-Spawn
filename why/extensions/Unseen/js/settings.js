function set_icon(state) {
    if (state) {
        chrome.runtime.sendMessage({action: 'quickEnable'})
    } else {
        chrome.runtime.sendMessage({action: 'quickDisable'})
    }
}

function changeMessengerPermissions(state) {
    if (state) {
        chrome.runtime.sendMessage({action: 'addMessenger'});
    } else {
        chrome.runtime.sendMessage({action: 'removeMessenger'});
    }
}

window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
        var elements = ['block_chat_seen', 'block_chat_receipts', 'block_typing_indicator', 'fbunseen_messenger', 'block_chat_indicator', 'show_mark_as_read'];
        elements.forEach(function (element) {
            settings.manifest[element].addEvent("action", function (state) {
                switch (element) {
                    case "block_chat_seen" :
                        set_icon(state);
                        break;
                    case "fbunseen_messenger" :
                        changeMessengerPermissions(state);
                        break;
                        
                }
            });
        });
    });

    // Option 2: Do everything manually:
    /*
     var settings = new FancySettings("My Extension", "icon.png");

     var username = settings.create({
     "tab": i18n.get("information"),
     "group": i18n.get("login"),
     "name": "username",
     "type": "text",
     "label": i18n.get("username"),
     "text": i18n.get("x-characters")
     });

     var password = settings.create({
     "tab": i18n.get("information"),
     "group": i18n.get("login"),
     "name": "password",
     "type": "text",
     "label": i18n.get("password"),
     "text": i18n.get("x-characters-pw"),
     "masked": true
     });

     var myDescription = settings.create({
     "tab": i18n.get("information"),
     "group": i18n.get("login"),
     "name": "myDescription",
     "type": "description",
     "text": i18n.get("description")
     });

     var myButton = settings.create({
     "tab": "Information",
     "group": "Logout",
     "name": "myButton",
     "type": "button",
     "label": "Disconnect:",
     "text": "Logout"
     });

     // ...

     myButton.addEvent("action", function () {
     alert("You clicked me!");
     });

     settings.align([
     username,
     password
     ]);
     */
});
