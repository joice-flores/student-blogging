# Documentação e Guia da API

[Leia em Inglês (EN)](./DOCUMENTATION.md)

Este documento fornece instruções técnicas para a API Student Blogging, incluindo diretrizes de configuração e referência da API.

## Configuração da Aplicação

### Ambiente Local

1. Certifique-se de que o Node.js (>= 24.12.0) está instalado.
2. Execute `npm install` para baixar as dependências.
3. Certifique-se de que uma instância do MongoDB está sendo executada localmente na porta configurada no arquivo `.env`.
4. Defina `ANTHROPIC_API_KEY` no `.env` com uma chave de API válida da Anthropic ([console.anthropic.com](https://console.anthropic.com)) — necessária para gerar planos de aula via Claude. `ANTHROPIC_MODEL` usa `claude-opus-5` como padrão se não for definida.
5. Execute `npm run dev` para iniciar o servidor Fastify em modo de observação.

### Ambiente Docker

O projeto fornece um ambiente de desenvolvimento isolado completo via Docker.

1. Execute `npm run docker:dev` para construir e iniciar os contêineres da API e do banco de dados.
2. Para parar, execute `npm run docker:dev:stop` ou `npm run docker:dev:down`.
3. Verifique os logs dos contêineres com `docker compose logs -f`.

### Testes

A suíte é configurada para usar o Jest.

- Testes de unidade: `npm run test:unit`
- Testes de integração: `npm run test:integration`

## Referência da API

**Collection do Postman**: [Acesse a Collection completa do Postman aqui](https://www.postman.com/rom-mb/workspace/student-blogging/collection/6885147-7cd33662-b7ed-49bd-bbc1-4e864adcb758?action=share&source=copy-link&creator=6885147).

### URL Base

A URL base local padrão é `http://localhost:3000`.

### 1. Saúde do Sistema (Health)

**Verificação de Saúde (Health Check)**

- **Endpoint**: `GET /health`
- **Descrição**: Verifica se a API está funcionando corretamente.

### 2. Autenticação

**Registro**

- **Endpoint**: `POST /auth/register`
- **Cabeçalhos**: `Content-Type: application/json`
- **Corpo**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }
  ```

**Login**

- **Endpoint**: `POST /auth/login`
- **Cabeçalhos**: `Content-Type: application/json`
- **Corpo**:
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Resposta**: Retorna o token de autenticação a ser enviado como cabeçalho Authorization em endpoints protegidos.

**Logout**

- **Endpoint**: `POST /auth/logout`
- **Cabeçalhos**: `Authorization: Bearer <token>`
- **Descrição**: Invalida a sessão atual.

### 3. Postagens

**Criar Postagem**

- **Endpoint**: `POST /posts`
- **Cabeçalhos**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Corpo**:
  ```json
  {
    "title": "Novo post sobre Node",
    "content": "Conteúdo do post de teste",
    "author": "Oliver Doe"
  }
  ```

**Listar Todas as Postagens**

- **Endpoint**: `GET /posts`
- **Cabeçalhos**: `Authorization: Bearer <token>`

**Pesquisar Postagens**

- **Endpoint**: `GET /posts/search?q=blog`
- **Cabeçalhos**: `Authorization: Bearer <token>`
- **Parâmetros de Consulta**: `q` (String de busca)

### 4. Planos de Aula (gerados por IA)

**Gerar Plano de Aula**

- **Endpoint**: `POST /lesson-plans/generate`
- **Cabeçalhos**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (role `teacher` ou `admin`)
- **Corpo**:
  ```json
  {
    "subject": "História",
    "grade": "7º ano do Ensino Fundamental",
    "theme": "Descobrimento do Brasil"
  }
  ```
- **Descrição**: Gera um plano de aula estruturado (objetivos, conteúdo, metodologia, cronograma, avaliação, recursos) usando a API do Claude e salva para o professor solicitante. Requer `ANTHROPIC_API_KEY` configurada — veja [Ambiente Local](#ambiente-local).
