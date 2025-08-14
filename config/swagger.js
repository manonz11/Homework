const swaggerJsdoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API Documentation',
            version: '1.0.0',
            description: 'API documentation for E-commerce product management',
        },
        servers: [
            {
                url: 'http://localhost:3000/',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Product: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        name: {
                            type: 'string',
                            example: 'iPhone 15',
                        },
                        price: {
                            type: 'number',
                            format: 'float',
                            example: 37900.00,
                        },
                        deleted: {
                            type: 'boolean',
                            example: false,
                        },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;