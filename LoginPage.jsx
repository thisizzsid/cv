import React, { useState } from 'react';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { signIn, signUp } from './firebase-auth';

export default function LoginPage({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      onAuthSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2F5D50 0%, #33465C 100%);
          font-family: 'Inter', sans-serif;
        }
        .auth-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          padding: 40px;
          width: 100%;
          max-width: 400px;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .auth-header h1 {
          font-family: 'Newsreader', serif;
          font-size: 28px;
          margin: 0 0 10px;
          color: #1C1F26;
        }
        .auth-header p {
          color: #565B66;
          font-size: 14px;
          margin: 0;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .auth-input-group label {
          font-size: 12.5px;
          font-weight: 600;
          color: #565B66;
        }
        .auth-input-group input {
          padding: 11px 13px;
          border: 1px solid #E3E1DA;
          border-radius: 6px;
          font-size: 13.5px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .auth-input-group input:focus {
          border-color: #2F5D50;
        }
        .auth-button {
          padding: 11px;
          background: #2F5D50;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
        }
        .auth-button:hover:not(:disabled) {
          background: #245241;
        }
        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .auth-error {
          background: #FEE5E5;
          border: 1px solid #FACAC8;
          color: #C22C2C;
          padding: 12px;
          border-radius: 6px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
        }
        .auth-toggle {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: #565B66;
        }
        .auth-toggle button {
          background: none;
          border: none;
          color: #2F5D50;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }
        .auth-divider {
          text-align: center;
          color: #9A9EA6;
          font-size: 12px;
          margin: 20px 0;
        }
      `}</style>

      <div className="auth-card">
        <div className="auth-header">
          <h1>Lets make CV</h1>
          <p>{isSignUp ? 'Create your account' : 'Sign in to your account'}</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="auth-input-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required={isSignUp}
              />
            </div>
          )}

          <div className="auth-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {isSignUp ? (
              <>
                <UserPlus size={16} />
                {loading ? 'Creating account...' : 'Create Account'}
              </>
            ) : (
              <>
                <LogIn size={16} />
                {loading ? 'Signing in...' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        <div className="auth-toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
