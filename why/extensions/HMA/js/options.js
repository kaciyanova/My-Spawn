var main_dom = chrome.extension.getBackgroundPage(),
  props_defs = main_dom.props_defs;

function getOptions() {
  var key, options = {};
  for (key in props_defs) {
    options[key] = (key in localStorage) ? localStorage[key] : props_defs[key];
  }
  return options;
}

// Saves options to localStorage.
function saveOption(key) {
  if (typeof key == 'object') {
    key = $(key.target).is(':radio') ? key.target.name : key.target.id;
  }
  var el, els, i, j;
  switch (key) {
    case 'proxy_server':
      el = document.getElementById(key);
      localStorage[key] = el.value;
      break;
    case 'url_encrypt':
      els = document.getElementsByName(key);
      for (i = 0, j = els.length; i < j; i++) {
        if (els[i].checked) {
          localStorage[key] = els[i].value;
          break;
        }
      }
      break;
    default:
      el = document.getElementById(key);
      localStorage[key] = +el.checked;
  }
  //document.getElementById('status').style.display = '';
  main_dom.toggleContextMenuItem();
  /*if (window.confirm('Your settings are now saved. Close this tab?')) {
    window.close();
  }*/
}

// Restores select box state to saved value from localStorage.
function restoreOptions(defaults) {
  var el,
      key,
      options = defaults ? props_defs : getOptions();
  for (key in options) {
    switch(key) {
      case 'proxy_server':
        el = document.getElementById(key);
        el.value = options[key];
        break;
      case 'url_encrypt':
        el = document.getElementById(key + '_' + options[key]);
        el.checked = true;
        break;
      default:
        el = document.getElementById(key);
        el.checked = !!+options[key];
    }
    if (defaults) {
      saveOption(key);
    }
  }
  if (defaults) {
    jcf.refreshAll();
  }
}

function init() {
  restoreOptions();
  //document.getElementById('save_button').addEventListener('click', save_options);
  $('INPUT, SELECT').on('change', saveOption);
  document.getElementById('restore_link').addEventListener('click', function () {
    restoreOptions(true);
  });
  //document.getElementById('close_link').addEventListener('click', window.close.bind(window));
}

document.addEventListener('DOMContentLoaded', init);