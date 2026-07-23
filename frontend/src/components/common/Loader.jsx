function LoadingSpinner({ label = 'Loading', size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-9 w-9 border-[3px]',
  };

  return (
    <span className={`inline-flex items-center gap-3 text-sm text-vestro-muted ${className}`}>
      <span
        aria-hidden="true"
        className={`${sizes[size] || sizes.md} rounded-full border-vestro-gold/25 border-t-vestro-gold-light shadow-vestro-gold motion-safe:animate-spin`}
      />
      <span className="sr-only">{label}</span>
      {label && <span aria-hidden="true">{label}</span>}
    </span>
  );
}

export { LoadingSpinner };
export default LoadingSpinner;
