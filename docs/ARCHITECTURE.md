# Architecture Documentation

## Overview

This project follows **Clean Architecture** principles combined with **Domain-Driven Design (DDD)** patterns to ensure scalability, maintainability, and separation of concerns.

## Layers

### 1. Domain Layer (`src/domain/`)

The **Domain Layer** contains the core business logic and is independent of external frameworks.

#### Entities (`src/domain/entities/`)

Business entities that represent core concepts in the problem domain.

```typescript
// src/domain/entities/post.entity.ts
export interface Post {
  _id?: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
}
```

**Key Characteristics:**
- No framework dependencies
- Pure business rules
- Immutable in many cases
- Contains the core value objects

#### Repositories (`src/domain/repositories/`)

Repository interfaces that define the contract for data access.

```typescript
// Example repository interface
export interface IPostRepository {
  create(post: CreatePostDto): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findAll(limit: number, skip: number): Promise<Post[]>;
  update(id: string, post: UpdatePostDto): Promise<Post>;
  delete(id: string): Promise<boolean>;
}
```

**Why interfaces here:**
- Dependency inversion (depend on abstractions, not implementations)
- Framework-agnostic contracts
- Facilitates testing with mocks

#### Value Objects (`src/domain/value-objects/`)

Objects defined by their attributes, not identity. Examples: Email, Money, Address.

### 2. Application Layer (`src/application/`)

The **Application Layer** orchestrates domain logic and contains use cases.

#### DTOs (`src/application/dtos/`)

Data Transfer Objects for input/output contracts with validation.

```typescript
// src/application/dtos/post.dto.ts
export type CreatePostDto = {
  title: string;
  content: string;
  author: string;
};
```

**Validation with Zod:**
```typescript
// src/application/dtos/post.validation.ts
export const createPostSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1).max(50000),
  author: z.string().min(1).max(200)
});
```

**Benefits:**
- Type-safe API contracts
- Runtime validation
- Clear documentation
- Fail-fast on invalid input

#### Use Cases (`src/application/use-cases/`)

Business logic that implements specific user scenarios.

```typescript
// src/application/use-cases/post.use-cases.ts
export async function createPost(dto: CreatePostDto) {
  // Validation
  if (!dto.title) throw new Error(translate(POSTS.ERRORS.TITLE_REQUIRED));
  
  // Business logic
  const db = getDatabase();
  const result = await db.collection('posts').insertOne({...});
  
  return result;
}
```

**Responsibilities:**
- Orchestrating domain logic
- Implementing workflows
- Transaction management
- Error handling

### 3. Infrastructure Layer (`src/infrastructure/`)

The **Infrastructure Layer** handles external concerns and implementations.

#### Database (`src/infrastructure/database/`)

Data persistence implementation using MongoDB.

```typescript
// src/infrastructure/database/mongodb/connection.ts
export async function connectDatabase(uri: string): Promise<Db> {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db();
}

export function getDatabase(): Db {
  if (!db) throw new Error('Database not connected');
  return db;
}
```

**Key Points:**
- Singleton pattern for database connection
- Connection lifecycle management
- Error handling for database failures
- Centralized access to the database instance

#### HTTP Server (`src/infrastructure/http/`)

Web layer implementation with Fastify.

##### Server (`server.ts`)
```typescript
export function createServer() {
  const app = fastify({ logger: true });
  app.register(cors);
  app.register(postRoutes, { prefix: '/posts' });
  return app;
}
```

##### Controllers (`controllers/`)
Handle HTTP request/response and delegate to use cases.

```typescript
export class PostController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const validated = createPostSchema.parse(request.body);
    const post = await createPost(validated);
    return reply.status(201).send({...});
  }
}
```

**Controller Responsibilities:**
- Parse HTTP requests
- Validate using schemas
- Call use cases
- Format responses
- Handle HTTP-specific errors

##### Routes (`routes/`)
Define API endpoints using Fastify plugin pattern.

```typescript
export async function postRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (req, reply) => controller.create(req, reply));
  fastify.get('/:id', async (req, reply) => controller.getById(req, reply));
  // ... more routes
}
```

**Plugin Pattern Benefits:**
- Modular route organization
- Reusable route definitions
- Encapsulation
- Easy testing

### 4. Shared Layer (`src/shared/`)

Utilities and constants used across all layers.

#### Environment Variables (`env/`)

```typescript
// src/shared/env/env.validation.ts
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.url(),
  // ...
});
```

**Benefits:**
- Type-safe environment access
- Runtime validation on startup
- Fail-fast on missing/invalid config
- Single source of truth

#### Internationalization (`i18n/`)

```typescript
// src/shared/i18n/index.ts
export const translate = (key: string, lng: string = 'en-US') => {
  return i18n.t(key, { lng });
};
```

#### Constants (`constants/`)

```typescript
// src/shared/constants/i18n.keys.ts
export const POSTS = {
  ERRORS: {
    NOT_FOUND: 'posts.errors.notFound',
    TITLE_REQUIRED: 'posts.errors.titleRequired',
    // ...
  }
};
```

## Data Flow

### Creating a Post

```
HTTP Request (POST /posts)
    ↓
Fastify Routes (postRoutes)
    ↓
PostController.create()
    ↓
Validation (Zod schema)
    ↓
Use Case (createPost)
    ↓
Domain Logic (validation, business rules)
    ↓
Database (MongoDB)
    ↓
Response Formatting
    ↓
HTTP Response (201 Created)
```

## Dependencies Direction

The **dependency graph** follows the **Dependency Inversion Principle**:

```
Controllers → Use Cases → Domain
    ↓
  Shared (env, i18n, constants)
    ↓
Infrastructure (Database, HTTP)
```

**Key Rules:**
- Domain layer has NO external dependencies
- Application layer depends only on Domain
- Infrastructure depends on Domain (via interfaces)
- Controllers depend on Application
- All layers can depend on Shared

## Testing Strategy

### Unit Tests

Test business logic in isolation:

```typescript
describe('createPost', () => {
  it('should create a post successfully', async () => {
    // Mock database
    // Call use case
    // Assert result
  });
});
```

**Coverage Target:** 20%+ of codebase

### Integration Tests

Test API endpoints end-to-end:

```typescript
describe('POST /posts', () => {
  it('should create a post via HTTP', async () => {
    // Start server
    // Make HTTP request
    // Verify database state
  });
});
```

## Configuration Management

### Environment-Based Config

```env
# Development
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/student-blogging

# Production
NODE_ENV=production
MONGODB_URI=mongodb://prod-server:27017/student-blogging
```

### Validation

```typescript
// Validated on startup
const env = getEnv(); // Throws if invalid
```

## Error Handling

### Structured Error Responses

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "path": ["title"],
      "message": "Title is required"
    }
  ]
}
```

### Error Categories

1. **Validation Errors** (400) - Invalid input
2. **Not Found Errors** (404) - Resource doesn't exist
3. **Server Errors** (500) - Unexpected failures

## Scalability Considerations

### Current Architecture Supports:

- **Horizontal Scaling**: Stateless HTTP handlers
- **Database Sharding**: MongoDB native support
- **Microservices**: Each use case can become a service
- **Caching**: Can be added at repository level
- **Load Balancing**: Stateless design allows multiple instances

### Future Improvements:

- Message queues (RabbitMQ, Kafka) for async operations
- Event sourcing for post changes
- CQRS for read/write separation
- API Gateway for authentication
- Monitoring and observability (Prometheus, Grafana)

## Monitoring & Observability

### Integrated Tools:

- **Prometheus**: Metrics collection
- **Grafana**: Visualization and dashboards
- **Structured Logging**: Via Fastify logger

### Configuration:

```yaml
# deployment/monitoring/prometheus.yml
# deployment/monitoring/grafana/provisioning/
```

## Best Practices Implemented

✅ **Single Responsibility Principle** - Each class/function has one reason to change
✅ **Dependency Inversion** - Depend on abstractions, not implementations
✅ **DRY (Don't Repeat Yourself)** - Shared utilities in `shared/`
✅ **SOLID Principles** - Applied throughout the codebase
✅ **Type Safety** - TypeScript strict mode enabled
✅ **Validation** - Zod for runtime validation
✅ **Error Handling** - Consistent error responses
✅ **Testing** - Jest with mocks for isolation
✅ **Documentation** - Code comments and API docs
✅ **CI/CD** - Automated testing and deployment

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Fastify Documentation](https://www.fastify.io/)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/core/best-practices/)
