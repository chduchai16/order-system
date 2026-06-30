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

-- ---- Categories: 1 per image folder, 6 total ----
INSERT INTO categories (name, description) VALUES
    ('Foods',  'Premium organic food items, dried fruits, nuts, coffee and tea'),
    ('Crafts', 'Handcrafted ceramic, wood, glass, and textile decoration items'),
    ('Bags',   'Handbags, backpacks, totes and everyday carry accessories'),
    ('Pants',  'Trousers, jeans, chinos and casual pants'),
    ('Shirts', 'Fashion shirts, tops and casual wear for men and women'),
    ('Shoes',  'Footwear including sneakers, boots, heels and sandals');

-- ---- Products: 20 per category x 6 = 120 total ----
INSERT INTO products (sku, name, category_id, description, price, stock, reserved_stock, version, active, created_at, updated_at) VALUES
    -- FOODS (category_id=1, products 1-20)
    ('FOO-001','Organic Dried Mango',           1,'Delicious organic dried mango slices.',                       80000, 100,0,0,true,NOW(),NOW()),
    ('FOO-002','Honey Glazed Almonds',          1,'Crunchy almonds with a sweet honey glaze.',                  120000, 100,0,0,true,NOW(),NOW()),
    ('FOO-003','Premium Matcha Powder',         1,'Pure Japanese green tea matcha powder.',                     250000, 100,0,0,true,NOW(),NOW()),
    ('FOO-004','Roasted Cashew Nuts',           1,'Slow-roasted cashews with a touch of sea salt.',             140000, 150,0,0,true,NOW(),NOW()),
    ('FOO-005','Cold Brew Coffee Blend',        1,'Rich coffee blend optimized for cold brewing.',              180000, 120,0,0,true,NOW(),NOW()),
    ('FOO-006','Jasmine Green Tea',             1,'Fragrant green tea leaves infused with jasmine.',             95000,  90,0,0,true,NOW(),NOW()),
    ('FOO-007','Dried Cranberries',             1,'Sweet and tangy dried whole cranberries.',                    85000, 130,0,0,true,NOW(),NOW()),
    ('FOO-008','Raw Wildflower Honey',          1,'Unfiltered raw honey from wildflower blossoms.',             160000, 120,0,0,true,NOW(),NOW()),
    ('FOO-009','Dark Chocolate Bar 70%',        1,'Rich dark chocolate made from single-origin cocoa.',          65000, 100,0,0,true,NOW(),NOW()),
    ('FOO-010','Whole Grain Oatmeal',           1,'Hearty rolled oats for a healthy breakfast.',                 75000,  60,0,0,true,NOW(),NOW()),
    ('FOO-011','Organic Chia Seeds',            1,'Nutrient-dense organic black chia seeds.',                   110000,  80,0,0,true,NOW(),NOW()),
    ('FOO-012','Virgin Coconut Oil',            1,'Cold-pressed extra virgin coconut oil.',                     150000,  90,0,0,true,NOW(),NOW()),
    ('FOO-013','Spicy Chilli Sauce',            1,'Hot sauce made with sun-ripened chillies.',                   45000, 110,0,0,true,NOW(),NOW()),
    ('FOO-014','Himalayan Pink Salt',           1,'Fine grain pure Himalayan pink salt.',                        55000, 100,0,0,true,NOW(),NOW()),
    ('FOO-015','Ground Cinnamon Spice',         1,'Aromatic ground Ceylon cinnamon.',                            60000, 140,0,0,true,NOW(),NOW()),
    ('FOO-016','Pure Vanilla Extract',          1,'Premium pure vanilla bean extract.',                         220000, 160,0,0,true,NOW(),NOW()),
    ('FOO-017','Gluten Free Flour',             1,'All-purpose baking flour blend, gluten free.',               130000,  90,0,0,true,NOW(),NOW()),
    ('FOO-018','Whole Wheat Pasta',             1,'Organic whole wheat penne pasta.',                            50000, 150,0,0,true,NOW(),NOW()),
    ('FOO-019','Tomato Basil Sauce',            1,'Classic Italian tomato sauce with fresh basil.',              80000,  70,0,0,true,NOW(),NOW()),
    ('FOO-020','Extra Virgin Olive Oil',        1,'Cold-pressed Italian extra virgin olive oil.',               240000,  85,0,0,true,NOW(),NOW()),

    -- CRAFTS (category_id=2, products 21-40)
    ('CRA-001','Handmade Ceramic Mug',          2,'Unique hand-thrown ceramic coffee mug.',                     180000,  80,0,0,true,NOW(),NOW()),
    ('CRA-002','Handwoven Bamboo Basket',       2,'Decorative and functional woven bamboo basket.',             220000,  60,0,0,true,NOW(),NOW()),
    ('CRA-003','Scented Soy Candle',            2,'Natural soy wax candle scented with lavender.',              150000,  50,0,0,true,NOW(),NOW()),
    ('CRA-004','Leather Journal Notebook',       2,'Genuine leather-bound notebook with unruled pages.',         320000,  90,0,0,true,NOW(),NOW()),
    ('CRA-005','Macrame Wall Hanging',          2,'Boho-style hand-knotted cotton wall art.',                   280000, 100,0,0,true,NOW(),NOW()),
    ('CRA-006','Wool Felt Coaster Set',         2,'Set of 4 heat-resistant handmade wool felt coasters.',       120000,  75,0,0,true,NOW(),NOW()),
    ('CRA-007','Handcrafted Wooden Spoon',      2,'Carved from solid cherry wood, food safe.',                   90000,  70,0,0,true,NOW(),NOW()),
    ('CRA-008','Embroidered Linen Cushion',     2,'Linen cushion cover with delicate hand-embroidery.',         260000,  85,0,0,true,NOW(),NOW()),
    ('CRA-009','Terracotta Plant Pot',          2,'Classic hand-molded terracotta pot with saucer.',            110000,  55,0,0,true,NOW(),NOW()),
    ('CRA-010','Handcrafted Glass Vase',        2,'Hand-blown glass vase with a unique blue tint.',             450000, 100,0,0,true,NOW(),NOW()),
    ('CRA-011','Woven Jute Rug',                2,'Natural jute fibers woven into a durable area rug.',         650000,  65,0,0,true,NOW(),NOW()),
    ('CRA-012','Scented Bath Bomb Set',         2,'Set of 3 organic essential oil bath bombs.',                 140000,  80,0,0,true,NOW(),NOW()),
    ('CRA-013','Natural Herbal Soap',           2,'Handcrafted cold process soap with oatmeal and honey.',       60000,  90,0,0,true,NOW(),NOW()),
    ('CRA-014','Handcrafted Metal Lantern',     2,'Vintage style metal lantern for candles.',                   380000,  95,0,0,true,NOW(),NOW()),
    ('CRA-015','Wooden Jewelry Box',            2,'Teak wood jewelry box with velvet lining.',                  420000,  60,0,0,true,NOW(),NOW()),
    ('CRA-016','Pressed Flower Art Frame',      2,'Real dried flowers preserved in a wooden frame.',            240000,  80,0,0,true,NOW(),NOW()),
    ('CRA-017','Knitted Cotton Blanket',        2,'Soft throw blanket knitted with organic cotton.',            550000,  65,0,0,true,NOW(),NOW()),
    ('CRA-018','Handmade Dreamcatcher',         2,'Traditional dreamcatcher with feathers and beads.',          160000,  75,0,0,true,NOW(),NOW()),
    ('CRA-019','Ceramic Oil Burner',            2,'Minimalist ceramic burner for essential oils.',              130000,  85,0,0,true,NOW(),NOW()),
    ('CRA-020','Hand-carved Wooden Coasters',   2,'Set of 4 hand-carved coasters in acacia wood.',              150000,  90,0,0,true,NOW(),NOW()),

    -- BAGS (category_id=3, products 41-60)
    ('BAG-001','Classic Leather Tote Bag',      3,'Spacious genuine leather tote for work and daily use.',       780000,  70,0,0,true,NOW(),NOW()),
    ('BAG-002','Canvas Backpack',               3,'Durable canvas backpack with padded laptop compartment.',     450000,  90,0,0,true,NOW(),NOW()),
    ('BAG-003','Mini Crossbody Bag',            3,'Compact crossbody bag perfect for a night out.',              380000, 100,0,0,true,NOW(),NOW()),
    ('BAG-004','Woven Straw Beach Bag',         3,'Handwoven straw tote ideal for beach and summer trips.',      290000, 110,0,0,true,NOW(),NOW()),
    ('BAG-005','Quilted Chain Shoulder Bag',    3,'Chic quilted bag with a gold chain shoulder strap.',          860000,  60,0,0,true,NOW(),NOW()),
    ('BAG-006','Structured Top Handle Satchel', 3,'Polished satchel with rigid top handles and clean lines.',    720000,  65,0,0,true,NOW(),NOW()),
    ('BAG-007','Drawstring Bucket Bag',         3,'Casual bucket bag with drawstring closure.',                  340000, 100,0,0,true,NOW(),NOW()),
    ('BAG-008','Zip-Top Hobo Bag',              3,'Slouchy hobo bag in soft pebbled faux leather.',              560000,  75,0,0,true,NOW(),NOW()),
    ('BAG-009','Laptop Messenger Bag',          3,'Padded messenger bag for carrying a 15 inch laptop.',         650000,  70,0,0,true,NOW(),NOW()),
    ('BAG-010','Vintage Leather Clutch',        3,'Timeless leather clutch with an antique gold clasp.',         420000,  85,0,0,true,NOW(),NOW()),
    ('BAG-011','Sporty Bum Bag',                3,'Practical bum bag worn around the waist or crossbody.',       280000, 120,0,0,true,NOW(),NOW()),
    ('BAG-012','Oversized Shopper Tote',        3,'Generous shopper tote that fits everything you need.',        490000,  90,0,0,true,NOW(),NOW()),
    ('BAG-013','Suede Fringe Bag',              3,'Boho-chic suede bag with playful fringe detailing.',          630000,  65,0,0,true,NOW(),NOW()),
    ('BAG-014','Clear PVC Shoulder Bag',        3,'Transparent PVC bag for a fun, contemporary look.',           310000,  95,0,0,true,NOW(),NOW()),
    ('BAG-015','Patchwork Fabric Tote',         3,'Unique patchwork tote crafted from upcycled fabrics.',        380000,  80,0,0,true,NOW(),NOW()),
    ('BAG-016','Bamboo Handle Handbag',         3,'Elegant handbag featuring curved bamboo handles.',            520000,  70,0,0,true,NOW(),NOW()),
    ('BAG-017','Beaded Evening Clutch',         3,'Glamorous beaded clutch for special evening occasions.',      680000,  55,0,0,true,NOW(),NOW()),
    ('BAG-018','Nylon Utility Backpack',        3,'Lightweight nylon backpack with multiple organiser pockets.', 410000, 100,0,0,true,NOW(),NOW()),
    ('BAG-019','Knotted Handle Handbag',        3,'Statement bag with sculptural knotted top handles.',          440000,  75,0,0,true,NOW(),NOW()),
    ('BAG-020','Roll-Top Waterproof Backpack',  3,'Waterproof roll-top backpack for commuters and cyclists.',    590000,  80,0,0,true,NOW(),NOW()),

    -- PANTS (category_id=4, products 61-80)
    ('PAN-001','Slim Fit Chino Pants',          4,'Versatile slim-fit chinos for smart-casual looks.',           350000, 100,0,0,true,NOW(),NOW()),
    ('PAN-002','Classic Straight Jeans',        4,'Timeless straight-leg denim in mid-blue wash.',               420000, 110,0,0,true,NOW(),NOW()),
    ('PAN-003','Wide Leg Linen Trousers',       4,'Flowy wide-leg trousers in breathable linen.',                380000,  90,0,0,true,NOW(),NOW()),
    ('PAN-004','Cargo Utility Pants',           4,'Practical cargo pants with multiple side pockets.',           430000,  95,0,0,true,NOW(),NOW()),
    ('PAN-005','High-Waist Skinny Jeans',       4,'Figure-flattering high-rise skinny jeans.',                   390000, 105,0,0,true,NOW(),NOW()),
    ('PAN-006','Relaxed Jogger Sweatpants',     4,'Cosy jogger pants with an elastic waistband.',                290000, 130,0,0,true,NOW(),NOW()),
    ('PAN-007','Pleated Dress Pants',           4,'Elegant pleated trousers for formal settings.',               460000,  80,0,0,true,NOW(),NOW()),
    ('PAN-008','Cropped Flare Jeans',           4,'On-trend cropped flare jeans with a retro flair.',            410000,  90,0,0,true,NOW(),NOW()),
    ('PAN-009','Tailored Suit Trousers',        4,'Precision-cut suit trousers in a fine wool blend.',           580000,  70,0,0,true,NOW(),NOW()),
    ('PAN-010','Paperbag Waist Pants',          4,'Trendy paperbag waist pants with a tie belt.',                320000, 100,0,0,true,NOW(),NOW()),
    ('PAN-011','Distressed Boyfriend Jeans',    4,'Casual distressed jeans with a relaxed boyfriend fit.',       450000,  95,0,0,true,NOW(),NOW()),
    ('PAN-012','Corduroy Wide Leg Pants',       4,'Rich corduroy trousers in a chic wide-leg silhouette.',       370000,  85,0,0,true,NOW(),NOW()),
    ('PAN-013','Striped Resort Trousers',       4,'Breezy striped trousers perfect for resort wear.',            340000,  90,0,0,true,NOW(),NOW()),
    ('PAN-014','Leather-Look Leggings',         4,'Sleek faux-leather leggings with a second-skin fit.',         280000, 120,0,0,true,NOW(),NOW()),
    ('PAN-015','Bermuda Casual Shorts',         4,'Relaxed Bermuda shorts for warm-weather dressing.',           240000, 130,0,0,true,NOW(),NOW()),
    ('PAN-016','Palazzo Flowy Pants',           4,'Dramatic palazzo pants with a billowing silhouette.',          360000,  85,0,0,true,NOW(),NOW()),
    ('PAN-017','Tech Stretch Pants',            4,'High-performance stretch pants for commute and travel.',      490000,  80,0,0,true,NOW(),NOW()),
    ('PAN-018','Patchwork Denim Jeans',         4,'Artistic patchwork jeans as a statement fashion piece.',      520000,  60,0,0,true,NOW(),NOW()),
    ('PAN-019','Drawstring Linen Pants',        4,'Effortless drawstring linen pants for a relaxed look.',       310000, 100,0,0,true,NOW(),NOW()),
    ('PAN-020','Athletic Track Pants',          4,'Classic two-stripe track pants for sporty occasions.',        270000, 120,0,0,true,NOW(),NOW()),

    -- SHIRTS (category_id=5, products 81-100)
    ('SHI-001','Classic White Oxford Shirt',    5,'Timeless white oxford shirt, perfect for any occasion.',      280000, 100,0,0,true,NOW(),NOW()),
    ('SHI-002','Casual Linen Summer Shirt',     5,'Breathable linen shirt ideal for warm weather.',              320000, 100,0,0,true,NOW(),NOW()),
    ('SHI-003','Slim Fit Formal Shirt',         5,'Sharp slim-fit shirt for office and formal events.',          350000, 100,0,0,true,NOW(),NOW()),
    ('SHI-004','Graphic Oversized Tee',         5,'Bold graphic print on a relaxed oversized silhouette.',       180000, 150,0,0,true,NOW(),NOW()),
    ('SHI-005','Striped Cotton Polo',           5,'Classic striped polo in breathable 100% cotton.',             220000, 120,0,0,true,NOW(),NOW()),
    ('SHI-006','Denim Button-Down Shirt',       5,'Versatile denim shirt that pairs with everything.',           390000,  90,0,0,true,NOW(),NOW()),
    ('SHI-007','Vintage Crop Top',              5,'Retro-inspired crop top with a flattering fit.',              200000, 130,0,0,true,NOW(),NOW()),
    ('SHI-008','Long Sleeve Ribbed Top',        5,'Stretchy ribbed knit top for layering or solo wear.',         240000, 120,0,0,true,NOW(),NOW()),
    ('SHI-009','Sheer Chiffon Blouse',          5,'Elegant sheer blouse with a flowy drape.',                    290000, 100,0,0,true,NOW(),NOW()),
    ('SHI-010','Tailored Blazer Jacket',        5,'Structured blazer that elevates any outfit.',                 650000,  60,0,0,true,NOW(),NOW()),
    ('SHI-011','V-Neck Knit Sweater',           5,'Soft v-neck sweater in a cosy knit fabric.',                  420000,  80,0,0,true,NOW(),NOW()),
    ('SHI-012','Embroidered Floral Shirt',      5,'Delicate floral embroidery on a soft cotton base.',           380000,  90,0,0,true,NOW(),NOW()),
    ('SHI-013','Mock Neck Fitted Top',          5,'Sleek mock-neck top in a body-skimming fit.',                 260000, 110,0,0,true,NOW(),NOW()),
    ('SHI-014','Hooded Zip-Up Sweatshirt',      5,'Comfortable hoodie with full-zip closure.',                   480000, 100,0,0,true,NOW(),NOW()),
    ('SHI-015','Tie-Dye Cotton Tee',            5,'Hand-crafted tie-dye pattern on soft cotton.',                170000, 140,0,0,true,NOW(),NOW()),
    ('SHI-016','Sleeveless Tank Top',           5,'Lightweight tank top for casual and athletic wear.',           150000, 160,0,0,true,NOW(),NOW()),
    ('SHI-017','Corduroy Button Shirt',         5,'Textured corduroy shirt in a relaxed cut.',                   310000,  90,0,0,true,NOW(),NOW()),
    ('SHI-018','Athletic Performance Tee',      5,'Moisture-wicking tee designed for active lifestyles.',        195000, 150,0,0,true,NOW(),NOW()),
    ('SHI-019','Patterned Silk Blouse',         5,'Luxurious silk-feel blouse with an artistic print.',          520000,  70,0,0,true,NOW(),NOW()),
    ('SHI-020','Utility Cargo Shirt',           5,'Rugged cargo shirt with multiple chest pockets.',             340000,  85,0,0,true,NOW(),NOW()),

    -- SHOES (category_id=6, products 101-120)
    ('SHO-001','Classic White Sneakers',        6,'Crisp white sneakers that go with any outfit.',               650000,  80,0,0,true,NOW(),NOW()),
    ('SHO-002','Leather Oxford Derby',          6,'Polished leather oxford for formal occasions.',               890000,  60,0,0,true,NOW(),NOW()),
    ('SHO-003','Suede Chelsea Boots',           6,'Sleek suede chelsea boots with elastic side panels.',        1200000,  50,0,0,true,NOW(),NOW()),
    ('SHO-004','High-Top Canvas Shoes',         6,'Timeless high-top canvas kicks in multiple colors.',          480000,  90,0,0,true,NOW(),NOW()),
    ('SHO-005','Lightweight Running Shoes',     6,'Ultra-light mesh runners built for performance.',             750000, 100,0,0,true,NOW(),NOW()),
    ('SHO-006','Slip-On Loafers',               6,'Easy slip-on loafers in premium suede.',                      520000,  75,0,0,true,NOW(),NOW()),
    ('SHO-007','Platform Chunky Sneakers',      6,'Bold platform sneakers for a streetwear edge.',               680000,  70,0,0,true,NOW(),NOW()),
    ('SHO-008','Strappy Heeled Sandals',        6,'Elegant strappy sandals with a block heel.',                  420000,  85,0,0,true,NOW(),NOW()),
    ('SHO-009','Waterproof Hiking Boots',       6,'Durable hiking boots with waterproof membrane.',              980000,  55,0,0,true,NOW(),NOW()),
    ('SHO-010','Ballet Flat Shoes',             6,'Classic pointed-toe ballet flats in soft leather.',           320000, 100,0,0,true,NOW(),NOW()),
    ('SHO-011','Retro Dad Sneakers',            6,'Chunky retro sneakers with a vintage sports look.',           710000,  65,0,0,true,NOW(),NOW()),
    ('SHO-012','Pointed Toe Kitten Heels',      6,'Sophisticated kitten heels with a pointed toe.',              560000,  80,0,0,true,NOW(),NOW()),
    ('SHO-013','Mesh Athletic Trainers',        6,'Breathable mesh trainers for gym and everyday use.',          630000,  90,0,0,true,NOW(),NOW()),
    ('SHO-014','Mule Slide Sandals',            6,'Minimalist mule sandals for effortless style.',               380000,  95,0,0,true,NOW(),NOW()),
    ('SHO-015','Lace-Up Combat Boots',          6,'Heavy-duty combat boots with lug sole.',                      850000,  60,0,0,true,NOW(),NOW()),
    ('SHO-016','Espadrille Wedge Shoes',        6,'Summer-ready espadrille wedges with canvas upper.',           440000,  80,0,0,true,NOW(),NOW()),
    ('SHO-017','Sock-Fit Ankle Boots',          6,'Stretchy sock-fit boots that hug the ankle.',                 720000,  65,0,0,true,NOW(),NOW()),
    ('SHO-018','Open Toe Block Heels',          6,'Versatile open-toe sandals with a stable block heel.',        490000,  75,0,0,true,NOW(),NOW()),
    ('SHO-019','Faux Leather Sneakers',         6,'Clean faux leather sneakers with a minimal design.',          540000,  85,0,0,true,NOW(),NOW()),
    ('SHO-020','Woven Raffia Sandals',          6,'Handwoven raffia sandals for a boho beach look.',             370000,  90,0,0,true,NOW(),NOW());

-- ---- SEED: Product Variants (size variants for select products) ----
INSERT INTO product_variants (sku_code, name, price, total_stock, reserved_stock, product_id) VALUES
    ('SHI-001-S',  'Classic White Oxford Shirt - S',   280000, 30, 0, 81),
    ('SHI-001-M',  'Classic White Oxford Shirt - M',   280000, 40, 0, 81),
    ('SHI-001-L',  'Classic White Oxford Shirt - L',   280000, 30, 0, 81),
    ('SHI-005-S',  'Striped Cotton Polo - S',          220000, 35, 0, 85),
    ('SHI-005-M',  'Striped Cotton Polo - M',          220000, 50, 0, 85),
    ('SHI-005-L',  'Striped Cotton Polo - L',          220000, 35, 0, 85),
    ('SHO-001-39', 'Classic White Sneakers - EU 39',   650000, 20, 0, 101),
    ('SHO-001-40', 'Classic White Sneakers - EU 40',   650000, 25, 0, 101),
    ('SHO-001-41', 'Classic White Sneakers - EU 41',   650000, 20, 0, 101),
    ('SHO-001-42', 'Classic White Sneakers - EU 42',   650000, 15, 0, 101),
    ('PAN-002-29', 'Classic Straight Jeans - W29',     420000, 25, 0, 62),
    ('PAN-002-30', 'Classic Straight Jeans - W30',     420000, 35, 0, 62),
    ('PAN-002-32', 'Classic Straight Jeans - W32',     420000, 30, 0, 62),
    ('PAN-002-34', 'Classic Straight Jeans - W34',     420000, 20, 0, 62),
    ('BAG-001-BK', 'Classic Leather Tote Bag - Black', 780000, 35, 0, 41),
    ('BAG-001-BN', 'Classic Leather Tote Bag - Brown', 780000, 35, 0, 41);

-- ---- SEED: Product Attributes ----
INSERT INTO product_attributes (product_id, name, value) VALUES
    (81, 'Material','Premium cotton poplin'),(81,'Fit','Regular fit'),(81,'Care','Machine wash cold'),
    (85, 'Material','100% cotton pique'),   (85,'Fit','Slim fit'),   (85,'Sizes','S / M / L / XL'),
    (90, 'Material','Polyester-viscose'),   (90,'Closure','Single button'),(90,'Lining','Fully lined'),
    (101,'Upper','Genuine leather'),        (101,'Sole','Rubber outsole'),(101,'Closure','Lace-up'),
    (62, 'Fabric','98% cotton 2% elastane'),(62,'Rise','Mid-rise'),  (62,'Wash','Classic mid-blue'),
    (41, 'Material','Full-grain leather'),  (41,'Lining','Suede interior'),(41,'Closure','Magnetic snap');

-- ---- SEED: Stock Movements ----
INSERT INTO stock_movements (product_id, variant_id, quantity, type, reason, created_at) VALUES
    (81, 1, 30,'IMPORT','Initial stock - Classic White Oxford Shirt S', NOW()-INTERVAL '30 days'),
    (81, 2, 40,'IMPORT','Initial stock - Classic White Oxford Shirt M', NOW()-INTERVAL '30 days'),
    (81, 3, 30,'IMPORT','Initial stock - Classic White Oxford Shirt L', NOW()-INTERVAL '30 days'),
    (101,7, 20,'IMPORT','Initial stock - Classic White Sneakers EU 39', NOW()-INTERVAL '28 days'),
    (101,8, 25,'IMPORT','Initial stock - Classic White Sneakers EU 40', NOW()-INTERVAL '28 days'),
    (62, 11,25,'IMPORT','Initial stock - Classic Straight Jeans W29',  NOW()-INTERVAL '25 days'),
    (62, 12,35,'IMPORT','Initial stock - Classic Straight Jeans W30',  NOW()-INTERVAL '25 days'),
    (41, 15,35,'IMPORT','Initial stock - Classic Leather Tote Black',  NOW()-INTERVAL '20 days'),
    (41, 16,35,'IMPORT','Initial stock - Classic Leather Tote Brown',  NOW()-INTERVAL '20 days');

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('product_variants_id_seq', (SELECT MAX(id) FROM product_variants));

-- ================================================================
-- PRODUCT REVIEWS SCHEMA & SEED DATA
-- ================================================================
CREATE TABLE IF NOT EXISTS product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_review_images (
    id SERIAL PRIMARY KEY,
    media_id BIGINT NOT NULL,
    review_id INTEGER NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE
);

INSERT INTO product_reviews (product_id, user_id, rating, title, content, created_at, updated_at) VALUES
    (1, 1, 5, 'Rất ngon và dẻo', 'Xoài sấy dẻo ngọt vừa phải, không bị xơ, rất đáng tiền mua thử.', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    (1, 2, 4, 'Chất lượng ổn', 'Đóng gói đẹp mắt, xoài thơm ngon dẻo dẻo. Sẽ mua lại lần sau.', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    (21, 3, 5, 'Cốc sứ đẹp tinh xảo', 'Cốc làm thủ công rất tinh tế, cầm đầm tay, giữ nhiệt tốt.', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    (41, 1, 5, 'Túi da rất sang trọng', 'Da thật mềm mại, đường chỉ khâu tỉ mỉ và chắc chắn, để đồ đi làm thoải mái.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    (81, 2, 4, 'Áo oxford vừa vặn', 'Vải dày dặn, mặc đứng dáng và rất thoáng mát.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

SELECT setval('product_reviews_id_seq', (SELECT MAX(id) FROM product_reviews));

-- Note: product_images table intentionally left empty here as images are assigned dynamically via assign script.


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

-- Note: medias table intentionally left empty here as files are uploaded dynamically via assign script.

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
    (1,'SALE10','Sale 10% off','10% off up to 50k, min order 300k','PERCENT',10,50000,300000,500,1,NOW()-INTERVAL '30 days',NOW()+INTERVAL '60 days',true,NOW()-INTERVAL '30 days',NOW()-INTERVAL '5 days'),
    (2,'ONLINEPAY','Online payment deal','30k off for online payment orders','FIXED',30000,NULL,200000,300,0,NOW()-INTERVAL '15 days',NOW()+INTERVAL '45 days',true,NOW()-INTERVAL '15 days',NOW()-INTERVAL '1 day'),
    (3,'FREESHIP','Free shipping','Free shipping voucher','FREESHIP',0,NULL,0,200,1,NOW()-INTERVAL '10 days',NOW()+INTERVAL '30 days',true,NOW()-INTERVAL '10 days',NOW()-INTERVAL '5 days'),
    (4,'SALE20','Sale 20% off','20% off up to 80k, min order 500k','PERCENT',20,80000,500000,150,0,NOW()-INTERVAL '7 days',NOW()+INTERVAL '25 days',true,NOW()-INTERVAL '7 days',NOW()-INTERVAL '1 day'),
    (5,'WELCOME50','Welcome new customer','50k off first order from 400k','FIXED',50000,NULL,400000,120,0,NOW()-INTERVAL '20 days',NOW()+INTERVAL '40 days',true,NOW()-INTERVAL '20 days',NOW()-INTERVAL '2 days'),
    (6,'SUMMER15','Summer sale 15%','15% off up to 60k, min order 350k','PERCENT',15,60000,350000,220,0,NOW()-INTERVAL '5 days',NOW()+INTERVAL '35 days',true,NOW()-INTERVAL '5 days',NOW()-INTERVAL '1 day'),
    (7,'VIPSHIP','VIP free shipping','Free shipping for loyal customers','FREESHIP',0,NULL,200000,100,0,NOW()-INTERVAL '12 days',NOW()+INTERVAL '20 days',true,NOW()-INTERVAL '12 days',NOW()-INTERVAL '3 days');

SELECT setval('vouchers_id_seq', (SELECT MAX(id) FROM vouchers));

INSERT INTO voucher_conditions (voucher_id, condition_type, value) VALUES
    (1,'FIRST_ORDER','true'),
    (2,'USER_GROUP','ONLINE_CUSTOMER'),
    (3,'CATEGORY','ALL'),
    (4,'CATEGORY','FASHION'),
    (5,'FIRST_ORDER','true'),
    (6,'CATEGORY','SUMMER_COLLECTION'),
    (7,'USER_GROUP','VIP');

INSERT INTO voucher_usages (voucher_id, user_id, order_id, discount_amount, used_at) VALUES
    (1,1,1,50000,NOW()-INTERVAL '10 days'),
    (3,4,5,0,NOW()-INTERVAL '5 days'),
    (4,2,2,80000,NOW()-INTERVAL '2 days'),
    (6,3,3,45000,NOW()-INTERVAL '1 day');

INSERT INTO orders (order_number, user_id, total_price, shipping_street, shipping_city, shipping_district, shipping_country, shipping_carrier, tracking_number, shipping_fee, estimated_delivery, discount_code, discount_amount, tax_amount, tax_type, voucher_id, voucher_code, voucher_discount_amount, status, created_at, updated_at) VALUES
    ('ORD-20240501-001',1,770000,'123 Nguyen Hue','Ho Chi Minh','District 1','Viet Nam','GHN','GHN-TRK-001',30000,'2024-05-05','SALE10',50000,74000,'VAT10',1,'SALE10',50000,'DELIVERED',NOW()-INTERVAL '10 days',NOW()-INTERVAL '5 days'),
    ('ORD-20240502-002',2,265000,'789 Dinh Tien Hoang','Ha Noi','Hoan Kiem','Viet Nam','GHTK','GHTK-TRK-002',25000,'2024-05-07',NULL,0,24000,'VAT10',NULL,NULL,NULL,'PAID',NOW()-INTERVAL '3 days',NOW()-INTERVAL '2 days'),
    ('ORD-20240503-003',3,380000,'10 Tran Phu','Da Nang','Hai Chau','Viet Nam',NULL,NULL,NULL,NULL,NULL,0,38000,'VAT10',NULL,NULL,NULL,'PENDING',NOW()-INTERVAL '1 day',NOW()-INTERVAL '1 day'),
    ('ORD-20240504-004',1,510000,'123 Nguyen Hue','Ho Chi Minh','District 1','Viet Nam','VNPost','VNPOST-TRK-004',30000,'2024-05-10',NULL,0,48000,'VAT10',NULL,NULL,NULL,'SHIPPING',NOW()-INTERVAL '4 days',NOW()-INTERVAL '1 day'),
    ('ORD-20240505-005',4,310000,'55 Hung Vuong','Can Tho','Ninh Kieu','Viet Nam','GHN','GHN-TRK-005',20000,'2024-05-08','FREESHIP',0,29000,'VAT10',3,'FREESHIP',0,'CANCELLED',NOW()-INTERVAL '6 days',NOW()-INTERVAL '5 days');

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, tax_amount, discount_amount) VALUES
    (1,81,'Classic White Oxford Shirt',2,280000,56000,50000),
    (1,85,'Striped Cotton Polo',1,220000,22000,0),
    (2,101,'Classic White Sneakers',1,650000,65000,0),
    (3,62,'Classic Straight Jeans',1,420000,42000,0),
    (4,41,'Classic Leather Tote Bag',1,780000,78000,0),
    (5,83,'Slim Fit Formal Shirt',1,350000,35000,0);

INSERT INTO order_status_history (order_id, from_status, to_status, reason, changed_at) VALUES
    (1,NULL,'PENDING','Order created from cart',NOW()-INTERVAL '10 days'),
    (1,'PENDING','PAID','VNPay payment success',NOW()-INTERVAL '10 days'+INTERVAL '5 minutes'),
    (1,'PAID','SHIPPING','Handed over to GHN carrier',NOW()-INTERVAL '8 days'),
    (1,'SHIPPING','DELIVERED','Delivered successfully',NOW()-INTERVAL '5 days'),
    (2,NULL,'PENDING','Order created from checkout',NOW()-INTERVAL '3 days'),
    (2,'PENDING','PAID','Momo payment success',NOW()-INTERVAL '3 days'+INTERVAL '3 minutes'),
    (3,NULL,'PENDING','Order pending processing',NOW()-INTERVAL '1 day'),
    (4,NULL,'PENDING','Order created',NOW()-INTERVAL '4 days'),
    (4,'PENDING','PAID','VNPay payment success',NOW()-INTERVAL '4 days'+INTERVAL '2 minutes'),
    (4,'PAID','SHIPPING','Handed to VNPost',NOW()-INTERVAL '2 days'),
    (5,NULL,'PENDING','Order created',NOW()-INTERVAL '6 days'),
    (5,'PENDING','CANCELLED','Customer cancelled order',NOW()-INTERVAL '5 days');

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
    ('PAY-INIT-1',1,1,770000,'BANK_TRANSFER','COMPLETED',NOW()-INTERVAL '10 days',NOW()-INTERVAL '10 days'),
    ('PAY-INIT-2',2,2,265000,'WALLET','COMPLETED',NOW()-INTERVAL '3 days',NOW()-INTERVAL '3 days'),
    ('PAY-INIT-3',3,3,380000,'COD','PENDING',NULL,NOW()-INTERVAL '1 day'),
    ('PAY-INIT-4',4,1,510000,'BANK_TRANSFER','COMPLETED',NOW()-INTERVAL '4 days',NOW()-INTERVAL '4 days'),
    ('PAY-INIT-5',5,4,310000,'WALLET','REFUNDED',NOW()-INTERVAL '5 days',NOW()-INTERVAL '6 days');

INSERT INTO payment_transactions (order_id, transaction_id, gateway_provider, raw_response, status, created_at) VALUES
    (1,'VNPAY-TXN-00000001','VNPay','{"vnp_ResponseCode":"00","vnp_TransactionStatus":"00","vnp_Amount":"77000000"}','SUCCESS',NOW()-INTERVAL '10 days'),
    (2,'MOMO-TXN-00000002','MoMo','{"resultCode":0,"message":"Success","transId":"MOMO-3192837"}','SUCCESS',NOW()-INTERVAL '3 days'),
    (4,'VNPAY-TXN-00000004','VNPay','{"vnp_ResponseCode":"00","vnp_TransactionStatus":"00","vnp_Amount":"51000000"}','SUCCESS',NOW()-INTERVAL '4 days'),
    (5,'MOMO-TXN-00000005','MoMo','{"resultCode":0,"message":"Refund success","transId":"MOMO-9876543"}','REFUNDED',NOW()-INTERVAL '5 days'),
    (3,NULL,'InternalMock','{"status":"pending","method":"COD"}','PENDING',NOW()-INTERVAL '1 day');
