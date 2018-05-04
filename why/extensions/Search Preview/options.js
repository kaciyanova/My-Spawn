function save_options() {
  var checkedRelated = document.getElementById("insertrelated").checked;
  var checkedPreviews = document.getElementById("insertpreviews").checked;
  var checkedRanks = document.getElementById("insertranks").checked;
  chrome.storage.local.set({"insertpreviews" : checkedPreviews, "insertrelated" : checkedRelated , "insertranks" : checkedRanks}, function() {
	  // Update status to let user know options were saved.
	  var status = document.getElementById("status");
	  status.innerHTML = chrome.i18n.getMessage("ex_saved");
	  setTimeout(function() {
	    status.innerHTML = "";
	  }, 1000);
  });	
  
  chrome.tabs.query({}, function(tabs) {
	    for (var i=0; i<tabs.length; ++i) {
	        chrome.tabs.sendMessage(tabs[i].id, {method: "applyPrefs"});
	    }
  });
  
}

function restore_options() {
  //Texts
  document.getElementById("title").innerHTML = "SearchPreview";
  document.getElementById("save").innerHTML = chrome.i18n.getMessage("ex_save");
  document.getElementById("options").innerHTML = chrome.i18n.getMessage("ex_options");
  document.getElementById("check_insertrelated").innerHTML = chrome.i18n.getMessage("ex_insert_related");
  document.getElementById("check_insertpreviews").innerHTML = chrome.i18n.getMessage("ex_insert_previews");
  document.getElementById("check_insertranks").innerHTML = chrome.i18n.getMessage("ex_insert_ranks") + "<img src='pop-rank.png'>" + chrome.i18n.getMessage("ex_insert_ranks_sec") + "<img src='not-so-pop-rank.png'>)";
    
  chrome.storage.local.get(["insertpreviews", "insertrelated" , "insertranks"], function(items) {
	  document.getElementById("insertpreviews").checked = items.insertpreviews;
	  document.getElementById("insertrelated").checked = items.insertrelated;
	  document.getElementById("insertranks").checked = items.insertranks;
  });
}

restore_options();
document.querySelector('#save').addEventListener('click', save_options);