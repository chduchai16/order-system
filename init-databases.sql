-- ================================
-- CREATE DATABASES
-- ================================
CREATE DATABASE user_db;
CREATE DATABASE product_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE keycloak_db;
CREATE DATABASE notification_db;


-- ================================================================
-- PRODUCT SERVICE SCHEMA & SEED DATA
-- ================================================================
\c product_db;

-- ---- DDL ----
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    description TEXT,
    price DECIMAL(19, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    reserved_stock INTEGER NOT NULL DEFAULT 0,
    version BIGINT DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    sku_code VARCHAR(100) UNIQUE,
    name VARCHAR(255),
    price DECIMAL(19, 2),
    total_stock INTEGER DEFAULT 0,
    reserved_stock INTEGER DEFAULT 0,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_attributes (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255),
    value VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    variant_id BIGINT,
    quantity INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ---- SEED: Categories ----
INSERT INTO categories (name, description) VALUES
    ('Điện thoại', 'Điện thoại thông minh các loại'),
    ('Laptop', 'Máy tính xách tay'),
    ('Phụ kiện', 'Phụ kiện điện tử'),
    ('Máy tính bảng', 'Tablet và iPad'),
    ('Đồng hồ thông minh', 'Smartwatch và fitness tracker'),
    ('Âm thanh', 'Loa, tai nghe các loại'),
    ('Thiết bị mạng', 'Router, switch, modem'),
    ('Màn hình', 'Màn hình máy tính'),
    ('Bàn phím & Chuột', 'Thiết bị ngoại vi'),
    ('Ổ cứng & Lưu trữ', 'SSD, HDD, USB');

-- ---- SEED: Products (10 sản phẩm cố định) ----
INSERT INTO products (sku, name, category_id, description, price, stock, reserved_stock, version, active, created_at, updated_at) VALUES
    ('IPHONE-15-PRO', 'iPhone 15 Pro 256GB', 1, 'iPhone 15 Pro chip A17 Pro, màu Titan Tự Nhiên', 29990000, 150, 5, 0, true, NOW(), NOW()),
    ('SAMSUNG-S24U', 'Samsung Galaxy S24 Ultra', 1, 'Samsung S24 Ultra màn hình 6.8 inch AMOLED', 31990000, 80, 2, 0, true, NOW(), NOW()),
    ('MACBOOK-M3-PRO', 'MacBook Pro M3 14 inch', 2, 'MacBook Pro chip M3, RAM 18GB, SSD 512GB', 52990000, 40, 0, 0, true, NOW(), NOW()),
    ('DELL-XPS-15', 'Dell XPS 15 OLED', 2, 'Dell XPS 15 Intel Core i9, RTX 4060', 45990000, 25, 1, 0, true, NOW(), NOW()),
    ('AIRPODS-PRO2', 'Apple AirPods Pro (2nd Gen)', 3, 'Tai nghe chống ồn chủ động ANC', 6490000, 200, 10, 0, true, NOW(), NOW()),
    ('IPAD-PRO-M4', 'iPad Pro M4 11 inch', 4, 'iPad Pro chip M4, màn hình Nano-texture', 23990000, 60, 3, 0, true, NOW(), NOW()),
    ('WATCH-ULTRA2', 'Apple Watch Ultra 2', 5, 'Đồng hồ thông minh cao cấp cho hoạt động ngoài trời', 21990000, 35, 0, 0, true, NOW(), NOW()),
    ('SONY-WH1000XM5', 'Sony WH-1000XM5', 6, 'Tai nghe over-ear chống ồn tốt nhất thị trường', 8490000, 120, 4, 0, true, NOW(), NOW()),
    ('ASUS-ROG-SWIFT', 'ASUS ROG Swift 27" 165Hz', 8, 'Màn hình gaming QHD 165Hz 1ms', 10990000, 45, 2, 0, true, NOW(), NOW()),
    ('SAMSUNG-990PRO', 'Samsung 990 Pro SSD 1TB', 10, 'NVMe PCIe Gen4 SSD tốc độ cao 7450MB/s', 3290000, 300, 15, 0, true, NOW(), NOW());

-- ---- SEED: Product Variants ----
INSERT INTO product_variants (sku_code, name, price, total_stock, reserved_stock, product_id) VALUES
    ('IPHONE-15-PRO-128', 'iPhone 15 Pro 128GB Titan Đen', 27990000, 50, 2, 1),
    ('IPHONE-15-PRO-512', 'iPhone 15 Pro 512GB Titan Trắng', 34990000, 30, 0, 1),
    ('SAMSUNG-S24U-256', 'Samsung S24 Ultra 256GB Đen Titanium', 31990000, 40, 1, 2),
    ('SAMSUNG-S24U-512', 'Samsung S24 Ultra 512GB Xám Titanium', 35990000, 20, 0, 2),
    ('MACBOOK-M3-512', 'MacBook Pro M3 14" 512GB Bạc', 52990000, 20, 0, 3),
    ('MACBOOK-M3-1T', 'MacBook Pro M3 14" 1TB Đen Không Gian', 62990000, 10, 0, 3);

-- ---- SEED: Product Attributes ----
INSERT INTO product_attributes (product_id, name, value) VALUES
    (1, 'Màu sắc', 'Titan Tự Nhiên'),
    (1, 'Chip', 'A17 Pro'),
    (1, 'Hệ điều hành', 'iOS 17'),
    (2, 'Màu sắc', 'Đen Titanium'),
    (2, 'Chip', 'Snapdragon 8 Gen 3'),
    (3, 'Chip', 'Apple M3'),
    (3, 'RAM', '18GB'),
    (4, 'CPU', 'Intel Core i9-13900H'),
    (4, 'GPU', 'NVIDIA RTX 4060');

-- ---- SEED: Stock Movements ----
INSERT INTO stock_movements (product_id, variant_id, quantity, type, reason, created_at) VALUES
    (1, 1, 50, 'IMPORT', 'Nhập kho lần đầu iPhone 15 Pro', NOW() - INTERVAL '30 days'),
    (1, NULL, 5, 'RESERVE', 'Giữ chỗ đơn hàng ORD-001', NOW() - INTERVAL '2 days'),
    (2, NULL, 80, 'IMPORT', 'Nhập kho Samsung S24 Ultra', NOW() - INTERVAL '25 days'),
    (3, NULL, 40, 'IMPORT', 'Nhập kho MacBook M3', NOW() - INTERVAL '20 days'),
    (5, NULL, 200, 'IMPORT', 'Nhập kho AirPods Pro 2', NOW() - INTERVAL '15 days'),
    (5, NULL, 10, 'RESERVE', 'Giữ chỗ đơn hàng ORD-002', NOW() - INTERVAL '1 day'),
    (10, NULL, 300, 'IMPORT', 'Nhập kho SSD Samsung 990 Pro', NOW() - INTERVAL '10 days'),
    (10, NULL, 15, 'RESERVE', 'Giữ chỗ đợt sale cuối tuần', NOW() - INTERVAL '3 hours');


-- ================================================================
-- USER SERVICE SCHEMA & SEED DATA
-- ================================================================
\c user_db;

-- ---- DDL ----
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    keycloak_id VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_addresses (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100),
    street VARCHAR(500),
    city VARCHAR(100),
    district VARCHAR(100),
    country VARCHAR(100),
    is_default BOOLEAN DEFAULT false,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_wishlists (
    id SERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255),
    added_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- ---- SEED: Users ----
INSERT INTO users (keycloak_id, username, email, first_name, last_name, active, created_at, updated_at) VALUES
    ('kc-uuid-user-001', 'nguyen.van.an', 'an.nguyen@gmail.com', 'Nguyễn', 'Văn An', true, NOW(), NOW()),
    ('kc-uuid-user-002', 'tran.thi.binh', 'binh.tran@gmail.com', 'Trần', 'Thị Bình', true, NOW(), NOW()),
    ('kc-uuid-user-003', 'le.quoc.cuong', 'cuong.le@gmail.com', 'Lê', 'Quốc Cường', true, NOW(), NOW()),
    ('kc-uuid-user-004', 'pham.hoang.dung', 'dung.pham@outlook.com', 'Phạm', 'Hoàng Dũng', true, NOW(), NOW()),
    ('kc-uuid-user-005', 'vo.thi.em', 'em.vo@gmail.com', 'Võ', 'Thị Em', true, NOW(), NOW());

-- ---- SEED: User Addresses ----
INSERT INTO user_addresses (label, street, city, district, country, is_default, user_id) VALUES
    ('Nhà riêng', '123 Nguyễn Huệ', 'Hồ Chí Minh', 'Quận 1', 'Việt Nam', true, 1),
    ('Công ty', '456 Lê Lợi', 'Hồ Chí Minh', 'Quận 3', 'Việt Nam', false, 1),
    ('Nhà riêng', '789 Đinh Tiên Hoàng', 'Hà Nội', 'Hoàn Kiếm', 'Việt Nam', true, 2),
    ('Nhà riêng', '10 Trần Phú', 'Đà Nẵng', 'Hải Châu', 'Việt Nam', true, 3),
    ('Nhà riêng', '55 Hùng Vương', 'Cần Thơ', 'Ninh Kiều', 'Việt Nam', true, 4),
    ('Căn hộ', '200 Nguyễn Văn Linh', 'Hồ Chí Minh', 'Quận 7', 'Việt Nam', true, 5);

-- ---- SEED: User Wishlists ----
INSERT INTO user_wishlists (product_id, product_name, added_at, user_id) VALUES
    (1, 'iPhone 15 Pro 256GB', NOW() - INTERVAL '5 days', 1),
    (3, 'MacBook Pro M3 14 inch', NOW() - INTERVAL '3 days', 1),
    (2, 'Samsung Galaxy S24 Ultra', NOW() - INTERVAL '10 days', 2),
    (5, 'Apple AirPods Pro (2nd Gen)', NOW() - INTERVAL '7 days', 2),
    (7, 'Apple Watch Ultra 2', NOW() - INTERVAL '2 days', 3),
    (6, 'iPad Pro M4 11 inch', NOW() - INTERVAL '1 day', 4),
    (8, 'Sony WH-1000XM5', NOW() - INTERVAL '4 days', 5);


-- ================================================================
-- ORDER SERVICE SCHEMA & SEED DATA
-- ================================================================
\c order_db;

-- ---- DDL ----
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    keycloak_id VARCHAR(255) NOT NULL,
    total_price DECIMAL(19, 2) NOT NULL,
    shipping_street VARCHAR(500),
    shipping_city VARCHAR(100),
    shipping_district VARCHAR(100),
    shipping_country VARCHAR(100),
    shipping_carrier VARCHAR(100),
    tracking_number VARCHAR(100),
    shipping_fee DECIMAL(19, 2),
    estimated_delivery VARCHAR(100),
    discount_code VARCHAR(50),
    discount_amount DECIMAL(19, 2),
    tax_amount DECIMAL(19, 2),
    tax_type VARCHAR(50),
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(19, 2) NOT NULL,
    tax_amount DECIMAL(19, 2),
    discount_amount DECIMAL(19, 2)
);

CREATE TABLE IF NOT EXISTS order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    reason VARCHAR(500),
    changed_at TIMESTAMP NOT NULL
);

-- ---- SEED: Orders ----
INSERT INTO orders (order_number, user_id, keycloak_id, total_price, shipping_street, shipping_city, shipping_district, shipping_country, shipping_carrier, tracking_number, shipping_fee, estimated_delivery, discount_code, discount_amount, tax_amount, tax_type, status, created_at, updated_at) VALUES
    ('ORD-20240501-001', 1, 'kc-uuid-user-001', 36480000, '123 Nguyễn Huệ', 'Hồ Chí Minh', 'Quận 1', 'Việt Nam', 'GHN', 'GHN-TRK-001', 30000, '2024-05-05', 'SALE10', 3000000, 1650000, 'VAT10', 'DELIVERED', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
    ('ORD-20240502-002', 2, 'kc-uuid-user-002', 8490000, '789 Đinh Tiên Hoàng', 'Hà Nội', 'Hoàn Kiếm', 'Việt Nam', 'GHTK', 'GHTK-TRK-002', 25000, '2024-05-07', NULL, 0, 849000, 'VAT10', 'PAID', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
    ('ORD-20240503-003', 3, 'kc-uuid-user-003', 31990000, '10 Trần Phú', 'Đà Nẵng', 'Hải Châu', 'Việt Nam', NULL, NULL, NULL, NULL, NULL, 0, 2909000, 'VAT10', 'PENDING', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    ('ORD-20240504-004', 1, 'kc-uuid-user-001', 52990000, '123 Nguyễn Huệ', 'Hồ Chí Minh', 'Quận 1', 'Việt Nam', 'VNPost', 'VNPOST-TRK-004', 50000, '2024-05-10', NULL, 0, 4817000, 'VAT10', 'SHIPPING', NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day'),
    ('ORD-20240505-005', 4, 'kc-uuid-user-004', 6490000, '55 Hùng Vương', 'Cần Thơ', 'Ninh Kiều', 'Việt Nam', 'GHN', 'GHN-TRK-005', 20000, '2024-05-08', 'FREESHIP', 0, 590000, 'VAT10', 'CANCELLED', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days');

-- ---- SEED: Order Items ----
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, tax_amount, discount_amount) VALUES
    (1, 1, 'iPhone 15 Pro 256GB', 1, 29990000, 2999000, 3000000),
    (1, 5, 'Apple AirPods Pro (2nd Gen)', 1, 6490000, 649000, 0),
    (2, 8, 'Sony WH-1000XM5', 1, 8490000, 849000, 0),
    (3, 2, 'Samsung Galaxy S24 Ultra', 1, 31990000, 3199000, 0),
    (4, 3, 'MacBook Pro M3 14 inch', 1, 52990000, 5299000, 0),
    (5, 5, 'Apple AirPods Pro (2nd Gen)', 1, 6490000, 649000, 0);

-- ---- SEED: Order Status History ----
INSERT INTO order_status_history (order_id, from_status, to_status, reason, changed_at) VALUES
    (1, NULL, 'PENDING', 'Đơn hàng được tạo tự động từ giỏ hàng', NOW() - INTERVAL '10 days'),
    (1, 'PENDING', 'PAID', 'Thanh toán VNPay thành công', NOW() - INTERVAL '10 days' + INTERVAL '5 minutes'),
    (1, 'PAID', 'SHIPPING', 'Đã bàn giao cho đơn vị vận chuyển GHN', NOW() - INTERVAL '8 days'),
    (1, 'SHIPPING', 'DELIVERED', 'Giao hàng thành công', NOW() - INTERVAL '5 days'),
    (2, NULL, 'PENDING', 'Đơn hàng được tạo từ checkout', NOW() - INTERVAL '3 days'),
    (2, 'PENDING', 'PAID', 'Thanh toán Momo thành công', NOW() - INTERVAL '3 days' + INTERVAL '3 minutes'),
    (3, NULL, 'PENDING', 'Đơn hàng chờ xử lý', NOW() - INTERVAL '1 day'),
    (4, NULL, 'PENDING', 'Đơn hàng được tạo', NOW() - INTERVAL '4 days'),
    (4, 'PENDING', 'PAID', 'Thanh toán VNPAY thành công', NOW() - INTERVAL '4 days' + INTERVAL '2 minutes'),
    (4, 'PAID', 'SHIPPING', 'Giao cho VNPost', NOW() - INTERVAL '2 days'),
    (5, NULL, 'PENDING', 'Đơn hàng được tạo', NOW() - INTERVAL '6 days'),
    (5, 'PENDING', 'CANCELLED', 'Khách hàng huỷ đơn', NOW() - INTERVAL '5 days');


-- ================================================================
-- PAYMENT SERVICE SCHEMA & SEED DATA
-- ================================================================
\c payment_db;

-- ---- DDL ----
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    keycloak_id VARCHAR(255) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL,
    processed_at TIMESTAMP,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    order_id BIGINT,
    transaction_id VARCHAR(255),
    gateway_provider VARCHAR(100),
    raw_response TEXT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ---- SEED: Payments ----
INSERT INTO payments (order_id, user_id, keycloak_id, amount, payment_method, status, processed_at, created_at) VALUES
    (1, 1, 'kc-uuid-user-001', 36480000, 'BANK_TRANSFER', 'COMPLETED', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    (2, 2, 'kc-uuid-user-002', 8490000, 'MOMO', 'COMPLETED', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    (3, 3, 'kc-uuid-user-003', 31990000, 'CASH_ON_DELIVERY', 'PENDING', NULL, NOW() - INTERVAL '1 day'),
    (4, 1, 'kc-uuid-user-001', 52990000, 'BANK_TRANSFER', 'COMPLETED', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    (5, 4, 'kc-uuid-user-004', 6490000, 'MOMO', 'REFUNDED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 days');

-- ---- SEED: Payment Transactions ----
INSERT INTO payment_transactions (order_id, transaction_id, gateway_provider, raw_response, status, created_at) VALUES
    (1, 'VNPAY-TXN-00000001', 'VNPay', '{"vnp_ResponseCode":"00","vnp_TransactionStatus":"00","vnp_Amount":"3648000000"}', 'SUCCESS', NOW() - INTERVAL '10 days'),
    (2, 'MOMO-TXN-00000002', 'MoMo', '{"resultCode":0,"message":"Thành công","transId":"MOMO-3192837"}', 'SUCCESS', NOW() - INTERVAL '3 days'),
    (4, 'VNPAY-TXN-00000004', 'VNPay', '{"vnp_ResponseCode":"00","vnp_TransactionStatus":"00","vnp_Amount":"5299000000"}', 'SUCCESS', NOW() - INTERVAL '4 days'),
    (5, 'MOMO-TXN-00000005', 'MoMo', '{"resultCode":0,"message":"Hoàn tiền thành công","transId":"MOMO-9876543"}', 'REFUNDED', NOW() - INTERVAL '5 days'),
    (3, NULL, 'InternalMock', '{"status":"pending","method":"COD"}', 'PENDING', NOW() - INTERVAL '1 day');


-- ================================================================
-- NOTIFICATION SERVICE SCHEMA & SEED DATA
-- ================================================================
\c notification_db;

-- ---- DDL ----
CREATE TABLE IF NOT EXISTS notification_logs (
    id SERIAL PRIMARY KEY,
    user_id BIGINT,
    recipient VARCHAR(255),
    subject VARCHAR(500),
    content TEXT,
    status VARCHAR(20),
    sent_at TIMESTAMP DEFAULT NOW()
);

-- ---- SEED: Notification Logs ----
INSERT INTO notification_logs (user_id, recipient, subject, content, status, sent_at) VALUES
    (1, 'an.nguyen@gmail.com', 'Xác nhận đơn hàng ORD-20240501-001', 'Cảm ơn bạn đã đặt hàng! Đơn hàng ORD-20240501-001 đã được xác nhận.', 'SENT', NOW() - INTERVAL '10 days'),
    (1, 'an.nguyen@gmail.com', 'Đơn hàng ORD-20240501-001 đang được giao', 'Đơn hàng của bạn đã được bàn giao cho GHN. Mã tracking: GHN-TRK-001', 'SENT', NOW() - INTERVAL '8 days'),
    (1, 'an.nguyen@gmail.com', 'Giao hàng thành công - ORD-20240501-001', 'Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm tại chúng tôi!', 'SENT', NOW() - INTERVAL '5 days'),
    (2, 'binh.tran@gmail.com', 'Xác nhận đơn hàng ORD-20240502-002', 'Đơn hàng ORD-20240502-002 của bạn đã được xác nhận và đang được chuẩn bị.', 'SENT', NOW() - INTERVAL '3 days'),
    (4, 'dung.pham@outlook.com', 'Huỷ đơn hàng ORD-20240505-005', 'Đơn hàng ORD-20240505-005 đã được huỷ theo yêu cầu của bạn. Hoàn tiền sẽ được xử lý trong 3-5 ngày.', 'SENT', NOW() - INTERVAL '5 days'),
    (3, 'cuong.le@gmail.com', 'Xác nhận đơn hàng ORD-20240503-003', 'Đơn hàng ORD-20240503-003 đã được tiếp nhận và đang chờ xử lý.', 'SENT', NOW() - INTERVAL '1 day'),
    (5, 'em.vo@gmail.com', 'Chào mừng bạn đến với hệ thống', 'Tài khoản của bạn đã được tạo thành công. Hãy bắt đầu mua sắm!', 'SENT', NOW() - INTERVAL '30 days'),
    (2, 'binh.tran@gmail.com', 'Lỗi kết nối gateway thanh toán', 'Không thể kết nối cổng thanh toán. Vui lòng thử lại.', 'FAILED', NOW() - INTERVAL '7 days');
