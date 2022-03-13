const express = require('express');
let store = require('../db/store.js');
global.db = JSON.parse(JSON.stringify(store));
let app = new express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('dotenv').config();
require('../routes/item')(app);
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
            servers: [`${base_url}:${port}`]
        }
    },
    apis: ["./routes/*.js", "./api/*.js"]
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

/**
 * @swagger
 * /reset:
 *  post:
 *    description: Resets store DB to initial state
 *    responses:
 *      '204':
 *        description: A successful response. No content
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
app.post('/reset', function (req, res) {
    global.db = JSON.parse(JSON.stringify(store));
    return res.status(204).end();
});

// Create a server to listen at port 8080
let baseApi = app.listen(port, () => {
    let port = baseApi.address().port;
    console.log(`REST API demo app listening at ${base_url}:${port}`)
})

module.exports = app;