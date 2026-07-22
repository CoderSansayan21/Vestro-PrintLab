function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function NeonCard({ as: Component = 'section', className = '', children, ...props }) {
  return (
    <Component
      className={joinClasses(
        'rounded-2xl border border-vestro-border bg-vestro-card/90 p-5 shadow-vestro-sm backdrop-blur transition duration-200 hover:border-vestro-cyan/35 hover:shadow-vestro-cyan sm:p-6',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default NeonCard;
