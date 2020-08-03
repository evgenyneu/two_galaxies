// The UI for sharing the simulation parameters:
// button clicks, showing/hiding text area with shared URLs.

import { hideAllControls } from './buttons.js';
import { getShareURL } from './share.js';
import { copyToClipboard } from './copy_to_clipboard.js';
import { show, showElement, hide, hideElement } from './html_element.js';


/**
 * Remove text selection on page, if present.
 */
function clearSelection() {
  if (window.getSelection) {window.getSelection().removeAllRanges();}
  else if (document.selection) {document.selection.empty();}
}


function didClickShare(initialParams, currentParams) {
  return (e) => {
    hideAllControls();
    clearSelection();

    // Show the share controls: container and copy button
    show(".TwoGalaxies-shareContainer");
    show(".TwoGalaxies-copyToClipboardButton");

    // Hide the share success/error message
    hide(".TwoGalaxies-copyOutcome");

    // Generate the URL for sharing containing the current parameters
    // of the simulation
    let url = getShareURL(initialParams, currentParams);

    // The the URL in the text area
    let textArea = document.querySelector(".TwoGalaxies-shareText");
    showElement(textArea);
    textArea.value = url;

    return false; // Prevent default
  };
}


function didClickCopyToClipboard() {
    var copyTextarea = document.querySelector(".TwoGalaxies-shareText");
    var outcomeElement = document.querySelector(".TwoGalaxies-copyOutcome");

    copyToClipboard(copyTextarea).then(
      () => {
        // Copied successfully. Show the "success" message
        showElement(outcomeElement);
        outcomeElement.innerHTML = "Copied";

        // Hide the share URL and the Share button
        hideElement(copyTextarea);
        hide(".TwoGalaxies-copyToClipboardButton");
      },
      (err) => {
        // Failed to copy. Show the error message
        showElement(outcomeElement);
        outcomeElement.innerHTML = "Error: " + err;
      });
}


/**
 * Prepare for sharing the parameters of the simulation as a URL.
 */
export function initShareUI(initialParams, currentParams) {
  // Share button
  // --------

  var button = document.querySelector(".TwoGalaxies-shareButton");
  button.onclick = didClickShare(initialParams, currentParams);

  // Copy to clipboard button
  // --------

  button = document.querySelector(".TwoGalaxies-copyToClipboardButton");
  button.onclick = didClickCopyToClipboard;

}
