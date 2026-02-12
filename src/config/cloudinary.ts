import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

// Configure Cloudinary (warn if not configured)
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    console.warn('⚠️  Cloudinary environment variables not configured. File uploads will not work.');
} else {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
    });
}

export default cloudinary;
