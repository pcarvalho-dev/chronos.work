import { DataSource } from "typeorm";
import { User } from "../models/User.js";
import { UserCheckIn } from "../models/UserCheckIn.js";
import "reflect-metadata";
import "dotenv/config";
import dotenv from 'dotenv';
import dns from 'dns';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Force IPv4 resolution to avoid ENETUNREACH errors on Render/Supabase
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

// Detect if running compiled code (production) or TypeScript (development)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProduction = __dirname.includes('dist');

// Use appropriate migration paths based on environment
const migrationPaths = isProduction
    ? ["dist/database/migrations/*.js"]
    : ["src/database/migrations/*.ts"];

// Check if using connection string (recommended for production)
const useConnectionString = !!process.env.DATABASE_URL;

if (useConnectionString) {
    console.log('✓ Using DATABASE_URL for database connection');
} else {
    console.log('✓ Using individual DB_* variables for database connection');
    // Validate required environment variables for individual config
    const requiredEnvVars = ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'] as const;
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar} or DATABASE_URL`);
        }
    }
}

export const AppDataSource = new DataSource(
    useConnectionString
        ? {
            // Production configuration using connection string (Supabase, Render, etc.)
            type: 'postgres',
            url: process.env.DATABASE_URL!,
            ssl: {
                rejectUnauthorized: false
            },
            extra: {
                // Force IPv4 at the driver level
                host: undefined, // Let URL parser handle it
                ssl: {
                    rejectUnauthorized: false
                },
                connectionTimeoutMillis: 30000, // 30 seconds
                query_timeout: 30000,
                statement_timeout: 30000,
                // Disable IPv6
                keepAlive: true,
                keepAliveInitialDelayMillis: 10000,
            },
            synchronize: false,
            logging: true, // Enable logging to debug connection issues
            entities: [User, UserCheckIn],
            migrations: migrationPaths,
            subscribers: [],
        }
        : {
            // Development configuration using individual variables
            type: 'postgres',
            host: process.env.DB_HOST!,
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME!,
            password: process.env.DB_PASSWORD!,
            database: process.env.DB_DATABASE!,
            extra: {
                ssl: process.env.DB_SSL === 'true' ? {
                    rejectUnauthorized: false
                } : undefined,
                connectionTimeoutMillis: 10000,
            },
            ssl: process.env.DB_SSL === 'true' ? {
                rejectUnauthorized: false
            } : false,
            synchronize: false,
            logging: false,
            entities: [User, UserCheckIn],
            migrations: migrationPaths,
            subscribers: [],
        }
);