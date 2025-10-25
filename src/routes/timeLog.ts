import { Router } from 'express';
import { TimeLogController } from '../controllers/TimeLogController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { checkinUpload } from '../config/multer.js';

const router = Router();

// Test endpoint (no authentication required)
router.get('/test', (req, res) => {
    res.json({
        message: 'TimeLog API is working!',
        timestamp: new Date().toISOString(),
        authenticated: !!req.isAuthenticated?.()
    });
});

router.post('/checkin', isAuthenticated, checkinUpload.single('photo'), TimeLogController.checkIn);

router.post('/checkout', isAuthenticated, checkinUpload.single('photo'), TimeLogController.checkOut);

router.get('/', isAuthenticated, TimeLogController.getTimeLogs);

export default router;
