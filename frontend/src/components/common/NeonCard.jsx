function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function NeonCard({ as: Component = 'section', className = '', children, ...props }) {
  return (
    <Component
      className={joinClasses(
        'min-w-0 rounded-2xl border border-vestro-border bg-vestro-card p-4 shadow-vestro-sm transition duration-200 hover:border-vestro-gold/35 hover:shadow-vestro-gold sm:p-5 lg:p-6',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default NeonCard;
