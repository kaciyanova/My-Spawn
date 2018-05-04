var error = false;

function proxify() {
  var input = document.getElementById('url');
  var url = input.value;
  if (!/^(https?:\/\/)?[\d\w-]+?\.[\d\w]+/i.test(url)) {
    toggleErrorMsg(true);
    input.focus();
    return;
  }
  chrome.extension.sendRequest(url);
  window.close();
}

function onKeydown(ev) {
  if (error) {
    toggleErrorMsg(false);
  }
  if (ev.keyCode == 13) { // Enter
    proxify();
  }
}

function toggleErrorMsg(on) {
  error = on;
  $('#error')[on ? 'show' : 'hide']();
}

function init() {
  $('#url').focus().on('keydown', onKeydown);
  $('INPUT[type="submit"]').on('click', proxify);
  $('.link-cancel').on('click', window.close);
  $('.link-settings').on('click', function () {
    chrome.tabs.create({ url : 'options.html' });
  });
}

document.addEventListener('DOMContentLoaded', init);