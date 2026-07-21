import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { validateEmail, validatePassword } from '../../utils/validators.js';

const initialValues = {
  email: '',
  password: '',
  remember: true,
};

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
      {apiError && <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{apiError}</p>}
      {successMessage && <p className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{successMessage}</p>}

      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-200">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={updateField}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
          placeholder="you@company.com"
        />
        {errors.email && <p className="mt-2 text-sm text-rose-300">{errors.email}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="password" className="text-sm font-medium text-slate-200">
            Password
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-indigo-300 hover:text-indigo-200">
            Forgot password?
          </Link>
        </div>
        <div className="mt-2 flex rounded-2xl border border-white/10 bg-slate-950/70 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/15">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={values.password}
            onChange={updateField}
            className="min-w-0 flex-1 rounded-l-2xl bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-500"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="px-4 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <p className="mt-2 text-sm text-rose-300">{errors.password}</p>}
      </div>

      <label className="flex items-center gap-3 text-sm text-slate-300">
        <input
          name="remember"
          type="checkbox"
          checked={values.remember}
          onChange={updateField}
          className="h-4 w-4 rounded border-white/20 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
        />
        Remember me on this device
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm text-slate-300">
        New to VESTRO PRINTLAB?{' '}
        <Link to="/register" className="font-semibold text-indigo-300 hover:text-indigo-200">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;