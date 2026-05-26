# Hệ thống đặt hàng Microservices (Order System)

Đây là một hệ thống đặt hàng trực tuyến được thiết kế theo kiến trúc Microservices hướng sự kiện (Event-Driven Architecture) với Spring Boot và Spring Cloud ở backend, cùng React và Next.js ở frontend.

## Kiến trúc hệ thống

Hệ thống bao gồm các dịch vụ sau:

- Gateway (apigateway): Cổng kết nối duy nhất, định tuyến các yêu cầu và xác thực JWT.
- User Service (userservice): Quản lý người dùng, đăng ký, đăng nhập và bảo mật.
- Product Service (productservice): Quản lý danh mục sản phẩm và kho hàng.
- Cart Service (cartservice): Dịch vụ giỏ hàng lưu trữ dữ liệu trên Redis cache.
- Order Service (orderservice): Logic đặt hàng và xử lý quy trình mua hàng.
- Payment Service (paymentservice): Giả lập và xử lý thanh toán đơn hàng, tích hợp SePay.
- Notification Service (notificationservice): Gửi thông báo về trạng thái đơn hàng.
- Shared Library (commonlib): Thư viện chứa các DTO, Exceptions, và Kafka Events dùng chung.

## Thiết kế kiến trúc và Tính năng nổi bật

### Kiến trúc Clean Architecture

Các dịch vụ backend trong hệ thống được thiết kế tuân thủ nghiêm ngặt các nguyên lý của Clean Architecture nhằm đảm bảo tách biệt rõ ràng các mối quan tâm (separation of concerns), độc lập cấu trúc mã nguồn, dễ viết unit test và bảo trì lâu dài:
- Domain Layer: Chứa các thực thể cốt lõi (entities) và các quy tắc nghiệp vụ cơ bản không phụ thuộc vào framework hay cơ sở dữ liệu bên ngoài.
- Application Layer: Chứa các ca sử dụng (use cases), định nghĩa các cổng giao tiếp (interfaces) và điều phối luồng logic nghiệp vụ chính của từng dịch vụ.
- Infrastructure Layer: Chứa triển khai cụ thể của các cổng giao tiếp (adapters) như tương tác cơ sở dữ liệu (Spring Data JPA), tích hợp dịch vụ bên ngoài, cấu hình Apache Kafka (producers/listeners) hay Redis.
- Web Layer: Định nghĩa các REST API Controller để tiếp nhận và phản hồi yêu cầu từ phía Client thông qua API Gateway.

### Tích hợp cổng thanh toán SePay

Hệ thống hỗ trợ thanh toán tự động qua cổng thanh toán SePay:
- Cung cấp API Webhook tại đường dẫn `/sepay` để tiếp nhận thông tin chuyển khoản từ SePay theo thời gian thực.
- Tự động phân tích nội dung chuyển khoản để trích xuất mã thanh toán (payment code).
- Xác thực tính hợp lệ của thông tin giao dịch, cập nhật trạng thái đơn hàng ngay lập tức và phát hành sự kiện Kafka để các dịch vụ liên quan cập nhật trạng thái tương ứng.

## Công nghệ sử dụng

- Ngôn ngữ: Java 17, JavaScript/TypeScript.
- Framework Backend: Spring Boot 3.5.0, Spring Cloud 2025.0.0, Spring Data JPA.
- Framework Frontend: React 19, Next.js 16.2, Tailwind CSS v4, Zustand.
- Cơ sở dữ liệu: PostgreSQL 15 (CSDL quan hệ), Redis 7.2 (InMemory cache).
- Hệ thống tin nhắn: Apache Kafka 7.6.0.
- Container hóa: Docker, Docker Compose.

## Port và các dịch vụ

Dưới đây là danh sách các cổng (port) mặc định:

- Gateway: 8080
- User Service: 8081
- Product Service: 8082
- Order Service: 8083
- Payment Service: 8084
- Cart Service: 8085
- Notification Service: 8086
- Frontend: 3000
- PostgreSQL: 5432
- Redis: 6380
- Kafka: 9092, 9094

## Hướng dẫn chạy hệ thống

### Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã được cài đặt sẵn:

- Java Development Kit (JDK) 17
- Node.js và npm
- Docker và Docker Compose
- Maven (để build mã nguồn Java)

### Bước 1: Build các dịch vụ backend

Sử dụng Makefile để tự động build tất cả microservices qua Maven:

```bash
make build
```

Hoặc sử dụng lệnh Maven truyền thống từ thư mục gốc:

```bash
mvn clean package -DskipTests
```

### Bước 2: Khởi chạy cơ sở hạ tầng và các microservices

```bash
docker-compose up -d
```

Cơ sở dữ liệu PostgreSQL sẽ tự động được khởi tạo thông qua tập tin init-databases.sql.

### Bước 3: Chạy frontend

Di chuyển vào thư mục frontend và khởi chạy môi trường phát triển (development):

```bash
cd frontend
npm install
npm run dev
```

Ứng dụng frontend sẽ chạy tại địa chỉ: http://localhost:3000

