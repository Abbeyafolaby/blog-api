# Blog API

A comprehensive RESTful API for a blog platform with user authentication, posts, comments, pagination, filtering, and security features.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Posts Management**: Create, read, update, and delete blog posts
- **Comments System**: Add and manage comments on posts
- **Pagination & Filtering**: Advanced query capabilities for posts
- **Security**: Helmet, rate limiting, XSS protection, and input validation
- **Role-based Access Control**: Admin, author, and reader roles

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, express-rate-limit, xss-clean
- **Password Hashing**: bcrypt

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/blog-api
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "reader"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "reader"
    },
    "token": "jwt_token_here"
  }
}
```

### Posts

#### GET `/api/posts`
Get all published posts with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)
- `author` (optional): Filter by author name
- `tags` (optional): Filter by tags (comma-separated)
- `search` (optional): Search in title and content
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort direction (asc/desc, default: desc)

**Example:**
```
GET /api/posts?page=1&limit=5&tags=javascript,nodejs&sortBy=createdAt&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "post_id",
      "title": "Getting Started with Node.js",
      "content": "Node.js is a powerful runtime...",
      "tags": ["javascript", "nodejs"],
      "author": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "commentCount": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalPosts": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET `/api/posts/:id`
Get a specific post by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "post_id",
    "title": "Getting Started with Node.js",
    "content": "Node.js is a powerful runtime...",
    "tags": ["javascript", "nodejs"],
    "author": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "commentCount": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/posts`
Create a new post (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "My New Post",
  "content": "This is the content of my new post...",
  "tags": ["blog", "api"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "post_id",
    "title": "My New Post",
    "content": "This is the content of my new post...",
    "tags": ["blog", "api"],
    "author": "user_id",
    "published": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT `/api/posts/:id`
Update a post (requires authentication, post owner or admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Updated Post Title",
  "content": "Updated content...",
  "tags": ["updated", "tags"]
}
```

#### DELETE `/api/posts/:id`
Delete a post (requires authentication, post owner or admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Comments

#### GET `/api/comments/posts/:postId/comments`
Get comments for a specific post with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Comments per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "comment_id",
      "content": "Great post! Very informative.",
      "author": {
        "_id": "user_id",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "post": "post_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalComments": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### POST `/api/comments/posts/:postId/comments`
Add a comment to a post (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "content": "This is my comment on the post!",
  "parentComment": "parent_comment_id" // optional, for nested comments
}
```

#### DELETE `/api/comments/:id`
Delete a comment (requires authentication, comment owner or admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Protected Routes

#### GET `/api/protected/profile`
Get user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## Security Features

### Rate Limiting
- **General**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **Post Creation**: 10 posts per hour per IP
- **Comments**: 20 comments per hour per IP

### Security Headers
- **Helmet**: Comprehensive HTTP security headers
- **XSS Protection**: Input sanitization to prevent XSS attacks
- **CORS**: Configurable Cross-Origin Resource Sharing

### Input Validation
- **Post Validation**: Title (3-200 chars), content (min 10 chars), tags array
- **Comment Validation**: Content (1-1000 chars)
- **User Validation**: Name, email, password requirements

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Admin, author, and reader roles
- **Resource Ownership**: Users can only modify their own content

## Database Models

### User Schema
```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['admin', 'author', 'reader'], default: 'reader'),
  timestamps: true
}
```

### Post Schema
```javascript
{
  title: String (required, 3-200 chars),
  content: String (required, min 10 chars),
  tags: [String] (optional, lowercase),
  author: ObjectId (ref: User, required),
  published: Boolean (default: true),
  timestamps: true
}
```

### Comment Schema
```javascript
{
  content: String (required, 1-1000 chars),
  author: ObjectId (ref: User, required),
  post: ObjectId (ref: Post, required),
  parentComment: ObjectId (ref: Comment, optional),
  timestamps: true
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"] // for validation errors
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## Development

### Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

### Environment Variables
- `PORT`: Server port (default: 3000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (development/production)

## API Testing

You can test the API endpoints using tools like:
- **Postman**: API development and testing
- **Thunder Client**: VS Code extension