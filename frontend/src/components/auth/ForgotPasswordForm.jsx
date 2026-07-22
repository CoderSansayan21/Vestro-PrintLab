import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { validateEmail } from '../../utils/validators.js';

function ForgotPasswordForm() {
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const loading = useAuthStore((state) => state.loading);
  const apiError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');

    const emailError = validateEmail(email);
    setError(emailError);

    if (emailError) {
      return;
    }

    try {
      await forgotPassword(email);
      setSuccessMessage('Password reset instructions have been sent if this email exists.');
    } catch {
      setSuccessMessage('');
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {apiError && <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{apiError}</p>}
      {successMessage && <p className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{successMessage}</p>}

      <div>
        <label htmlFor="forgot-email" className="text-sm font-medium text-slate-200">
          Email address
        </label>
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError('');
            setSuccessMessage('');
            clearError();
          }}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
          placeholder="you@company.com"
        />
        {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>

      <p className="text-center text-sm text-slate-300">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">
          Back to login
        </Link>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;