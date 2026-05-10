-- ================================
-- CREATE DATABASES
-- ================================
CREATE DATABASE user_db;
CREATE DATABASE product_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE keycloak_db;
CREATE DATABASE notification_db;

-- ================================
-- SEED DATA FOR PRODUCT SERVICE
-- ================================
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

-- Tự động sinh 10 Category ngẫu nhiên
DO $$
BEGIN
    FOR i IN 1..10 LOOP
        INSERT INTO categories (name, description)
        VALUES ('Category ' || i, 'Description for category number ' || i)
        ON CONFLICT (name) DO NOTHING;
    END LOOP;
END $$;

-- Tự động sinh 10,000 sản phẩm ngẫu nhiên
-- Sử dụng generate_series để đạt tốc độ cao nhất
INSERT INTO products (sku, name, category_id, description, price, stock, reserved_stock, version, active, created_at, updated_at)
SELECT 
    'PROD-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)),
    'Ultimate Product ' || i,
    (SELECT id FROM categories ORDER BY RANDOM() LIMIT 1),
    'Description for product ' || i || '. This is a large scale performance test data.',
    (RANDOM() * 5000 + 5)::NUMERIC(19,2),
    (RANDOM() * 1000)::INT,
    0,
    0,
    true,
    NOW(),
    NOW()
FROM generate_series(1, 10000) s(i);

-- ================================
-- SEED DATA FOR USER SERVICE
-- ================================
\c user_db;

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

-- Tự động sinh 20 User ngẫu nhiên
DO $$
BEGIN
    FOR i IN 1..20 LOOP
        INSERT INTO users (keycloak_id, username, email, first_name, last_name, active, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'user_' || i,
            'user' || i || '@example.com',
            'FirstName' || i,
            'LastName' || i,
            true,
            NOW(),
            NOW()
        );
    END LOOP;
END $$;
