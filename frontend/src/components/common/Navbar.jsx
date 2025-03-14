import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService';

function Navbar({ setIsAdmin }) {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [isAdmin, setIsAdminState] = useState(UserService.isAdmin());

    useEffect(() => {
        const updateAuthStatus = () => {
            setIsAuthenticated(UserService.isAuthenticated());
            setIsAdminState(UserService.isAdmin());
            setIsAdmin(UserService.isAdmin()); // Cập nhật state ở App.jsx
        };

        window.addEventListener("storage", updateAuthStatus);
        return () => window.removeEventListener("storage", updateAuthStatus);
    }, [setIsAdmin]); // Đảm bảo hiệu ứng này có thể truy cập setIsAdmin từ props

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout this user?')) {
            UserService.logout();
            setIsAuthenticated(false);
            setIsAdminState(false);
            setIsAdmin(false); // Cập nhật state trong App.jsx
        }
    };

    return (
        <nav>
            <ul>
                {!isAuthenticated && <li><Link to="/">JB Dev</Link></li>}
                {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                {isAdmin && <li><Link to="/admin/user-management">User Management</Link></li>}
                {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
            </ul>
        </nav>
    );
}

export default Navbar;
