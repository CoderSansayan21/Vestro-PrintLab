import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { validateEmail, validatePassword } from '../../utils/validators.js';

const initialValues = {
  email: '',
  password: '',
  remember: true,
};

const inputClass =
  'mt-2 w-full rounded-xl border border-vestro-border bg-vestro-elevated/80 px-4 py-3 text-vestro-text outline-none transition placeholder:text-vestro-muted/70 hover:border-vestro-cyan/45 focus:border-vestro-cyan focus:ring-4 focus:ring-vestro-cyan/15';
const passwordWrapClass =
  'mt-2 flex rounded-xl border border-vestro-border bg-vestro-elevated/80 transition hover:border-vestro-cyan/45 focus-within:border-vestro-cyan focus-within:ring-4 focus-within:ring-vestro-cyan/15';
const buttonClass =
  'inline-flex w-full items-center justify-center gap-3 rounded-xl border border-vestro-pink/60 bg-vestro-pink px-5 py-3.5 text-sm font-black text-vestro-text shadow-vestro-pink transition hover:-translate-y-0.5 hover:border-vestro-cyan/70 hover:shadow-vestro-cyan focus-visible:outline-vestro-cyan disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0';

function ButtonSpinner() {
  return <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white motion-safe:animate-spin" />;
}

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const apiError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSuccessMessage('');
    clearError();
  };

  const validate = () => {
    const nextErrors = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
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
      await login({ email: values.email, password: values.password });
      setSuccessMessage('Login successful. Redirecting...');
      const destination = location.state?.from?.pathname || '/dashboard';
      window.setTimeout(() => navigate(destination, { replace: true }), 600);
    } catch {
      setSuccessMessage('');
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {apiError && <p className="text-sm font-medium text-vestro-pink">{apiError}</p>}
      {successMessage && <p className="text-sm font-medium text-emerald-300">{successMessage}</p>}

      <div>
        <label htmlFor="email" className="text-sm font-bold text-vestro-text">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={updateField}
          className={inputClass}
          placeholder="you@company.com"
          aria-invalid={errors.email ? 'true' : undefined}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && <p id="email-error" className="mt-2 text-sm text-vestro-pink">{errors.email}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="password" className="text-sm font-bold text-vestro-text">
            Password
          </label>
          <Link to="/forgot-password" className="text-sm font-bold text-vestro-cyan transition hover:text-vestro-pink">
            Forgot password?
          </Link>
        </div>
        <div className={passwordWrapClass}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={values.password}
            onChange={updateField}
            className="min-w-0 flex-1 rounded-l-xl bg-transparent px-4 py-3 text-vestro-text outline-none placeholder:text-vestro-muted/70"
            placeholder="Enter your password"
            aria-invalid={errors.password ? 'true' : undefined}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="px-4 text-sm font-bold text-vestro-cyan transition hover:text-vestro-pink focus-visible:outline-vestro-cyan"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <p id="password-error" className="mt-2 text-sm text-vestro-pink">{errors.password}</p>}
      </div>

      <label className="flex items-center gap-3 text-sm text-vestro-muted">
        <input
          name="remember"
          type="checkbox"
          checked={values.remember}
          onChange={updateField}
          className="h-4 w-4 rounded border-vestro-border bg-vestro-elevated text-vestro-pink focus:ring-vestro-cyan"
        />
        Remember me on this device
      </label>

      <button type="submit" disabled={loading} className={buttonClass}>
        {loading && <ButtonSpinner />}
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm text-vestro-muted">
        New to VESTRO PRINTLAB?{' '}
        <Link to="/register" className="font-bold text-vestro-cyan transition hover:text-vestro-pink">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
