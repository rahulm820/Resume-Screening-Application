import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import './Home.css';

const Home = () => {
  const [active, setActive] = useState(false);
  const [loginRole, setLoginRole] = useState('Job Seeker');
  const [registerRole, setRegisterRole] = useState('Job Seeker');

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });

  const navigate = useNavigate();  // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: loginData.username,
        password: loginData.password,
        role: loginRole,
      });
      alert(`Login successful: ${response.data.message}`);
      // Store token in localStorage
      localStorage.setItem('token', response.data.auth_token);

      // Navigate based on the role
      if (loginRole === 'Recruiter') {
        navigate('/recruiter');  // Redirect to Recruiter's Dashboard
      } else if (loginRole === 'Job Seeker') {
        navigate('/student');  // Redirect to Job Seeker's Dashboard
      }
    } catch (error) {
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username: registerData.username,
        password: registerData.password,
        role: registerRole,
      });
      alert(`Registration successful: ${response.data.message}`);
      setActive(false); // move to login
    } catch (error) {
      alert(`Registration failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className={`container ${active ? 'active' : ''}`}>
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              required
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="input-box">
            <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)} required>
              <option value="Job Seeker">Job Seeker</option>
              <option value="Recruiter">Recruiter</option>
            </select>
            <i className="bx bxs-user-badge"></i>
          </div>
          <div className="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
      </div>

      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Registration</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              required
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="input-box">
            <select value={registerRole} onChange={(e) => setRegisterRole(e.target.value)} required>
              <option value="Job Seeker">Job Seeker</option>
              <option value="Recruiter">Recruiter</option>
            </select>
            <i className="bx bxs-user-badge"></i>
          </div>
          <button type="submit" className="btn">Register</button>
        </form>
      </div>

      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn register-btn" onClick={() => setActive(true)}>Register</button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn login-btn" onClick={() => setActive(false)}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
