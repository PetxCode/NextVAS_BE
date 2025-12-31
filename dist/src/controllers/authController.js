import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        // Create user
        const user = new User({
            email,
            password: hashedPassword,
            name
        });
        await user.save();
        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, email, name, subscription: user.subscription } });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                classLevel: user.classLevel,
                term: user.term,
                subject: user.subject,
                assimilationLevel: user.assimilationLevel,
                voiceName: user.voiceName,
                theme: user.theme,
                subscription: user.subscription
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const { name, classLevel, term, subject, assimilationLevel, voiceName, theme } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (name)
            user.name = name;
        if (classLevel)
            user.classLevel = classLevel;
        if (term)
            user.term = term;
        if (subject)
            user.subject = subject;
        if (assimilationLevel)
            user.assimilationLevel = assimilationLevel;
        if (voiceName)
            user.voiceName = voiceName;
        if (theme)
            user.theme = theme;
        await user.save();
        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            classLevel: user.classLevel,
            term: user.term,
            subject: user.subject,
            assimilationLevel: user.assimilationLevel,
            voiceName: user.voiceName,
            theme: user.theme,
            subscription: user.subscription
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong during update' });
    }
};
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = req.file.path; // Cloudinary URL
        // Update user's avatar field
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.avatar = imageUrl;
        await user.save();
        res.json({ avatar: imageUrl });
    }
    catch (err) {
        console.error("Upload error details:", err);
        console.log("Current User ID:", req.userId);
        res.status(500).json({
            message: 'Image upload failed',
            error: err instanceof Error ? err.message : String(err),
            details: err
        });
    }
};
export const recordSession = async (req, res) => {
    try {
        const { minutes, isNewSession } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const today = new Date().toISOString().split('T')[0];
        // Check if entry for today exists
        const logIndex = user.activityLog.findIndex((log) => log.date === today);
        if (logIndex > -1) {
            if (minutes)
                user.activityLog[logIndex].minutes += minutes;
            if (isNewSession)
                user.activityLog[logIndex].sessions += 1;
        }
        else {
            user.activityLog.push({
                date: today,
                minutes: minutes || 0,
                sessions: isNewSession ? 1 : 0
            });
        }
        // Keep only last 30 days of logs to avoid document bloat
        if (user.activityLog.length > 30) {
            user.activityLog.shift();
        }
        user.markModified('activityLog');
        await user.save();
        res.json({ activityLog: user.activityLog });
    }
    catch (err) {
        console.error("Session recording error:", err);
        res.status(500).json({ message: 'Failed to record session' });
    }
};
//# sourceMappingURL=authController.js.map