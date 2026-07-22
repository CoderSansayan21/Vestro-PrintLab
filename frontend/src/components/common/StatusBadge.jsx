const variants = {
  success: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  warning: 'border-amber-300/40 bg-amber-300/10 text-amber-100',
  danger: 'border-vestro-pink/50 bg-vestro-pink/10 text-pink-100',
  info: 'border-vestro-cyan/50 bg-vestro-cyan/10 text-cyan-100',
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
