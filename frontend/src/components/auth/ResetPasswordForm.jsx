import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { validateConfirmPassword, validatePassword } from '../../utils/validators.js';

const initialValues = {
  password: '',
  confirmPassword: '',
};

function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.loading);
  const apiError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({ password: false, confirmPassword: false });

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSuccessMessage('');
    clearError();
  };

  const validate = () => {
    const nextErrors = {
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
      token: token ? '' : 'Reset token is missing or invalid.',
    };

    return Object.fromEntries(Object.entries(nextErrors).filter(([, message]) => message));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await resetPassword({ token, password: values.password });
      setSuccessMessage('Password reset successful. Redirecting to login...');
      window.setTimeout(() => navigate('/login', { replace: true }), 800);
    } catch {
      setSuccessMessage('');
    }
  };

  const togglePassword = (field) => {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {apiError && <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{apiError}</p>}
      {successMessage && <p className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{successMessage}</p>}
      {errors.token && <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{errors.token}</p>}

      <div>
        <label htmlFor="new-password" className="text-sm font-medium text-slate-200">
          New password
        </label>
        <div className="mt-2 flex rounded-2xl border border-white/10 bg-slate-950/70 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/15">
          <input
            id="new-password"
            name="password"
            type={visiblePasswords.password ? 'text' : 'password'}
            autoComplete="new-password"
            value={values.password}
            onChange={updateField}
            className="min-w-0 flex-1 rounded-l-2xl bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-500"
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => togglePassword('password')}
            className="px-4 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
          >
            {visiblePasswords.password ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <p className="mt-2 text-sm text-rose-300">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="reset-confirm-password" className="text-sm font-medium text-slate-200">
          Confirm new password
        </label>
        <div className="mt-2 flex rounded-2xl border border-white/10 bg-slate-950/70 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/15">
          <input
            id="reset-confirm-password"
            name="confirmPassword"
            type={visiblePasswords.confirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={updateField}
            className="min-w-0 flex-1 rounded-l-2xl bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-500"
            placeholder="Repeat new password"
          />
          <button
            type="button"
            onClick={() => togglePassword('confirmPassword')}
            className="px-4 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
          >
            {visiblePasswords.confirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-2 text-sm text-rose-300">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>

      <p className="text-center text-sm text-slate-300">
        Ready to continue?{' '}
        <Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">
          Login
        </Link>
      </p>
    </form>
  );
}

export default ResetPasswordForm;