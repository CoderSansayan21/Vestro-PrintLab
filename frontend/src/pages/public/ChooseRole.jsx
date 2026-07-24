import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/ui/index.js';
import { authRoles, getAuthRoleRouteState } from '../../constants/authRoles.js';

function RoleIcon({ path }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d={path}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function ChooseRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleCardKeyDown = (event, roleTitle) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedRole(roleTitle);
    }
  };

  const handleContinue = (event, role) => {
    event.stopPropagation();

    if (selectedRole !== role.title) {
      return;
    }

    navigate('/login', {
      state: getAuthRoleRouteState(role),
    });
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-vestro-page text-vestro-text">
      <section
        aria-labelledby="choose-role-title"
        className="flex min-h-[100dvh] items-center py-12 sm:py-16 lg:py-24"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-vestro-gold-light">
              VESTRO PRINTLAB
            </p>
            <h1
              id="choose-role-title"
              className="mt-4 text-2xl font-black leading-[1.08] text-vestro-text sm:text-4xl lg:text-5xl"
            >
              Choose Your Role
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vestro-muted sm:text-lg sm:leading-8">
              Select how you want to enter the premium AI jersey customization platform.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:mt-12 md:grid-cols-2 lg:gap-6">
            {authRoles.map((role) => {
              const isSelected = selectedRole === role.title;

              return (
                <article
                  key={role.title}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedRole(role.title)}
                  onKeyDown={(event) => handleCardKeyDown(event, role.title)}
                  className={joinClasses(
                    'min-w-0 cursor-pointer rounded-2xl border bg-vestro-card p-5 text-center shadow-vestro-sm outline-none transition duration-200 sm:p-8',
                    isSelected
                      ? 'scale-[1.02] border-vestro-gold/70 shadow-[0_22px_50px_rgba(0,0,0,0.34)]'
                      : 'border-vestro-border hover:border-vestro-gold/40',
                    'focus-visible:border-vestro-gold/70 focus-visible:ring-2 focus-visible:ring-vestro-gold/25 focus-visible:ring-offset-2 focus-visible:ring-offset-vestro-page',
                  )}
                >
                  <div
                    className={joinClasses(
                      'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border bg-vestro-gold/10 text-vestro-gold-light transition duration-200',
                      isSelected ? 'border-vestro-gold/55 bg-vestro-gold/15' : 'border-vestro-gold/25',
                    )}
                  >
                    <RoleIcon path={role.icon} />
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-vestro-gold-light">
                    {role.label}
                  </p>
                  <h2 className="mt-3 text-xl font-black leading-tight text-vestro-text sm:text-2xl">
                    {role.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-vestro-muted">
                    {role.description}
                  </p>
                  {role.features && (
                    <ul className="mt-6 grid gap-3 text-left">
                      {role.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm font-bold text-vestro-text">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-vestro-gold/25 bg-vestro-gold/10 text-[0.65rem] text-vestro-gold-light">
                            &#10003;
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  {role.buttonLabel && (
                    <button
                      type="button"
                      disabled={!isSelected}
                      onClick={(event) => handleContinue(event, role)}
                      className={joinClasses(
                        'mt-7 w-full rounded-xl border px-5 py-3 text-sm font-black transition duration-200 focus-visible:outline-vestro-gold',
                        isSelected
                          ? 'border-vestro-gold/70 bg-vestro-gold text-vestro-page shadow-vestro-gold hover:-translate-y-0.5 hover:border-vestro-gold-light hover:bg-vestro-gold-light'
                          : 'cursor-not-allowed border-vestro-border bg-vestro-elevated text-vestro-muted opacity-70',
                      )}
                    >
                      {role.buttonLabel}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}

export default ChooseRole;
