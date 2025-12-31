import express from 'express';
import { signup, login, getProfile, updateProfile, uploadAvatar, recordSession } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.patch('/update', authMiddleware, updateProfile);
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
router.post('/record-session', authMiddleware, recordSession);
export default router;
//# sourceMappingURL=authRoutes.js.map