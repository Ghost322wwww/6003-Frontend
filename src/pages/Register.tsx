import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [signupCode, setSignupCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await api.post('/auth/register', {
        username,
        email,
        password,
        signupCode,
      });

      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          type="email"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <input
          value={signupCode}
          onChange={e => setSignupCode(e.target.value)}
          placeholder="Sign Up Code (if any)"
        />
        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p className="link-text">
        Already have an account?{' '}
        <span onClick={() => navigate('/login')}>Log in</span>
      </p>
    </div>
  );
};

export default Register;
