
const swaggerAutogen = require('swagger-autogen')();


const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
      description: 'Enter the token with the `Bearer ` prefix, e.g., "Bearer YOUR_TOKEN"',
    },
  },
  security: [{ bearerAuth: [] }],
  schemes: ['http'],
  host: 'localhost:5000',
};


const outputFile = './swagger-output.json';
const routes = ['./src/routes/router.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);