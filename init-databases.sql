-- ================================
-- CREATE DATABASES
-- ================================
CREATE DATABASE user_db;
CREATE DATABASE product_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE media_db;

-- ================================================================
-- PRODUCT SERVICE SCHEMA & SEED DATA
-- ================================================================
\c product_db;

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

CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    media_id BIGINT NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    variant_id INTEGER,
    quantity INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categories are flat, no tree structure.
INSERT INTO categories (name, description) VALUES
    ('Food - Bakery', 'Bread, cakes and baked goods'),
    ('Food - Drinks', 'Coffee, tea and beverage products'),
    ('Food - Pantry', 'Kitchen and pantry staples'),
    ('Food - Snacks', 'Snack items and quick bites'),
    ('Craft - Jewelry', 'Handmade jewelry and accessories'),
    ('Craft - Home Decor', 'Decorative handmade home goods'),
    ('Craft - Accessories', 'Bags, scarves and wearable crafts'),
    ('Craft - Stationery', 'Journals, notebooks and paper goods');

INSERT INTO products (sku, name, category_id, description, price, stock, reserved_stock, version, active, created_at, updated_at) VALUES
    ('FOOD-001', 'Artisan sourdough loaf', 1, 'Sample product for food image set 001.', 95000, 120, 0, 0, true, NOW(), NOW()),
    ('FOOD-002', 'Butter croissant box', 1, 'Sample product for food image set 002.', 85000, 120, 0, 0, true, NOW(), NOW()),
    ('FOOD-003', 'Chocolate brownie tray', 1, 'Sample product for food image set 003.', 110000, 120, 0, 0, true, NOW(), NOW()),
    ('FOOD-004', 'Breakfast toast set', 1, 'Sample product for food image set 004.', 120000, 120, 0, 0, true, NOW(), NOW()),
    ('FOOD-005', 'Fruit tart slice', 1, 'Sample product for food image set 005.', 130000, 120, 0, 0, true, NOW(), NOW()),
    ('FOOD-006', 'Cold brew bottle', 2, 'Sample product for food image set 006.', 75000, 150, 0, 0, true, NOW(), NOW()),
    ('FOOD-007', 'Cappuccino cup', 2, 'Sample product for food image set 007.', 65000, 150, 0, 0, true, NOW(), NOW()),
    ('FOOD-008', 'Matcha latte', 2, 'Sample product for food image set 008.', 70000, 150, 0, 0, true, NOW(), NOW()),
    ('FOOD-009', 'Herbal tea tin', 2, 'Sample product for food image set 009.', 90000, 150, 0, 0, true, NOW(), NOW()),
    ('FOOD-010', 'Pour over coffee set', 2, 'Sample product for food image set 010.', 180000, 150, 0, 0, true, NOW(), NOW()),
    ('FOOD-011', 'Olive oil bottle', 3, 'Sample product for food image set 011.', 140000, 100, 0, 0, true, NOW(), NOW()),
    ('FOOD-012', 'Spice jar bundle', 3, 'Sample product for food image set 012.', 160000, 100, 0, 0, true, NOW(), NOW()),
    ('FOOD-013', 'Ceramic meal bowl', 3, 'Sample product for food image set 013.', 99000, 100, 0, 0, true, NOW(), NOW()),
    ('FOOD-014', 'Honey jar', 3, 'Sample product for food image set 014.', 125000, 100, 0, 0, true, NOW(), NOW()),
    ('FOOD-015', 'Cooking salt pack', 3, 'Sample product for food image set 015.', 45000, 100, 0, 0, true, NOW(), NOW()),
    ('FOOD-016', 'Sea salt snack pack', 4, 'Sample product for food image set 016.', 55000, 130, 0, 0, true, NOW(), NOW()),
    ('FOOD-017', 'Potato chips bag', 4, 'Sample product for food image set 017.', 60000, 130, 0, 0, true, NOW(), NOW()),
    ('FOOD-018', 'Granola cup', 4, 'Sample product for food image set 018.', 72000, 130, 0, 0, true, NOW(), NOW()),
    ('FOOD-019', 'Cookie pack', 4, 'Sample product for food image set 019.', 65000, 130, 0, 0, true, NOW(), NOW()),
    ('FOOD-020', 'Fruit snack jar', 4, 'Sample product for food image set 020.', 88000, 130, 0, 0, true, NOW(), NOW()),
    ('CRAFT-021', 'Handmade silver ring', 5, 'Sample product for craft image set 021.', 320000, 80, 0, 0, true, NOW(), NOW()),
    ('CRAFT-022', 'Stone bead bracelet', 5, 'Sample product for craft image set 022.', 290000, 80, 0, 0, true, NOW(), NOW()),
    ('CRAFT-023', 'Minimal pendant necklace', 5, 'Sample product for craft image set 023.', 340000, 80, 0, 0, true, NOW(), NOW()),
    ('CRAFT-024', 'Copper cufflinks', 5, 'Sample product for craft image set 024.', 260000, 80, 0, 0, true, NOW(), NOW()),
    ('CRAFT-025', 'Leather charm bracelet', 5, 'Sample product for craft image set 025.', 310000, 80, 0, 0, true, NOW(), NOW()),
    ('CRAFT-026', 'Clay vase', 6, 'Sample product for craft image set 026.', 450000, 60, 0, 0, true, NOW(), NOW()),
    ('CRAFT-027', 'Candle holder set', 6, 'Sample product for craft image set 027.', 390000, 60, 0, 0, true, NOW(), NOW()),
    ('CRAFT-028', 'Wall art print', 6, 'Sample product for craft image set 028.', 420000, 60, 0, 0, true, NOW(), NOW()),
    ('CRAFT-029', 'Wooden tray', 6, 'Sample product for craft image set 029.', 360000, 60, 0, 0, true, NOW(), NOW()),
    ('CRAFT-030', 'Woven basket decor', 6, 'Sample product for craft image set 030.', 330000, 60, 0, 0, true, NOW(), NOW()),
    ('CRAFT-031', 'Canvas tote bag', 7, 'Sample product for craft image set 031.', 240000, 90, 0, 0, true, NOW(), NOW()),
    ('CRAFT-032', 'Embroidered scarf', 7, 'Sample product for craft image set 032.', 280000, 90, 0, 0, true, NOW(), NOW()),
    ('CRAFT-033', 'Wool beanie', 7, 'Sample product for craft image set 033.', 210000, 90, 0, 0, true, NOW(), NOW()),
    ('CRAFT-034', 'Leather wallet', 7, 'Sample product for craft image set 034.', 390000, 90, 0, 0, true, NOW(), NOW()),
    ('CRAFT-035', 'Fabric pouch', 7, 'Sample product for craft image set 035.', 170000, 90, 0, 0, true, NOW(), NOW()),
    ('CRAFT-036', 'Leather notebook', 8, 'Sample product for craft image set 036.', 260000, 70, 0, 0, true, NOW(), NOW()),
    ('CRAFT-037', 'Handbound journal', 8, 'Sample product for craft image set 037.', 280000, 70, 0, 0, true, NOW(), NOW()),
    ('CRAFT-038', 'Paper gift tag set', 8, 'Sample product for craft image set 038.', 120000, 70, 0, 0, true, NOW(), NOW()),
    ('CRAFT-039', 'Desk sketchbook', 8, 'Sample product for craft image set 039.', 220000, 70, 0, 0, true, NOW(), NOW()),
    ('CRAFT-040', 'Planner notebook', 8, 'Sample product for craft image set 040.', 240000, 70, 0, 0, true, NOW(), NOW());

-- Keep seed light; variants/attributes/stock movements can be added later when needed.

-- ---- SEED: Product Variants ----
INSERT INTO product_variants (sku_code, name, price, total_stock, reserved_stock, product_id) VALUES
    ('LY-SU-HB-01', 'Ly sứ men hỏa biến Lam Ngọc', 250000, 50, 2, 1),
    ('LY-SU-HB-02', 'Ly sứ men hỏa biến Hổ Phách', 250000, 60, 3, 1),
    ('LY-SU-HB-03', 'Ly sứ men hỏa biến Bạch Vân', 270000, 30, 0, 1),
    ('NHAN-BAC-TA-TOC-VANG', 'Nhẫn bạc thạch anh tóc vàng', 380000, 80, 4, 2),
    ('NHAN-BAC-TA-TOC-DO', 'Nhẫn bạc thạch anh tóc đỏ', 380000, 60, 2, 2),
    ('NHAN-BAC-TA-TOC-DEN', 'Nhẫn bạc thạch anh tóc đen', 380000, 40, 1, 2),
    ('KHAY-GO-OC-CHO-S', 'Khay trà gỗ óc chó Size S', 1200000, 40, 1, 4),
    ('KHAY-GO-OC-CHO-M', 'Khay trà gỗ óc chó Size M', 1500000, 20, 0, 4),
    ('KHAY-GO-OC-CHO-L', 'Khay trà gỗ óc chó Size L', 1800000, 10, 0, 4),
    ('TRANH-SEN-KHO-40X60', 'Tranh sen khô 40x60cm', 550000, 20, 0, 9),
    ('TRANH-SEN-KHO-60X90', 'Tranh sen khô 60x90cm', 750000, 10, 0, 9),
    ('SO-TAY-DA-A6', 'Sổ tay da bò Size A6', 280000, 40, 2, 10),
    ('SO-TAY-DA-A5', 'Sổ tay da bò Size A5', 380000, 25, 1, 10),
    ('SO-TAY-DA-B5', 'Sổ tay da bò Size B5', 480000, 15, 1, 10),
    ('TRANH-SM-PS-STD', 'Tranh sơn mài Phú Sĩ tiêu chuẩn', 2500000, 30, 2, 19),
    ('TRANH-SM-PS-VIP', 'Tranh sơn mài Phú Sĩ dát vàng đặc biệt', 3500000, 15, 1, 19),
    ('NEN-THOM-GO-DONG-AM-100G', 'Hũ nến thơm gỗ thông 100g', 220000, 40, 1, 23),
    ('NEN-THOM-GO-DONG-AM-250G', 'Hũ nến thơm gỗ thông 250g', 390000, 20, 0, 23),
    ('TRANH-BIEN-SMALL', 'Bộ tranh canvas biển 30x40cm x 3', 750000, 150, 10, 29),
    ('TRANH-BIEN-MEDIUM', 'Bộ tranh canvas biển 40x60cm x 3', 1100000, 80, 3, 29);

-- ---- SEED: Product Attributes ----
INSERT INTO product_attributes (product_id, name, value) VALUES
    (1, 'Chất liệu', 'Đất sét cao lanh Tràng An'), (1, 'Nhiệt độ nung', '1300 độ C'), (1, 'Men gốm', 'Men hỏa biến tự nhiên độc bản'), (1, 'Dung tích', '350ml'), (1, 'Đóng gói', 'Hộp xi măng lót lụa cao cấp'),
    (2, 'Chất liệu', 'Bạc S925 chuẩn quốc tế'), (2, 'Loại đá', 'Thạch anh tóc vàng tự nhiên'), (2, 'Size nhẫn', 'Tùy chỉnh (Free size)'), (2, 'Đánh bóng', 'Thủ công bằng vải nỉ'),
    (3, 'Thành phần', 'Sáp đậu nành thiên nhiên, tinh dầu oải hương nguyên chất'), (3, 'Thời gian cháy', '40 giờ'), (3, 'Trọng lượng', '200g'),
    (4, 'Chất liệu', 'Gỗ óc chó nhập khẩu Bắc Mỹ'), (4, 'Hoàn thiện', 'Lau dầu gỗ Rubio Monocoat cực kỳ an toàn'), (4, 'Kích thước', '40 x 25 x 2.5 cm'), (4, 'Khay lót', 'Lót da bò lộn bên dưới đáy khay'),
    (5, 'Chất liệu', 'Vải linen bột tự nhiên nguyên bản'), (5, 'Họa tiết', 'Thêu tay thủ công cúc họa mi'), (5, 'Kích thước', '35 x 40 cm'),
    (9, 'Chất liệu', 'Vải canvas sợi cotton cao cấp'), (9, 'Khung tranh', 'Khung gỗ thông tự nhiên đã qua sấy chống mối mọt'), (9, 'Mực in', 'Mực in UV sắc nét bền màu 10 năm'), (9, 'Kích thước mặc định', '60x90cm'),
    (10, 'Chất liệu', 'Da bò Veg-tan mộc cao cấp càng xài càng bóng'), (10, 'Giấy viết', 'Giấy Kraft cổ điển không dòng kẻ chống lóa mắt'), (10, 'Số trang', '200 trang'), (10, 'Chỉ may', 'Chỉ sáp tết thủ công khâu tay tròn'),
    (11, 'Chất liệu', 'Đất sét đỏ tráng men ngọc mờ cổ kính'), (11, 'Kích thước', 'Cao 25cm, đường kính miệng bình 8cm'), (11, 'Phong cách', 'Mộc mạc xưa cũ'),
    (12, 'Chất liệu', 'Gỗ trầm hương kiến rừng tự nhiên'), (12, 'Kích thước hạt', '10mm - 108 hạt thiền định'), (12, 'Hương thơm', 'Thơm dịu ấm nhẹ, phát huy mùi tốt khi tiếp xúc nhiệt cơ thể'),
    (15, 'Chất liệu vải thêu', 'Lụa tơ tằm thiên nhiên bảo hành trọn đời'), (15, 'Nghệ nhân', 'Làng thêu Quất Động danh tiếng'), (15, 'Thời gian hoàn thành', '30 ngày thêu liên tục'),
    (19, 'Nền vẽ', 'Gỗ tấm tự nhiên sơn nền đen tuyền sâu thẳm'), (19, 'Chất liệu dát', 'Vàng lá quỳ 24K cực kỳ sang trọng'), (19, 'Số lớp mài hoàn thiện', '15 lớp sơn mài tỉ mỉ'),
    (22, 'Chất liệu vỏ ấm', 'Đất nung lòng ấm không tráng men dưỡng hương trà'), (22, 'Phụ kiện đi kèm', 'Khay hứng nước thừa, kẹp gắp chén gỗ tre'), (22, 'Dung tích ấm', '250ml'),
    (23, 'Hương thơm chủ đạo', 'Gỗ thông đỏ, rêu ẩm sâu, hổ phách ấm ngọt ngào'), (23, 'Thời gian khuyên dùng', 'Đốt buổi tối thư giãn đầu óc'), (23, 'Bấc nến', 'Bấc gỗ thông kêu lách tách vui tai khi cháy'),
    (24, 'Chất liệu gỗ', 'Gỗ sồi Mỹ nguyên tấm nhập khẩu tiện tay'), (24, 'Độ hoàn thiện', 'Sơn phủ sáp ong bảo vệ bề mặt chống nước'), (24, 'Ứng dụng', 'Đựng nước, trà, cà phê ấm nóng cực ấm cúng'),
    (25, 'Chất liệu vải', 'Vải canvas cotton 100% dày mềm tự nhiên'), (25, 'Họa tiết thêu', 'Sen vàng nhụy đỏ cách điệu'), (25, 'Kích thước túi', '38 x 42 cm'),
    (28, 'Nguồn gốc thảo mộc', 'Cánh hoa Atiso đỏ thu hoạch từ nông trang Dalat Organic'), (28, 'Quy cách đóng gói', 'Lọ thủy tinh nắp thiếc kín khí 150g'), (28, 'Hạn sử dụng', '12 tháng từ ngày sản xuất'),
    (29, 'Vật liệu in', 'Tranh in canvas căng khung gỗ nhựa composite chống nước'), (29, 'Số bức tranh', '3 bức tranh ghép nghệ thuật'), (29, 'Chủ đề tranh', 'Hoàng hôn biển Địa Trung Hải ấm áp sặc sỡ'),
    (30, 'Chất liệu da', 'Da sáp ngựa điên (Crazy Horse Leather) tạo vết xước phong trần'), (30, 'Kích cỡ bảo vệ', 'Tương thích tốt các dòng iPad từ 10.2 đến 11 inch'), (30, 'Khâu viền', 'May thủ công chỉ dù sáp siêu bền bỉ');

-- ---- SEED: Stock Movements ----
INSERT INTO stock_movements (product_id, variant_id, quantity, type, reason, created_at) VALUES
    (1, 1, 50, 'IMPORT', 'Nhập kho Ly sứ men hỏa biến Lam Ngọc', NOW() - INTERVAL '35 days'),
    (1, 2, 60, 'IMPORT', 'Nhập kho Ly sứ men hỏa biến Hổ Phách', NOW() - INTERVAL '35 days'),
    (1, 3, 30, 'IMPORT', 'Nhập kho Ly sứ men hỏa biến Bạch Vân', NOW() - INTERVAL '35 days'),
    (1, NULL, 5, 'RESERVE', 'Giữ chỗ đơn hàng ORD-20240501-001', NOW() - INTERVAL '10 days'),
    (2, NULL, 200, 'IMPORT', 'Nhập kho Nhẫn bạc thạch anh tóc vàng', NOW() - INTERVAL '30 days'),
    (2, NULL, 8, 'RESERVE', 'Giữ chỗ đợt sale cuối tuần', NOW() - INTERVAL '5 days'),
    (4, 7, 40, 'IMPORT', 'Nhập kho Khay trà gỗ óc chó Size S', NOW() - INTERVAL '28 days'),
    (4, 8, 20, 'IMPORT', 'Nhập kho Khay trà gỗ óc chó Size M', NOW() - INTERVAL '28 days'),
    (4, NULL, 2, 'RESERVE', 'Giữ chỗ đơn hàng ORD-20240503-003', NOW() - INTERVAL '1 day'),
    (9, NULL, 40, 'IMPORT', 'Nhập kho Tranh canvas sen khô mùa thu', NOW() - INTERVAL '20 days'),
    (10, NULL, 80, 'IMPORT', 'Nhập kho Sổ tay bìa da bò', NOW() - INTERVAL '22 days'),
    (10, NULL, 4, 'RESERVE', 'Giữ chỗ đơn hàng khách sỉ', NOW() - INTERVAL '3 days'),
    (11, NULL, 25, 'IMPORT', 'Nhập kho Bình hoa gốm mộc', NOW() - INTERVAL '18 days'),
    (11, NULL, 1, 'RESERVE', 'Đặt trước từ khách VIP', NOW() - INTERVAL '4 days'),
    (15, NULL, 200, 'IMPORT', 'Nhập kho Tranh thêu tay phong cảnh', NOW() - INTERVAL '15 days'),
    (15, NULL, 10, 'RESERVE', 'Giữ chỗ đơn hàng ORD-20240502-002', NOW() - INTERVAL '3 days'),
    (17, NULL, 500, 'IMPORT', 'Nhập kho Thú bông thỏ len móc tay', NOW() - INTERVAL '40 days'),
    (17, NULL, 20, 'RESERVE', 'Giữ chỗ đợt sale cúc họa mi', NOW() - INTERVAL '2 days'),
    (19, NULL, 60, 'IMPORT', 'Nhập kho Tranh sơn mài núi Phú Sĩ', NOW() - INTERVAL '12 days'),
    (19, NULL, 3, 'RESERVE', 'Đặt trước từ công ty quà tặng doanh nghiệp', NOW() - INTERVAL '1 day'),
    (24, NULL, 80, 'IMPORT', 'Nhập kho Ly gỗ sồi Bắc Âu', NOW() - INTERVAL '25 days'),
    (24, NULL, 2, 'RESERVE', 'Giữ chỗ đơn hàng của khách', NOW() - INTERVAL '6 hours'),
    (25, NULL, 120, 'IMPORT', 'Nhập kho Túi tote thêu hoa sen', NOW() - INTERVAL '14 days'),
    (25, NULL, 4, 'RESERVE', 'Giữ chỗ đơn hàng ORD-20240504-004', NOW() - INTERVAL '4 days'),
    (29, NULL, 300, 'IMPORT', 'Nhập kho Bộ 3 tranh canvas biển', NOW() - INTERVAL '10 days'),
    (29, NULL, 15, 'RESERVE', 'Giữ chỗ đợt sale khai trương chi nhánh', NOW() - INTERVAL '3 hours'),
    (30, NULL, 150, 'IMPORT', 'Nhập kho Bao da iPad da sáp ngựa điên', NOW() - INTERVAL '8 days'),
    (30, NULL, 5, 'RESERVE', 'Khách đặt trước combo da sáp', NOW() - INTERVAL '1 day'),
    (6, NULL, 60, 'IMPORT', 'Nhập kho Áo linen dáng suông', NOW() - INTERVAL '20 days'),
(7, NULL, 70, 'IMPORT', 'Nhập kho Khăn choàng len móc tay', NOW() - INTERVAL '18 days');

-- ================================================================
-- MEDIA SERVICE SCHEMA & SEED DATA
-- ================================================================
\c media_db;

CREATE TABLE IF NOT EXISTS medias (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    content_type VARCHAR(100) NOT NULL
);


-- ================================================================
-- USER SERVICE SCHEMA & SEED DATA
-- ================================================================
\c user_db;

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES ('CUSTOMER')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role_id INTEGER REFERENCES roles(id),
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

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL
);


-- ================================================================
-- ORDER SERVICE SCHEMA & SEED DATA
-- ================================================================
\c order_db;

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
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
    voucher_id BIGINT,
    voucher_code VARCHAR(50),
    voucher_discount_amount DECIMAL(19, 2),
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

CREATE TABLE IF NOT EXISTS vouchers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255),
    description TEXT,
    discount_type VARCHAR(30) NOT NULL,
    discount_value DECIMAL(19, 2) NOT NULL,
    max_discount_value DECIMAL(19, 2),
    min_order_value DECIMAL(19, 2),
    total_quantity BIGINT NOT NULL DEFAULT 0,
    used_quantity BIGINT NOT NULL DEFAULT 0,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voucher_conditions (
    id SERIAL PRIMARY KEY,
    voucher_id BIGINT NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
    condition_type VARCHAR(30) NOT NULL,
    value VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS voucher_usages (
    id SERIAL PRIMARY KEY,
    voucher_id BIGINT NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    discount_amount DECIMAL(19, 2) NOT NULL,
    used_at TIMESTAMP NOT NULL
);

INSERT INTO vouchers (id, code, name, description, discount_type, discount_value, max_discount_value, min_order_value, total_quantity, used_quantity, start_date, end_date, is_active, created_at, updated_at) VALUES
    (1, 'SALE10', 'Giảm 10% tối đa 50k', 'Áp dụng cho đơn từ 300k', 'PERCENT', 10, 50000, 300000, 500, 1, NOW() - INTERVAL '30 days', NOW() + INTERVAL '60 days', true, NOW() - INTERVAL '30 days', NOW() - INTERVAL '5 days'),
    (2, 'ONLINEPAY', 'Ưu đãi thanh toán online', 'Giảm trực tiếp 30k cho đơn thanh toán online', 'FIXED', 30000, NULL, 200000, 300, 0, NOW() - INTERVAL '15 days', NOW() + INTERVAL '45 days', true, NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day'),
    (3, 'FREESHIP', 'Miễn phí vận chuyển', 'Voucher hỗ trợ phí ship', 'FREESHIP', 0, NULL, 0, 200, 1, NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
    (4, 'SALE20', 'Giảm 20% tối đa 80k', 'Áp dụng cho đơn từ 500k', 'PERCENT', 20, 80000, 500000, 150, 0, NOW() - INTERVAL '7 days', NOW() + INTERVAL '25 days', true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day'),
    (5, 'WELCOME50', 'Chào mừng khách mới', 'Giảm trực tiếp 50k cho đơn đầu tiên từ 400k', 'FIXED', 50000, NULL, 400000, 120, 0, NOW() - INTERVAL '20 days', NOW() + INTERVAL '40 days', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '2 days'),
    (6, 'SUMMER15', 'Ưu đãi mùa hè 15%', 'Giảm 15% tối đa 60k cho đơn từ 350k', 'PERCENT', 15, 60000, 350000, 220, 0, NOW() - INTERVAL '5 days', NOW() + INTERVAL '35 days', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
    (7, 'VIPSHIP', 'Freeship khách thân thiết', 'Miễn phí vận chuyển cho khách hàng thân thiết', 'FREESHIP', 0, NULL, 200000, 100, 0, NOW() - INTERVAL '12 days', NOW() + INTERVAL '20 days', true, NOW() - INTERVAL '12 days', NOW() - INTERVAL '3 days');

SELECT setval('vouchers_id_seq', (SELECT MAX(id) FROM vouchers));

INSERT INTO voucher_conditions (voucher_id, condition_type, value) VALUES
    (1, 'FIRST_ORDER', 'true'),
    (2, 'USER_GROUP', 'ONLINE_CUSTOMER'),
    (3, 'CATEGORY', 'ALL'),
    (4, 'CATEGORY', 'HANDMADE'),
    (5, 'FIRST_ORDER', 'true'),
    (6, 'CATEGORY', 'SUMMER_COLLECTION'),
    (7, 'USER_GROUP', 'VIP');

INSERT INTO voucher_usages (voucher_id, user_id, order_id, discount_amount, used_at) VALUES
    (1, 1, 1, 50000, NOW() - INTERVAL '10 days'),
    (3, 4, 5, 0, NOW() - INTERVAL '5 days'),
    (4, 2, 2, 80000, NOW() - INTERVAL '2 days'),
    (6, 3, 3, 45000, NOW() - INTERVAL '1 day');

INSERT INTO orders (order_number, user_id, total_price, shipping_street, shipping_city, shipping_district, shipping_country, shipping_carrier, tracking_number, shipping_fee, estimated_delivery, discount_code, discount_amount, tax_amount, tax_type, voucher_id, voucher_code, voucher_discount_amount, status, created_at, updated_at) VALUES
    ('ORD-20240501-001', 1, 770000, '123 Nguyễn Huệ', 'Hồ Chí Minh', 'Quận 1', 'Việt Nam', 'GHN', 'GHN-TRK-001', 30000, '2024-05-05', 'SALE10', 50000, 74000, 'VAT10', 1, 'SALE10', 50000, 'DELIVERED', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
    ('ORD-20240502-002', 2, 265000, '789 Đinh Tiên Hoàng', 'Hà Nội', 'Hoàn Kiếm', 'Việt Nam', 'GHTK', 'GHTK-TRK-002', 25000, '2024-05-07', NULL, 0, 24000, 'VAT10', NULL, NULL, NULL, 'PAID', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
    ('ORD-20240503-003', 3, 380000, '10 Trần Phú', 'Đà Nẵng', 'Hải Châu', 'Việt Nam', NULL, NULL, NULL, NULL, NULL, 0, 38000, 'VAT10', NULL, NULL, NULL, 'PENDING', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    ('ORD-20240504-004', 1, 510000, '123 Nguyễn Huệ', 'Hồ Chí Minh', 'Quận 1', 'Việt Nam', 'VNPost', 'VNPOST-TRK-004', 30000, '2024-05-10', NULL, 0, 48000, 'VAT10', NULL, NULL, NULL, 'SHIPPING', NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day'),
    ('ORD-20240505-005', 4, 310000, '55 Hùng Vương', 'Cần Thơ', 'Ninh Kiều', 'Việt Nam', 'GHN', 'GHN-TRK-005', 20000, '2024-05-08', 'FREESHIP', 0, 29000, 'VAT10', 3, 'FREESHIP', 0, 'CANCELLED', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days');

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, tax_amount, discount_amount) VALUES
    (1, 1, 'Ly sứ men hỏa biến Hà Đông', 2, 250000, 50000, 50000),
    (1, 5, 'Túi vải linen thêu hoa cúc cổ điển', 1, 290000, 29000, 0),
    (2, 8, 'Trà hoa cúc dệt hương mật ong', 2, 120000, 24000, 0),
    (3, 2, 'Nhẫn bạc thạch anh tóc vàng', 1, 380000, 38000, 0),
    (4, 3, 'Nến thơm tinh dầu hoa oải hương', 3, 160000, 48000, 0),
    (5, 5, 'Túi vải linen thêu hoa cúc cổ điển', 1, 290000, 29000, 0);

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
    (5, 'PENDING', 'CANCELLED', 'Khách hàng hủy đơn', NOW() - INTERVAL '5 days');

-- ================================================================
-- PAYMENT SERVICE SCHEMA & SEED DATA
-- ================================================================
\c payment_db;

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    payment_code VARCHAR(255) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
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

INSERT INTO payments (payment_code, order_id, user_id, amount, payment_method, status, processed_at, created_at) VALUES
    ('PAY-INIT-1', 1, 1, 770000, 'BANK_TRANSFER', 'COMPLETED', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    ('PAY-INIT-2', 2, 2, 265000, 'WALLET', 'COMPLETED', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    ('PAY-INIT-3', 3, 3, 380000, 'COD', 'PENDING', NULL, NOW() - INTERVAL '1 day'),
    ('PAY-INIT-4', 4, 1, 510000, 'BANK_TRANSFER', 'COMPLETED', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    ('PAY-INIT-5', 5, 4, 310000, 'WALLET', 'REFUNDED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 days');

INSERT INTO payment_transactions (order_id, transaction_id, gateway_provider, raw_response, status, created_at) VALUES
    (1, 'VNPAY-TXN-00000001', 'VNPay', '{"vnp_ResponseCode":"00","vnp_TransactionStatus":"00","vnp_Amount":"77000000"}', 'SUCCESS', NOW() - INTERVAL '10 days'),
    (2, 'MOMO-TXN-00000002', 'MoMo', '{"resultCode":0,"message":"Thành công","transId":"MOMO-3192837"}', 'SUCCESS', NOW() - INTERVAL '3 days'),
    (4, 'VNPAY-TXN-00000004', 'VNPay', '{"vnp_ResponseCode":"00","vnp_TransactionStatus":"00","vnp_Amount":"51000000"}', 'SUCCESS', NOW() - INTERVAL '4 days'),
    (5, 'MOMO-TXN-00000005', 'MoMo', '{"resultCode":0,"message":"Hoàn tiền thành công","transId":"MOMO-9876543"}', 'REFUNDED', NOW() - INTERVAL '5 days'),
    (3, NULL, 'InternalMock', '{"status":"pending","method":"COD"}', 'PENDING', NOW() - INTERVAL '1 day');
