-- Create databases
CREATE DATABASE user_db;
CREATE DATABASE product_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE notification_db;

-- Create users with passwords
CREATE USER "user" WITH PASSWORD 'password';
CREATE USER "product" WITH PASSWORD 'password';
CREATE USER "order" WITH PASSWORD 'password';
CREATE USER "payment" WITH PASSWORD 'password';
CREATE USER "notification" WITH PASSWORD 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE user_db TO "user";
GRANT ALL PRIVILEGES ON DATABASE product_db TO "product";
GRANT ALL PRIVILEGES ON DATABASE order_db TO "order";
GRANT ALL PRIVILEGES ON DATABASE payment_db TO "payment";
GRANT ALL PRIVILEGES ON DATABASE notification_db TO "notification";

-- Grant schema privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "product";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "order";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "payment";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "notification";
