function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Modal({
  isOpen,
  title,
  description,
  children,
  actions,
  onClose,
  className = '',
  closeLabel = 'Close modal',
}) {
  if (!isOpen) {
    return null;
  }

  const titleId = title ? 'modal-title' : undefined;
  const descriptionId = description ? 'modal-description' : undefined;

  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-black/75 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <button
        type="button"
        aria-label={closeLabel}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <section
        className={joinClasses(
          'relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-vestro-gold/35 bg-vestro-card p-4 text-vestro-text shadow-vestro-gold sm:max-h-[calc(100dvh-3rem)] sm:p-6',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 id={titleId} className="text-xl font-black text-vestro-text">
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className="mt-2 text-sm leading-6 text-vestro-muted">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-vestro-gold/35 bg-vestro-gold/10 text-xl font-bold text-vestro-text transition hover:border-vestro-gold-light hover:bg-vestro-gold/15 hover:shadow-vestro-gold focus-visible:outline-vestro-gold"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="mt-5 min-w-0 sm:mt-6">{children}</div>

        {actions && (
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {actions}
          </div>
        )}
      </section>
    </div>
  );
}

export default Modal;
