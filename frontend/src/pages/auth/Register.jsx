import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logos/vestro-logo (2).png';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from '../../utils/validators.js';
import { getAuthRole, getAuthRoleRouteState } from '../../constants/authRoles.js';
import useAuthStore from '../../store/authStore.js';

const benefitsByRole = {
  customer: [
    'AI-assisted customization',
    'Real-time jersey preview',
    'Secure ordering and tracking',
  ],
  designer: [
    'Professional portfolio',
    'Project opportunities',
    'Secure earnings management',
  ],
};

const initialValues = {
  fullName: '',
  username: '',
  email: '',
  nic: '',
  password: '',
  confirmPassword: '',
  terms: false,
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

function FieldIcon({ type }) {
  const paths = {
    user: 'M12 12.25a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 7.25c.55-3.55 3.25-5.75 7-5.75s6.45 2.2 7 5.75H5Z',
    username: 'M4.5 12a7.5 7.5 0 1 1 3 6M15 9.75V15a2.25 2.25 0 0 0 4.5 0v-3a7.5 7.5 0 0 0-15 0v.75',
    mail: 'M4.5 7.5h15v10h-15v-10Zm0 0 7.5 5.25 7.5-5.25',
    id: 'M4.5 6.5h15v11h-15v-11Zm3 3.5h4M7.5 13h3M14 10h2.5M14 13h2.5',
    lock: 'M7 10V8.25a5 5 0 0 1 10 0V10M6.5 10h11v9h-11v-9Zm5.5 4.25v1.5',
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
      <path
        d={paths[type]}
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
      <path d="M4 12s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M12 14.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      {hidden && <path d="M5 19 19 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />}
    </svg>
  );
}

function RequiredMark() {
  return <span className="text-[#F2CE72]" aria-hidden="true">*</span>;
}

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
    <div id="register-password-strength" className="mt-3 rounded-xl border border-[rgba(214,167,55,0.18)] bg-[#081018] p-4">
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

function validateFullName(value) {
  const fullName = value.trim();

  if (!fullName) {
    return 'Full name is required.';
  }

  if (fullName.length < 2) {
    return 'Full name must be at least 2 characters.';
  }

  if (!/^[A-Za-z][A-Za-z\s'-]*$/.test(fullName)) {
    return 'Use letters, spaces, apostrophes, and hyphens only.';
  }

  return '';
}

function validateUsername(value) {
  const username = value.trim();

  if (!username) {
    return 'Username is required.';
  }

  if (username.length < 3) {
    return 'Username must be at least 3 characters.';
  }

  if (username.length > 30) {
    return 'Username must be 30 characters or fewer.';
  }

  if (!/^[A-Za-z0-9_.]+$/.test(username)) {
    return 'Use letters, numbers, underscore, and period only.';
  }

  return '';
}

function validateNic(value) {
  const nic = value.trim();

  if (!nic) {
    return 'NIC number is required.';
  }

  if (!/^(?:\d{9}[vVxX]|\d{12})$/.test(nic)) {
    return 'Enter a valid Sri Lankan NIC, such as 123456789V or 200012345678.';
  }

  return '';
}

function validateField(name, value, allValues) {
  if (name === 'fullName') {
    return validateFullName(value);
  }

  if (name === 'username') {
    return validateUsername(value);
  }

  if (name === 'email') {
    return validateEmail(value);
  }

  if (name === 'nic') {
    return validateNic(value);
  }

  if (name === 'password') {
    return validatePassword(value);
  }

  if (name === 'confirmPassword') {
    return validateConfirmPassword(allValues.password, value);
  }

  if (name === 'terms' && !value) {
    return 'You must accept the Terms of Service and Privacy Policy.';
  }

  return '';
}

function FormField({ id, name, label, type = 'text', autoComplete, placeholder, icon, value, error, onChange, required = true, describedBy }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const errorId = `${id}-error`;
  const describedByIds = [errorId, describedBy].filter(Boolean).join(' ');

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-bold text-[#F8FAFC]">
        {label} {required && <RequiredMark />}
      </label>
      <div
        className={`mt-2 flex min-h-12 items-center rounded-xl border bg-[#03070B] text-[#9CA3AF] transition duration-200 focus-within:ring-2 focus-within:ring-[#D6A737]/20 motion-reduce:transition-none ${
          error
            ? 'border-[#F2CE72]/70 focus-within:border-[#F2CE72]'
            : 'border-[rgba(214,167,55,0.20)] focus-within:border-[#D6A737]/70'
        }`}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center text-[#F2CE72]">
          <FieldIcon type={icon} />
        </span>
        <input
          id={id}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={describedByIds}
          className="min-w-0 flex-1 bg-transparent pr-4 text-sm font-medium text-[#F8FAFC] outline-none placeholder:text-[#9CA3AF]"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
            aria-pressed={showPassword}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-r-xl text-[#B5BAC3] transition duration-200 hover:text-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#D6A737] motion-reduce:transition-none"
          >
            <EyeIcon hidden={showPassword} />
          </button>
        )}
      </div>
      <p id={errorId} className="mt-2 min-h-5 text-sm leading-5 text-[#F2CE72]" aria-live="polite" aria-atomic="true">
        {error || ''}
      </p>
    </div>
  );
}

function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const selectedRole = getAuthRole(location.state?.selectedRole);
  const roleRouteState = getAuthRoleRouteState(selectedRole);

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;
    const nextValues = { ...values, [name]: nextValue };

    setValues(nextValues);
    setStatusMessage('');
    setErrors((current) => {
      const nextErrors = {
        ...current,
        [name]: validateField(name, nextValue, nextValues),
      };

      if (name === 'password' && nextValues.confirmPassword) {
        nextErrors.confirmPassword = validateField('confirmPassword', nextValues.confirmPassword, nextValues);
      }

      return nextErrors;
    });
  };

  const validateForm = () => {
    const nextValues = {
      ...values,
      nic: values.nic.trim(),
    };
    const nextErrors = {
      fullName: validateField('fullName', nextValues.fullName, nextValues),
      username: validateField('username', nextValues.username, nextValues),
      email: validateField('email', nextValues.email, nextValues),
      nic: validateField('nic', nextValues.nic, nextValues),
      password: validateField('password', nextValues.password, nextValues),
      confirmPassword: validateField('confirmPassword', nextValues.confirmPassword, nextValues),
      terms: validateField('terms', nextValues.terms, nextValues),
    };

    setValues(nextValues);
    setErrors(nextErrors);

    return Object.values(nextErrors).every((message) => !message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        ...values,
        role: selectedRole.value,
      });
      setIsSubmitting(false);
      navigate('/login', {
        replace: true,
        state: {
          ...roleRouteState,
          registeredEmail: values.email,
        },
      });
    } catch (error) {
      setIsSubmitting(false);
      setStatusMessage(error?.message || 'Unable to create account. Please try again.');
    }
  };

  const showPlaceholderMessage = (message) => {
    setStatusMessage(message);
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#03070B] text-[#F8FAFC]">
      <section className="grid min-h-[100dvh] lg:grid-cols-[42%_58%]">
        <aside className="relative hidden overflow-hidden border-r border-[rgba(214,167,55,0.20)] bg-[#081018] px-8 py-10 lg:block lg:px-12 xl:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(214,167,55,0.13),transparent_24rem),radial-gradient(circle_at_80%_84%,rgba(242,206,114,0.08),transparent_28rem)]" />
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
              <h1 className="mt-5 text-4xl font-black leading-[1.04] text-[#F8FAFC] lg:text-5xl 2xl:text-6xl">
                Turn Your Ideas Into Premium Jerseys.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-[#B5BAC3] lg:text-lg">
                Join VESTRO PRINTLAB and start creating premium sportswear experiences.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-[#B5BAC3]">
              {benefitsByRole[selectedRole.value].map((benefit) => (
                <div key={benefit} className="rounded-2xl border border-[rgba(214,167,55,0.20)] bg-[#0C141D] p-4 shadow-[0_16px_34px_rgba(0,0,0,0.18)]">
                  <p className="font-bold text-[#F8FAFC]">{benefit}</p>
                  <p className="mt-1 leading-6">Continue with tools built for your selected role.</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:px-6 md:px-8 lg:px-12">
          <div className="w-full max-w-2xl">
            <div className="mb-8 flex justify-center lg:hidden">
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

            <div className="rounded-2xl border border-[rgba(214,167,55,0.20)] bg-[#0C141D] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.36)] sm:p-8 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F2CE72]">
                Create Account
              </p>
              <h2 className="mt-3 text-2xl font-black leading-[1.08] text-[#F8FAFC] sm:text-3xl lg:text-4xl">
                Create Your Account
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#B5BAC3]">
                Join VESTRO PRINTLAB and start creating premium sportswear experiences.
              </p>

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

              <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
                {statusMessage && (
                  <p className="rounded-2xl border border-[#D6A737]/25 bg-[#081018] px-4 py-3 text-sm leading-6 text-[#F2CE72]" role="status" aria-live="polite">
                    {statusMessage}
                  </p>
                )}

                <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                  <FormField id="register-name" name="fullName" label="Full Name" autoComplete="name" placeholder="Enter your full name" icon="user" value={values.fullName} error={errors.fullName} onChange={updateField} />
                  <FormField id="register-username" name="username" label="Username" autoComplete="username" placeholder="Choose a username" icon="username" value={values.username} error={errors.username} onChange={updateField} />
                </div>
                <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                  <FormField id="register-email" name="email" label="Email Address" type="email" autoComplete="email" placeholder="you@example.com" icon="mail" value={values.email} error={errors.email} onChange={updateField} />
                  <FormField id="register-nic" name="nic" label="NIC Number" autoComplete="off" placeholder="e.g. 123456789V or 200012345678" icon="id" value={values.nic} error={errors.nic} onChange={updateField} />
                </div>
                <div className="grid items-start gap-x-5 gap-y-4 sm:grid-cols-2">
                  <div>
                    <FormField id="register-password" name="password" label="Password" type="password" autoComplete="new-password" placeholder="Create password" icon="lock" value={values.password} error={errors.password} onChange={updateField} describedBy="register-password-strength" />
                    <PasswordStrength password={values.password} />
                  </div>
                  <FormField id="register-confirm-password" name="confirmPassword" label="Confirm Password" type="password" autoComplete="new-password" placeholder="Confirm password" icon="lock" value={values.confirmPassword} error={errors.confirmPassword} onChange={updateField} />
                </div>

                <div>
                  <label htmlFor="register-terms" className="flex items-start gap-3 text-sm leading-6 text-[#B5BAC3]">
                    <input
                      id="register-terms"
                      name="terms"
                      type="checkbox"
                      checked={values.terms}
                      onChange={updateField}
                      aria-invalid={Boolean(errors.terms)}
                      aria-describedby="register-terms-error"
                      className="mt-1 h-4 w-4 rounded border-[rgba(214,167,55,0.35)] bg-[#03070B] text-[#D6A737] focus:ring-2 focus:ring-[#D6A737]/30 focus:ring-offset-2 focus:ring-offset-[#0C141D]"
                    />
                    <span>
                      I agree to the{' '}
                      <a
                        href="#terms"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          showPlaceholderMessage('Terms of Service page integration is pending.');
                        }}
                        className="rounded-md font-bold text-[#F2CE72] underline decoration-[#D6A737]/50 underline-offset-4 transition duration-200 hover:text-[#D6A737] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] motion-reduce:transition-none"
                      >
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                        href="#privacy"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          showPlaceholderMessage('Privacy Policy page integration is pending.');
                        }}
                        className="rounded-md font-bold text-[#F2CE72] underline decoration-[#D6A737]/50 underline-offset-4 transition duration-200 hover:text-[#D6A737] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] motion-reduce:transition-none"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                  <p id="register-terms-error" className="mt-2 min-h-5 text-sm leading-5 text-[#F2CE72]" aria-live="polite">
                    {errors.terms || ''}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-12 w-full rounded-xl border border-[#D6A737]/70 bg-[#D6A737] px-5 text-sm font-black text-[#03070B] shadow-[0_14px_34px_rgba(214,167,55,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-[#F2CE72] hover:bg-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="flex items-center gap-3 text-center text-[0.68rem] font-bold uppercase leading-5 tracking-[0.12em] text-[#9CA3AF] sm:gap-4 sm:text-xs sm:tracking-[0.16em]">
                  <span className="h-px flex-1 bg-[rgba(214,167,55,0.20)]" />
                  Or continue with
                  <span className="h-px flex-1 bg-[rgba(214,167,55,0.20)]" />
                </div>

                <button
                  type="button"
                  onClick={() => showPlaceholderMessage('Google registration is a frontend placeholder. OAuth integration is pending.')}
                  className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[rgba(214,167,55,0.20)] bg-[#081018] px-5 text-sm font-black text-[#F8FAFC] transition duration-200 hover:-translate-y-0.5 hover:border-[#D6A737]/45 hover:text-[#F2CE72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </form>

              <p className="mt-7 text-center text-sm leading-6 text-[#B5BAC3]">
                Already have an account?{' '}
                <Link to="/login" state={roleRouteState} className="rounded-md font-black text-[#F2CE72] transition duration-200 hover:text-[#D6A737] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A737]">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Register;
