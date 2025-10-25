import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';
import path from 'path';

// Cloudinary storage for profile photos
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chronos-work/profiles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
        public_id: (req: any, file: any) => `profile-${Date.now()}`
    } as any
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo inválido. Apenas JPEG, JPG, PNG e GIF são permitidos.'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Cloudinary storage for check-in/check-out photos
const checkinStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chronos-work/checkins',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
        public_id: (req: any, file: any) => `checkin-${Date.now()}`
    } as any
});

export const checkinUpload = multer({
    storage: checkinStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
