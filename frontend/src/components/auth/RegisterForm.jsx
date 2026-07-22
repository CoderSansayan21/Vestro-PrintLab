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

const inputClass =
  'mt-2 w-full rounded-xl border border-vestro-border bg-vestro-elevated/80 px-4 py-3 text-vestro-text outline-none transition placeholder:text-vestro-muted/70 hover:border-vestro-cyan/45 focus:border-vestro-cyan focus:ring-4 focus:ring-vestro-cyan/15';
const passwordWrapClass =
  'mt-2 flex rounded-xl border border-vestro-border bg-vestro-elevated/80 transition hover:border-vestro-cyan/45 focus-within:border-vestro-cyan focus-within:ring-4 focus-within:ring-vestro-cyan/15';
const buttonClass =
  'inline-flex w-full items-center justify-center gap-3 rounded-xl border border-vestro-pink/60 bg-vestro-pink px-5 py-3.5 text-sm font-black text-vestro-text shadow-vestro-pink transition hover:-translate-y-0.5 hover:border-vestro-cyan/70 hover:shadow-vestro-cyan focus-visible:outline-vestro-cyan disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0';

function ButtonSpinner() {
  return <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white motion-safe:animate-spin" />;
}

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
      {apiError && <p className="text-sm font-medium text-vestro-pink">{apiError}</p>}
      {successMessage && <p className="text-sm font-medium text-emerald-300">{successMessage}</p>}

      <div>
        <label htmlFor="name" className="text-sm font-bold text-vestro-text">Full name</label>
        <input id="name" name="name" type="text" autoComplete="name" value={values.name} onChange={updateField} className={inputClass} placeholder="Your name" aria-invalid={errors.name ? 'true' : undefined} aria-describedby={errors.name ? 'name-error' : undefined} />
        {errors.name && <p id="name-error" className="mt-2 text-sm text-vestro-pink">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="register-email" className="text-sm font-bold text-vestro-text">Email address</label>
        <input id="register-email" name="email" type="email" autoComplete="email" value={values.email} onChange={updateField} className={inputClass} placeholder="you@company.com" aria-invalid={errors.email ? 'true' : undefined} aria-describedby={errors.email ? 'register-email-error' : undefined} />
        {errors.email && <p id="register-email-error" className="mt-2 text-sm text-vestro-pink">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="text-sm font-bold text-vestro-text">Phone number</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={updateField} className={inputClass} placeholder="0712345678 or +94712345678" aria-invalid={errors.phone ? 'true' : undefined} aria-describedby={errors.phone ? 'phone-error' : undefined} />
        {errors.phone && <p id="phone-error" className="mt-2 text-sm text-vestro-pink">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="register-password" className="text-sm font-bold text-vestro-text">Password</label>
        <div className={passwordWrapClass}>
          <input id="register-password" name="password" type={visiblePasswords.password ? 'text' : 'password'} autoComplete="new-password" value={values.password} onChange={updateField} className="min-w-0 flex-1 rounded-l-xl bg-transparent px-4 py-3 text-vestro-text outline-none placeholder:text-vestro-muted/70" placeholder="Create a password" aria-invalid={errors.password ? 'true' : undefined} aria-describedby={errors.password ? 'register-password-error' : undefined} />
          <button type="button" onClick={() => togglePassword('password')} className="px-4 text-sm font-bold text-vestro-cyan transition hover:text-vestro-pink focus-visible:outline-vestro-cyan">{visiblePasswords.password ? 'Hide' : 'Show'}</button>
        </div>
        {errors.password && <p id="register-password-error" className="mt-2 text-sm text-vestro-pink">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirm-password" className="text-sm font-bold text-vestro-text">Confirm password</label>
        <div className={passwordWrapClass}>
          <input id="confirm-password" name="confirmPassword" type={visiblePasswords.confirmPassword ? 'text' : 'password'} autoComplete="new-password" value={values.confirmPassword} onChange={updateField} className="min-w-0 flex-1 rounded-l-xl bg-transparent px-4 py-3 text-vestro-text outline-none placeholder:text-vestro-muted/70" placeholder="Repeat your password" aria-invalid={errors.confirmPassword ? 'true' : undefined} aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined} />
          <button type="button" onClick={() => togglePassword('confirmPassword')} className="px-4 text-sm font-bold text-vestro-cyan transition hover:text-vestro-pink focus-visible:outline-vestro-cyan">{visiblePasswords.confirmPassword ? 'Hide' : 'Show'}</button>
        </div>
        {errors.confirmPassword && <p id="confirm-password-error" className="mt-2 text-sm text-vestro-pink">{errors.confirmPassword}</p>}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-vestro-muted">
          <input name="agree" type="checkbox" checked={values.agree} onChange={updateField} className="mt-1 h-4 w-4 rounded border-vestro-border bg-vestro-elevated text-vestro-pink focus:ring-vestro-cyan" />
          <span>I agree to create a VESTRO PRINTLAB account for design and order management.</span>
        </label>
        {errors.agree && <p className="mt-2 text-sm text-vestro-pink">{errors.agree}</p>}
      </div>

      <button type="submit" disabled={loading} className={buttonClass}>
        {loading && <ButtonSpinner />}
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-vestro-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-vestro-cyan transition hover:text-vestro-pink">Login</Link>
      </p>
    </form>
  );
}

export default RegisterForm;
