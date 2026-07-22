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
        'border border-vestro-pink/60 bg-vestro-pink text-vestro-text shadow-vestro-pink focus-visible:outline-vestro-cyan hover:-translate-y-0.5 hover:border-vestro-cyan/70 hover:bg-[#ff2ba3] hover:shadow-vestro-cyan',
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
        'border border-vestro-cyan/50 bg-vestro-elevated/80 text-vestro-text shadow-vestro-cyan focus-visible:outline-vestro-pink hover:-translate-y-0.5 hover:border-vestro-pink/70 hover:bg-vestro-card',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
