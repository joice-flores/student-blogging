# Student Blogging API

[![CI/CD Pipeline](https://github.com/roma-mb/student-blogging/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/roma-mb/student-blogging/actions)

A modern API built for a blogging platform, developed with Node.js, Fastify, TypeScript, and MongoDB. The system follows Clean Architecture principles along with Domain-Driven Design (DDD) to ensure modularity, scalability, and maintainability.

[Read this in Portuguese (pt-BR)](./README.pt-BR.md)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Documentation Reference](#documentation-reference)
- [Quick Start](#quick-start)
- [License](#license)

## Features

- User authentication (Register, Login, Logout) using JWT and Argon2.
- Create, read, update, and delete blog posts.
- Full-text search and pagination for posts.
- Input validation using Zod.
- Internationalization (i18n) support for error messages.
- Comprehensive testing (Unit and Integration) with Jest.
- Full containerization using Docker and Docker Compose.
- CI/CD integration.

## Tech Stack

- **Runtime**: Node.js (>= 24.12.0)
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: MongoDB
- **Validation**: Zod
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

## Documentation Reference

For more detailed information, please refer to the documents below:

- [Application Architecture](./docs/ARCHITECTURE.md)
- [Detailed Documentation & API Guide](./docs/DOCUMENTATION.md)

## Quick Start

### Prerequisites

- Node.js >= 24.12.0
- npm >= 11.6.0
- Docker & Docker Compose (for containerized environments)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/roma-mb/student-blogging.git
   cd student-blogging
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the environment:**
   Copy the example environment file and adjust the variables based on your setup.
   ```bash
   cp .env.example .env
   ```

4. **Run the application (Development mode):**
   ```bash
   npm run dev
   ```

5. **Run via Docker (Development):**
   ```bash
   npm run docker:dev
   ```

## License

This project is licensed under the MIT License.

