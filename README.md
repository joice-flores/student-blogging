# Student Blogging API

![CI/CD Pipeline](https://github.com/roma-mb/student-blogging/actions/workflows/ci-cd.yml/badge.svg)

A modern blogging platform API built with **Node.js**, **Fastify**, **TypeScript**, **MongoDB**, and following **Clean Architecture** with **Domain-Driven Design** principles.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Testing](#testing)
- [Docker](#docker)
- [Contributing](#contributing)

## ✨ Features

- ✅ Create, read, update, and delete blog posts
- ✅ Full-text search on posts
- ✅ Pagination support
- ✅ Input validation with Zod
- ✅ i18n (Internationalization) support
- ✅ Comprehensive error handling
- ✅ Clean Architecture with DDD
- ✅ Docker & Docker Compose support
- ✅ CI/CD with GitHub Actions
- ✅ Unit testing with Jest

## 🛠 Tech Stack

- **Runtime**: Node.js >= 24.12.0
- **Framework**: Fastify 5.7.2
- **Language**: TypeScript 5.9.3
- **Database**: MongoDB 7.0
- **Validation**: Zod 4.3.6
- **Testing**: Jest 30.2.0
- **i18n**: i18next 25.8.0
- **Containerization**: Docker & Docker Compose

## 🏗 Architecture

The project follows **Clean Architecture** principles organized into layers:

```
src/
├── domain/           # Business logic and entities
│   ├── entities/     # Core business entities (Post)
│   ├── repositories/ # Repository interfaces
│   └── value-objects/
├── application/      # Use cases and DTOs
│   ├── dtos/        # Data Transfer Objects with Zod validation
│   └── use-cases/   # Business logic implementation
├── infrastructure/   # External implementations
│   ├── database/    # MongoDB connection and schemas
│   ├── http/        # Fastify server, routes, controllers
│   └── monitoring/  # Observability setup
└── shared/          # Shared utilities, i18n, env validation
    ├── constants/
    ├── env/
    ├── errors/
    └── i18n/
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 24.12.0
- npm >= 11.7.0
- MongoDB >= 7.0 (local or Docker)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/roma-mb/student-blogging.git
cd student-blogging
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
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

### Running the Application

#### Development Mode
```bash
npm run dev
```

The server will start on `http://localhost:3000`

#### Production Mode
```bash
npm run build
npm run start
```

## 📚 API Endpoints

For detailed API documentation, see [docs/API.md](docs/API.md)

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | List all posts with pagination |
| GET | `/posts/:id` | Get a specific post by ID |
| POST | `/posts` | Create a new post |
| PUT | `/posts/:id` | Update an existing post |
| DELETE | `/posts/:id` | Delete a post |
| GET | `/posts/search?q=keyword` | Search posts by keyword |

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

The project maintains a minimum of **20% code coverage**.

## 🐳 Docker

### Using Docker Compose (Development)
```bash
npm run docker:dev
```

View logs:
```bash
npm run docker:devLogs
```

Stop containers:
```bash
npm run docker:devDown
```

### Using Docker Compose (Production)
```bash
npm run docker:build
npm run docker:prod
npm run docker:logs
```

## 👨‍💻 Development

### Linting
```bash
npm run lint
npm run lint:fix
```

### Code Formatting
```bash
npm run format
```

### Build
```bash
npm run build
```

## 📦 Project Structure

```
.
├── src/
│   ├── application/      # Use cases and DTOs
│   ├── domain/           # Business entities
│   ├── infrastructure/   # HTTP server, database, controllers
│   ├── shared/          # Shared utilities and constants
│   └── main.ts          # Application entry point
├── tests/
│   ├── unit/            # Unit tests
│   └── integration/      # Integration tests
├── deployment/
│   ├── docker/          # Dockerfile for production
│   └── monitoring/      # Grafana & Prometheus configs
├── docs/
│   ├── API.md           # API documentation
│   ├── ARCHITECTURE.md   # Architecture details
│   └── DOCUMENTATION.md  # General documentation
├── jest.config.js        # Jest configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies
└── eslint.config.mjs     # ESLint configuration
```

## 🔄 CI/CD Pipeline

The project uses **GitHub Actions** for automated testing and deployment:

- **On Push/PR to main or develop**:
  - Install dependencies
  - Run linter
  - Build project
  - Run tests with coverage
  - Verify minimum 20% coverage

- **On Push to main**:
  - Build and push Docker image to registry

See [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) for details.

## 📝 Internationalization (i18n)

The application supports multiple languages. English (en-US) is configured by default.

To add a new language:
1. Create a new locale file in `src/shared/i18n/locales/`
2. Update `src/shared/i18n/i18n.config.ts`
3. Update environment validation in `src/shared/env/env.validation.ts`

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👤 Author

**Roma MB**
- GitHub: [@roma-mb](https://github.com/roma-mb)
- Email: [your-email@example.com]

## 📞 Support

For support, open an issue on [GitHub Issues](https://github.com/roma-mb/student-blogging/issues)
