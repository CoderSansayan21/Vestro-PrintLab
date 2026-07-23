const baseButtonClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-60';

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function PrimaryButton({ className = '', type = 'button', children, ...props }) {
  return (
    <button
      type={type}
      className={joinClasses(
        baseButtonClasses,
        'border border-vestro-gold/70 bg-vestro-gold text-vestro-page shadow-vestro-gold focus-visible:outline-vestro-gold hover:-translate-y-0.5 hover:border-vestro-gold-light hover:bg-vestro-gold-light',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ className = '', type = 'button', children, ...props }) {
  return (
    <button
      type={type}
      className={joinClasses(
        baseButtonClasses,
        'border border-vestro-gold/40 bg-transparent text-vestro-text focus-visible:outline-vestro-gold hover:-translate-y-0.5 hover:border-vestro-gold-light hover:bg-vestro-gold/10 hover:text-vestro-gold-light',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
