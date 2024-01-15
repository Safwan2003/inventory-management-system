const express = require('express');
require('dotenv').config();
const connectDB = require('./db');

const app = express();

app.use(express.json({ extended: false }));

// Swagger documentation setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management',
      description: 'API documentation for Inventory Management',
      version: '1.0.0',
      contact: {
        name: 'Muhammad Shaffan',
        email: 'someone@gmail.com',
      },
      servers: ['http://localhost:2000'],
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes folder
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Your API routes
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/user', require('./routes/user'));
app.use('/api/auth', require('./routes/auth'));

connectDB();

// Start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
