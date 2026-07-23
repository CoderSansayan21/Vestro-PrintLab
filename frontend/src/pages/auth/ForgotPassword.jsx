import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logos/vestro-logo (2).png';
import { validateEmail } from '../../utils/validators.js';

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
      <path
        d="M4.5 7.5h15v10h-15v-10Zm0 0 7.5 5.25 7.5-5.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none">
      <path
        d="M15 6 9 12l6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 shrink-0" fill="none">
      <path
        d="m6 12.5 4 4 8-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ForgotPassword() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const submitTimerRef = useRef(null);
  const roleRouteState = location.state?.selectedRole
    ? {
        selectedRole: location.state.selectedRole,
        selectedRoleTitle: location.state.selectedRoleTitle,
      }
    : undefined;

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) {
        window.clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    setError(emailError);

    if (emailError) {
      return;
    }

    setIsSubmitting(true);
    submitTimerRef.current = window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      submitTimerRef.current = null;
    }, 700);
  };

  const handleResend = () => {
    setIsSent(false);
    setError('');
  };

  return (
    <main className="min-h-screen bg-[#03070B] text-[#F8FAFC]">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(214,167,55,0.12),transparent_24rem),linear-gradient(180deg,#03070B_0%,#071018_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D6A737]/35 to-transparent" />

        <div className="relative w-full max-w-md sm:max-w-lg">
          <div className="rounded-2xl border border-[rgba(214,167,55,0.20)] bg-[#0C141D] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.36)] sm:p-8 lg:p-10">
            <div className="flex justify-center">
              <Link
                to="/"
                aria-label="VESTRO PRINTLAB home"
                className="inline-flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737]"
              >
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[#D6A737]/30 bg-[#081018] shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
                  <img src={logo} alt="" className="h-12 w-12 object-contain" />
                </span>
                <span className="leading-none">
                  <span className="block text-sm font-black tracking-[0.16em]">VESTRO</span>
                  <span className="mt-1 block text-[0.7rem] font-bold tracking-[0.24em] text-[#F2CE72]">PRINTLAB</span>
                </span>
              </Link>
            </div>

            <div className="mt-8 text-center sm:mt-9">
              <p className="text-xs font-bold uppercase leading-6 tracking-[0.22em] text-[#F2CE72]">
                Password Help
              </p>
              <h1 id="forgot-password-title" className="mt-3 text-3xl font-black leading-[1.08] text-[#F8FAFC] sm:text-4xl">
                Forgot Your Password?
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#B5BAC3]">
                Enter your registered email address and we'll send you a password reset link.
              </p>
            </div>

            {isSent ? (
              <div className="mt-8 rounded-2xl border border-[#D6A737]/25 bg-[#081018] p-5 text-center sm:p-6" role="status" aria-live="polite" aria-labelledby="forgot-success-title">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D6A737]/45 bg-[#D6A737]/10 text-[#F2CE72]">
                  <CheckIcon />
                </div>
                <h2 id="forgot-success-title" className="mt-5 text-2xl font-black leading-tight text-[#F8FAFC]">
                  Email Sent
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#B5BAC3]">
                  If an account exists for this email, a password reset link has been sent.
                </p>
                <p className="mx-auto mt-3 max-w-sm text-xs font-bold uppercase leading-6 tracking-[0.14em] text-[#F2CE72]">
                  Backend integration is pending.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link
                    to="/login"
                    state={roleRouteState}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D6A737]/70 bg-[#D6A737] px-5 text-sm font-black text-[#03070B] shadow-[0_14px_34px_rgba(214,167,55,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[#F2CE72] hover:bg-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    Back to Login
                  </Link>
                  <button
                    type="button"
                    onClick={handleResend}
                    className="min-h-12 rounded-xl border border-[rgba(214,167,55,0.25)] bg-[#03070B] px-5 text-sm font-black text-[#F8FAFC] transition duration-200 hover:-translate-y-0.5 hover:border-[#D6A737]/55 hover:text-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    Resend Email
                  </button>
                </div>
              </div>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} aria-labelledby="forgot-password-title">
                <div>
                  <label htmlFor="forgot-email" className="text-sm font-bold text-[#F8FAFC]">
                    Email Address
                  </label>
                  <div
                    className={`mt-2 flex min-h-12 items-center rounded-xl border bg-[#03070B] text-[#9CA3AF] transition duration-200 focus-within:ring-2 focus-within:ring-[#D6A737]/20 motion-reduce:transition-none ${
                      error
                        ? 'border-[#F2CE72]/70 focus-within:border-[#F2CE72]'
                        : 'border-[rgba(214,167,55,0.20)] focus-within:border-[#D6A737]/70'
                    }`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center text-[#F2CE72]">
                      <MailIcon />
                    </span>
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        const nextEmail = event.target.value;
                        setEmail(nextEmail);
                        setError(validateEmail(nextEmail));
                      }}
                      placeholder="you@example.com"
                      aria-invalid={Boolean(error)}
                      aria-describedby="forgot-email-error"
                      className="min-w-0 flex-1 bg-transparent pr-4 text-sm font-medium text-[#F8FAFC] outline-none placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  <p id="forgot-email-error" className="mt-2 min-h-5 text-sm leading-5 text-[#F2CE72]" aria-live="polite" aria-atomic="true">
                    {error || ''}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-12 w-full rounded-xl border border-[#D6A737]/70 bg-[#D6A737] px-5 text-sm font-black text-[#03070B] shadow-[0_14px_34px_rgba(214,167,55,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[#F2CE72] hover:bg-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            {!isSent && (
              <p className="mt-7 text-center text-sm leading-6 text-[#B5BAC3]">
                Remember your password?{' '}
                <Link
                  to="/login"
                  state={roleRouteState}
                  className="inline-flex items-center gap-1 rounded-md font-black text-[#F2CE72] transition duration-200 hover:text-[#D6A737] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] motion-reduce:transition-none"
                >
                  <ArrowIcon />
                  Back to Login
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;
