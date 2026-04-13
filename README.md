# Ordering System — Microservice Demo

Hệ thống đặt hàng demo xây dựng theo kiến trúc microservice, mục đích học hỏi các công nghệ và pattern phổ biến trong thực tế.

---

## Tech Stack

| | Công nghệ |
|---|---|
| Framework | Spring Boot 3.2, Spring Cloud 2023 |
| API Gateway | Spring Cloud Gateway |
| Auth | Keycloak, OAuth2, JWT |
| Service Discovery | Eureka |
| Messaging | Apache Kafka |
| Database | PostgreSQL |
| Resilience | Resilience4j |
| Monitoring | Prometheus, Grafana, Zipkin |
| Container | Docker, Docker Compose |

---

## Kiến trúc

```
Client
  └── API Gateway :8080
        ├── Auth Service        (Keycloak wrapper)
        ├── User Service        (profile nghiệp vụ)
        ├── Product Service
        ├── Order Service
        ├── Payment Service
        └── Notification Service

Infrastructure:
  Keycloak · PostgreSQL · Kafka · Eureka
```

---

## Chạy project

```bash
# 1. Khởi động infrastructure
docker-compose up -d

# 2. Build
mvn clean package -DskipTests

# 3. Chạy từng service trong IDE
```

---

## Lộ trình phát triển

- [x] Phase 1 — Infrastructure (Docker Compose)
- [x] Phase 2 — API Gateway + Auth (Keycloak)
- [ ] Phase 3 — Business Services
- [ ] Phase 4 — Resilience & Service Discovery
- [ ] Phase 5 — Observability
- [ ] Phase 6 — CI/CD & Deploy
