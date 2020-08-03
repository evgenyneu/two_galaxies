// Helper function for working with HTML elements: show/hide etc.

const cssHidden = "TwoGalaxies--isHidden";


/**
 * Show the element on page.
 *
 * @param  {string} selector CSS selector for the element.
 */
export function show(selector) {
  var element = document.querySelector(selector);
  showElement(element);
}


/**
 * Show the element on page.
 *
 * @param  {object} element Html element object.
 */
export function showElement(element) {
  element.classList.remove(cssHidden);
}

/**
 * Hide the element.
 *
 * @param  {string} selector CSS selector for the element.
 */
export function hide(selector) {
  var element = document.querySelector(selector);
  hideElement(element);
}

/**
 * Hide the element.
 *
 * @param  {object} element Html element object
 */
export function hideElement(element) {
  element.classList.add(cssHidden);
}
