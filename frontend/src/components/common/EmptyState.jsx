import NeonCard from './NeonCard.jsx';

function EmptyState({ title, description, action, icon, className = '' }) {
  return (
    <NeonCard
      className={`flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center ${className}`}
    >
      {icon && (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-vestro-cyan/30 bg-vestro-cyan/10 text-vestro-cyan shadow-vestro-cyan">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-black text-vestro-text">{title}</h3>
      {description && (
        <p className="mt-3 max-w-md text-sm leading-6 text-vestro-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </NeonCard>
  );
}

export default EmptyState;
