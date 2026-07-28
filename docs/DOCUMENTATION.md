# Documentation && API Guide

[Read this in Portuguese (pt-BR)](./DOCUMENTATION.pt-BR.md)

This document provides technical instructions for the Student Blogging API, including setup guidelines and API reference.

## Application Setup

### Local Environment

1. Ensure Node.js (>= 24.12.0) is installed.
2. Run `npm install` to download dependencies.
3. Make sure a MongoDB instance is running locally on the port configured in `.env`.
4. Set `ANTHROPIC_API_KEY` in `.env` with a valid Anthropic API key ([console.anthropic.com](https://console.anthropic.com)) — required to generate lesson plans via Claude. `ANTHROPIC_MODEL` defaults to `claude-opus-5` if not set.
5. Run `npm run dev` to start the Fastify server in watch mode.

### Docker Environment

The project provides a complete isolated development environment via Docker.

1. Run `npm run docker:dev` to build and start the API and Database containers.
2. To stop, run `npm run docker:dev:stop` or `npm run docker:dev:down`.
3. Verify container logs with `docker compose logs -f`.

### Testing

The suite is configured to use Jest.

- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`

## API Reference

**Postman Collection**: [Access the complete Postman Collection here](https://www.postman.com/rom-mb/workspace/student-blogging/collection/6885147-7cd33662-b7ed-49bd-bbc1-4e864adcb758?action=share&source=copy-link&creator=6885147).

### Base URL

The default local base URL is `http://localhost:3000`.

### 1. Health

**Health Check**

- **Endpoint**: `GET /health`
- **Description**: Verifies if the API is correctly running.

### 2. Authentication

**Register**

- **Endpoint**: `POST /auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }
  ```

**Login**

- **Endpoint**: `POST /auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: Returns the authentication token to be sent as Authorization header in secured endpoints.

**Logout**

- **Endpoint**: `POST /auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Invalidates the current session.

### 3. Posts

**Create Post**

- **Endpoint**: `POST /posts`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "New Post about Instagram",
    "content": "Content post test",
    "author": "Oliver Doe"
  }
  ```

**List All Posts**

- **Endpoint**: `GET /posts`
- **Headers**: `Authorization: Bearer <token>`

**Search Posts**

- **Endpoint**: `GET /posts/search?q=blog`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `q` (Search query string)

### 4. Lesson Plans (AI-generated)

**Generate Lesson Plan**

- **Endpoint**: `POST /lesson-plans/generate`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (role `teacher` or `admin`)
- **Body**:
  ```json
  {
    "subject": "História",
    "grade": "7º ano do Ensino Fundamental",
    "theme": "Descobrimento do Brasil"
  }
  ```
- **Description**: Generates a structured lesson plan (objectives, content, methodology, schedule, assessment, resources) using the Claude API and saves it for the requesting teacher. Requires `ANTHROPIC_API_KEY` to be configured — see [Local Environment](#local-environment).
