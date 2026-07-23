function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function FeatureIconFrame({ className = '', children, ...props }) {
  return (
    <div
      className={joinClasses(
        'flex h-12 w-12 items-center justify-center rounded-2xl border border-vestro-gold/30 bg-vestro-elevated text-vestro-gold-light shadow-vestro-sm transition duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default FeatureIconFrame;
