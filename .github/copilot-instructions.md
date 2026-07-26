# Copilot Instructions for `student-blogging`

## Quick "never do" checklist
- Never put business logic in controllers, routes, middleware, or repositories.
- Never let the Domain layer depend on Fastify, MongoDB, Zod, JWT, HTTP, env vars, or logging frameworks.
- Never instantiate repositories/infra dependencies inside controllers or use cases — go through a factory.
- Never throw a generic `Error` — use the `AppError` hierarchy.
- Never expose MongoDB documents outside the repository layer.
- Never log passwords, JWT tokens, secrets, or personal data.
- Never use `any`, non-null assertion (`!`), or `@ts-ignore` unless truly unavoidable.
- Never introduce a new dependency unless explicitly requested.

## Build, test, and lint commands

### Environment baseline
- Node.js `>= 24.12.0`
- npm `>= 11.6.2`

### Core quality gates (same sequence used in CI)
1. `npm run typecheck`
2. `npm run lint`
3. `npm run format:check`
4. `npm run build`
5. `npm run test:unit:coverage`
6. `npm run test:integration`

### Local development
- Start API in watch mode: `npm run dev`
- Build production output: `npm run build`
- Run built app: `npm run start`

### Tests
- Default test entrypoint (Dockerized): `npm test`
- Local Jest (without Docker): `npm run test:local`
- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- Coverage (local): `npm run test:coverage:local`

### Run a single test file
- Local Jest single file: `npm run test:local -- tests/unit/user.use-cases.spec.ts`
- Unit suite single file: `npm run test:unit -- tests/unit/post.use-cases.spec.ts`
- Integration single file: `npm run test:integration -- tests/integration/smoke.integration.spec.ts`

## High-level architecture

This project follows a Clean Architecture + DDD structure with explicit boundaries:

- **Domain (`src/domain`)**: entities and value objects (`User`, `Post`, `Email`, `Role`, IDs) plus repository interfaces.
- **Application (`src/application`)**: use cases and DTOs, orchestrating domain behavior through repository/provider abstractions.
- **Infrastructure (`src/infrastructure`)**: Fastify HTTP layer, MongoDB repository implementations, provider adapters (JWT, Argon2, telemetry), and factories that wire concrete dependencies.
- **Shared (`src/shared`)**: env validation, i18n resources, reusable error builder, constants, policies, validation helper.

Request flow is typically:
`route -> middleware -> controller -> factory -> use case -> domain/repository -> presenter/response`.

`src/main.ts` is the composition root: it loads env, connects MongoDB, creates the Fastify server, and starts listening.

Dependencies always point inward:

```
Infrastructure
      ↓
Application
      ↓
Domain
```

## Key repository conventions

### File and module naming
- Files: `kebab-case`, with a suffix that matches the layer: `create-user.use-case.ts`, `user.repository.ts`, `user.controller.ts`, `email.value-object.ts`.
- Classes/types inside files: `PascalCase` (see Naming section below).
- Path aliases: `@domain/*`, `@application/*`, `@infrastructure/*`, `@shared/*` — always use these instead of relative `../../..` paths.

### Dependency wiring and boundaries
- Controllers do not instantiate infrastructure dependencies directly; they call `make*` factories in `src/infrastructure/http/factories/**`.
- Use cases depend on interfaces/abstractions from inner layers (or provider contracts), while concrete adapters stay in infrastructure.
- Always prefer constructor injection. Never instantiate dependencies inside business classes. Avoid service locators and global singletons.

### DTOs
- DTOs live in `src/application` and are plain, immutable data shapes (`readonly` fields) — no behavior.
- Input DTOs are validated at the boundary (controller) via `validateOrThrow`; never trust a DTO's shape without validation.
- Use cases return DTOs, never domain entities directly, to avoid leaking domain internals to the HTTP layer.

### Validation and error handling
- Zod validation is centralized through `validateOrThrow(schema, data)` (`src/shared/utils/validation.ts`) instead of ad-hoc parsing. Validate external input once, at the system boundary — do not duplicate validation across layers.
- Domain objects still validate their own invariants (e.g. a `Email` value object rejects an invalid string), independent of the Zod boundary check.
- Business/domain errors are built via `ErrorBuilder` into the `AppError` hierarchy (with specialized classes like `UserError`/`PostError`), then normalized by the Fastify global error handler. Business errors should be recoverable; unexpected errors bubble to the global handler and are never swallowed.
- Error messages are i18n-driven via keys in `src/shared/constants/i18n.keys.ts` and translated through `@shared/i18n`.

### AuthN/AuthZ route pattern
- Authenticated routes use `makeAuthMiddleware()` to decode JWT and populate `request.user`.
- Authorization is policy-based via `requireRoles(...)` / `requireSelfOrRoles(...)` with role sets defined in `src/shared/policies/constants/roles.policy.ts`.
- Always validate authentication before authorization.

### Data mapping
- Mongo repositories map persistence documents to domain entities/value objects explicitly (no direct document leakage into domain/use-cases).
- Repositories represent collections of aggregate roots, expose domain language in their method names, and never leak persistence details (e.g. Mongo-specific types) upward.

### Environment & config
- All env vars are validated once at startup through `src/shared` env validation — fail fast if config is invalid.
- Never read `process.env` directly outside that boundary; consume typed config instead.

## Engineering Principles

Every implementation must prioritize readability, maintainability and testability.

Follow: SOLID, DRY, KISS, YAGNI, Clean Code, Clean Architecture, DDD, and Object Calisthenics whenever practical.

Prefer simple solutions over clever solutions. Write code for humans first.

## TypeScript Guidelines

Use TypeScript in strict mode.

Always:
- Prefer explicit types for public APIs.
- Prefer type inference for local variables.
- Avoid `any`; prefer `unknown` when the type is genuinely not known yet.
- Prefer `readonly` whenever mutation is not required.
- Prefer `const` over `let`.
- Prefer union types over enums unless interoperability requires enums.
- Use discriminated unions to represent business states.
- Prefer interfaces for contracts and type aliases for compositions.
- Never disable TypeScript errors with `@ts-ignore` unless absolutely necessary.
- Never use the non-null assertion operator (`!`) unless there is no safer alternative.
- Avoid unnecessary type assertions (`as`).

Use utility types when appropriate: `Pick`, `Omit`, `Partial`, `Required`, `Readonly`, `Record`.

## Node.js Best Practices

Always write asynchronous code using async/await.

Avoid: callback-based APIs, nested promises, synchronous filesystem operations, blocking the event loop.

Always: release resources correctly, handle promise rejections, use `AbortController` when cancellation is required, keep request handlers lightweight.

## Domain-Driven Design

Domain objects must represent business concepts.

**Entities**: contain behavior, protect invariants, expose meaningful methods. Avoid anemic models.

**Value Objects**: immutable, equality by value, validate themselves on construction.

**Repositories**: represent collections of aggregate roots, expose domain language, never expose persistence details.

## Use Cases

Every business operation is implemented as a dedicated Use Case:
- represents one business action
- has one public `execute()` method
- returns a predictable result
- does not depend on HTTP, database implementation, or framework details

Keep orchestration inside Use Cases; move business rules to Domain whenever possible.

## Controllers

Controllers should only: receive requests, validate input, invoke a factory, call a Use Case, map the response.

Controllers must never: instantiate repositories, access MongoDB, contain business rules, perform authorization logic.

## Testing

- Every Use Case should be unit testable via dependency injection.
- Mock interfaces instead of implementations.
- Test behavior, not implementation details; avoid testing private methods.
- Keep tests deterministic. Follow Arrange -> Act -> Assert.

## Logging

Logs should provide operational value. Prefer structured logs. Log failures once — avoid duplicate logging.

Never log: passwords, JWT tokens, secrets, personal data.

## Object Calisthenics

Prefer, whenever practical:
1. One level of indentation per method.
2. Avoid `else` blocks by using early returns.
3. Wrap primitive values into Value Objects whenever they represent business concepts.
4. Keep collections encapsulated.
5. One method call chained per line when chaining fluent calls (avoid long chained one-liners) — this does not mean avoiding normal property/member access.
6. Do not abbreviate names.
7. Keep classes small and focused.
8. Prefer composition over inheritance.
9. Avoid getters/setters that expose internal state unnecessarily — expose behavior instead (this applies to entities; Value Objects may expose their value directly since it *is* their state).

## Code Style

Prefer: early returns, pure functions, immutable data, composition over inheritance, expressive names.

Avoid: deep nesting, magic numbers, duplicated logic, long methods, long parameter lists.

Extract private methods when intent becomes clearer.

## Performance

Optimize only when necessary. Readability has priority over premature optimization.

Avoid unnecessary object allocations and unnecessary database queries. Keep I/O operations asynchronous. Batch operations whenever possible.

## Security

Never trust external input — always validate it. Escape output when necessary.

Never expose internal stack traces. Never hardcode secrets — read them from environment variables (through the `src/shared` config boundary).

## Naming

Use ubiquitous language (terms from the business domain).

- Class names: `CreateUserUseCase`
- Method names: `create()`, `publish()`, `activate()`
- Boolean methods: `isPublished()`, `hasPermission()`, `canDelete()`

Avoid abbreviations. Avoid generic names such as `Manager`, `Helper`, `Utils`, `Common`, `Base`.

## AI Coding Instructions

When generating code:
- Follow existing project patterns before introducing new ones.
- Reuse existing abstractions whenever possible; search for similar implementations before creating new code.
- Do not introduce new dependencies unless explicitly requested.
- Do not duplicate logic already available in the project.
- Keep changes minimal and localized.
- Preserve backward compatibility unless instructed otherwise.
- Favor readability over clever implementations.
- Generate production-ready code, not examples.
- When uncertain, follow the existing architecture instead of inventing a new pattern.