Inventory Management System Backend (MERN Stack)
This repository contains the backend implementation of an Inventory Management System using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The backend is responsible for user authentication and managing inventory through CRUD (Create, Read, Update, Delete) operations.

Features
User Authentication: Secure user authentication using JWT (JSON Web Tokens).
CRUD Operations: Perform CRUD operations on the inventory items.
Validation: Input validation using Express Validator for data integrity.
Swagger Documentation: API documentation using Swagger.
Technologies Used
bcryptjs: Password hashing for secure user authentication.
dotenv: Load environment variables from a .env file.
express: Web application framework for Node.js.
express-validator: Library for input validation in Express.
jsonwebtoken: Token-based authentication using JSON Web Tokens.
mongoose: MongoDB object modeling for Node.js.
nodemon: Monitor for any changes in the server code and restart the server.
swagger-jsdoc: Swagger documentation generation from JSDoc comments.
swagger-ui-express: Swagger UI for API documentation.
Project Structure
bash
Copy code
.
├── db              # Database related files
├── middleware      # middleware for auth
├── models          # Mongoose models
├── routes          # API route definitions
├── .env            # Environment variable configuration
└── server.js       # Entry point for your server
Setup
Clone the repository:

bash
Copy code
git clone https://github.com/Safwan2003/inventory-management-system

Install dependencies:

npm install
Create a .env file in the root directory and add the following variables:

env
Copy code
PORT=3001
MONGODB_URI=mongodb://localhost:27017/inventory 

JWT_SECRET=your_secret_key
Replace your_secret_key with a strong and unique secret for JWT.

Run the server:

bash
Copy code
npm start
The server will be running at http://localhost:2000.

API Documentation
Swagger documentation is available at http://localhost:2000/api-docs once the server is running. Explore and test the API endpoints using Swagger UI.

live:https://relieved-threads-cod.cyclic.app/
app:https://github.com/Safwan2003/starter-express-api

Contributing
Feel free to contribute to the project by opening issues or submitting pull requests. Your feedback and suggestions are highly appreciated.
