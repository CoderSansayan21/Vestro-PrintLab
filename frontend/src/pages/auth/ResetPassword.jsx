import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logos/vestro-logo (2).png';
import { validateConfirmPassword, validatePassword } from '../../utils/validators.js';

const passwordRules = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (value) => value.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: 'number',
    label: 'One number',
    test: (value) => /[0-9]/.test(value),
  },
  {
    id: 'special',
    label: 'One special character',
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

const passwordStrengthStates = [
  {
    label: 'Weak',
    barClass: 'bg-[#8A641D]',
    textClass: 'text-[#F2CE72]',
  },
  {
    label: 'Fair',
    barClass: 'bg-[#B9892B]',
    textClass: 'text-[#F2CE72]',
  },
  {
    label: 'Good',
    barClass: 'bg-[#D6A737]',
    textClass: 'text-[#F2CE72]',
  },
  {
    label: 'Strong',
    barClass: 'bg-[#F2CE72]',
    textClass: 'text-[#F8FAFC]',
  },
];

function getPasswordStrength(password) {
  const checks = passwordRules.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));
  const score = checks.filter((rule) => rule.passed).length;

  if (score <= 1) {
    return { score, checks, state: passwordStrengthStates[0] };
  }

  if (score <= 3) {
    return { score, checks, state: passwordStrengthStates[1] };
  }

  if (score === 4) {
    return { score, checks, state: passwordStrengthStates[2] };
  }

  return { score, checks, state: passwordStrengthStates[3] };
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
      <path
        d="M7 10V8.25a5 5 0 0 1 10 0V10M6.5 10h11v9h-11v-9Zm5.5 4.25v1.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function EyeIcon({ hidden }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
      <path
        d="M4 12s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M12 14.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      {hidden && (
        <path
          d="M5 19 19 5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
      )}
    </svg>
  );
}

function PasswordRuleIcon({ passed }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none">
      {passed ? (
        <path
          d="m5 10 3 3 7-7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      ) : (
        <path
          d="M6 6l8 8M14 6l-8 8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      )}
    </svg>
  );
}

function PasswordStrength({ password }) {
  const { score, checks, state } = getPasswordStrength(password);

  return (
    <div id="reset-password-strength" className="mt-3 rounded-xl border border-[rgba(214,167,55,0.18)] bg-[#081018] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-[#F8FAFC]">Password strength</p>
        <p className={`text-sm font-black ${state.textClass}`}>
          {state.label}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2" aria-hidden="true">
        {passwordStrengthStates.map((strength, index) => (
          <span
            key={strength.label}
            className={`h-1.5 rounded-full transition duration-200 ${
              index < Math.max(1, Math.ceil((score / passwordRules.length) * 4))
                ? state.barClass
                : 'bg-[rgba(248,250,252,0.14)]'
            }`}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Password strength: {state.label}. {score} of {passwordRules.length} requirements met.
      </p>

      <ul className="mt-4 grid gap-2 text-sm leading-5 text-[#B5BAC3] sm:grid-cols-2">
        {checks.map((rule) => (
          <li
            key={rule.id}
            className={`flex items-center gap-2 ${
              rule.passed ? 'text-[#F8FAFC]' : 'text-[#9CA3AF]'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                rule.passed
                  ? 'border-[#D6A737]/50 bg-[#D6A737]/10 text-[#F2CE72]'
                  : 'border-[rgba(156,163,175,0.35)] text-[#9CA3AF]'
              }`}
            >
              <PasswordRuleIcon passed={rule.passed} />
            </span>
            <span>
              <span className="sr-only">{rule.passed ? 'Met: ' : 'Missing: '}</span>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
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

function PasswordField({ id, name, label, value, onChange, visible, onToggle, placeholder, error, describedBy }) {
  const errorId = `${id}-error`;
  const describedByIds = [errorId, describedBy].filter(Boolean).join(' ');

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-bold text-[#F8FAFC]">
        {label}
      </label>
      <div
        className={`mt-2 flex min-h-12 items-center rounded-xl border bg-[#03070B] text-[#9CA3AF] transition duration-200 focus-within:ring-2 focus-within:ring-[#D6A737]/20 motion-reduce:transition-none ${
          error
            ? 'border-[#F2CE72]/70 focus-within:border-[#F2CE72]'
            : 'border-[rgba(214,167,55,0.20)] focus-within:border-[#D6A737]/70'
        }`}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center text-[#F2CE72]">
          <LockIcon />
        </span>
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete="new-password"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedByIds}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#F8FAFC] outline-none placeholder:text-[#9CA3AF]"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          aria-pressed={visible}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-r-xl text-[#B5BAC3] transition duration-200 hover:text-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#D6A737] motion-reduce:transition-none"
        >
          <EyeIcon hidden={visible} />
        </button>
      </div>
      <p id={errorId} className="mt-2 min-h-5 text-sm leading-5 text-[#F2CE72]" aria-live="polite" aria-atomic="true">
        {error || ''}
      </p>
    </div>
  );
}

function ResetPassword() {
  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
  });
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) {
        window.clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  const validateField = (name, value, nextValues) => {
    if (name === 'password') {
      return validatePassword(value);
    }

    if (name === 'confirmPassword') {
      return validateConfirmPassword(nextValues.password, value);
    }

    return '';
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };

    if (submitTimerRef.current) {
      window.clearTimeout(submitTimerRef.current);
      submitTimerRef.current = null;
    }

    setValues(nextValues);
    setIsSubmitting(false);
    setErrors((current) => {
      const nextErrors = {
        ...current,
        [name]: validateField(name, value, nextValues),
      };

      if (name === 'password' && nextValues.confirmPassword) {
        nextErrors.confirmPassword = validateField('confirmPassword', nextValues.confirmPassword, nextValues);
      }

      return nextErrors;
    });
  };

  const togglePassword = (field) => {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {
      password: validateField('password', values.password, values),
      confirmPassword: validateField('confirmPassword', values.confirmPassword, values),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).every((message) => !message)) {
      if (submitTimerRef.current) {
        window.clearTimeout(submitTimerRef.current);
      }

      setIsSubmitting(true);
      submitTimerRef.current = window.setTimeout(() => {
        setIsSubmitting(false);
        setIsUpdated(true);
        submitTimerRef.current = null;
      }, 700);
    }
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
                Secure Reset
              </p>
              <h1 id="reset-password-title" className="mt-3 text-3xl font-black leading-[1.08] text-[#F8FAFC] sm:text-4xl">
                Create a New Password
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#B5BAC3]">
                Choose a strong password to secure your VESTRO PRINTLAB account.
              </p>
            </div>

            {isUpdated ? (
              <div className="mt-8 rounded-2xl border border-[#D6A737]/25 bg-[#081018] p-5 text-center sm:p-6" role="status" aria-live="polite" aria-labelledby="reset-success-title">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D6A737]/45 bg-[#D6A737]/10 text-[#F2CE72]">
                  <CheckIcon />
                </div>
                <h2 id="reset-success-title" className="mt-5 text-2xl font-black leading-tight text-[#F8FAFC]">
                  Password Updated Successfully
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#B5BAC3]">
                  Your password has been updated successfully.
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-[#B5BAC3]">
                  You can now sign in using your new password.
                </p>
                <p className="mx-auto mt-3 max-w-sm text-xs font-bold uppercase leading-6 tracking-[0.14em] text-[#F2CE72]">
                  Backend integration is pending.
                </p>
                <Link
                  to="/login"
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#D6A737]/70 bg-[#D6A737] px-5 text-sm font-black text-[#03070B] shadow-[0_14px_34px_rgba(214,167,55,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[#F2CE72] hover:bg-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <>
                <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} aria-labelledby="reset-password-title">
                  <PasswordField
                    id="new-password"
                    name="password"
                    label="New Password"
                    value={values.password}
                    onChange={updateField}
                    visible={visiblePasswords.password}
                    onToggle={() => togglePassword('password')}
                    placeholder="Enter new password"
                    error={errors.password}
                    describedBy="reset-password-strength"
                  />
                  <PasswordStrength password={values.password} />

                  <PasswordField
                    id="reset-confirm-password"
                    name="confirmPassword"
                    label="Confirm Password"
                    value={values.confirmPassword}
                    onChange={updateField}
                    visible={visiblePasswords.confirmPassword}
                    onToggle={() => togglePassword('confirmPassword')}
                    placeholder="Confirm new password"
                    error={errors.confirmPassword}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-12 w-full rounded-xl border border-[#D6A737]/70 bg-[#D6A737] px-5 text-sm font-black text-[#03070B] shadow-[0_14px_34px_rgba(214,167,55,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[#F2CE72] hover:bg-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </form>

                <p className="mt-7 text-center text-sm leading-6 text-[#B5BAC3]">
                  Remembered your password?{' '}
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 rounded-md font-black text-[#F2CE72] transition duration-200 hover:text-[#D6A737] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] motion-reduce:transition-none"
                  >
                    <ArrowIcon />
                    Back to Login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ResetPassword;
