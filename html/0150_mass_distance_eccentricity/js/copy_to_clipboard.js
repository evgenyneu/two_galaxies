// Copy text from text area to clipboard

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
      textarea.select();
    }

    try {
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

export function copyToClipboard(copyTextarea) {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(copyTextarea);
  }
  console.log('write text');

  return navigator.clipboard.writeText(copyTextarea.value);
}
