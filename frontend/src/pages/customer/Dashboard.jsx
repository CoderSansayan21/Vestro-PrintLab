import EmptyState from '../../components/common/EmptyState.jsx';
import NeonCard from '../../components/common/NeonCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import useAuthStore from '../../store/authStore.js';

const quickActions = [
  { label: 'Start a Design', tone: 'pink' },
  { label: 'Choose Apparel', tone: 'cyan' },
  { label: 'Generate Logo', tone: 'purple' },
];

function getDisplayName(user) {
  return user?.full_name || user?.name || user?.email || 'VESTRO Customer';
}

function getInitial(user) {
  return getDisplayName(user).trim().charAt(0).toUpperCase() || 'V';
}

function CyberIcon({ children, tone = 'cyan' }) {
  const tones = {
    cyan: 'border-vestro-cyan/35 bg-vestro-cyan/10 text-vestro-cyan shadow-vestro-cyan',
    pink: 'border-vestro-pink/35 bg-vestro-pink/10 text-vestro-pink shadow-vestro-pink',
    purple: 'border-vestro-purple/35 bg-vestro-purple/10 text-violet-200 shadow-vestro-purple',
  };

  return (
    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-black ${tones[tone] || tones.cyan}`}>
      {children}
    </span>
  );
}

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const displayName = getDisplayName(user);

  return (
    <main className="min-h-screen bg-vestro-page text-vestro-text">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_8%,rgba(236,22,140,0.13),transparent_30rem),radial-gradient(circle_at_84%_12%,rgba(22,191,253,0.12),transparent_28rem)]" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <NeonCard className="relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_80%_20%,rgba(22,191,253,0.14),transparent_18rem)]" />
            <div className="relative">
              <StatusBadge variant="info">Customer Dashboard</StatusBadge>
              <h1 className="mt-5 text-3xl font-black leading-tight text-vestro-text sm:text-4xl">
                Welcome back, {displayName}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-vestro-muted sm:text-base">
                Your VESTRO PRINTLAB workspace is ready for jersey design, AI artwork, apparel previews, and order tracking.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    disabled
                    className={`rounded-full border px-5 py-3 text-sm font-black text-vestro-text transition hover:-translate-y-0.5 focus-visible:outline-vestro-cyan ${
                      action.tone === 'pink'
                        ? 'border-vestro-pink/55 bg-vestro-pink/15 shadow-vestro-pink hover:border-vestro-cyan/60 hover:shadow-vestro-cyan'
                        : action.tone === 'purple'
                          ? 'border-vestro-purple/50 bg-vestro-purple/15 shadow-vestro-purple hover:border-vestro-pink/60 hover:shadow-vestro-pink'
                          : 'border-vestro-cyan/50 bg-vestro-cyan/10 shadow-vestro-cyan hover:border-vestro-pink/60 hover:shadow-vestro-pink'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </NeonCard>

          <NeonCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-vestro-pink/40 bg-vestro-pink/10 text-xl font-black text-vestro-text shadow-vestro-pink">
                {getInitial(user)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-black text-vestro-text">{displayName}</p>
                <p className="truncate text-sm text-vestro-muted">{user?.email || 'Profile email unavailable'}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-vestro-border bg-vestro-elevated/70 px-4 py-3">
                <span className="text-vestro-muted">Role</span>
                <StatusBadge variant="neutral">{user?.role || 'Customer'}</StatusBadge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-vestro-border bg-vestro-elevated/70 px-4 py-3">
                <span className="text-vestro-muted">Status</span>
                <StatusBadge variant="success">Active</StatusBadge>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="mt-6 w-full rounded-xl border border-vestro-pink/45 bg-vestro-pink/10 px-5 py-3 text-sm font-black text-vestro-text transition hover:-translate-y-0.5 hover:bg-vestro-pink/20 hover:shadow-vestro-pink focus-visible:outline-vestro-cyan"
            >
              Logout
            </button>
          </NeonCard>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-3">
          <NeonCard className="lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-vestro-cyan">Recent designs</p>
                <h2 className="mt-2 text-2xl font-black text-vestro-text">Design workspace</h2>
              </div>
              <CyberIcon tone="cyan">3D</CyberIcon>
            </div>
            <EmptyState
              className="mt-5 min-h-64 border-vestro-cyan/20 bg-vestro-elevated/50"
              title="No recent designs yet"
              description="Saved jersey concepts will appear here once design data is available for your account."
              icon={<span className="text-sm font-black">AI</span>}
            />
          </NeonCard>

          <NeonCard>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-vestro-pink">Order status</p>
                <h2 className="mt-2 text-2xl font-black text-vestro-text">Tracking</h2>
              </div>
              <CyberIcon tone="pink">OS</CyberIcon>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-vestro-border bg-vestro-elevated/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-vestro-muted">Pending</span>
                  <StatusBadge variant="neutral">0</StatusBadge>
                </div>
              </div>
              <div className="rounded-xl border border-vestro-border bg-vestro-elevated/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-vestro-muted">In progress</span>
                  <StatusBadge variant="info">0</StatusBadge>
                </div>
              </div>
              <div className="rounded-xl border border-vestro-border bg-vestro-elevated/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-vestro-muted">Completed</span>
                  <StatusBadge variant="success">0</StatusBadge>
                </div>
              </div>
            </div>
          </NeonCard>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <NeonCard>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-vestro-cyan">Recent orders</p>
                <h2 className="mt-2 text-2xl font-black text-vestro-text">Order history</h2>
              </div>
              <CyberIcon tone="purple">#</CyberIcon>
            </div>
            <EmptyState
              className="mt-5 min-h-56 border-vestro-purple/20 bg-vestro-elevated/50"
              title="No recent orders yet"
              description="Your recent order activity will appear here once order data is available."
            />
          </NeonCard>

          <NeonCard>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-vestro-pink">Quick actions</p>
                <h2 className="mt-2 text-2xl font-black text-vestro-text">Next move</h2>
              </div>
              <CyberIcon tone="pink">Go</CyberIcon>
            </div>
            <div className="mt-5 grid gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  disabled
                  className="rounded-xl border border-vestro-border bg-vestro-elevated/70 px-4 py-3 text-left text-sm font-black text-vestro-muted opacity-80 focus-visible:outline-vestro-cyan"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </NeonCard>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
