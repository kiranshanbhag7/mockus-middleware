/**
 * API Response Mocking Middleware
 * Author: Kiran U Shanbhag <shanbhag.kiran@gmail.com>
 * @param options
 * @returns {function(*, *, *)}
 */

'use strict';

const DEFAULT_API_STATUS = 200;
const DEFAULT_API_METHOD = 'GET';
const DEFAULT_API_DELAY = 0;

module.exports = function (options={}) {
  /* Check whether configurations received */
  if (!options || Object.keys(options).length === 0) {
    throw new TypeError('No mock configurations received');
  }
  /* Check whether Mock routes map received */
  else if (Object.keys(options.routes).length === 0) {
    throw new TypeError('Routes map not added. Please refer Readme file for map creation');
  }
  /* Return Middleware function which sends the mock response for the request API endpoint */
  else {
    return (req, res, next) => {
      const apiEndpoint = req.originalUrl;
      const apiMethod = req.method;
      const exactRoute = apiEndpoint.split('?')[0]; // Remove query params if any from the original url
      const routeObj = options.routes[exactRoute];  // Extract mock object for matched api route
      if (!routeObj || !routeObj.response) {
        throw new TypeError(`Error in the mock value received for route ${exactRoute}. Please refer Readme file for setting mandatory params`);
      }
      const routeMethod = routeObj.method || DEFAULT_API_METHOD;
      if (routeMethod.toUpperCase() === apiMethod) {
        const returnStatus = routeObj.status || DEFAULT_API_STATUS;
        const responseDelay = routeObj.delay || DEFAULT_API_DELAY;
        setTimeout(() => res.status(returnStatus).json(routeObj.response), responseDelay);
      } else {
        /* No Mock Route found for the request API endpoint. Proceed with original API flow */
        next();
      }
    }
  }
};