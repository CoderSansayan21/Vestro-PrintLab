function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

const baseClasses =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition duration-200 ease-out focus-visible:outline-vestro-gold disabled:pointer-events-none disabled:opacity-60';

const variantClasses = {
  primary:
    'border border-vestro-gold/80 bg-gradient-to-b from-vestro-gold-light via-vestro-gold to-vestro-gold-dark text-vestro-page shadow-vestro-gold hover:-translate-y-0.5 hover:border-vestro-gold-light hover:shadow-vestro-md',
  secondary:
    'border border-vestro-gold/35 bg-vestro-page/30 text-vestro-text hover:-translate-y-0.5 hover:border-vestro-gold-light hover:bg-vestro-gold/10 hover:text-vestro-gold-light',
};

function LandingButton({
  as: Component = 'button',
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const buttonProps = Component === 'button' ? { type } : {};

  return (
    <Component
      className={joinClasses(baseClasses, variantClasses[variant] || variantClasses.primary, className)}
      {...buttonProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export default LandingButton;
