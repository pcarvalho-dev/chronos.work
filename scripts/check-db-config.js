// Database configuration checker
import 'dotenv/config';

console.log('\n=== Database Configuration Check ===\n');

if (process.env.DATABASE_URL) {
    console.log('✓ DATABASE_URL is set');

    // Parse the URL to show host (without password)
    try {
        const url = new URL(process.env.DATABASE_URL);
        console.log(`  Host: ${url.hostname}`);
        console.log(`  Port: ${url.port || 5432}`);
        console.log(`  Database: ${url.pathname.slice(1)}`);
        console.log(`  Username: ${url.username}`);
        console.log(`  Password: ${url.password ? '***' + url.password.slice(-4) : 'NOT SET'}`);

        // Check if it's IPv6
        if (url.hostname.includes(':')) {
            console.log('⚠️  WARNING: Hostname appears to be IPv6!');
            console.log('   This may cause ENETUNREACH errors on Render.');
        } else {
            console.log('✓ Hostname appears to be a domain name (good!)');
        }
    } catch (error) {
        console.log('✗ Error parsing DATABASE_URL:', error.message);
    }
} else {
    console.log('ℹ Using individual DB_* variables');
    console.log(`  DB_HOST: ${process.env.DB_HOST || 'NOT SET'}`);
    console.log(`  DB_PORT: ${process.env.DB_PORT || 'NOT SET'}`);
    console.log(`  DB_USERNAME: ${process.env.DB_USERNAME || 'NOT SET'}`);
    console.log(`  DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-4) : 'NOT SET'}`);
    console.log(`  DB_DATABASE: ${process.env.DB_DATABASE || 'NOT SET'}`);
}

console.log('\n=== Node.js DNS Configuration ===\n');
console.log(`  Node Version: ${process.version}`);
console.log(`  Platform: ${process.platform}`);
console.log(`  Architecture: ${process.arch}`);

if (process.env.NODE_OPTIONS) {
    console.log(`  NODE_OPTIONS: ${process.env.NODE_OPTIONS}`);
} else {
    console.log('  NODE_OPTIONS: NOT SET');
}

console.log('\n====================================\n');
