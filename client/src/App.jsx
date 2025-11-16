import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUserRole } from './utils/auth.js';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; //  ІМПОРТОВАНО
import AuthPage from './pages/AuthPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [role, setRole] = useState(getUserRole());

    const handleAuthChange = () => {
        setRole(getUserRole());
    };

    return (
        <BrowserRouter>
            <Navbar role={role} onAuthChange={handleAuthChange} />

            <div className="container mt-4">
                <Routes>
                    <Route path="*" element={<h1>Тест: Роутер працює</h1>} />

                    <Route
                        path="/"
                        element={<Navigate to={role ? (role === 'admin' ? '/admin' : '/user') : '/auth'} replace />}
                    />

                    <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthChange} />} />

                    <Route
                        path="/user"
                        element={
                            <ProtectedRoute
                                element={UserDashboard}
                                onAuthChange={handleAuthChange}
                            />
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute
                                element={AdminDashboard}
                                adminOnly={true}
                                onAuthChange={handleAuthChange}
                            />
                        }
                    />

                    <Route path="*" element={<h1>404 | Сторінка не знайдена</h1>} />

                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;