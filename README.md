# Ordering System — Microservice Demo

Hệ thống đặt hàng demo xây dựng theo kiến trúc microservice, mục đích học hỏi các công nghệ và pattern phổ biến trong thực tế.

---

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.5.0, Spring Cloud 2025.0.0 |
| API Gateway | Spring Cloud Gateway |
| Auth | Keycloak, OAuth2, JWT |
| Service Discovery | Eureka |
| Messaging | Apache Kafka |
| Database | PostgreSQL |
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

## Key API Endpoints

### User & Auth Service
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập & nhận JWT Token
- `GET /api/users/me` - Lấy thông tin user hiện tại

### Product Service
- `GET /api/products` - Danh sách sản phẩm (hỗ trợ lọc theo category)
- `GET /api/products/{id}` - Chi tiết sản phẩm
- `GET /api/categories` - Danh sách danh mục sản phẩm

### Order Service
- `POST /api/orders` - Đặt hàng (Saga Orchestration)
- `GET /api/orders` - Lịch sử đơn hàng của người dùng
- `GET /api/orders/{id}` - Chi tiết trạng thái đơn hàng

### Payment Service
- `GET /api/payments/order/{orderId}` - Kiểm tra trạng thái thanh toán của đơn hàng

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

## Kiến trúc & Pattern
Hệ thống được thiết kế theo các nguyên tắc hiện đại để đảm bảo khả năng mở rộng và bảo trì:
- **Clean Architecture & DDD**: Tách biệt rõ ràng các lớp Domain, Application, Infrastructure. Sử dụng mô hình Port-Adapter.
- **Saga Pattern (Orchestration)**: Quản lý giao dịch phân tán giữa các service Order, Inventory và Payment.
- **Database per Service**: Mỗi service sở hữu database riêng để đảm bảo tính độc lập.
