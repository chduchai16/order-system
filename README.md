# Ordering System — Microservice Demo

Hệ thống đặt hàng demo xây dựng theo kiến trúc microservice, mục đích học hỏi các công nghệ và pattern phổ biến trong thực tế.

---

## Tech Stack

| | Công nghệ |
|---|---|
| Framework | Spring Boot 3.5.0, Spring Cloud 2025.0.0 |
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
        ├── User Service (with Auth)  
        │   ├── Authentication (Keycloak wrapper)
        │   └── User Management (PostgreSQL)
        ├── Product Service
        ├── Order Service
        ├── Payment Service
        └── Discovery Server

Infrastructure:
  Keycloak · PostgreSQL · Kafka · Eureka
```

---

## Services

| Service | Port | Chức năng |
|---------|------|----------|
| API Gateway | 8080 | Routing, Load Balancing |
| **User Service** | 8081 | **Auth + User Management** |
| Product Service | 8082 | Quản lý sản phẩm |
| Order Service | 8083 | Quản lý đơn hàng |
| Payment Service | 8084 | Xử lý thanh toán |
| Discovery Server | 8061 | Service Discovery (Eureka) |
| Keycloak | 9090 | Identity Provider |
| PostgreSQL | 5432 | Database |
| Kafka | 9092 | Message Broker |

---

## User Service - Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Làm mới access token
- `POST /api/auth/logout` - Đăng xuất

### User Management
- `GET /api/users` - Danh sách users
- `GET /api/users/{id}` - Lấy user theo ID
- `GET /api/users/keycloak/{keycloakId}` - Lấy user theo Keycloak ID

---

## Chạy project

### Prerequisites
- Docker & Docker Compose
- Java 17+
- Maven 3.9+

### Steps

```bash
# 1. Clone & navigate
cd d:\Java\order-system

# 2. Khởi động infrastructure (Postgres, Kafka, Keycloak, Eureka)
docker-compose up -d

# 3. Build all services
mvn clean package -DskipTests

# 4. Run services (IDE hoặc terminal)
# Backend: mỗi service chạy trên port riêng (8080-8084)
# Frontend: npm run dev (port 3000)

# 5. Kiểm tra services
# - API Gateway: http://localhost:8080
# - User Service (Auth): http://localhost:8081/api/auth/*
# - Keycloak: http://localhost:9090 (admin/admin)
# - Eureka: http://localhost:8061
```

---

## Lộ trình phát triển

- [x] Phase 1 — Infrastructure (Docker Compose)
- [x] Phase 2 — API Gateway + Auth
- [x] Phase 2.1 — **Merge Auth Service → User Service** (Consolidation)
- [ ] Phase 3 — Business Services
- [ ] Phase 4 — Resilience & Service Discovery
- [ ] Phase 5 — Observability (Prometheus, Grafana, Zipkin)
- [ ] Phase 6 — CI/CD & Deploy

---

## Kiến trúc Messaging

**User Registration Flow:**
```
1. Client → POST /api/auth/register
   ↓
2. User Service → Keycloak (create user)
   ↓
3. User Service → Kafka (publish UserRegisteredIntegrationEvent)
   ↓
4. Other Services (listening) ← consume event
```

---

## Cấu trúc Project

```
order-system/
├── commonlib/              # Shared libraries & events
├── apigateway/             # Spring Cloud Gateway
├── userservice/            # User + Auth (merged)
│   ├── auth/
│   │   ├── controller/     # AuthController
│   │   ├── service/        # AuthService, KeycloakService
│   │   ├── dto/            # LoginRequest, RegisterRequest, TokenResponse
│   │   ├── producers/      # UserEventProducer (Kafka)
│   │   └── event/
│   └── user/
│       ├── controller/     # UserController
│       ├── service/        # UserService
│       ├── entities/       # User entity
│       ├── listeners/      # UserRegistrationEventListener (Kafka)
│       └── repositories/   # UserRepository
├── productservice/         # Product management
├── orderservice/           # Order management
├── paymentservice/         # Payment processing
├── discoveryserver/        # Eureka
├── frontend/               # Next.js React app
├── docker-compose.yml      # Infrastructure
└── Makefile               # Build commands
```
