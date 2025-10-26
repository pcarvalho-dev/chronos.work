import { AppDataSource } from '../dist/database/data-source.js';

async function runMigration() {
    try {
        console.log('Initializing database connection...');
        await AppDataSource.initialize();
        console.log('Database connection initialized successfully!');

        console.log('Running migration...');
        await AppDataSource.runMigrations();
        console.log('Migration completed successfully!');

        await AppDataSource.destroy();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error running migration:', error);
        process.exit(1);
    }
}

runMigration();