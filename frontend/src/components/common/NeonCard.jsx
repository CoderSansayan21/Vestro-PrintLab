function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function NeonCard({ as: Component = 'section', className = '', children, ...props }) {
  return (
    <Component
      className={joinClasses(
        'rounded-2xl border border-vestro-border bg-vestro-card p-5 shadow-vestro-sm transition duration-200 hover:border-vestro-gold/35 hover:shadow-vestro-gold sm:p-6',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default NeonCard;
