// Copy text from text area to clipboard

/**
 * Copy text from a text area to the clipboard. It first selects
 * the text in the text area and then copies it to clipboard.
 *
 * @param  {object} textarea HTML element for the text area
 * @return {Promise} A promise, resolved on success, and rejected if
 *                  failed to copy to clipboard.
 */
function fallbackCopyTextToClipboard(textarea) {
  return new Promise((resolve, reject) => {
    let text = textarea.value;

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      // iOS hack: https://stackoverflow.com/a/45308151/297131

      // save current contentEditable/readOnly status
      const editable = textarea.contentEditable;
      const oldReadOnly = textarea.readOnly;

      // convert to editable with readonly to stop iOS keyboard opening
      textarea.readOnly = true;
      textarea.contentEditable = true;

      // create a selectable range
      const range = document.createRange();
      range.selectNodeContents(textarea);

      // select the range
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      textarea.setSelectionRange(0, 999999);

      // restore contentEditable/readOnly to original state
      textarea.contentEditable = editable;
      textarea.readOnly = oldReadOnly;
    } else {
      // Select text in the text area
      textarea.select();
    }

    try {
      // Copy selected text to clipboard
      var successful = document.execCommand('copy');

      if (successful) {
        resolve();
      } else {
        reject("execCommand failed");
      }
    } catch (err) {
      reject("unknown");
    }
  });
}


/**
 * Copy text from a text area to the clipboard
 *
 * @param  {object} copyTextarea HTML element for the text area
 * @return {Promise} A promise, resolved on success, and rejected if
 *                  failed to copy to clipboard.
 */
export function copyToClipboard(copyTextarea) {
  if (!navigator.clipboard) {
    // Asynchronous copy to clipboard is not supported, fallback to
    // using document.execCommand('copy')
    return fallbackCopyTextToClipboard(copyTextarea);
  }

  // Use asynchronous clipboard copy
  return navigator.clipboard.writeText(copyTextarea.value);
}
