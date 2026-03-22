# Student Blogging API

[![CI/CD Pipeline](https://github.com/roma-mb/student-blogging/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/roma-mb/student-blogging/actions)

Uma API moderna desenvolvida para uma plataforma de blog, utilizando Node.js, Fastify, TypeScript e MongoDB. O sistema segue os princípios de Clean Architecture (Arquitetura Limpa) em conjunto com Domain-Driven Design (DDD) para garantir modularidade, escalabilidade e manutenibilidade.

[Leia em Inglês (EN)](./README.md)

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Referência de Documentação](#referência-de-documentação)
- [Início Rápido](#início-rápido)
- [Licença](#licença)

## Funcionalidades

- Autenticação de usuário (Registro, Login, Logout) utilizando JWT e Argon2.
- Criação, leitura, atualização e exclusão de postagens no blog.
- Pesquisa de texto completo e paginação para postagens.
- Validação de entrada utilizando Zod.
- Suporte a internacionalização (i18n) para mensagens de erro.
- Testes abrangentes (Unidade e Integração) com Jest.
- Contêineres de aplicação completos utilizando Docker e Docker Compose.
- Integração contínua e implantação contínua (CI/CD).

## Tecnologias Utilizadas

- **Ambiente de Execução**: Node.js (>= 24.12.0)
- **Framework Web**: Fastify
- **Linguagem**: TypeScript
- **Banco de Dados**: MongoDB
- **Validação**: Zod
- **Testes**: Jest
- **Contêineres**: Docker e Docker Compose

## Referência de Documentação

Para informações mais detalhadas, consulte os documentos abaixo:

- [Arquitetura da Aplicação](./docs/ARCHITECTURE.pt-BR.md)
- [Documentação Detalhada e Guia da API](./docs/DOCUMENTATION.pt-BR.md)

## Início Rápido

### Pré-requisitos

- Node.js >= 24.12.0
- npm >= 11.6.0
- Docker e Docker Compose (para ambientes em contêineres)

### Instruções de Configuração

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/roma-mb/student-blogging.git
   cd student-blogging
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o ambiente:**
   Copie o arquivo de ambiente de exemplo e ajuste as variáveis de acordo com a sua configuração.

   ```bash
   cp .env.example .env
   ```

4. **Execute a aplicação (Modo de Desenvolvimento):**

   ```bash
   npm run dev
   ```

5. **Execute via Docker (Desenvolvimento):**
   ```bash
   npm run docker:dev
   ```

## Licença

Este projeto está licenciado sob a licença MIT.
