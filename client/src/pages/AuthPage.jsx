// client/src/pages/AuthPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/api.js';
import { saveAuthData } from '../utils/auth.js';

const AuthPage = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let response;
            if (isLogin) {
                response = await authApi.login(username, password);
            } else {
                await authApi.register(username, password);
                response = await authApi.login(username, password);
            }

            const { token, role, userId, username: loggedInUsername } = response.data;
            saveAuthData(token, role, userId, loggedInUsername);

            onAuthSuccess();
            navigate(role === 'admin' ? '/admin' : '/user', { replace: true });

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Помилка авторизації/реєстрації.';
            setError(errorMessage);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow-lg">
                    <div className="card-header text-center bg-primary text-white">
                        <h3>{isLogin ? 'Вхід' : 'Реєстрація'}</h3>
                    </div>
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Логін</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Пароль</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100 mb-3">
                                {isLogin ? 'Увійти' : 'Зареєструватися'}
                            </button>
                        </form>
                        <p className="text-center">
                            {isLogin ? 'Не маєте акаунта?' : 'Вже зареєстровані?'}
                            <button
                                className="btn btn-link"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Зареєструватися' : 'Увійти'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;