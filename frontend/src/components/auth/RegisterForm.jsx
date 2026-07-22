import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
  validateSriLankanPhone,
} from '../../utils/validators.js';

const initialValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agree: false,
};

function RegisterForm() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const apiError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({ password: false, confirmPassword: false });

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
      name: validateFullName(values.name),
      email: validateEmail(values.email),
      phone: validateSriLankanPhone(values.phone),
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
      agree: values.agree ? '' : 'Please accept the account terms.',
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
      await register(values);
      setSuccessMessage('Account created successfully. Redirecting...');
      window.setTimeout(() => navigate('/dashboard', { replace: true }), 700);
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

      <div>
        <label htmlFor="name" className="text-sm font-medium text-slate-200">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={updateField}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
          placeholder="Your name"
        />
        {errors.name && <p className="mt-2 text-sm text-rose-300">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="register-email" className="text-sm font-medium text-slate-200">
          Email address
        </label>
        <input
          id="register-email"
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
        <label htmlFor="phone" className="text-sm font-medium text-slate-200">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={updateField}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15"
          placeholder="0712345678 or +94712345678"
        />
        {errors.phone && <p className="mt-2 text-sm text-rose-300">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="register-password" className="text-sm font-medium text-slate-200">
          Password
        </label>
        <div className="mt-2 flex rounded-2xl border border-white/10 bg-slate-950/70 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/15">
          <input
            id="register-password"
            name="password"
            type={visiblePasswords.password ? 'text' : 'password'}
            autoComplete="new-password"
            value={values.password}
            onChange={updateField}
            className="min-w-0 flex-1 rounded-l-2xl bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-500"
            placeholder="Create a password"
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
        <label htmlFor="confirm-password" className="text-sm font-medium text-slate-200">
          Confirm password
        </label>
        <div className="mt-2 flex rounded-2xl border border-white/10 bg-slate-950/70 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/15">
          <input
            id="confirm-password"
            name="confirmPassword"
            type={visiblePasswords.confirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={updateField}
            className="min-w-0 flex-1 rounded-l-2xl bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-500"
            placeholder="Repeat your password"
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

      <div>
        <label className="flex items-start gap-3 text-sm text-slate-300">
          <input
            name="agree"
            type="checkbox"
            checked={values.agree}
            onChange={updateField}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
          />
          <span>I agree to create a VESTRO PRINTLAB account for design and order management.</span>
        </label>
        {errors.agree && <p className="mt-2 text-sm text-rose-300">{errors.agree}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-slate-300">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">
          Login
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;