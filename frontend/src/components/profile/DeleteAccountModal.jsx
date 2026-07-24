import Modal from '../common/Modal.jsx';

function DeleteAccountModal({
  isOpen,
  confirmText,
  password,
  onConfirmTextChange,
  onPasswordChange,
  onClose,
  onSubmit,
}) {
  const canDelete = confirmText === 'DELETE' && password.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      title="Delete Account"
      description="This frontend-only confirmation does not delete your account yet."
      onClose={onClose}
      className="max-w-xl"
      actions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl border border-vestro-border px-5 py-3 text-sm font-bold text-vestro-text transition hover:border-vestro-gold/45 focus-visible:outline-vestro-gold"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canDelete}
            onClick={onSubmit}
            className="min-h-11 rounded-xl border border-red-300/60 bg-red-300/10 px-5 py-3 text-sm font-black text-red-100 transition hover:bg-red-300/15 focus-visible:outline-red-300 disabled:opacity-50"
          >
            Confirm Delete
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-red-300/35 bg-red-300/10 p-4 text-sm leading-6 text-red-100">
          Deleting an account removes profile details, saved preferences, order access, and design history. This action is intentionally blocked from real backend deletion in this task.
        </div>
        <div className="space-y-2">
          <label htmlFor="delete-confirm" className="block text-sm font-bold text-vestro-text">
            Type DELETE to continue
          </label>
          <input
            id="delete-confirm"
            value={confirmText}
            onChange={(event) => onConfirmTextChange(event.target.value)}
            className="w-full rounded-xl border border-vestro-border bg-vestro-elevated/80 px-4 py-3 text-sm text-vestro-text outline-none focus:border-vestro-gold focus:ring-4 focus:ring-vestro-gold/15"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="delete-password" className="block text-sm font-bold text-vestro-text">
            Password
          </label>
          <input
            id="delete-password"
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            className="w-full rounded-xl border border-vestro-border bg-vestro-elevated/80 px-4 py-3 text-sm text-vestro-text outline-none focus:border-vestro-gold focus:ring-4 focus:ring-vestro-gold/15"
          />
        </div>
      </div>
    </Modal>
  );
}

export default DeleteAccountModal;
