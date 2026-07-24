import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState.jsx';
import NeonCard from '../../components/common/NeonCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import useAuthStore from '../../store/authStore.js';

const menuItems = ['Dashboard', 'Orders', 'Products', 'Users', 'Reports'];

const metrics = [
  { label: 'Total Orders', value: 0, tone: 'cyan' },
  { label: 'Pending Orders', value: 0, tone: 'pink' },
  { label: 'Products', value: 0, tone: 'purple' },
  { label: 'Reports', value: 0, tone: 'cyan' },
];

const productStatuses = [
  { label: 'Apparel items', value: 0 },
  { label: 'Active products', value: 0 },
  { label: 'Draft products', value: 0 },
];

function getDisplayName(user) {
  return user?.full_name || user?.name || user?.email || 'Admin user';
}

function MetricCard({ label, value, tone }) {
  const tones = {
    cyan: 'border-vestro-cyan/35 bg-vestro-cyan/10 text-vestro-cyan shadow-vestro-cyan',
    pink: 'border-vestro-pink/35 bg-vestro-pink/10 text-vestro-pink shadow-vestro-pink',
    purple: 'border-vestro-purple/35 bg-vestro-purple/10 text-violet-200 shadow-vestro-purple',
  };

  return (
    <NeonCard className="p-4 sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-vestro-muted">{label}</p>
          <p className="mt-3 text-3xl font-black text-vestro-text sm:text-4xl">{value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-black ${tones[tone] || tones.cyan}`}>
          {value}
        </span>
      </div>
    </NeonCard>
  );
}

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const displayName = getDisplayName(user);

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarOpen]);

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-vestro-page text-vestro-text">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(236,22,140,0.12),transparent_30rem),radial-gradient(circle_at_86%_10%,rgba(22,191,253,0.12),transparent_30rem)]" />

      <div className="lg:grid lg:min-h-screen lg:grid-cols-[280px_1fr]">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[min(18rem,calc(100vw-2rem))] overflow-y-auto border-r border-vestro-cyan/15 bg-vestro-secondary/95 p-4 shadow-vestro-sm backdrop-blur-xl transition-transform duration-200 lg:static lg:w-auto lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          id="admin-sidebar"
          aria-label="Admin navigation"
        >
          <div className="flex h-full flex-col">
            <div className="rounded-2xl border border-vestro-pink/25 bg-vestro-elevated/70 p-4 shadow-vestro-pink">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-vestro-cyan">VESTRO PRINTLAB</p>
              <p className="mt-2 text-xl font-black text-vestro-text">Admin Control</p>
            </div>

            <nav className="mt-6 grid gap-2" aria-label="Admin navigation">
              {menuItems.map((item) => {
                const isActive = item === 'Dashboard';

                return (
                  <button
                    key={item}
                    type="button"
                    disabled={!isActive}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                      isActive
                        ? 'border-vestro-pink/60 bg-vestro-pink/15 text-vestro-text shadow-vestro-pink'
                        : 'border-vestro-border bg-vestro-card/60 text-vestro-muted opacity-75'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl border border-vestro-border bg-vestro-card/70 p-4">
              <p className="truncate text-sm font-black text-vestro-text">{displayName}</p>
              <p className="mt-1 truncate text-xs text-vestro-muted">{user?.email || 'Admin email unavailable'}</p>
              <button
                type="button"
                onClick={logout}
                className="mt-4 w-full rounded-xl border border-vestro-pink/45 bg-vestro-pink/10 px-4 py-2.5 text-sm font-black text-vestro-text transition hover:bg-vestro-pink/20 hover:shadow-vestro-pink focus-visible:outline-vestro-cyan"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close admin menu"
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-vestro-cyan/15 bg-vestro-page/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Open admin menu"
                  aria-controls="admin-sidebar"
                  aria-expanded={isSidebarOpen}
                  onClick={() => setIsSidebarOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-vestro-cyan/35 bg-vestro-elevated/80 text-vestro-text shadow-vestro-cyan focus-visible:outline-vestro-cyan lg:hidden"
                >
                  <span aria-hidden="true" className="space-y-1.5">
                    <span className="block h-0.5 w-5 bg-current" />
                    <span className="block h-0.5 w-5 bg-current" />
                    <span className="block h-0.5 w-5 bg-current" />
                  </span>
                </button>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-vestro-cyan">Admin Dashboard</p>
                  <h1 className="truncate text-xl font-black text-vestro-text sm:text-2xl lg:text-3xl">Operations Overview</h1>
                </div>
              </div>
              <StatusBadge variant="danger">Admin</StatusBadge>
            </div>
          </header>

          <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
              <NeonCard>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-vestro-pink">Recent orders</p>
                    <h2 className="mt-2 text-xl font-black text-vestro-text sm:text-2xl">Order queue</h2>
                  </div>
                  <StatusBadge variant="neutral">0 orders</StatusBadge>
                </div>
                <EmptyState
                  className="mt-5 min-h-64 border-vestro-pink/20 bg-vestro-elevated/50"
                  title="No recent orders available"
                  description="Recent admin order data will appear here once it is connected to the dashboard."
                />
              </NeonCard>

              <NeonCard>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-vestro-cyan">Products</p>
                    <h2 className="mt-2 text-xl font-black text-vestro-text sm:text-2xl">Apparel overview</h2>
                  </div>
                  <StatusBadge variant="info">Inventory</StatusBadge>
                </div>
                <div className="mt-5 grid gap-3">
                  {productStatuses.map((item) => (
                    <div key={item.label} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-vestro-border bg-vestro-elevated/70 px-4 py-3">
                      <span className="text-sm font-bold text-vestro-muted">{item.label}</span>
                      <StatusBadge variant="neutral">{item.value}</StatusBadge>
                    </div>
                  ))}
                </div>
              </NeonCard>
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <NeonCard>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-vestro-cyan">Status</p>
                    <h2 className="mt-2 text-xl font-black text-vestro-text sm:text-2xl">Production states</h2>
                  </div>
                  <StatusBadge variant="neutral">Live</StatusBadge>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-vestro-border bg-vestro-elevated/70 px-4 py-3">
                    <span className="text-sm font-bold text-vestro-muted">Pending</span>
                    <StatusBadge variant="warning">0</StatusBadge>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-vestro-border bg-vestro-elevated/70 px-4 py-3">
                    <span className="text-sm font-bold text-vestro-muted">In progress</span>
                    <StatusBadge variant="info">0</StatusBadge>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-vestro-border bg-vestro-elevated/70 px-4 py-3">
                    <span className="text-sm font-bold text-vestro-muted">Completed</span>
                    <StatusBadge variant="success">0</StatusBadge>
                  </div>
                </div>
              </NeonCard>

              <NeonCard>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-vestro-pink">Reports</p>
                    <h2 className="mt-2 text-xl font-black text-vestro-text sm:text-2xl">Insights</h2>
                  </div>
                  <StatusBadge variant="danger">Reports</StatusBadge>
                </div>
                <EmptyState
                  className="mt-5 min-h-56 border-vestro-cyan/20 bg-vestro-elevated/50"
                  title="No reports available"
                  description="Reports exist in the project structure, but no report data is currently connected to this dashboard."
                />
              </NeonCard>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
