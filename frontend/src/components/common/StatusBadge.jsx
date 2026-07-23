const variants = {
  success: 'border-vestro-gold/45 bg-vestro-gold/10 text-vestro-gold-light',
  warning: 'border-amber-300/40 bg-amber-300/10 text-amber-100',
  danger: 'border-red-300/45 bg-red-300/10 text-red-200',
  info: 'border-vestro-gold/45 bg-vestro-gold/10 text-vestro-gold-light',
  neutral: 'border-vestro-border bg-vestro-elevated/80 text-vestro-muted',
};

function StatusBadge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
        variants[variant] || variants.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
}

export default StatusBadge;
