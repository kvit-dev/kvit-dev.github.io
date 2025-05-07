import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, signUp, signInWithGoogle, getGoogleRedirectResult, resetPassword } from '../firebase/auth';
import { saveUserProfile, getUserProfile } from '../firebase/database';
import "../styles/login.css";

function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        setIsLoading(true);
        const user = await getGoogleRedirectResult();
        if (user) {
          const existingProfile = await getUserProfile(user.uid);
          
          if (!existingProfile) {
            await saveUserProfile(user.uid, {
              email: user.email,
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString(),
            });
          }
          navigate('/profile');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkRedirectResult();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (isForgotPassword) {
      if (!email) {
        setError('Будь ласка, введіть ваш email');
        return;
      }

      try {
        setIsLoading(true);
        await resetPassword(email);
        setSuccessMessage('Вказівки щодо відновлення пароля надіслано на вказану електронну пошту');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setError('Заповніть всі поля');
      return;
    }

    try {
      setIsLoading(true);
      if (isRegistering) {
        const user = await signUp(email, password);
        
        await saveUserProfile(user.uid, {
          email: user.email,
          displayName: '',
          createdAt: new Date().toISOString(),
        });
      } else {
        await login(email, password);
      }
      navigate('/profile'); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      const user = await signInWithGoogle();
      if (user) {
        const existingProfile = await getUserProfile(user.uid);
        if (!existingProfile) {
          await saveUserProfile(user.uid, {
            enail: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
          });
        }
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setError('');
    setSuccessMessage('');
  };

  if (isForgotPassword) {
    return (
      <div className="auth-container">
        <h2>Відновлення пароля</h2>
        <p className="forgot-password-info">
          Введіть ваш email
        </p>
        <form onSubmit={handleSubmit} className='form'>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input'
            disabled={isLoading}
          />
          {error && <div className='error'>{error}</div>}
          {successMessage && <div className='success'>{successMessage}</div>}
          <button 
            type="submit" 
            className='auth-button'
            disabled={isLoading}
          >
            {isLoading ? 'Надсилання...' : 'Відновити пароль'}
          </button>
        </form>
        <p>
          <span
            onClick={handleBackToLogin}
            className='toggle'
          >
            Повернутися до входу
          </span>
        </p>
        <p className="back-link-container">
          <Link to="/" className="back-link">На головну</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>{isRegistering ? 'Реєстрація' : 'Вхід'}</h2>
      
      <button 
        onClick={handleGoogleSignIn} 
        className="google-button"
        disabled={isLoading}
      >
        <img 
          src="/assets/icons/google-logo.svg" 
          alt="Google" 
          className="google-icon" 
        />
        {isRegistering ? 'Зареєструватись через Google' : 'Увійти через Google'}
      </button>
      
      <div className="separator">
        <span>або</span>
      </div>
      
      <form onSubmit={handleSubmit} className='form'>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='input'
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='input'
          disabled={isLoading}
        />
        {!isRegistering && (
          <div className="forgot-password-link">
            <span 
              onClick={() => setIsForgotPassword(true)}
              className='toggle'
            >
              Забули пароль?
            </span>
          </div>
        )}
        {error && <div className='error'>{error}</div>}
        <button 
          type="submit" 
          className='auth-button'
          disabled={isLoading}
        >
          {isLoading ? 'Завантаження...' : (isRegistering ? 'Зареєструватись' : 'Увійти')}
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
