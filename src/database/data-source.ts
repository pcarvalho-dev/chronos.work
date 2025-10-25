import { DataSource } from "typeorm";
import { User } from "../models/User.js";
import { UserCheckIn } from "../models/UserCheckIn.js";
import "reflect-metadata";
import "dotenv/config";

// Load environment variables
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'] as const;
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    extra: {
        family: 4
    },
    synchronize: false,
    logging: false,
    entities: [User, UserCheckIn],
    migrations: ["src/database/migrations/*.ts"],
    subscribers: [],
});
