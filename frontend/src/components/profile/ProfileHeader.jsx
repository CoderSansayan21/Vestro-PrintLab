import { Link } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '../common/Button.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import ProfileCompletion from './ProfileCompletion.jsx';

function getInitials(profile) {
  return `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || 'VP';
}

function ProfileHeader({ profile }) {
  return (
    <section className="rounded-2xl border border-vestro-border bg-vestro-card p-5 shadow-vestro-sm sm:p-6 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-vestro-gold/35 bg-vestro-gold/10 text-3xl font-black text-vestro-gold-light shadow-vestro-sm">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={`${profile.fullName} profile`} className="h-full w-full object-cover" />
            ) : (
              getInitials(profile)
            )}
          </div>

          <div className="min-w-0">
            <StatusBadge variant="success">{profile.status}</StatusBadge>
            <h1 className="mt-4 break-words text-2xl font-black leading-tight text-vestro-text sm:text-3xl lg:text-4xl">
              {profile.fullName}
            </h1>
            <p className="mt-2 break-words text-sm leading-6 text-vestro-muted">@{profile.username} · {profile.email}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PrimaryButton as={Link} to="/profile/edit" className="min-h-11 w-full sm:w-auto">
                Edit Profile
              </PrimaryButton>
              <SecondaryButton as={Link} to="/profile/change-password" className="min-h-11 w-full sm:w-auto">
                Change Password
              </SecondaryButton>
              <SecondaryButton as={Link} to="/profile/settings" className="min-h-11 w-full sm:w-auto">
                Account Settings
              </SecondaryButton>
            </div>
          </div>
        </div>

        <ProfileCompletion value={profile.profileCompletion} />
      </div>
    </section>
  );
}

export default ProfileHeader;
