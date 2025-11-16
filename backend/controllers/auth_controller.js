// controllers/auth_controller.js
import jwt from 'jsonwebtoken';
import userService from '../services/user_service.js';

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const newUser = await userService.registerUser(username, password);

        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
            message: 'Користувач успішно зареєстрований.'
        });

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userService.loginUser(username, password);

        if (!user) {
            return res.status(401).json({ message: 'Неправильний логін або пароль.' });
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role, username: user.username });

    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера під час входу.' });
    }
};