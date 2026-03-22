# Architecture Documentation

[Read this in Portuguese (pt-BR)](./ARCHITECTURE.pt-BR.md)

## Overview

This project follows Clean Architecture principles combined with Domain-Driven Design (DDD) patterns to ensure scalability, maintainability, and clear separation of concerns.

## System Layers

### 1. Domain Layer (`src/domain/`)

The Domain Layer contains the core business logic and is completely independent of external libraries or frameworks.

#### Entities (`src/domain/entities/`)

Business entities that represent core concepts in the problem domain (e.g., Post, User). Key characteristics:

- No external dependencies.
- Contains the main state and logic that does not depend on anything outer.

#### Repositories (`src/domain/repositories/`)

Repository interfaces defining the contract for data access. It ensures the Dependency Inversion Principle.

- Depend on abstractions, not implementations.
- Easy to swap the actual database without affecting the domain.

#### Value Objects (`src/domain/value-objects/`)

Objects defined by their attributes and behavior, not identity.

### 2. Application Layer (`src/application/`)

The Application Layer orchestrates domain logic and executes specific use cases.

#### DTOs (`src/application/dtos/`)

Data Transfer Objects representing input/output contracts.

- Validated via Zod to guarantee type safety and payload correctness.

#### Use Cases (`src/application/use-cases/`)

Business logic corresponding to specific user actions (e.g., Create Post, Auth Login).

- Fetches data from repositories.
- Calls domain entities or external services.

### 3. Infrastructure Layer (`src/infrastructure/`)

The outer layer containing implementations of the interfaces defined in the inner layers.

#### HTTP Server (`src/infrastructure/http/`)

Handles the web transport setup (Fastify).

- **Controllers**: Adapts HTTP requests to Use Case payloads.
- **Routes**: Maps URLs to appropriate controllers.
- **Middlewares**: Handles global logic like authentication checks.

#### Database (`src/infrastructure/database/`)

MongoDB implementations utilizing the official Node.js driver or Mongoose.

#### Providers (`src/infrastructure/providers/`)

Concrete implementations for tokens (e.g., JWT) and hashing (e.g., Argon2).

### 4. Shared (`src/shared/`)

Utilities and configurations that can be used across multiple layers.

- **Constants**: Global magic strings and configuration keys.
- **i18n**: Multi-language support configuration and dictionaries.
- **Errors**: Domain-specific error templates.
