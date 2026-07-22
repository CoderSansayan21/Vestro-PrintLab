import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { validateConfirmPassword, validatePassword } from '../../utils/validators.js';

const initialValues = {
  password: '',
  confirmPassword: '',
};

const passwordWrapClass =
  'mt-2 flex rounded-xl border border-vestro-border bg-vestro-elevated/80 transition hover:border-vestro-cyan/45 focus-within:border-vestro-cyan focus-within:ring-4 focus-within:ring-vestro-cyan/15';
const buttonClass =
  'inline-flex w-full items-center justify-center gap-3 rounded-xl border border-vestro-pink/60 bg-vestro-pink px-5 py-3.5 text-sm font-black text-vestro-text shadow-vestro-pink transition hover:-translate-y-0.5 hover:border-vestro-cyan/70 hover:shadow-vestro-cyan focus-visible:outline-vestro-cyan disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0';

function ButtonSpinner() {
  return <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white motion-safe:animate-spin" />;
}

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
      {apiError && <p className="text-sm font-medium text-vestro-pink">{apiError}</p>}
      {successMessage && <p className="text-sm font-medium text-emerald-300">{successMessage}</p>}
      {errors.token && <p className="text-sm font-medium text-vestro-pink">{errors.token}</p>}

      <div>
        <label htmlFor="new-password" className="text-sm font-bold text-vestro-text">
          New password
        </label>
        <div className={passwordWrapClass}>
          <input
            id="new-password"
            name="password"
            type={visiblePasswords.password ? 'text' : 'password'}
            autoComplete="new-password"
            value={values.password}
            onChange={updateField}
            className="min-w-0 flex-1 rounded-l-xl bg-transparent px-4 py-3 text-vestro-text outline-none placeholder:text-vestro-muted/70"
            placeholder="Enter new password"
            aria-invalid={errors.password ? 'true' : undefined}
            aria-describedby={errors.password ? 'new-password-error' : undefined}
          />
          <button type="button" onClick={() => togglePassword('password')} className="px-4 text-sm font-bold text-vestro-cyan transition hover:text-vestro-pink focus-visible:outline-vestro-cyan">
            {visiblePasswords.password ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <p id="new-password-error" className="mt-2 text-sm text-vestro-pink">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="reset-confirm-password" className="text-sm font-bold text-vestro-text">
          Confirm new password
        </label>
        <div className={passwordWrapClass}>
          <input
            id="reset-confirm-password"
            name="confirmPassword"
            type={visiblePasswords.confirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={updateField}
            className="min-w-0 flex-1 rounded-l-xl bg-transparent px-4 py-3 text-vestro-text outline-none placeholder:text-vestro-muted/70"
            placeholder="Repeat new password"
            aria-invalid={errors.confirmPassword ? 'true' : undefined}
            aria-describedby={errors.confirmPassword ? 'reset-confirm-password-error' : undefined}
          />
          <button type="button" onClick={() => togglePassword('confirmPassword')} className="px-4 text-sm font-bold text-vestro-cyan transition hover:text-vestro-pink focus-visible:outline-vestro-cyan">
            {visiblePasswords.confirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.confirmPassword && <p id="reset-confirm-password-error" className="mt-2 text-sm text-vestro-pink">{errors.confirmPassword}</p>}
      </div>

      <button type="submit" disabled={loading} className={buttonClass}>
        {loading && <ButtonSpinner />}
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>

      <p className="text-center text-sm text-vestro-muted">
        Ready to continue?{' '}
        <Link to="/login" className="font-bold text-vestro-cyan transition hover:text-vestro-pink">
          Login
        </Link>
      </p>
    </form>
  );
}

export default ResetPasswordForm;
