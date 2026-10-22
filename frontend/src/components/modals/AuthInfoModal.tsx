import React, { useState } from 'react';
import { CloseIcon, ShieldCheckIcon } from '../common/Icons';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthInfoModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!identifier.trim() || !password) {
      setError('Please provide your email/phone and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier.trim(), password);
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.details) setFieldErrors(err.details);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!fullName.trim() || !phoneNumber.trim() || !signupPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() ? email.trim() : undefined,
        password: signupPassword,
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.details) setFieldErrors(err.details);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Signup failed. Please check the provided information.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickFill = (demoEmail: string, demoPass: string) => {
    setTab('login');
    setIdentifier(demoEmail);
    setPassword(demoPass);
    setError(null);
    setFieldErrors({});
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-auth-title"
    >
      <div
        className="modal-content"
        style={{ maxWidth: '440px', padding: '1.75rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0d9488' }}>
            <ShieldCheckIcon size={26} />
            <h3
              id="modal-auth-title"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}
            >
              Trust<span style={{ color: '#0d9488' }}>Stay</span> Authentication
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
            aria-label="Close dialog"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        {/* Tab selection */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            style={{
              flex: 1,
              padding: '0.6rem 0',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: tab === 'login' ? '#0d9488' : '#64748b',
              borderBottom: tab === 'login' ? '2px solid #0d9488' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(null); }}
            style={{
              flex: 1,
              padding: '0.6rem 0',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: tab === 'signup' ? '#0d9488' : '#64748b',
              borderBottom: tab === 'signup' ? '2px solid #0d9488' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            Create Tenant Account
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              borderRadius: '8px',
              border: '1px solid #fecaca',
              fontSize: '0.86rem',
              marginBottom: '1rem',
              lineHeight: '1.4',
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Email or Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. niketan@truststay.demo or +000-000-0000"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
              {fieldErrors.identifier && (
                <span style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '0.2rem', display: 'block' }}>
                  {fieldErrors.identifier}
                </span>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
              {fieldErrors.password && (
                <span style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '0.2rem', display: 'block' }}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Quick Demo Login Credentials */}
            <div style={{ marginTop: '1.25rem', padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                One-Click Demo Accounts
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => quickFill('niketan@truststay.demo', 'Admin123!')}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.6rem',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#0f172a',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span><strong>Admin:</strong> Niketan</span>
                  <span style={{ color: '#0d9488', fontWeight: 600 }}>niketan@truststay.demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickFill('owner@truststay.demo', 'Owner123!')}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.6rem',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#0f172a',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span><strong>Owner:</strong> Owner Demo</span>
                  <span style={{ color: '#0d9488', fontWeight: 600 }}>owner@truststay.demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickFill('tenant@truststay.demo', 'Tenant123!')}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.6rem',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#0f172a',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span><strong>Tenant:</strong> Tenant Demo</span>
                  <span style={{ color: '#0d9488', fontWeight: 600 }}>tenant@truststay.demo</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
              {fieldErrors.fullName && (
                <span style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '0.2rem', display: 'block' }}>
                  {fieldErrors.fullName}
                </span>
              )}
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Phone Number *
              </label>
              <input
                type="text"
                placeholder="e.g. +91-9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
              {fieldErrors.phoneNumber && (
                <span style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '0.2rem', display: 'block' }}>
                  {fieldErrors.phoneNumber}
                </span>
              )}
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
              {fieldErrors.email && (
                <span style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '0.2rem', display: 'block' }}>
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Password (min. 6 characters) *
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
              {fieldErrors.password && (
                <span style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '0.2rem', display: 'block' }}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '1rem', fontSize: '0.8rem', color: '#166534' }}>
              ℹ️ Public signup assigns standard <strong>TENANT</strong> role automatically.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Creating Account...' : 'Register as Tenant'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
