# Docker Integration via npm Scripts

## Overview

O projeto utiliza **Docker e Docker Compose** diretamente através dos scripts npm para gerenciar containers, instalação de dependências e orquestração de serviços.

## Scripts Docker Disponíveis

### 📦 Desenvolvimento (`compose.dev.yml`)

```bash
# Iniciar containers de desenvolvimento
npm run docker:dev

# Reconstruir imagem sem cache
npm run docker:devBuild

# Instalar dependências dentro do container
npm run docker:devDependencies

# Reiniciar containers
npm run docker:devRestart

# Parar containers
npm run docker:devDown
```

### 🏢 Produção (`compose.yml`)

```bash
# Subir containers de produção
npm run docker:prod

# Reconstruir imagens Docker
npm run docker:build

# Reiniciar containers
npm run docker:restart

# Parar containers
npm run docker:stop

# Derrubar containers e volumes
npm run docker:down

# Ver logs da API
npm run docker:logs
```

## Fluxo de Uso

### 1. Desenvolvimento com Docker

```bash
# Instalar dependências (primeira vez)
npm run docker:devDependencies

# Iniciar ambiente
npm run docker:dev

# Ver logs
npm run docker:logs

# Parar quando terminar
npm run docker:devDown
```

**O que acontece:**

- ✅ Container API (Dockerfile.dev) com Node.js
- ✅ Container MongoDB
- ✅ Volume compartilhado para hot-reload
- ✅ Network bridge para comunicação

### 2. Produção com Docker

```bash
# Build das imagens
npm run docker:build

# Subir todos os containers
npm run docker:prod

# Monitorar logs
npm run docker:logs

# Parar quando necessário
npm run docker:down
```

**O que acontece:**

- ✅ Container API (Dockerfile multi-stage otimizado)
- ✅ Container MongoDB
- ✅ Container Prometheus (métricas)
- ✅ Container Grafana (dashboards)
- ✅ Health checks em todos os serviços
- ✅ Restart automático
- ✅ Networks isoladas

## Dockerfile Prod (Multi-Stage)

### Build Stage

```dockerfile
FROM node:24.12-alpine AS builder
# Instala dependências
# Faz build do TypeScript
```

### Runtime Stage

```dockerfile
FROM node:24.12-alpine
# Copia apenas build + dependências prod
# Usuário não-root
# Health check HTTP
```

**Benefícios:**

- Imagem menor (apenas dependências prod)
- Segurança (usuário não-root)
- Health check integrado
- Build otimizado para cache

## Dockerfile Dev

```dockerfile
FROM node:24.12-alpine
# Instala todas as dependências
# Copia todo o código
# Executa npm run dev com hot-reload
```

**Características:**

- Volumes para hot-reload
- Ideal para desenvolvimento
- Build rápido

## Docker Compose Development

```yaml
services:
  sb_api_dev:
    build: deployment/docker/Dockerfile.dev
    volumes:
      - ../:/app # Hot-reload
    depends_on:
      sb_mongodb_dev:
        condition: service_healthy

  sb_mongodb_dev:
    image: mongo:7.0-jammy
    healthcheck: mongosh ping
```

**Recursos:**

- ✅ Hot-reload via volumes
- ✅ Health checks
- ✅ Service dependencies
- ✅ Network isolada

## Docker Compose Production

```yaml
services:
  sb_api:
    build: deployment/docker/Dockerfile
    healthcheck: HTTP /health

  sb_mongodb:
    image: mongo:7.0-jammy
    healthcheck: mongosh ping

  sb_prometheus:
    image: prom/prometheus:latest

  sb_grafana:
    image: grafana/grafana:latest
```

**Stack Completo:**

- API com health check
- MongoDB com health check
- Prometheus para métricas
- Grafana para visualização
- Volumes para persistência
- Restart automático

## Instalação de Dependências via Docker

### Primeira vez (com Docker)

```bash
npm run docker:devDependencies
```

Equivalente a:

```bash
docker compose --env-file .env -f deployment/compose.dev.yml run --rm sb_api_dev npm install
```

**Benefícios:**

- ✅ Sem poluir máquina local
- ✅ Compatibilidade garantida
- ✅ Isola ambiente
- ✅ Reproduzível em CI/CD

### Desenvolvimento normal

```bash
npm run docker:dev  # Sobe containers
npm run docker:logs # Ver logs
npm run docker:devDown # Parar
```

## Variáveis de Ambiente

O `.env` é passado automaticamente:

```bash
docker compose --env-file .env ...
```

**Arquivo `.env`:**

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://sb_mongodb_dev:27017/student-blogging
MONGO_INITDB_DATABASE=student-blogging
```

## Rede Docker (Networks)

### Development

```yaml
networks:
  student-blogging-dev-network:
    driver: bridge
```

### Production

```yaml
networks:
  student-blogging-network:
    driver: bridge
```

**Acesso entre containers:**

```
sb_api_dev → mongodb://sb_mongodb_dev:27017
sb_api → mongodb://sb_mongodb:27017
```

## Volumes Persistentes

### Development

```yaml
volumes:
  mongodb-dev-data: # Dados MongoDB
```

### Production

```yaml
volumes:
  mongodb_data: # Dados MongoDB
  mongodb_config: # Config MongoDB
  prometheus_data: # Métricas
  grafana_data: # Dashboards
```

## Health Checks

### API (Prod)

```yaml
healthcheck:
  test: ['CMD', 'node', '-e', "require('http').get('http://localhost:3000/health'...)"]
  interval: 30s
  timeout: 3s
  retries: 3
```

### MongoDB

```yaml
healthcheck:
  test: ['CMD', 'mongosh', '--eval', "db.adminCommand('ping')"]
  interval: 10s
  timeout: 5s
  retries: 5
```

**Garantem que:**

- ✅ API está respondendo
- ✅ MongoDB está pronto
- ✅ Services iniciam na ordem correta

## CI/CD Integration

O `.github/workflows/ci-cd.yml` usa Docker para:

```yaml
jobs:
  build-docker:
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: |
          docker build -f deployment/docker/Dockerfile -t student-blogging:latest .
```

## Checklist de Uso

- ✅ Primeiro setup: `npm run docker:devDependencies`
- ✅ Dev local: `npm run docker:dev`
- ✅ Logs: `npm run docker:logs`
- ✅ Parar: `npm run docker:devDown`
- ✅ Produção: `npm run docker:prod`
- ✅ Rebuild: `npm run docker:build`

## Troubleshooting

### Limpeza completa

```bash
npm run docker:down
docker system prune -a
npm run docker:dev
```

### Verificar status

```bash
docker ps  # Containers rodando
docker logs student-blogging-api-dev  # Logs específicos
```

### Reinstalar dependências

```bash
npm run docker:devBuild --no-cache
npm run docker:devDependencies
npm run docker:dev
```

---

**Status**: ✅ Docker totalmente integrado via npm scripts
**Cobertura**: Dev, Prod, CI/CD
**Automação**: Máxima (health checks, auto-restart, volumes)
