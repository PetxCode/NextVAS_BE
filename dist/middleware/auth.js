import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.userId = decodedToken.userId;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};
//# sourceMappingURL=auth.js.map