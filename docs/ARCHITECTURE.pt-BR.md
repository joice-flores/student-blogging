# Documentação de Arquitetura

[Leia em Inglês (EN)](./ARCHITECTURE.md)

## Visão Geral

Este projeto segue os princípios da Arquitetura Limpa (Clean Architecture) combinados com os padrões de Domain-Driven Design (DDD) para garantir escalabilidade, manutenibilidade e uma clara separação de responsabilidades.

## Camadas do Sistema

### 1. Camada de Domínio (`src/domain/`)

A Camada de Domínio contém as regras de negócios principais e é completamente independente de bibliotecas ou frameworks externos.

#### Entidades (`src/domain/entities/`)

Entidades de negócios que representam conceitos centrais do domínio do problema (ex: Postagem, Usuário). Características principais:

- Sem dependências externas.
- Contém o estado e a lógica essenciais.

#### Repositórios (`src/domain/repositories/`)

Interfaces de repositório que definem o contrato de acesso a dados. Garante o Princípio de Inversão de Dependência.

- Depende de abstrações e não de implementações.
- Facilita a substituição do banco de dados sem afetar o domínio.

#### Objetos de Valor (`src/domain/value-objects/`)

Objetos definidos por seus atributos e comportamentos, não por sua identidade.

### 2. Camada de Aplicação (`src/application/`)

A Camada de Aplicação orquestra a lógica de domínio e executa os casos de uso específicos do sistema.

#### DTOs (`src/application/dtos/`)

Objetos de Transferência de Dados representando contratos de entrada/saída.

- Validados via Zod para garantir segurança de tipos e integridade da requisição.

#### Casos de Uso (`src/application/use-cases/`)

Lógica de negócios correspondente a ações específicas do usuário (ex: Criar Postagem, Login).

- Busca dados através de repositórios.
- Invoca entidades do domínio ou serviços externos.

### 3. Camada de Infraestrutura (`src/infrastructure/`)

A camada externa contendo implementações que satisfazem as interfaces definidas nas camadas internas.

#### Servidor HTTP (`src/infrastructure/http/`)

Gerencia as configurações de transporte web (Fastify).

- **Controllers**: Adaptam as requisições HTTP para a chamada dos casos de uso.
- **Rotas**: Mapeiam URLs para os controladores apropriados.
- **Middlewares**: Lógica global como validação de autenticação.

#### Banco de Dados (`src/infrastructure/database/`)

Implementações para o MongoDB utilizando os drivers oficiais ou ferramentas adicionais.

#### Provedores (`src/infrastructure/providers/`)

Implementações concretas de serviços externos, como geração de tokens (ex: JWT) e criptografia de senhas (ex: Argon2).

### 4. Compartilhado (`src/shared/`)

Utilitários e configurações que são acessados em diversas camadas.

- **Constantes**: Chaves de configuração e literais globais.
- **i18n**: Configurações de múltiplos idiomas.
- **Erros**: Estruturas de erro específicas do sistema.

### 5. Observabilidade (Regras de Fronteira)

A instrumentação de observabilidade deve estar estritamente contida na **Camada de Infraestrutura**.

#### Responsabilidades

- **Camada de Domínio**: nunca deve possuir dependências de telemetria ou bibliotecas externas como Prometheus.
- **Camada de Aplicação**: deve depender apenas de abstrações de telemetria, como `TelemetryPort`, para disparar métricas de negócio.
- **Camada de Infraestrutura**: implementa o adapter concreto e o registry, como `PrometheusTelemetry` e `PrometheusMetricsRegistry`.
- **Composition Root**: `main.ts` instancia o adapter de telemetria e injeta no bootstrap do servidor HTTP.

#### Categorias de métricas

- **Métricas de negócio**: disparadas pelos casos de uso após operações bem-sucedidas.
- **Métricas técnicas HTTP**: disparadas por hooks do Fastify, como `onRequest` e `onResponse`.
- **Endpoint de scrape**: exposto via `GET /metrics` e alimentado pelo registry do Prometheus.

#### Regras de labels e nomenclatura

- Priorizar labels de baixa cardinalidade.
- Labels técnicas permitidas: `method`, `route`, `status_code`.
- Nomes de métricas devem seguir convenção consistente, por exemplo:
  - contadores: `*_total`
  - histogramas: `*_seconds`

#### Fluxo esperado

`rota -> controller -> caso de uso -> porta de telemetria` para eventos de negócio  
`onRequest/onResponse -> PrometheusTelemetry -> registry` para métricas HTTP
