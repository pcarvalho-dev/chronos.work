import { Router } from 'express';
import { TimeLogController } from '../controllers/TimeLogController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { checkinUpload } from '../config/multer.js';
import { validate } from '../middlewares/validate.js';
import {
    manualCheckInSchema,
    manualCheckOutSchema,
    approveTimeLogSchema,
    rejectTimeLogSchema
} from '../schemas/manualTimeLogSchema.js';

const router = Router();

// Test endpoint (no authentication required)
router.get('/test', (req, res) => {
    res.json({
        message: 'TimeLog API is working!',
        timestamp: new Date().toISOString(),
        authenticated: !!req.isAuthenticated?.()
    });
});

// Regular check-in/check-out with photo
router.post('/checkin', isAuthenticated, checkinUpload.single('photo'), TimeLogController.checkIn);

router.post('/checkout', isAuthenticated, checkinUpload.single('photo'), TimeLogController.checkOut);

// Manual check-in/check-out (retroactive)
router.post('/manual-checkin', isAuthenticated, validate(manualCheckInSchema), TimeLogController.manualCheckIn);

router.post('/manual-checkout', isAuthenticated, validate(manualCheckOutSchema), TimeLogController.manualCheckOut);

// Approval/rejection routes (manager only)
router.post('/approve', isAuthenticated, validate(approveTimeLogSchema), TimeLogController.approveTimeLog);

router.post('/reject', isAuthenticated, validate(rejectTimeLogSchema), TimeLogController.rejectTimeLog);

router.get('/pending', isAuthenticated, TimeLogController.getPendingTimeLogs);

// Get all time logs
router.get('/', isAuthenticated, TimeLogController.getTimeLogs);

export default router;
