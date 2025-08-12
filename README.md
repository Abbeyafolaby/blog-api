# Blog API

A RESTful API for a modern blogging platform built with Node.js, Express.js, MongoDB, and JWT.

## Description

This Blog API provides a robust backend solution for blogging platforms, offering complete CRUD operations for blog posts, and user authentication. The API is designed with scalability and security in mind, making it suitable for personal blogs platforms.

## Features

- **User Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin, Author, Reader)

- **Blog Post Management**
  - Create, read, update, and delete blog posts
  - Post categorization and tagging


- **API Features**
  - RESTful API design
  - Comprehensive error handling
  - Request validation
  - API documentation with Swagger
  - Rate limiting and security middleware

## Installation & Usage

### Prerequisites
- Node.js
- MongoDB

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blog-api.git
   cd blog-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/blogapi
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Usage
The API will be available at `http://localhost:3000`

#### API Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/protected/me` - Example protected route (requires Bearer token)

To be added as the project progresses:
- `GET /api/posts` - Get all blog posts
- `POST /api/posts` - Create a new blog post (protected)
- `GET /api/posts/:id` - Get a specific blog post
- `PUT /api/posts/:id` - Update a blog post (protected)
- `DELETE /api/posts/:id` - Delete a blog post (protected)

Full API documentation available at `/api/docs` when server is running.

## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi or express-validator
- **Documentation**: Swagger
- **Testing**: Jest and Supertest
- **Security**: Helmet, CORS, bcrypt
- **Environment**: dotenv
- **Development**: Nodemon

## Author

**Name**
- Name: Abiodun Afolabi
- GitHub: [@Abbeyafolaby](https://github.com/Abbeyafolaby)
