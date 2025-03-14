import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/common/Navbar';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import FooterComponent from './components/common/Footer';
import UserService from './components/service/UserService';
import UpdateUser from './components/userspage/UpdateUser';
import UserManagementPage from './components/userspage/UserManagementPage';
import ProfilePage from './components/userspage/ProfilePage';
import { useState, useEffect } from "react";




function App() {
  const [isAdmin, setIsAdmin] = useState(UserService.adminOnly());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(UserService.adminOnly()); // Cập nhật lại trạng thái khi localStorage thay đổi
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar setIsAdmin={setIsAdmin} />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<LoginPage setIsAdmin={setIsAdmin} />} />
            <Route exact path="/login" element={<LoginPage setIsAdmin={setIsAdmin} />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Check if user is authenticated and admin before rendering admin-only routes */}
            {isAdmin && (
              <>
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/admin/user-management" element={<UserManagementPage />} />
                <Route path="/update-user/:userId" element={<UpdateUser />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/login" />} />‰
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;