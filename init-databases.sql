-- ================================
-- CREATE DATABASES
-- ================================
CREATE DATABASE user_db;
CREATE DATABASE product_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
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
    ('Gốm sứ trang trí', 'Đồ gốm men hỏa biến và gốm sứ trang trí thủ công nghệ thuật'),
    ('Trang sức thủ công', 'Trang sức bạc S925, thạch anh và đá quý tự nhiên độc bản'),
    ('Nến thơm tự nhiên', 'Nến thơm tinh dầu thiên nhiên, sáp đậu nành bảo vệ sức khỏe'),
    ('Đồ gỗ mỹ nghệ', 'Nội thất, khay gỗ và dụng cụ trang trí gỗ óc chó tự nhiên'),
    ('Thêu tay nghệ thuật', 'Tranh thêu tay, túi vải và phụ kiện thêu tay họa tiết truyền thống'),
    ('Thời trang linen', 'Quần áo, chăn ga làm bằng chất liệu vải linen và cotton organic'),
    ('Đồ len móc tay', 'Khăn len choàng cổ, mũ nồi và thú bông đan móc thủ công'),
    ('Trà & Thảo mộc', 'Các loại trà hoa tự nhiên dệt hương và trà thảo mộc organic'),
    ('Tranh vẽ & Canvas', 'Tranh canvas, tranh sơn mài và tác phẩm nghệ thuật trang trí'),
    ('Sổ tay & Đồ da', 'Sổ tay da bò veg-tan, ví da và phụ kiện da thiết kế thủ công');

-- ---- SEED: Products (30 sản phẩm) ----
INSERT INTO products (sku, name, category_id, description, price, stock, reserved_stock, version, active, created_at, updated_at) VALUES
    ('LY-SU-HOA-BIEN', 'Ly sứ men hỏa biến Hà Đông', 1, 'Ly sứ được nung ở nhiệt độ cao với lớp men hỏa biến tự sắc xanh biển sâu độc bản.', 250000, 150, 5, 0, true, NOW(), NOW()),
    ('NHAN-BAC-THACH-ANH', 'Nhẫn bạc thạch anh tóc vàng', 2, 'Nhẫn làm thủ công từ bạc ta đính đá thạch anh tóc vàng thiên nhiên mang năng lượng tích cực.', 380000, 200, 8, 0, true, NOW(), NOW()),
    ('NEN-THOM-HOA-OAI-HUONG', 'Nến thơm tinh dầu hoa oải hương', 3, 'Nến thơm làm từ sáp đậu nành organic phối trộn tinh dầu oải hương giúp ngủ ngon, thư giãn tinh thần.', 160000, 100, 2, 0, true, NOW(), NOW()),
    ('KHAY-TRA-GO-OC-CHO', 'Khay trà gỗ óc chó nguyên khối', 4, 'Khay trà gỗ óc chó cao cấp vân gỗ tự nhiên sang trọng, bề mặt chống nước hoàn thiện thủ công.', 1500000, 80, 2, 0, true, NOW(), NOW()),
    ('TUI-LINEN-THEU-TAY', 'Túi vải linen thêu hoa cúc cổ điển', 5, 'Túi tote linen thêu tay cúc họa mi tỉ mỉ, ngăn chứa rộng phù hợp sử dụng hàng ngày.', 290000, 120, 3, 0, true, NOW(), NOW()),
    ('AO-LINEN-DANG-SUONG', 'Áo linen dáng suông cao cấp', 6, 'Áo kiểu cổ thuyền vải linen tự nhiên mềm mát, thoáng mát và sang trọng cho mùa hè.', 580000, 60, 1, 0, true, NOW(), NOW()),
    ('KHAN-CHOANG-LEN-MOC', 'Khăn choàng len móc tay thủ công', 7, 'Khăn quàng cổ đan từ sợi len cừu mềm mịn, họa tiết quả dâu xinh xắn nổi bật.', 450000, 70, 0, 0, true, NOW(), NOW()),
    ('TRA-HOA-CUC-MAT-ONG', 'Trà hoa cúc dệt hương mật ong', 8, 'Trà hoa cúc nguyên bông phơi sấy sạch tự nhiên kết hợp mật ong ngọt thanh thanh, tốt cho mắt.', 120000, 50, 0, 0, true, NOW(), NOW()),
    ('TRANH-CANVAS-SEN-KHO', 'Tranh canvas sen khô mùa thu', 9, 'Tác phẩm nghệ thuật tối giản với hình ảnh sen tàn mộc mạc mang cảm hứng thiền định tĩnh lặng.', 750000, 40, 0, 0, true, NOW(), NOW()),
    ('SO-TAY-DA-HANDMADE', 'Sổ tay bìa da bò thật khắc tên', 10, 'Sổ tay chế tác thủ công bìa da bò sáp, ruột giấy Kraft kem cổ điển không dòng kẻ.', 480000, 80, 4, 0, true, NOW(), NOW()),
    ('BINH-HOA-GOM-MOC', 'Bình hoa gốm mộc tráng men ngọc', 1, 'Bình cắm hoa thiết kế đơn giản mộc mạc, lòng bình tráng men ngọc giữ nước cắm hoa bền lâu.', 320000, 25, 1, 0, true, NOW(), NOW()),
    ('VONG-TAY-TRAM-HUONG', 'Vòng tay gỗ trầm hương thiên nhiên', 2, 'Vòng hạt gỗ trầm hương tự nhiên từ rừng Khánh Hòa, mùi thơm dịu nhẹ thu hút tài lộc.', 1200000, 35, 0, 0, true, NOW(), NOW()),
    ('NEN-THOM-QUE-HUONG-THAO', 'Nến thơm sáp ong hương quế & hương thảo', 3, 'Mùi hương ấm áp dễ chịu của quế pha chút thanh mát của hương thảo giúp khử mùi phòng hiệu quả.', 180000, 20, 0, 0, true, NOW(), NOW()),
    ('HOP-TRANG-SUC-GO-HUONG', 'Hộp đựng trang sức gỗ hương khắc hoa văn', 4, 'Hộp gỗ hương đỏ quý hiếm chạm trổ hoa mẫu đơn tỉ mỉ, có lót nhung bảo vệ trang sức bên trong.', 950000, 18, 1, 0, true, NOW(), NOW()),
    ('TRANH-THEU-PHONG-CANH', 'Tranh thêu tay phong cảnh làng quê', 5, 'Tác phẩm thêu chỉ tơ tằm sắc sảo, phác họa khung cảnh cây đa bến nước thanh bình cổ xưa.', 1650000, 200, 10, 0, true, NOW(), NOW()),
    ('DEM-NGOI-COTTON-LINEN', 'Đệm ngồi thiền vải linen organic', 6, 'Ruột bông gòn tự nhiên đàn hồi tốt, vỏ bọc linen dày dặn tháo giặt dễ dàng, dùng ngồi bệt hay trà đạo.', 350000, 150, 3, 0, true, NOW(), NOW()),
    ('THU-BONG-LEN-MOC-TAY', 'Thú bông thỏ len móc tay cho bé', 7, 'Móc len bằng tay hoàn toàn từ sợi cotton an toàn cho trẻ nhỏ, có thể ôm ngủ hay làm quà tặng.', 260000, 500, 20, 0, true, NOW(), NOW()),
    ('TRA-THIET-QUAN-AM-TAY-BAC', 'Trà Thiết Quan Âm Tây Bắc thượng hạng', 8, 'Hương vị trà ô long đậm đà thu hái thủ công từ vùng cao Tây Bắc, sấy thủ công giữ hương hoa lan đặc trưng.', 190000, 300, 5, 0, true, NOW(), NOW()),
    ('TRANH-SON-MAI-PHU-SI', 'Tranh sơn mài núi Phú Sĩ dát vàng', 9, 'Bức tranh sơn mài vẽ tay truyền thống qua 15 lớp mài, dát vàng quỳ sang trọng tạo chiều sâu.', 2500000, 60, 3, 0, true, NOW(), NOW()),
    ('VI-DA-CAM-TAY-MINIMALIST', 'Ví da mini dáng đứng thủ công', 10, 'Thiết kế ví nhỏ gọn đựng được 6 thẻ và tiền mặt, da bò pullup càng dùng càng bóng đẹp.', 650000, 90, 2, 0, true, NOW(), NOW()),
    ('BO-CHEN-TRA-MEN-HOA-BIEN', 'Bộ ấm chén trà gốm men hỏa biến lam ngọc', 1, 'Bộ trà gồm 1 ấm và 6 chén đất nung tráng men lam ngọc sáng bóng, thích hợp thưởng trà đón khách.', 1850000, 30, 0, 0, true, NOW(), NOW()),
    ('VONG-TAY-BAC-MAT-XICH', 'Vòng tay bạc S925 mắt xích cổ điển', 2, 'Vòng tay bạc xước phong cách vintage tối giản, phù hợp cho cả nam và nữ.', 420000, 35, 0, 0, true, NOW(), NOW()),
    ('NEN-THOM-GO-DONG-AM', 'Nến thơm tinh dầu gỗ thông & rêu ấm', 3, 'Hương thơm như bước vào rừng thông Đà Lạt sớm mai mang lại cảm giác bình yên dễ chịu.', 220000, 80, 2, 0, true, NOW(), NOW()),
    ('LY-GO-SO-CAO-CAP', 'Ly gỗ sồi phong cách Bắc Âu', 4, 'Ly uống nước uống trà bằng gỗ sồi tự nhiên tiện tinh xảo, có tay cầm tiện lợi.', 150000, 25, 0, 0, true, NOW(), NOW()),
    ('TUI-TOTE-THEU-HOA-SEN', 'Túi tote vải canvas thêu sen vàng', 5, 'Túi canvas trắng ngà dệt dày dặn thêu chỉ vàng hình đóa sen thanh khiết mang nét thanh lịch.', 310000, 120, 4, 0, true, NOW(), NOW()),
    ('CHAN-GA-LINEN-WASHED', 'Chăn ga giường vải linen washed mềm', 6, 'Bộ ga phủ giường và vỏ gối từ chất liệu linen washed có độ nhăn tự nhiên, thấm hút mồ hôi cực tốt.', 2200000, 180, 6, 0, true, NOW(), NOW()),
    ('MU-LEN-NOI-MOC-TAY', 'Mũ len nồi họa tiết hoa hồng móc tay', 7, 'Chiếc mũ bê rê cổ điển ấm áp làm điểm nhấn thời trang cho mùa đông thu hút ánh nhìn.', 280000, 60, 1, 0, true, NOW(), NOW()),
    ('TRA-ATISO-DO-DALAT', 'Trà Atiso đỏ hữu cơ Đà Lạt thanh mát', 8, 'Cánh hoa Atiso đỏ sấy khô tự nhiên có vị chua thanh nhẹ, giúp thanh nhiệt giải độc gan.', 85000, 45, 2, 0, true, NOW(), NOW()),
    ('TRANH-BO-PHONG-CANH-BIEN', 'Bộ 3 tranh canvas phong cảnh biển Địa Trung Hải', 9, 'Bộ 3 bức tranh màu sắc tươi mát mang hơi thở của nắng vàng biển xanh Địa Trung Hải vào căn nhà của bạn.', 750000, 300, 15, 0, true, NOW(), NOW()),
    ('BAO-DA-IPAD-KRAFT-HANDMADE', 'Bao da iPad handmade từ da sáp ngựa điên', 10, 'Bao da khâu tay từ miếng da sáp dầy dặn chống va đập, bảo vệ tối đa máy tính bảng của bạn.', 890000, 150, 5, 0, true, NOW(), NOW());

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
-- USER SERVICE SCHEMA & SEED DATA
-- ================================================================
\c user_db;

-- ---- DDL ----
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

-- ---- DDL ----
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

-- ---- SEED: Vouchers ----
INSERT INTO vouchers (id, code, name, description, discount_type, discount_value, max_discount_value, min_order_value, total_quantity, used_quantity, start_date, end_date, is_active, created_at, updated_at) VALUES
    (1, 'SALE10', 'Giam 10% toi da 50k', 'Ap dung cho don tu 300k', 'PERCENT', 10, 50000, 300000, 500, 1, NOW() - INTERVAL '30 days', NOW() + INTERVAL '60 days', true, NOW() - INTERVAL '30 days', NOW() - INTERVAL '5 days'),
    (2, 'ONLINEPAY', 'Uu dai thanh toan online', 'Giam truc tiep 30k cho don thanh toan online', 'FIXED', 30000, NULL, 200000, 300, 0, NOW() - INTERVAL '15 days', NOW() + INTERVAL '45 days', true, NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day'),
    (3, 'FREESHIP', 'Mien phi van chuyen', 'Voucher ho tro phi ship', 'FREESHIP', 0, NULL, 0, 200, 1, NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days');

SELECT setval('vouchers_id_seq', (SELECT MAX(id) FROM vouchers));

-- ---- SEED: Voucher Conditions ----
INSERT INTO voucher_conditions (voucher_id, condition_type, value) VALUES
    (1, 'FIRST_ORDER', 'true'),
    (2, 'USER_GROUP', 'ONLINE_CUSTOMER'),
    (3, 'CATEGORY', 'ALL');

-- ---- SEED: Voucher Usages ----
INSERT INTO voucher_usages (voucher_id, user_id, order_id, discount_amount, used_at) VALUES
    (1, 1, 1, 50000, NOW() - INTERVAL '10 days'),
    (3, 4, 5, 0, NOW() - INTERVAL '5 days');

-- ---- SEED: Orders ----
INSERT INTO orders (order_number, user_id, total_price, shipping_street, shipping_city, shipping_district, shipping_country, shipping_carrier, tracking_number, shipping_fee, estimated_delivery, discount_code, discount_amount, tax_amount, tax_type, voucher_id, voucher_code, voucher_discount_amount, status, created_at, updated_at) VALUES
    ('ORD-20240501-001', 1, 770000, '123 Nguyen Hue', 'Ho Chi Minh', 'Quan 1', 'Viet Nam', 'GHN', 'GHN-TRK-001', 30000, '2024-05-05', 'SALE10', 50000, 74000, 'VAT10', 1, 'SALE10', 50000, 'DELIVERED', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
    ('ORD-20240502-002', 2, 265000, '789 Dinh Tien Hoang', 'Ha Noi', 'Hoan Kiem', 'Viet Nam', 'GHTK', 'GHTK-TRK-002', 25000, '2024-05-07', NULL, 0, 24000, 'VAT10', NULL, NULL, NULL, 'PAID', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
    ('ORD-20240503-003', 3, 380000, '10 Tran Phu', 'Da Nang', 'Hai Chau', 'Viet Nam', NULL, NULL, NULL, NULL, NULL, 0, 38000, 'VAT10', NULL, NULL, NULL, 'PENDING', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    ('ORD-20240504-004', 1, 510000, '123 Nguyen Hue', 'Ho Chi Minh', 'Quan 1', 'Viet Nam', 'VNPost', 'VNPOST-TRK-004', 30000, '2024-05-10', NULL, 0, 48000, 'VAT10', NULL, NULL, NULL, 'SHIPPING', NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day'),
    ('ORD-20240505-005', 4, 310000, '55 Hung Vuong', 'Can Tho', 'Ninh Kieu', 'Viet Nam', 'GHN', 'GHN-TRK-005', 20000, '2024-05-08', 'FREESHIP', 0, 29000, 'VAT10', 3, 'FREESHIP', 0, 'CANCELLED', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days');

-- ---- SEED: Order Items ----
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, tax_amount, discount_amount) VALUES
    (1, 1, 'Ly su men hoa bien Ha Dong', 2, 250000, 50000, 50000),
    (1, 5, 'Tui vai linen theu hoa cuc co dien', 1, 290000, 29000, 0),
    (2, 8, 'Tra hoa cuc det huong mat ong', 2, 120000, 24000, 0),
    (3, 2, 'Nhan bac thach anh toc vang', 1, 380000, 38000, 0),
    (4, 3, 'Nen thom tinh dau hoa oai huong', 3, 160000, 48000, 0),
    (5, 5, 'Tui vai linen theu hoa cuc co dien', 1, 290000, 29000, 0);

-- ---- SEED: Order Status History ----
INSERT INTO order_status_history (order_id, from_status, to_status, reason, changed_at) VALUES
    (1, NULL, 'PENDING', 'Don hang duoc tao tu dong tu gio hang', NOW() - INTERVAL '10 days'),
    (1, 'PENDING', 'PAID', 'Thanh toan VNPay thanh cong', NOW() - INTERVAL '10 days' + INTERVAL '5 minutes'),
    (1, 'PAID', 'SHIPPING', 'Da ban giao cho don vi van chuyen GHN', NOW() - INTERVAL '8 days'),
    (1, 'SHIPPING', 'DELIVERED', 'Giao hang thanh cong', NOW() - INTERVAL '5 days'),
    (2, NULL, 'PENDING', 'Don hang duoc tao tu checkout', NOW() - INTERVAL '3 days'),
    (2, 'PENDING', 'PAID', 'Thanh toan Momo thanh cong', NOW() - INTERVAL '3 days' + INTERVAL '3 minutes'),
    (3, NULL, 'PENDING', 'Don hang cho xu ly', NOW() - INTERVAL '1 day'),
    (4, NULL, 'PENDING', 'Don hang duoc tao', NOW() - INTERVAL '4 days'),
    (4, 'PENDING', 'PAID', 'Thanh toan VNPAY thanh cong', NOW() - INTERVAL '4 days' + INTERVAL '2 minutes'),
    (4, 'PAID', 'SHIPPING', 'Giao cho VNPost', NOW() - INTERVAL '2 days'),
    (5, NULL, 'PENDING', 'Don hang duoc tao', NOW() - INTERVAL '6 days'),
    (5, 'PENDING', 'CANCELLED', 'Khach hang huy don', NOW() - INTERVAL '5 days');
-- PAYMENT SERVICE SCHEMA & SEED DATA
-- ================================================================
\c payment_db;

-- ---- DDL ----
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

-- ---- SEED: Payments ----
INSERT INTO payments (payment_code, order_id, user_id, amount, payment_method, status, processed_at, created_at) VALUES
    ('PAY-INIT-1', 1, 1, 770000, 'BANK_TRANSFER', 'COMPLETED', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    ('PAY-INIT-2', 2, 2, 265000, 'WALLET', 'COMPLETED', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    ('PAY-INIT-3', 3, 3, 380000, 'COD', 'PENDING', NULL, NOW() - INTERVAL '1 day'),
    ('PAY-INIT-4', 4, 1, 510000, 'BANK_TRANSFER', 'COMPLETED', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    ('PAY-INIT-5', 5, 4, 310000, 'WALLET', 'REFUNDED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 days');

-- ---- SEED: Payment Transactions ----
INSERT INTO payment_transactions (order_id, transaction_id, gateway_provider, raw_response, status, created_at) VALUES
    (1, 'VNPAY-TXN-00000001', 'VNPay', '{"vnp_ResponseCode":"00","vnp_TransactionStatus":"00","vnp_Amount":"77000000"}', 'SUCCESS', NOW() - INTERVAL '10 days'),
    (2, 'MOMO-TXN-00000002', 'MoMo', '{"resultCode":0,"message":"Thành công","transId":"MOMO-3192837"}', 'SUCCESS', NOW() - INTERVAL '3 days'),
    (4, 'VNPAY-TXN-00000004', 'VNPay', '{"vnp_ResponseCode":"00","vnp_TransactionStatus":"00","vnp_Amount":"51000000"}', 'SUCCESS', NOW() - INTERVAL '4 days'),
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
