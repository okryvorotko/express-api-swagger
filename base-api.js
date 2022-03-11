const express = require('express');
let store = require('./db/store.json');
let app = new express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('dotenv').config();
require('./routes/item')(app, store);
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const base_url = process.env.BASE_URL;
const port = process.env.PORT;
const swagger_url = process.env.SWAGGER_URL;

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "Store API",
            description: "By Oleksandr Kryvorotko",
            servers: [base_url + port]
        }
    },
    apis: ["./routes/*.js", "./base-api.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(swagger_url, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *  get:
 *    description: Landing page
 *    responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
app.get('/', function (req, res) {
    res.send(`Welcome to the store!\nAll information about API is here: ${base_url}:${port}${process.env.SWAGGER_URL}`);
});

// Create a server to listen at port 8080
let baseApi = app.listen(port, () => {
    let port = baseApi.address().port;
    console.log(`REST API demo app listening at ${base_url}:${port}`)
})

module.exports = app;