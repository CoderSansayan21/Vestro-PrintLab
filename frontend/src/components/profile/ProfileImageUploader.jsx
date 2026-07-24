function ProfileImageUploader({ preview, error, onChange, onRemove }) {
  return (
    <div className="rounded-2xl border border-vestro-border bg-vestro-elevated/70 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-vestro-gold/30 bg-vestro-page text-xl font-black text-vestro-gold-light">
          {preview ? <img src={preview} alt="Selected profile preview" className="h-full w-full object-cover" /> : 'JS'}
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor="profile-image" className="block text-sm font-black text-vestro-text">
            Profile image
          </label>
          <p className="mt-1 text-sm leading-6 text-vestro-muted">JPG, PNG, or WEBP. Maximum file size 2MB.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input id="profile-image" type="file" accept=".jpg,.jpeg,.png,.webp" onChange={onChange} className="sr-only" />
            <label
              htmlFor="profile-image"
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-vestro-gold/45 bg-vestro-gold/10 px-4 py-2 text-sm font-bold text-vestro-gold-light transition hover:border-vestro-gold-light hover:bg-vestro-gold/15 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-vestro-gold"
            >
              Change Image
            </label>
            <button
              type="button"
              onClick={onRemove}
              className="min-h-11 rounded-xl border border-vestro-border px-4 py-2 text-sm font-bold text-vestro-muted transition hover:border-red-300/50 hover:text-red-200 focus-visible:outline-vestro-gold"
            >
              Remove
            </button>
          </div>
          {error && <p className="mt-3 text-xs leading-5 text-red-300">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default ProfileImageUploader;
