# mockus-middleware

This module provides middleware interface to mock the api responses in a very elegant manner. It provides following benefits:
* Prevents from writing multiple boiler-plate codes in each of the application's APIs for returning mock response.
* Mock configuration for route to be set in only one place (say index.js), hence providing more control for developers to add/modify API response configurations in one place.
* Helps for simulation of API's response delay. Time delay can be configured in middleware options, to send API response to consumer after desired delay of time.
* Helps for simulation of API's request failure.

## Installation

```sh
$ npm install mockus-middleware
```

## API

```js
const mockus = require('mockus-middleware')
```

### mockus(options)

Initialise middleware with `options` configuration. `options` need to consist of `routes`, which is an object consisting of list of attributes for api routes in the form of key-value pair.

```js
options.routes = {
  '<API1-COMPLETE-ROUTE>': {
    response: <API1-MOCK-FILE-DATA>,
    method: <API1-METHOD>,
    status: <API1-RESPONSE-STATUS>,
    delay: <API1-RESPONSE-DELAY>
  },
  '<API2-COMPLETE-ROUTE>': {
    response: <API2-MOCK-FILE-DATA>,
    method: <API2-METHOD>,
    status: <API2-RESPONSE-STATUS>,
    delay: <API2-RESPONSE-DELAY>
  },
    
  ...
  
  '<KEY>': '<VALUE>'
}
```

In the above snippet, `routes` accepts list of api routes in the form of 'KEY' and 'VALUE', where 'KEY' is a string whose value is complete url of api.
On the other hand, 'VALUE' consists of following attributes:

* `response`: The data which needs to be sent as part of response for the api should be assigned to this attribute. This is **mandatory** attribute. If not set, an TypeError exception will be thrown.

    Example: `response = require('../mock/api.json')` If the mock file's relative location is at `../mock/api.json`
    
* `method`: The api's supported method like 'GET', 'POST', 'PUT' etc., If this attribute is not set, it defaults to `GET` method.

    Example: `method = 'POST'` If the api's supported method is POST
    
* `status`: The api's response status code which needs to be sent to consumer. If this attribute is not set, it defaults to response status code `200`.

    Example: `status = '403'` If the forbidden response error code needs to be sent
    
* `delay`: The delay of time in milliseconds after which the api's response needs to be sent to consumer. If this attribute is not set, it defaults to a delay of `0` ms.

    Example: `delay = 2000` If api's response needs to be sent to client after 2 seconds


### Code Guide
```js
const app = express();
const apiController = require('./controllers/api-controller');

const mockus = require('mockus-middleware');

// Create route configuration and pass to the mockus via routes attribute like below
const mockRoutes = {
  '/api/user/info': {
    response: require('../mock/user.mock.json'),
    status: 401,
  },
  '/api/form/submit': {
    response: require('../mock/form-data.mock.json'),
    method: 'post',
    delay: 800   // API response will be sent after 800 milliseconds
  },
  // ... some more api routes can be added
};

// In case of MOCK environment, include mockus middleware
if (process.env.NODE_ENV === 'MOCK')
  app.use('/api', mockus({ routes: mockRoutes }), apiController); 
```

In the above snippet, the mockus middleware is included just before the actual api controller `apiController`, which may handle all the routes of application.
When included, it matches for route configuration, set during initialisation. If the api route doesn't match against any of the configuration, then the flow continues to `apiController`. 
