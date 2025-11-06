-- ==============================================================================
-- Database Initialization Script
-- Chronos.work API - PostgreSQL
-- ==============================================================================

-- Create database if not exists (already done by docker-compose)
-- This script runs after database creation

-- Set timezone
SET timezone = 'America/Sao_Paulo';

-- Enable UUID extension (if needed in future)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a basic health check function
CREATE OR REPLACE FUNCTION public.health_check()
RETURNS TABLE(status TEXT, timestamp TIMESTAMPTZ) AS $$
BEGIN
    RETURN QUERY SELECT 'healthy'::TEXT, NOW();
END;
$$ LANGUAGE plpgsql;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Chronos.work database initialized successfully at %', NOW();
END $$;
