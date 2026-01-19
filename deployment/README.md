# Deployment - Student Blogging API

## 🚀 Como Executar

### Produção
```bash
cd deployment
docker-compose up -d
```

### Desenvolvimento
```bash
cd deployment
docker-compose -f docker-compose.dev.yml up
```

## 📊 Serviços

| Serviço | URL | Porta |
|---------|-----|-------|
| API | http://localhost:3000 | 3000 |
| Swagger | http://localhost:3000/docs | 3000 |
| MongoDB | mongodb://localhost:27017 | 27017 |
| Prometheus | http://localhost:9090 | 9090 |
| Grafana | http://localhost:3001 | 3001 |

### Credenciais Grafana
- Usuário: `admin`
- Senha: `admin123`

## 🛠️ Comandos Úteis
```bash
# Ver logs
docker-compose logs -f sb_api

# Parar serviços
docker-compose down

# Rebuild
docker-compose build --no-cache

# Limpar volumes
docker-compose down -v
```