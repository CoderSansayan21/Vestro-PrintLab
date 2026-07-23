function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function PremiumCard({ as: Component = 'article', className = '', children, ...props }) {
  return (
    <Component
      className={joinClasses(
        'rounded-2xl border border-vestro-border bg-vestro-card p-5 shadow-vestro-sm transition duration-200 hover:-translate-y-0.5 hover:border-vestro-gold/40 hover:shadow-vestro-md sm:p-6',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default PremiumCard;
