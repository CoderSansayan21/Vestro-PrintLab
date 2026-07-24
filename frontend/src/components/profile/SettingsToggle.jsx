function SettingsToggle({ id, label, description, checked, onChange, disabled = false }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-vestro-border bg-vestro-elevated/70 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <label htmlFor={id} className="text-sm font-black text-vestro-text">
          {label}
        </label>
        {description && <p className="mt-1 text-sm leading-6 text-vestro-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full border transition duration-200 focus-visible:outline-vestro-gold disabled:cursor-not-allowed disabled:opacity-70 ${
          checked ? 'border-vestro-gold bg-vestro-gold/30' : 'border-vestro-border bg-vestro-page'
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-vestro-text transition duration-200 ${
            checked ? 'left-7 bg-vestro-gold-light' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

export default SettingsToggle;
