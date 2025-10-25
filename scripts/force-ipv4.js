// Force IPv4 resolution for Node.js DNS lookups
// This script must run before any database connections
import dns from 'dns';

// Set DNS resolution to prefer IPv4
dns.setDefaultResultOrder('ipv4first');

console.log('✓ DNS configured to prefer IPv4');
