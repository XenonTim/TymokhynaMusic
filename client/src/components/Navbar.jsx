// client/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUsername } from '../utils/auth.js';

const Navbar = ({ role, onAuthChange }) => {
    const navigate = useNavigate();
    const username = getUsername();

    const handleLogout = () => {
        logout();
        onAuthChange();
        navigate('/auth');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to={role ? (role === 'admin' ? '/admin' : '/user') : '/auth'}>
                    Music
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                    <div className="d-flex">
                        {role ? (
                            <>
                                <span className="navbar-text me-3 text-white">
                                    Вітаємо, {username} ({role === 'admin' ? 'Адмін' : 'Користувач'})
                                </span>
                                <button className="btn btn-outline-light" onClick={handleLogout}>
                                    Вихід
                                </button>
                            </>
                        ) : (
                            <Link className="btn btn-outline-light" to="/auth">Вхід / Реєстрація</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;