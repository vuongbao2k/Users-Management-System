import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserService from '../service/UserService';

function LoginPage({ setIsAdmin }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await UserService.login(email, password);
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('refreshToken', userData.refreshToken);
        localStorage.setItem('role', userData.role);
        
        setIsAdmin(UserService.adminOnly());
        window.dispatchEvent(new Event("storage"));  // 🔥 Đảm bảo UI thay đổi

        navigate('/profile'); 
      } else {
        setError(userData.error)
      }
    } catch (error) {
      console.log(error);
      setError(error);
      setTimeout(() => {
        setError('');
      }, 5000)
    }
  }

  return (
    <div className='auth-container'>
      <h2>Login</h2>
      {error && <p className='error-message'>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label >Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='form-group'>
          <label >Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginPage