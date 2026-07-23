function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function GoldBadge({ as: Component = 'span', className = '', children, ...props }) {
  return (
    <Component
      className={joinClasses(
        'inline-flex items-center rounded-full border border-vestro-gold/35 bg-vestro-gold/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-vestro-gold-light',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default GoldBadge;
