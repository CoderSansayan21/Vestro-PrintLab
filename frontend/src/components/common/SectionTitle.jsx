function SectionTitle({ eyebrow, title, description, align = 'left', className = '' }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : '';

  return (
    <div className={`${alignment} max-w-3xl ${className}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-vestro-gold-light">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="mt-3 text-2xl font-black tracking-normal text-vestro-text sm:text-3xl">
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-3 text-sm leading-7 text-vestro-muted sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
