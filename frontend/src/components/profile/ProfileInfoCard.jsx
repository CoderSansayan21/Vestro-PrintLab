function ProfileInfoCard({ title, items }) {
  return (
    <section className="rounded-2xl border border-vestro-border bg-vestro-card p-5 shadow-vestro-sm sm:p-6">
      <h2 className="text-lg font-black text-vestro-text">{title}</h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 rounded-xl border border-vestro-border bg-vestro-elevated/70 p-4">
            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-vestro-muted">{item.label}</dt>
            <dd className="mt-2 break-words text-sm font-bold leading-6 text-vestro-text">{item.value || 'Not provided'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default ProfileInfoCard;
