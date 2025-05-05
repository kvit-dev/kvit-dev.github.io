import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, signUp } from '../firebase/auth';
import "../styles/login.css";

function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Заповніть всі поля');
      return;
    }

    try {
      if (isRegistering) {
        await signUp(email, password);
      } else {
        await login(email, password);
      }
      navigate('/profile'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegistering ? 'Реєстрація' : 'Вхід'}</h2>
      <form onSubmit={handleSubmit} className='form'>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='input'
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='input'
        />
        {error && <div className='error'>{error}</div>}
        <button type="submit" className='auth-button'>
          {isRegistering ? 'Зареєструватись' : 'Увійти'}
        </button>
      </form>
      <p>
        {isRegistering ? 'Вже маєте акаунт?' : 'Немає акаунта?'}{' '}
        <span
          onClick={() => setIsRegistering(!isRegistering)}
          className='toggle'
        >
          {isRegistering ? 'Увійдіть' : 'Зареєструйтесь'}
        </span>
      </p>
      <p className="back-link-container">
        <Link to="/" className="back-link">На головну</Link>
      </p>
    </div>
  );
}
export default LoginPage;

