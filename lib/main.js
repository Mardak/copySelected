// Add key event listeners to main browser windows
const {WindowTracker} = require("window-utils");
new WindowTracker({
  onTrack: function({document, gURLBar}) {
    if (document.documentElement.getAttribute("windowtype") != "navigator:browser")
      return;

    gURLBar.addEventListener("keydown", handleKey, true);
  },

  onUntrack: function({document, gURLBar}) {
    if (document.documentElement.getAttribute("windowtype") != "navigator:browser")
      return;
    gURLBar.removeEventListener("keydown", handleKey, true);
  }
});

// Detect cmd/ctrl-enter to do stuff
function handleKey(event) {
  switch (event.keyCode) {
    case event.DOM_VK_ENTER:
    case event.DOM_VK_RETURN:
      if (event.metaKey || event.ctrlKey) {
        let gURLBar = event.target;
        if (gURLBar.popupOpen && gURLBar.popup.selectedIndex >= 0) {
          event.preventDefault();

          // Copy the selected url
          let url = gURLBar.controller.getValueAt(gURLBar.popup.selectedIndex);
          url = url.replace(/^moz-action:[^,]+,/, "");
          require("clipboard").set(url);

          // Close the popup and restore the url
          gURLBar.closePopup();
          gURLBar.controller.handleEscape();

          // Refocus the page and paste the url
          let window = gURLBar.ownerDocument.defaultView;
          window.gBrowser.selectedBrowser.focus();
          window.document.getElementById("cmd_paste").doCommand();
        }
      }
      break;
  }
}
