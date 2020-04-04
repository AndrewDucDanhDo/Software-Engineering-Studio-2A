const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  info: {
    title: "SES2A - Quantum circuit solver",
    version: "1.0.0"
  },
  // TODO: Get this form env variables
  host: "localhost:3000",
  basePath: "/"
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"]
};

export function getSwaggerJsDoc() {
  return swaggerJSDoc(options);
}
