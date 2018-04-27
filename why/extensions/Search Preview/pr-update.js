document.querySelector('#pr-check').addEventListener('click', function(evt) {	
	chrome.storage.local.set({"insertranks" : evt.srcElement.checked});	  
});