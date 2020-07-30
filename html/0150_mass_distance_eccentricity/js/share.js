// Charing the URL to the simulation with all selected parameters

/**
 * Parse a string into a float.
 *
 * @param  {string} str A string containing a number
 * @return {nunmber} A float number, null if unsuccessful.
 */
export function readFloat(str) {
  let parsed = parseFloat(str);

  if (isNaN(parsed)) return null;

  return parsed;
}

/**
 * Parse comma separated values into an array of floats.
 *
 * @param  {string} str Comma separated values: "1,2,3"
 * @return {array}     Array of parsed values, null if unsuccessful.
 */
export function readArrayOfFloats(str) {
  let parsed = str.split(",").map((a) => parseFloat(a));

  for(let i = 0; i < parsed.length; i++) {
    let value = parsed[i];
    if (isNaN(value)) return null;
  }

  return parsed;
}

// The keys are names of initial parameters that can be shared.
// The values are functions for parsing string value from URL.
let sharedInitialParams = {
  "numberOfRings": readArrayOfFloats,
  "ringSeparation": readFloat
};

// The keys are names of current parameters that can be shared.
// The values are functions for parsing string value from URL.
let sharedCurrentParams = {
  "rotationMatrix": readArrayOfFloats
};

/**
 * Returns the full URL to the simulation for sharing containing
 * all the selected parameters
 */
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
  currentParams = filterCurrentParams(currentParams);
  var allParams = Object.assign(initialParams, currentParams);
  return new URLSearchParams(allParams).toString();
}


export function getInitialParameters(defaultParams) {
  return getInitialParameterFromUrl(location.search, defaultParams);
}


/**
 * Get the initial parameters from the URL string.
 *
 * @param  {string} urlParams URL parameters,
 *    for example "numberOfRings=24%2C2&ringSeparation=2"
 * @param  {object} defaultParams Default initial parameter used when
 *    absent in URL.
 * @return {object} Initial parameters that will be used in the simulation.
 */
export function getInitialParameterFromUrl(urlParams, defaultParams) {
  let parsed = new URLSearchParams(urlParams);

  var initialParams = Object.assign({}, defaultParams);

  for (let key in sharedInitialParams) {
    let parseFunction = sharedInitialParams[key];

    if (parsed.has(key)) {
      let parsedValue = parseFunction(parsed.get(key));

      if (parsedValue !== null) {
        initialParams[key] = parsedValue;
      }
    }
  }

  return initialParams;
}


/**
 * Keeps only permitted initial parameters that will be used for sharing.
 *
 * @param  {object} initialParams The initial parameters.
 * @return {object} Initial parameters containing only permitted attributes.
 */
export function filterInitialParams(initialParams) {
  return filterParams(sharedInitialParams, initialParams);
}

/**
 * Keeps only permitted current parameters that will be used for sharing.
 *
 * @param  {object} currentParams The current parameters.
 * @return {object} Current parameters containing only permitted attributes.
 */
export function filterCurrentParams(currentParams) {
  return filterParams(sharedCurrentParams, currentParams);
}

function filterParams(sharedParams, allParams) {
  let filtered = {};

  for (let key in sharedParams) {
    if (key in allParams) {
      filtered[key] = allParams[key];
    }
  }

  return filtered;
}

function getCurrentUrlWithoutParameters() {
  return location.protocol + '//' + location.host + location.pathname;
}
