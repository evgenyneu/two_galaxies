// Converting the simulation parameters (initial and current params)
// to a URL string for sharing. As well as the reverse operation: reading
// parameters from the shared URL into the parameter objects.

/**
 * Parse a string into a float.
 *
 * @param  {string} str A string containing a number
 * @return {number} A float number, null if unsuccessful.
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
  return readArrayOfNumbers(str, parseFloat);
}


/**
 * Parse comma separated values into an array of integers.
 *
 * @param  {string} str Comma separated values: "1,2,3"
 * @return {array}     Array of parsed values, null if unsuccessful.
 */
export function readArrayOfInts(str) {
  return readArrayOfNumbers(str, parseInt);
}


/**
 * Parse comma separated values into an array of integers.
 *
 * @param  {string} str   Comma separated values: "1,2,3"
 * @param  {function} parseFn A function for parsing a single value.
 * @return {array} Array of parsed values, null if unsuccessful.
 */
export function readArrayOfNumbers(str, parseFn) {
  let parsed = str.split(",").map((a) => parseFn(a));

  for(let i = 0; i < parsed.length; i++) {
    let value = parsed[i];
    if (isNaN(value)) return null;
  }

  return parsed;
}


/**
 * Rounds a float number of given number of decimal places
 * Source: https://stackoverflow.com/a/56632526/297131
 */
export function roundN(value, digits) {
   var tenToN = Math.pow(10, digits);
   return (Math.round(value * tenToN)) / tenToN;
}


export function roundFloat(decimalPlaces) {
  return (value) => roundN(value, decimalPlaces);
}


export function roundArray(decimalPlaces) {
  return (arr) => arr.map((a) => roundN(a, decimalPlaces));
}


// The keys are names of initial parameters that can be shared.
// The values are:
//    parseFunction: function for parsing string value from URL.
//    storeFunction: (optional) function for transforming parameter value before storing
//                   in the URL. For example, if parameter value is float
//                   1.234567890123456, we might want to round it to 1.23,
//                   to make the URL shorter. If function is not supplied,
//                   the parameter is stored in the URL as it is.
let sharedInitialParams = {
  "numberOfRings": { parseFunction: readArrayOfInts },
  "masses": {
    storeFunction: roundArray(2),
    parseFunction: readArrayOfFloats
  },
  "minimalGalaxySeparation": { parseFunction: readFloat },
  "eccentricity": { parseFunction: readFloat },
  "ringSeparation": { parseFunction: readFloat },
  "galaxyInclinationAnglesDegree": {
    storeFunction: roundArray(2),
    parseFunction: readArrayOfFloats
  }
};


// The keys are names of current parameters that can be shared.
// The values are functions for parsing string value from URL.
// The values are:
//    parseFunction: function for parsing string value from URL.
//    storeFunction: (optional) function for transforming parameter value before storing
//                   in the URL. For example, if parameter value is float
//                   1.234567890123456, we might want to round it to 1.23,
//                   to make the URL shorter. If function is not supplied,
//                   the parameter is stored in the URL as it is.
let sharedCurrentParams = {
  "rotationMatrix": {
    storeFunction: roundArray(2),
    parseFunction: readArrayOfFloats
  },
  "cameraDistance": {
    storeFunction: roundFloat(2),
    parseFunction: readFloat
  }
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
  initialParams = prepareParamsForSharing(initialParams, sharedInitialParams);
  currentParams = filterCurrentParams(currentParams);
  currentParams = prepareParamsForSharing(currentParams, sharedCurrentParams);
  var allParams = Object.assign(initialParams, currentParams);
  return new URLSearchParams(allParams).toString();
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


/**
 * Keeps only parameters permitted for sharing.
 *
 * @param  {object} sharedParams Object with keys that are the names of
 *   parameters that are suitable for sharing.
 * @param  {object} allParams Object containing all parameters
 * @return {object} Clone of `allParams` that only contains permitted parameters.
 */
function filterParams(sharedParams, allParams) {
  let filtered = {};

  for (let key in sharedParams) {
    if (key in allParams) {
      filtered[key] = allParams[key];
    }
  }

  return filtered;
}


export function prepareParamsForSharing(params, sharedParams) {
  let result = {};

  for (let key in params) {
    if (key in sharedParams) {
      let sharedSettings = sharedParams[key];
      if ("storeFunction" in sharedSettings) {
        result[key] = sharedSettings.storeFunction(params[key]);
      } else {
        result[key] = params[key];
      }
    } else {
      result[key] = params[key];
    }
  }

  return result;
}


function getCurrentUrlWithoutParameters() {
  return location.protocol + '//' + location.host + location.pathname;
}


/**
 * Get the initial parameters from the URL string.
 *
 * @param  {object} defaultParams  Default initial parameter used when absent in URL.
 * @return {object} Parameters that will be used in the simulation.
 */
export function getSharedInitialParameters(defaultParams) {
  return getSharedInitialParametersFromUrl(location.search, defaultParams);
}


/**
 * Get the initial parameters from the URL string.
 *
 * @param  {string} urlParams URL parameters,
 *    for example "numberOfRings=24%2C2&ringSeparation=2"
 * @param  {object} defaultParams Default parameters used when absent in URL.
 * @return {object} Parameters that will be used in the simulation.
 */
export function getSharedInitialParametersFromUrl(urlParams, defaultParams) {
  return getParametersFromUrl(urlParams, defaultParams, sharedInitialParams);
}


/**
 * Get the current parameters from the URL string.
 *
 * @param  {object} defaultParams  Default parameters used when  absent in URL.
 * @return {object} Parsed parameters that will be used in the simulation
 */
export function getSharedCurrentParameters(defaultParams) {
  return getSharedCurrentParametersFromUrl(location.search, defaultParams);
}


/**
 * Get the current parameters from the URL string.
 *
 * @param  {string} urlParams URL parameters,
 *    for example "rotationMatrix=1%2C0%2C0%2C0"
 * @param  {object} defaultParams Default parameters used when absent in URL.
 * @return {object} Parsed parameters that will be used in the simulation
 */
export function getSharedCurrentParametersFromUrl(urlParams, defaultParams) {
  return getParametersFromUrl(urlParams, defaultParams, sharedCurrentParams);
}


/**
 * Parse parameters from the URL string.
 *
 * @param  {string} urlParams URL parameters,
 *    for example "rotationMatrix=1%2C0%2C0%2C0"
 * @param  {object} defaultParams Default parameters used when absent in URL.
 * @param  {object} sharedParams Parameters permitted for sharing and parsing
 *      functions. Can be sharedCurrentParams or sharedInitialParams object.
 * @return {object} Parsed parameters that will be used in the simulation.
 */
function getParametersFromUrl(urlParams, defaultParams, sharedParams) {
  let parsed = new URLSearchParams(urlParams);

  var params = Object.assign({}, defaultParams);

  for (let key in sharedParams) {
    let parseFunction = sharedParams[key].parseFunction;

    if (parsed.has(key)) {
      let parsedValue = parseFunction(parsed.get(key));

      if (parsedValue !== null) {
        params[key] = parsedValue;
      }
    }
  }

  return params;
}
