'use strict'
const Joi = require("joi");

module.exports = function (app) {
    /**
     * @swagger
     * /item/{name}:
     *  get:
     *    description: Get an item by name
     *    tags:
     *      - items
     *    parameters:
     *       - in: path
     *         name: name
     *         schema:
     *           type: string
     *         required: true
     *         description: Name of the item to get
     *    responses:
     *      '200':
     *        description: A successful response
     *      '404':
     *        description: Item not found
     */
    app.get('/item/:name', function (req, res) {
        let item = db.find(entry => entry.name === req.params.name);
        if (!item) return res.status(404).send({error: `Item '${req.params.name}' was not found`});
        res.json(item);
    })

    /**
     * @swagger
     * /items:
     *  get:
     *    description: Get all items in the db
     *    tags:
     *      - items
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/items', function (req, res) {
        res.json(db);
    });

    /**
     * @swagger
     *   /item:
     *    post:
     *      description: Put an item in the db
     *      tags:
     *        - items
     *      consumes:
     *        - application/json
     *      parameters:
     *        - in: body
     *          name: item
     *          schema:
     *            type: object
     *            required:
     *              - name
     *              - amount
     *            properties:
     *              name:
     *                type: string
     *                minLength: 3
     *                description: Name of the item to add
     *              amount:
     *                type: integer
     *                minimum: 1
     *                description: Amount of items to add
     *      responses:
     *        '201':
     *          description: A successful response. Item added
     *        '400':
     *          description: Validation error generated by validator
     */
    app.post('/item', function (req, res) {
        const schema = Joi.object({
            name: Joi.string().alphanum().min(3).max(15).required().custom(errIfPresent),
            amount: Joi.number().integer().min(1).required()
        }).strict();

        const {error} = schema.validate(req.body);
        if (error) return res.status(400).send({error: error});

        req.body.name = req.body.name.trim();
        db.push(req.body);

        res.status(201).json(db.find(entry => entry.name === req.body.name));
    });

    /**
     * @swagger
     *   /item:
     *    patch:
     *      description: Update an item in the db
     *      tags:
     *        - items
     *      consumes:
     *        - application/json
     *      parameters:
     *        - in: body
     *          name: item
     *          schema:
     *            type: object
     *            required:
     *              - name
     *              - amount
     *            properties:
     *              name:
     *                type: string
     *                minLength: 3
     *                description: Name of the item to add
     *              amount:
     *                type: integer
     *                minimum: 1
     *                description: Amount of items to add
     *      responses:
     *        '200':
     *          description: A successful response. Item updated
     *        '400':
     *          description: Validation error generated by validator
     *        '404':
     *          description: Item not found
     */
    app.patch('/item', function (req, res) {
        const schema = Joi.object({
            name: Joi.string().alphanum().min(3).max(15).required().custom(errIfNotPresent),
            amount: Joi.number().integer().min(1).required()
        }).strict();

        const {error} = schema.validate(req.body);
        req.body.name = req.body.name.trim();

        if (error?.message === `Name '${req.body.name}' does not exist in DB. Please use POST to add`) {
            return res.status(404).send({error: error});
        }
        if (error) return res.status(400).send({error: error});

        db.find(entry => entry.name === req.body.name).amount = req.body.amount;

        res.json(db.find(entry => entry.name === req.body.name));
    });

    /**
     * @swagger
     * /item/{name}:
     *  delete:
     *    description: Delete an item by name
     *    tags:
     *      - items
     *    parameters:
     *       - in: path
     *         name: name
     *         schema:
     *           type: string
     *         required: true
     *         description: Name of the item to delete
     *    responses:
     *      '204':
     *        description: A successful response. No content to show
     *      '404':
     *        description: Item not found
     */
    app.delete('/item/:name', function (req, res) {
        req.params.name = req.params.name.trim();
        let item = db.find(entry => entry.name === req.params.name);
        if (!item) return res.status(404).send({error: `Item that you\'re trying to delete '${req.params.name}' was not found`});

        db.splice(db.indexOf(item), 1);

        res.status(204).end();
    });

    /**
     * Throws error if item is present in DB
     */
    const errIfPresent = (name, helpers) => {
        let res;
        name = name.trim();
        res = db.find(entry => entry.name === name);
        if (res) {
            return helpers.message(`Name '${name}' already exists in DB. Please use PATCH to update`);
        } else {
            return name;
        }
    }

    /**
     * Throws error if item is not present in DB
     */
    const errIfNotPresent = (name, helpers) => {
        let res;
        name = name.trim();
        res = db.find(entry => entry.name === name);
        if (!res) {
            return helpers.message(`Name '${name}' does not exist in DB. Please use POST to add`);
        } else {
            return name;
        }
    }
}

