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
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
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
          'relative w-full max-w-lg rounded-3xl border border-vestro-cyan/35 bg-vestro-card p-5 text-vestro-text shadow-vestro-cyan sm:p-6',
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-vestro-pink/35 bg-vestro-pink/10 text-xl font-bold text-vestro-text transition hover:border-vestro-cyan/60 hover:bg-vestro-cyan/10 hover:shadow-vestro-cyan focus-visible:outline-vestro-cyan"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="mt-6">{children}</div>

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
