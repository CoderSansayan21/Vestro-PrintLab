import { forwardRef } from 'react';

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function FieldShell({ id, label, hint, error, children, containerClassName = '' }) {
  const describedBy = [
    hint ? `${id}-hint` : '',
    error ? `${id}-error` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={joinClasses('w-full space-y-2', containerClassName)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-bold text-vestro-text">
          {label}
        </label>
      )}

      {children({ describedBy })}

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs leading-5 text-vestro-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="text-xs leading-5 text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

const fieldBaseClasses =
  'w-full rounded-xl border bg-vestro-elevated/80 px-4 py-3 text-sm text-vestro-text outline-none transition placeholder:text-vestro-muted/70 disabled:cursor-not-allowed disabled:opacity-60';

function getStateClasses(error) {
  return error
    ? 'border-red-300/70 focus:border-red-300 focus:ring-4 focus:ring-red-300/15'
    : 'border-vestro-border hover:border-vestro-gold/45 focus:border-vestro-gold focus:ring-4 focus:ring-vestro-gold/15';
}

const InputField = forwardRef(function InputField(
  { id, label, hint, error, className = '', inputClassName = '', containerClassName = '', ...props },
  ref,
) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} containerClassName={containerClassName}>
      {({ describedBy }) => (
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          className={joinClasses(fieldBaseClasses, getStateClasses(error), inputClassName, className)}
          {...props}
        />
      )}
    </FieldShell>
  );
});

const SelectField = forwardRef(function SelectField(
  { id, label, hint, error, className = '', selectClassName = '', children, ...props },
  ref,
) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} containerClassName={className}>
      {({ describedBy }) => (
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          className={joinClasses(fieldBaseClasses, getStateClasses(error), 'appearance-none bg-vestro-elevated/80', selectClassName)}
          {...props}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
});

const TextareaField = forwardRef(function TextareaField(
  { id, label, hint, error, className = '', textareaClassName = '', rows = 4, ...props },
  ref,
) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} containerClassName={className}>
      {({ describedBy }) => (
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          className={joinClasses(fieldBaseClasses, getStateClasses(error), 'min-h-28 resize-y', textareaClassName)}
          {...props}
        />
      )}
    </FieldShell>
  );
});

function FileUploadField({ id, label, hint, error, className = '', inputClassName = '', ...props }) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} containerClassName={className}>
      {({ describedBy }) => (
        <input
          id={id}
          type="file"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          className={joinClasses(
            fieldBaseClasses,
            getStateClasses(error),
            'file:mr-4 file:rounded-lg file:border-0 file:bg-vestro-gold/15 file:px-4 file:py-2 file:text-sm file:font-bold file:text-vestro-gold-light hover:file:bg-vestro-gold/25 hover:file:text-vestro-gold-light',
            inputClassName,
          )}
          {...props}
        />
      )}
    </FieldShell>
  );
}

function CheckboxField({ id, label, hint, error, className = '', inputClassName = '', ...props }) {
  return (
    <div className={joinClasses('space-y-2', className)}>
      <label className="flex items-start gap-3 text-sm text-vestro-muted" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          className={joinClasses(
            'mt-1 h-4 w-4 rounded border-vestro-border bg-vestro-elevated text-vestro-gold focus:ring-vestro-gold focus:ring-offset-0',
            inputClassName,
          )}
          {...props}
        />
        <span className="leading-6">{label}</span>
      </label>
      {hint && !error && <p className="pl-7 text-xs leading-5 text-vestro-muted">{hint}</p>}
      {error && <p className="pl-7 text-xs leading-5 text-red-300">{error}</p>}
    </div>
  );
}

function RadioField({ id, label, hint, error, className = '', inputClassName = '', ...props }) {
  return (
    <div className={joinClasses('space-y-2', className)}>
      <label className="flex items-start gap-3 text-sm text-vestro-muted" htmlFor={id}>
        <input
          id={id}
          type="radio"
          className={joinClasses(
            'mt-1 h-4 w-4 border-vestro-border bg-vestro-elevated text-vestro-gold focus:ring-vestro-gold focus:ring-offset-0',
            inputClassName,
          )}
          {...props}
        />
        <span className="leading-6">{label}</span>
      </label>
      {hint && !error && <p className="pl-7 text-xs leading-5 text-vestro-muted">{hint}</p>}
      {error && <p className="pl-7 text-xs leading-5 text-red-300">{error}</p>}
    </div>
  );
}

export { CheckboxField, FileUploadField, InputField, RadioField, SelectField, TextareaField };
export default InputField;
