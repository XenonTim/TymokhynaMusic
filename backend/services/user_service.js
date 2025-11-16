// services/user_service.js
import bcrypt from 'bcrypt';
import User from '../models/user_model.js'; // Ваш файл моделі

const SALT_ROUNDS = 10;

class UserService {

    async registerUser(username, password) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('Користувач з таким логіном вже існує.');
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({ username, passwordHash });
        await newUser.save();

        return { id: newUser._id, username: newUser.username, role: newUser.role };
    }

    async loginUser(username, password) {
        const userRecord = await User.findOne({ username });

        if (!userRecord) {
            return null;
        }

        const match = await bcrypt.compare(password, userRecord.passwordHash);

        if (match) {
            return { id: userRecord._id, username: userRecord.username, role: userRecord.role };
        } else {
            return null;
        }
    }
}

export default new UserService();