import { signup, login, getProfile, updateProfile, uploadAvatar, recordSession, upgradeSubscription } from '../controllers/authController.js';
// ...
router.post('/upgrade', authMiddleware, upgradeSubscription);
router.post('/record-session', authMiddleware, recordSession);

export default router;
