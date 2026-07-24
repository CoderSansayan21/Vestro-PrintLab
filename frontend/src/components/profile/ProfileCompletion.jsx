function ProfileCompletion({ value }) {
  const percent = Math.min(Math.max(Number(value) || 0, 0), 100);

  return (
    <div className="rounded-2xl border border-vestro-border bg-vestro-elevated/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-black text-vestro-text">Profile completion</p>
        <p className="text-sm font-black text-vestro-gold-light">{percent}%</p>
      </div>
      <div
        className="mt-4 h-3 overflow-hidden rounded-full border border-vestro-gold/20 bg-vestro-page"
        role="progressbar"
        aria-label="Profile completion"
        aria-valuenow={percent}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-vestro-gold-dark via-vestro-gold to-vestro-gold-light"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default ProfileCompletion;
