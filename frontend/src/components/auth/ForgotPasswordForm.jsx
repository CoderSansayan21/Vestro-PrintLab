import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { validateEmail } from '../../utils/validators.js';

const inputClass =
  'mt-2 w-full rounded-xl border border-vestro-border bg-vestro-elevated/80 px-4 py-3 text-vestro-text outline-none transition placeholder:text-vestro-muted/70 hover:border-vestro-cyan/45 focus:border-vestro-cyan focus:ring-4 focus:ring-vestro-cyan/15';
const buttonClass =
  'inline-flex w-full items-center justify-center gap-3 rounded-xl border border-vestro-pink/60 bg-vestro-pink px-5 py-3.5 text-sm font-black text-vestro-text shadow-vestro-pink transition hover:-translate-y-0.5 hover:border-vestro-cyan/70 hover:shadow-vestro-cyan focus-visible:outline-vestro-cyan disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0';

function ButtonSpinner() {
  return <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white motion-safe:animate-spin" />;
}

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
      {apiError && <p className="text-sm font-medium text-vestro-pink">{apiError}</p>}
      {successMessage && <p className="text-sm font-medium text-emerald-300">{successMessage}</p>}

      <div>
        <label htmlFor="forgot-email" className="text-sm font-bold text-vestro-text">
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
          className={inputClass}
          placeholder="you@company.com"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'forgot-email-error' : undefined}
        />
        {error && <p id="forgot-email-error" className="mt-2 text-sm text-vestro-pink">{error}</p>}
      </div>

      <button type="submit" disabled={loading} className={buttonClass}>
        {loading && <ButtonSpinner />}
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>

      <p className="text-center text-sm text-vestro-muted">
        Remembered your password?{' '}
        <Link to="/login" className="font-bold text-vestro-cyan transition hover:text-vestro-pink">
          Back to login
        </Link>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;
