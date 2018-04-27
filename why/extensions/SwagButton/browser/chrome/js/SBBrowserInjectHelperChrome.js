chrome.runtime.sendMessage({
	'name': 'DocumentComplete',
	'url': document.location.href,
	'action': 'ci_browser_DocumentComplete',
	'isTop': (window==window.top),
	'forceDocumentComplete': window.SBExtension ? true : false,
	'location': document.location,
	'windowName': window.name
}, function(response) {
	SBFrameExtension.onDocumentComplete(response);
});
