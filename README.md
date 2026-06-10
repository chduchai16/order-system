# Hệ thống đặt hàng Microservices (Order System)

Đây là hệ thống đặt hàng trực tuyến được thiết kế theo kiến trúc microservices hướng sự kiện, sử dụng Spring Boot và Spring Cloud ở backend, Next.js ở frontend.

## Các thành phần chính

- `apigateway`: Cổng vào duy nhất, định tuyến request và xử lý JWT.
- `userservice`: Đăng ký, đăng nhập, thông tin người dùng.
- `productservice`: Danh mục sản phẩm và tồn kho.
- `cartservice`: Giỏ hàng, lưu trên Redis.
- `orderservice`: Xử lý đặt hàng.
- `paymentservice`: Thanh toán và webhook SePay.
- `mediaservice`: Module media mới, đã được thêm vào Maven reactor để build cùng backend.
- `commonlib`: DTO, event và thành phần dùng chung.
- `frontend`: Giao diện Next.js.

## Trạng thái hiện tại

- `notificationservice` đã bị loại bỏ khỏi repo.
- `mediaservice` đã có trong Maven modules.
- `mediaservice` chưa được khai báo runtime trong `docker-compose.yml`.

## Công nghệ

- Java 17
- Spring Boot 3.5.0
- Spring Cloud 2025.0.0
- PostgreSQL 15
- Redis 7.2
- Apache Kafka 7.6.0
- React 19
- Next.js 16
- Tailwind CSS v4

## DB Schema

Các sơ đồ dưới đây mô tả các bảng chính đang được khởi tạo trong `init-databases.sql`, tách riêng theo từng service để dễ đọc hơn trên GitHub.

### User Service (`user_db`)

```mermaid
erDiagram
    ROLES ||--o{ USERS : has
    USERS ||--o{ USER_ADDRESSES : owns
    USERS ||--o{ USER_WISHLISTS : saves
    USERS ||--o{ REFRESH_TOKENS : receives

    ROLES {
        int id
        string name
    }

    USERS {
        int id
        string username
        string email
        int role_id
        boolean active
    }

    USER_ADDRESSES {
        int id
        int user_id
        string label
        string city
        string district
        boolean is_default
    }

    USER_WISHLISTS {
        int id
        int user_id
        bigint product_id
        string product_name
    }

    REFRESH_TOKENS {
        int id
        int user_id
        string token_hash
        timestamp expires_at
        boolean revoked
    }
```

### Product Service (`product_db`)

```mermaid
erDiagram
    CATEGORIES ||--o{ PRODUCTS : groups
    PRODUCTS ||--o{ PRODUCT_VARIANTS : has
    PRODUCTS ||--o{ PRODUCT_ATTRIBUTES : describes
    PRODUCTS ||--o{ STOCK_MOVEMENTS : tracks

    CATEGORIES {
        int id
        string name
        string description
    }

    PRODUCTS {
        int id
        string sku
        string name
        int category_id
        decimal price
        int stock
        int reserved_stock
        boolean active
    }

    PRODUCT_VARIANTS {
        int id
        int product_id
        string sku_code
        string name
        decimal price
        int total_stock
    }

    PRODUCT_ATTRIBUTES {
        int product_id
        string name
        string value
    }

    STOCK_MOVEMENTS {
        int id
        bigint product_id
        bigint variant_id
        int quantity
        string type
    }
```

### Order Service (`order_db`)

```mermaid
erDiagram
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ ORDER_STATUS_HISTORY : logs
    VOUCHERS ||--o{ VOUCHER_CONDITIONS : defines
    VOUCHERS ||--o{ VOUCHER_USAGES : records

    ORDERS {
        int id
        string order_number
        bigint user_id
        decimal total_price
        string status
        bigint voucher_id
        string voucher_code
    }

    ORDER_ITEMS {
        int id
        int order_id
        bigint product_id
        string product_name
        int quantity
        decimal unit_price
    }

    ORDER_STATUS_HISTORY {
        int id
        int order_id
        string from_status
        string to_status
        timestamp changed_at
    }

    VOUCHERS {
        int id
        string code
        string discount_type
        decimal discount_value
        boolean is_active
    }

    VOUCHER_CONDITIONS {
        int id
        bigint voucher_id
        string condition_type
        string value
    }

    VOUCHER_USAGES {
        int id
        bigint voucher_id
        bigint user_id
        bigint order_id
        decimal discount_amount
    }
```

### Payment Service (`payment_db`)

```mermaid
erDiagram
    PAYMENTS ||--o{ PAYMENT_TRANSACTIONS : logs

    PAYMENTS {
        bigint order_id
        bigint user_id
        string payment_code
        decimal amount
        string payment_method
        string status
    }

    PAYMENT_TRANSACTIONS {
        bigint order_id
        string transaction_id
        string gateway_provider
        string status
    }
```

### Media Service

`mediaservice` đã có module Maven nhưng hiện chưa có schema database trong `init-databases.sql`.

## Port mặc định trong docker-compose

- `apigateway`: `8080`
- `userservice`: `8081`
- `productservice`: `8082`
- `orderservice`: `8083`
- `paymentservice`: `8084`
- `cartservice`: `8085`
- `frontend`: `3000`
- `postgres`: `5432`
- `redis`: `6380`
- `kafka`: `9092`, `9094`

Lưu ý:

- `mediaservice` hiện chưa có port/runtime trong `docker-compose.yml`.

## Build backend

```bash
mvn clean package -DskipTests
```

Hoặc build riêng `mediaservice` cùng dependency:

```bash
mvn -pl mediaservice -am -DskipTests validate
```

## Chạy bằng Docker Compose

```bash
docker compose up -d
```

PostgreSQL được khởi tạo bằng `init-databases.sql`.

## Chạy frontend local

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định chạy tại `http://localhost:3000`.
