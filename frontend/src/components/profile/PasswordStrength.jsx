const checks = [
  { label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { label: 'One lowercase letter', test: (value) => /[a-z]/.test(value) },
  { label: 'One number', test: (value) => /[0-9]/.test(value) },
  { label: 'One special character', test: (value) => /[^A-Za-z0-9]/.test(value) },
];

function getStrength(score) {
  if (score <= 1) return { label: 'Weak', width: '20%' };
  if (score <= 3) return { label: 'Fair', width: '45%' };
  if (score === 4) return { label: 'Good', width: '75%' };
  return { label: 'Strong', width: '100%' };
}

function PasswordStrength({ password }) {
  const score = checks.filter((item) => item.test(password)).length;
  const strength = getStrength(score);

  return (
    <div className="rounded-xl border border-vestro-border bg-vestro-page/70 p-4" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-vestro-muted">Password strength</p>
        <p className="text-sm font-black text-vestro-gold-light">{strength.label}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-vestro-elevated">
        <div className="h-full rounded-full bg-vestro-gold-light transition-all duration-200" style={{ width: strength.width }} />
      </div>
      <ul className="mt-4 grid gap-2 text-sm text-vestro-muted sm:grid-cols-2">
        {checks.map((item) => {
          const passed = item.test(password);
          return (
            <li key={item.label} className="flex items-center gap-2">
              <span className={passed ? 'text-vestro-gold-light' : 'text-vestro-muted'} aria-hidden="true">
                {passed ? '✓' : '○'}
              </span>
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PasswordStrength;
