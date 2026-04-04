-- =============================================================================
-- IBMP Platform - Production Database Setup
-- =============================================================================
-- Run these commands as PostgreSQL superuser (postgres)
-- =============================================================================

-- Create the database
CREATE DATABASE ibmp_production;

-- Create application user with password
CREATE USER ibmp_app WITH ENCRYPTED PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ibmp_production TO ibmp_app;

-- Connect to the database
\c ibmp_production

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO ibmp_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ibmp_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ibmp_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ibmp_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ibmp_app;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

