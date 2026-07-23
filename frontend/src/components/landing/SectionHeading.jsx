function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function SectionHeading({ eyebrow, title, description, align = 'left', className = '' }) {
  const isCentered = align === 'center';

  return (
    <div className={joinClasses('max-w-3xl', isCentered && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-vestro-gold-light">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="mt-3 text-3xl font-black leading-tight text-vestro-text sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-5 text-base leading-8 text-vestro-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
