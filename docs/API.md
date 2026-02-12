# Student Blogging API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. List All Posts
**GET** `/posts`

Query Parameters:
- `limit` (optional, default: 50): Maximum number of posts to return (max: 100)
- `skip` (optional, default: 0): Number of posts to skip for pagination

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Post Title",
      "content": "Post content here...",
      "author": "Author Name",
      "createdAt": "2026-02-06T10:30:00Z",
      "updatedAt": "2026-02-06T10:30:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "skip": 0,
    "total": 1
  }
}
```

---

### 2. Get Post by ID
**GET** `/posts/:id`

Parameters:
- `id` (path): MongoDB ObjectId of the post

Response:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Post Title",
    "content": "Post content here...",
    "author": "Author Name",
    "createdAt": "2026-02-06T10:30:00Z",
    "updatedAt": "2026-02-06T10:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Post not found"
}
```

---

### 3. Create New Post
**POST** `/posts`

Request Body:
```json
{
  "title": "New Post Title",
  "content": "Post content goes here...",
  "author": "Author Name"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "New Post Title",
    "content": "Post content goes here...",
    "author": "Author Name",
    "createdAt": "2026-02-06T11:00:00Z",
    "updatedAt": "2026-02-06T11:00:00Z"
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "path": ["title"],
      "message": "Title is required"
    }
  ]
}
```

---

### 4. Update Post
**PUT** `/posts/:id`

Parameters:
- `id` (path): MongoDB ObjectId of the post

Request Body:
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "author": "Updated Author"
}
```

Response:
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Title",
    "content": "Updated content...",
    "author": "Updated Author",
    "createdAt": "2026-02-06T10:30:00Z",
    "updatedAt": "2026-02-06T11:15:00Z"
  }
}
```

---

### 5. Delete Post
**DELETE** `/posts/:id`

Parameters:
- `id` (path): MongoDB ObjectId of the post

Response (204): No content

**Error Response (404):**
```json
{
  "success": false,
  "message": "Post not found"
}
```

---

### 6. Search Posts
**GET** `/posts/search?q=keyword`

Query Parameters:
- `q` (required): Search query (searches in title and content)
- `limit` (optional, default: 50): Maximum number of results (max: 100)

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Post Title with keyword",
      "content": "Content with keyword here...",
      "author": "Author Name",
      "createdAt": "2026-02-06T10:30:00Z",
      "updatedAt": "2026-02-06T10:30:00Z"
    }
  ]
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Search query parameter is required"
}
```

---

## Environment Variables

```env
NODE_ENV=development
PORT=3000
DEFAULT_LANGUAGE=en-US
MONGODB_URI=mongodb://localhost:27017/student-blogging
MONGO_INITDB_DATABASE=student-blogging
SWAGGER_ENABLED=true
GF_SECURITY_ADMIN_USER=admin
GF_SECURITY_ADMIN_PASSWORD=password
GF_SERVER_ROOT_URL=http://localhost:3000
```

---

## Running Locally

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
npm run start
```

### Docker
```bash
npm run docker:dev
npm run docker:devLogs
```

### Tests
```bash
npm test
npm run test:watch
npm run test:coverage
```
