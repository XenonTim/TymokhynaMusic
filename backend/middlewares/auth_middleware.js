// middleware/auth.js
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Потрібен авторизаційний токен.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error("Помилка: JWT_SECRET не завантажено. Перевірте dotenv.config() в index.js");
            return res.status(500).json({ message: 'Помилка сервера: Секретний ключ відсутній.' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {

        return res.status(401).json({ message: 'Недійсний або прострочений токен.' });
    }
};

export default authMiddleware;
