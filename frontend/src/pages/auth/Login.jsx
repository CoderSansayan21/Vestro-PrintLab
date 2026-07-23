import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logos/vestro-logo (2).png';
import { getAuthRole, getAuthRoleRouteState } from '../../constants/authRoles.js';
import useAuthStore from '../../store/authStore.js';

const initialValues = {
  email: '',
  password: '',
  remember: false,
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
      <path d="M21 12.22c0-.72-.06-1.42-.19-2.08H12v3.94h5.04a4.3 4.3 0 0 1-1.87 2.82v2.3h3.03A9.08 9.08 0 0 0 21 12.22Z" fill="#4285F4" />
      <path d="M12 21.2c2.43 0 4.47-.8 5.96-2.18l-3.03-2.3c-.84.56-1.92.9-2.93.9-2.25 0-4.16-1.52-4.84-3.56H4.04v2.38A8.99 8.99 0 0 0 12 21.2Z" fill="#34A853" />
      <path d="M7.16 14.06A5.38 5.38 0 0 1 6.88 12c0-.71.1-1.4.28-2.06V7.56H4.04A8.99 8.99 0 0 0 3.2 12c0 1.6.4 3.11 1.12 4.44l2.84-2.38Z" fill="#FBBC05" />
      <path d="M12 6.38c1.32 0 2.5.45 3.43 1.34l2.59-2.59A8.67 8.67 0 0 0 12 2.8a8.99 8.99 0 0 0-7.96 4.76l3.12 2.38C7.84 7.9 9.75 6.38 12 6.38Z" fill="#EA4335" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
      <path d="M4.5 7.5h15v10h-15v-10Zm0 0 7.5 5.25 7.5-5.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
      <path d="M7 10V8.25a5 5 0 0 1 10 0V10M6.5 10h11v9h-11v-9Zm5.5 4.25v1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function EyeIcon({ hidden }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
      <path d="M4 12s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M12 14.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      {hidden && <path d="M5 19 19 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />}
    </svg>
  );
}

function validateField(name, value) {
  if (name === 'email') {
    if (!value.trim()) {
      return 'Email is required.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Enter a valid email address.';
    }
  }

  if (name === 'password') {
    if (!value) {
      return 'Password is required.';
    }

    if (value.length < 8) {
      return 'Password must be at least 8 characters.';
    }
  }

  return '';
}

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const selectedRole = getAuthRole(location.state?.selectedRole);
  const roleRouteState = getAuthRoleRouteState(selectedRole);

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setValues((current) => ({ ...current, [name]: nextValue }));
    setStatusMessage('');

    if (name === 'email' || name === 'password') {
      setErrors((current) => ({
        ...current,
        [name]: validateField(name, nextValue),
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {
      email: validateField('email', values.email),
      password: validateField('password', values.password),
    };

    setErrors(nextErrors);

    return !nextErrors.email && !nextErrors.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login(values);
      const user = response?.user;
      const fallbackPath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      const destination = location.state?.from?.pathname || fallbackPath;

      setIsSubmitting(false);
      navigate(destination, { replace: true });
    } catch (error) {
      setIsSubmitting(false);
      setStatusMessage(error?.message || 'Unable to sign in. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[#03070B] text-[#F8FAFC]">
      <style>{`
        @keyframes vestro-login-enter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .vestro-login-enter { animation: none !important; }
        }
      `}</style>

      <section className="grid min-h-screen lg:grid-cols-[45%_55%]">
        <aside className="relative hidden overflow-hidden border-r border-[rgba(214,167,55,0.20)] bg-[#081018] px-8 py-10 md:block lg:px-12 xl:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(214,167,55,0.13),transparent_24rem),radial-gradient(circle_at_80%_88%,rgba(242,206,114,0.08),transparent_28rem)]" />
          <div className="relative flex h-full flex-col justify-between">
            <Link to="/" aria-label="VESTRO PRINTLAB home" className="inline-flex w-fit items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737]">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[#D6A737]/30 bg-[#0C141D] shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
                <img src={logo} alt="" className="h-11 w-11 object-contain" />
              </span>
              <span className="leading-none">
                <span className="block text-sm font-black tracking-[0.16em]">VESTRO</span>
                <span className="mt-1 block text-[0.7rem] font-bold tracking-[0.24em] text-[#F2CE72]">PRINTLAB</span>
              </span>
            </Link>

            <div className="max-w-xl py-12 lg:py-14">
              <p className="text-xs font-bold uppercase leading-6 tracking-[0.24em] text-[#F2CE72]">
                AI-POWERED SPORTSWEAR PLATFORM
              </p>
              <h1 className="mt-5 text-4xl font-black leading-[1.04] text-[#F8FAFC] lg:text-5xl xl:text-6xl">
                Create. Customize. Compete.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-[#B5BAC3] lg:text-lg">
                Design premium jerseys with intelligent tools, realistic previews, and a seamless ordering experience.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-[#B5BAC3]">
              {['Secure authentication', 'Premium customization', 'Reliable order tracking'].map((item, index) => (
                <div key={item} className="rounded-2xl border border-[rgba(214,167,55,0.20)] bg-[#0C141D] p-4 shadow-[0_16px_34px_rgba(0,0,0,0.18)]">
                  <p className="font-bold text-[#F8FAFC]">{item}</p>
                  <p className="mt-1 leading-6">
                    {index === 0 && 'Protected access for your VESTRO PRINTLAB workspace.'}
                    {index === 1 && 'Create sportswear with intelligent tools and precise controls.'}
                    {index === 2 && 'Follow your jersey projects from design to delivery.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 md:px-8 lg:px-12">
          <div className="w-full max-w-xl">
            <div className="mb-8 flex justify-center md:hidden">
              <Link to="/" aria-label="VESTRO PRINTLAB home" className="inline-flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737]">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[#D6A737]/30 bg-[#0C141D]">
                  <img src={logo} alt="" className="h-11 w-11 object-contain" />
                </span>
                <span className="leading-none">
                  <span className="block text-sm font-black tracking-[0.16em]">VESTRO</span>
                  <span className="mt-1 block text-[0.7rem] font-bold tracking-[0.24em] text-[#F2CE72]">PRINTLAB</span>
                </span>
              </Link>
            </div>

            <div className="vestro-login-enter rounded-2xl border border-[rgba(214,167,55,0.20)] bg-[#0C141D] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.36)] motion-safe:animate-[vestro-login-enter_280ms_ease-out_both] sm:p-8 lg:p-10">
              <div>
                <p className="text-xs font-bold uppercase leading-6 tracking-[0.22em] text-[#F2CE72]">
                  Secure Login
                </p>
                <h2 className="mt-3 text-3xl font-black leading-[1.08] text-[#F8FAFC] sm:text-4xl">
                  Welcome Back
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#B5BAC3]">
                  Sign in to continue designing, managing, and ordering premium sports jerseys.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-[#D6A737]/25 bg-[#081018] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p>
                  <span className="font-semibold text-[#B5BAC3]">Selected role:</span>{' '}
                  <span className="font-black text-[#F2CE72]">{selectedRole.title}</span>
                </p>
                <Link
                  to="/choose-role"
                  className="w-fit rounded-md font-bold text-[#F2CE72] underline decoration-[#D6A737]/50 underline-offset-4 transition duration-200 hover:text-[#D6A737] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737]"
                >
                  Change role
                </Link>
              </div>

              <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
                {statusMessage && (
                  <p className="rounded-2xl border border-[#D6A737]/25 bg-[#081018] px-4 py-3 text-sm leading-6 text-[#F2CE72]" aria-live="polite">
                    {statusMessage}
                  </p>
                )}

                <div>
                  <label htmlFor="login-email" className="text-sm font-bold text-[#F8FAFC]">
                    Email Address
                  </label>
                  <div className="mt-2 flex min-h-12 items-center rounded-xl border border-[rgba(214,167,55,0.20)] bg-[#03070B] text-[#9CA3AF] transition duration-200 focus-within:border-[#D6A737]/70 focus-within:ring-2 focus-within:ring-[#D6A737]/20">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center text-[#F2CE72]">
                      <MailIcon />
                    </span>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={updateField}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby="login-email-error"
                      placeholder="you@example.com"
                      className="min-w-0 flex-1 bg-transparent pr-4 text-sm font-medium text-[#F8FAFC] outline-none placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  <p id="login-email-error" className="mt-2 min-h-5 text-sm leading-5 text-[#F2CE72]" aria-live="polite">
                    {errors.email || ''}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="login-password" className="text-sm font-bold text-[#F8FAFC]">
                      Password
                    </label>
                    <Link to="/forgot-password" state={roleRouteState} className="rounded-md text-sm font-bold text-[#F2CE72] transition duration-200 hover:text-[#D6A737] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737]">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="mt-2 flex min-h-12 items-center rounded-xl border border-[rgba(214,167,55,0.20)] bg-[#03070B] text-[#9CA3AF] transition duration-200 focus-within:border-[#D6A737]/70 focus-within:ring-2 focus-within:ring-[#D6A737]/20">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center text-[#F2CE72]">
                      <LockIcon />
                    </span>
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={values.password}
                      onChange={updateField}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby="login-password-error"
                      placeholder="Enter your password"
                      className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#F8FAFC] outline-none placeholder:text-[#9CA3AF]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-r-xl text-[#B5BAC3] transition duration-200 hover:text-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#D6A737]"
                    >
                      <EyeIcon hidden={showPassword} />
                    </button>
                  </div>
                  <p id="login-password-error" className="mt-2 min-h-5 text-sm leading-5 text-[#F2CE72]" aria-live="polite">
                    {errors.password || ''}
                  </p>
                </div>

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <label htmlFor="remember-me" className="inline-flex w-fit items-center gap-3 text-[#B5BAC3]">
                    <input
                      id="remember-me"
                      name="remember"
                      type="checkbox"
                      checked={values.remember}
                      onChange={updateField}
                      className="h-4 w-4 rounded border-[rgba(214,167,55,0.35)] bg-[#03070B] text-[#D6A737] focus:ring-2 focus:ring-[#D6A737]/30 focus:ring-offset-2 focus:ring-offset-[#0C141D]"
                    />
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-12 w-full rounded-xl border border-[#D6A737]/70 bg-[#D6A737] px-5 text-sm font-black text-[#03070B] shadow-[0_14px_34px_rgba(214,167,55,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[#F2CE72] hover:bg-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="flex items-center gap-4 text-xs font-bold uppercase leading-5 tracking-[0.16em] text-[#9CA3AF]">
                  <span className="h-px flex-1 bg-[rgba(214,167,55,0.20)]" />
                  Or continue with
                  <span className="h-px flex-1 bg-[rgba(214,167,55,0.20)]" />
                </div>

                <button
                  type="button"
                  onClick={() => setStatusMessage('Google login is a frontend placeholder. OAuth integration is pending.')}
                  className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[rgba(214,167,55,0.20)] bg-[#081018] px-5 text-sm font-black text-[#F8FAFC] transition duration-200 hover:-translate-y-0.5 hover:border-[#D6A737]/45 hover:text-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </form>

              <p className="mt-7 text-center text-sm leading-6 text-[#B5BAC3]">
                Don't have an account?{' '}
                <Link to="/register" state={roleRouteState} className="rounded-md font-black text-[#F2CE72] transition duration-200 hover:text-[#D6A737] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737]">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Login;
