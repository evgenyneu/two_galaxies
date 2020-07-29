export function getShareURL(initialParams, currentParams) {
  let urlParams = getUrlParameters(initialParams, currentParams);
  let urlStart = getCurrentUrlWithoutParameters();
  return  `${urlStart}?${urlParams}`;
}

/**
 * Returns the last part of the URL containing the parameters
 */
export function getUrlParameters(initialParams, currentParams) {
  initialParams = filterInitialParams(initialParams);
  return new URLSearchParams(initialParams).toString();
}


/**
 * Keeps only permitted initial parameters that will be used for sharing.
 *
 * @param  {object} initialParams The initial parameters.
 * @return {object} Initial parameters containing only permitted attributes.
 */
export function filterInitialParams(initialParams) {
  let permittedKeys = [
    "numberOfRings",
    "ringSeparation"
  ];

  let filtered = {};

  permittedKeys.forEach((key) => {
    if (key in initialParams) {
      filtered[key] = initialParams[key];
    }
  });

  return filtered;
}

function getCurrentUrlWithoutParameters() {
  return location.protocol + '//' + location.host + location.pathname;
}
