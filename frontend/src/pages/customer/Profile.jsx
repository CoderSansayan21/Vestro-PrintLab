import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer.jsx';
import NeonCard from '../../components/common/NeonCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { InputField, SelectField, TextareaField } from '../../components/common/Input.jsx';
import { PrimaryButton, SecondaryButton } from '../../components/common/Button.jsx';
import DeleteAccountModal from '../../components/profile/DeleteAccountModal.jsx';
import PasswordStrength from '../../components/profile/PasswordStrength.jsx';
import ProfileCompletion from '../../components/profile/ProfileCompletion.jsx';
import ProfileHeader from '../../components/profile/ProfileHeader.jsx';
import ProfileImageUploader from '../../components/profile/ProfileImageUploader.jsx';
import ProfileInfoCard from '../../components/profile/ProfileInfoCard.jsx';
import SettingsToggle from '../../components/profile/SettingsToggle.jsx';
import { mockProfile, mockSettings } from '../../mock/profileData.js';
import { validateEmail, validatePassword, validateSriLankanPhone } from '../../utils/validators.js';

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const maxImageSize = 2 * 1024 * 1024;

function getMode(pathname) {
  if (pathname.endsWith('/edit')) return 'edit';
  if (pathname.endsWith('/settings')) return 'settings';
  if (pathname.endsWith('/change-password')) return 'password';
  return 'overview';
}

function validateRequired(value, label) {
  return value.trim() ? '' : `${label} is required.`;
}

function validateUsername(value) {
  const username = value.trim();
  if (!username) return 'Username is required.';
  if (username.length < 3) return 'Username must be at least 3 characters.';
  if (!/^[A-Za-z0-9._]+$/.test(username)) return 'Use letters, numbers, underscore, or period only.';
  return '';
}

function validateNIC(value) {
  const nic = value.trim();
  if (!nic) return 'NIC number is required.';
  if (!/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(nic)) return 'Enter a valid old or new Sri Lankan NIC format.';
  return '';
}

function validateBio(value) {
  return value.length > 180 ? 'Bio must be 180 characters or fewer.' : '';
}

function getFormFromProfile(profile) {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.username,
    email: profile.email,
    phoneNumber: profile.phoneNumber,
    nicNumber: profile.nicNumber,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    address: profile.address,
    city: profile.city,
    country: profile.country,
    postalCode: profile.postalCode,
    bio: profile.bio,
  };
}

function AlertMessage({ type = 'success', children }) {
  const classes = type === 'error' ? 'border-red-300/40 bg-red-300/10 text-red-100' : 'border-vestro-gold/35 bg-vestro-gold/10 text-vestro-gold-light';
  return <div className={`rounded-2xl border px-4 py-3 text-sm font-bold leading-6 ${classes}`} role="status">{children}</div>;
}

function ProfileOverview({ profile }) {
  const personalItems = [
    { label: 'Full name', value: profile.fullName },
    { label: 'Username', value: `@${profile.username}` },
    { label: 'Email', value: profile.email },
    { label: 'Phone number', value: profile.phoneNumber },
    { label: 'NIC number', value: profile.nicNumber },
    { label: 'Date of birth', value: profile.dateOfBirth },
    { label: 'Gender', value: profile.gender },
    { label: 'Member since', value: profile.memberSince },
  ];
  const locationItems = [
    { label: 'Address', value: profile.address },
    { label: 'City', value: profile.city },
    { label: 'Country', value: profile.country },
    { label: 'Postal code', value: profile.postalCode },
  ];

  return (
    <div className="grid gap-5">
      <ProfileHeader profile={profile} />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <ProfileInfoCard title="Personal Information" items={personalItems} />
          <ProfileInfoCard title="Address Details" items={locationItems} />
          <NeonCard>
            <h2 className="text-lg font-black text-vestro-text">Bio</h2>
            <p className="mt-4 text-sm leading-7 text-vestro-muted">{profile.bio}</p>
          </NeonCard>
        </div>
        <div className="grid gap-5 content-start">
          <NeonCard>
            <h2 className="text-lg font-black text-vestro-text">Account</h2>
            <div className="mt-5 grid gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-vestro-border bg-vestro-elevated/70 px-4 py-3"><span className="text-sm text-vestro-muted">Role</span><StatusBadge variant="info">{profile.role}</StatusBadge></div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-vestro-border bg-vestro-elevated/70 px-4 py-3"><span className="text-sm text-vestro-muted">Status</span><StatusBadge variant="success">{profile.status}</StatusBadge></div>
            </div>
          </NeonCard>
          <ProfileCompletion value={profile.profileCompletion} />
        </div>
      </div>
    </div>
  );
}

function EditProfile({ profile }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(getFormFromProfile(profile));
  const [initialValues] = useState(getFormFromProfile(profile));
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(profile.avatarUrl);
  const [imageError, setImageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');
  const hasUnsavedChanges = JSON.stringify(values) !== JSON.stringify(initialValues) || imagePreview !== profile.avatarUrl;

  const validate = (nextValues = values) => {
    const nextErrors = {
      firstName: validateRequired(nextValues.firstName, 'First name'),
      lastName: validateRequired(nextValues.lastName, 'Last name'),
      username: validateUsername(nextValues.username),
      email: validateEmail(nextValues.email),
      phoneNumber: validateSriLankanPhone(nextValues.phoneNumber),
      nicNumber: validateNIC(nextValues.nicNumber),
      dateOfBirth: validateRequired(nextValues.dateOfBirth, 'Date of birth'),
      gender: validateRequired(nextValues.gender, 'Gender'),
      address: validateRequired(nextValues.address, 'Address'),
      city: validateRequired(nextValues.city, 'City'),
      country: validateRequired(nextValues.country, 'Country'),
      postalCode: validateRequired(nextValues.postalCode, 'Postal code'),
      bio: validateBio(nextValues.bio),
    };
    Object.keys(nextErrors).forEach((key) => { if (!nextErrors[key]) delete nextErrors[key]; });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && !imageError;
  };

  const updateField = (field, value) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setStatus('');
    validate(nextValues);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setImageError('');
    if (!file) return;
    if (!allowedImageTypes.includes(file.type)) return setImageError('Use JPG, PNG, or WEBP image files only.');
    if (file.size > maxImageSize) return setImageError('Image size must be 2MB or less.');
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('');
    if (!validate()) return setStatus('error');
    setIsSaving(true);
    window.setTimeout(() => { setIsSaving(false); setStatus('success'); }, 650);
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-5">
      <NeonCard><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-vestro-gold-light">Edit Profile</p><h1 className="mt-2 text-2xl font-black text-vestro-text sm:text-3xl">Update your profile details</h1></div>{hasUnsavedChanges && <StatusBadge variant="warning">Unsaved changes</StatusBadge>}</div></NeonCard>
      {status === 'success' && <AlertMessage>Profile changes saved locally. Backend integration is pending.</AlertMessage>}
      {status === 'error' && <AlertMessage type="error">Please fix the highlighted fields before saving.</AlertMessage>}
      <ProfileImageUploader preview={imagePreview} error={imageError} onChange={handleImageChange} onRemove={() => { setImagePreview(''); setImageError(''); }} />
      <NeonCard as="section"><div className="grid gap-5 md:grid-cols-2">
        <InputField id="first-name" label="First name" value={values.firstName} error={errors.firstName} onChange={(event) => updateField('firstName', event.target.value)} />
        <InputField id="last-name" label="Last name" value={values.lastName} error={errors.lastName} onChange={(event) => updateField('lastName', event.target.value)} />
        <InputField id="profile-username" label="Username" value={values.username} error={errors.username} onChange={(event) => updateField('username', event.target.value)} />
        <InputField id="profile-email" label="Email" type="email" value={values.email} error={errors.email} onChange={(event) => updateField('email', event.target.value)} />
        <InputField id="profile-phone" label="Phone number" value={values.phoneNumber} error={errors.phoneNumber} onChange={(event) => updateField('phoneNumber', event.target.value)} />
        <InputField id="profile-nic" label="NIC number" value={values.nicNumber} error={errors.nicNumber} onChange={(event) => updateField('nicNumber', event.target.value)} />
        <InputField id="profile-dob" label="Date of birth" type="date" value={values.dateOfBirth} error={errors.dateOfBirth} onChange={(event) => updateField('dateOfBirth', event.target.value)} />
        <SelectField id="profile-gender" label="Gender" value={values.gender} error={errors.gender} onChange={(event) => updateField('gender', event.target.value)}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Prefer not to say</option></SelectField>
        <InputField id="profile-address" label="Address" value={values.address} error={errors.address} onChange={(event) => updateField('address', event.target.value)} containerClassName="md:col-span-2" />
        <InputField id="profile-city" label="City" value={values.city} error={errors.city} onChange={(event) => updateField('city', event.target.value)} />
        <InputField id="profile-country" label="Country" value={values.country} error={errors.country} onChange={(event) => updateField('country', event.target.value)} />
        <InputField id="profile-postal" label="Postal code" value={values.postalCode} error={errors.postalCode} onChange={(event) => updateField('postalCode', event.target.value)} />
        <TextareaField id="profile-bio" label="Bio" value={values.bio} error={errors.bio} hint={`${values.bio.length}/180 characters`} onChange={(event) => updateField('bio', event.target.value)} className="md:col-span-2" />
      </div></NeonCard>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><SecondaryButton type="button" onClick={() => navigate('/profile')} className="w-full sm:w-auto">Cancel</SecondaryButton><PrimaryButton type="submit" disabled={isSaving} className="w-full sm:w-auto">{isSaving ? 'Saving...' : 'Save Changes'}</PrimaryButton></div>
    </form>
  );
}

function AccountSettings() {
  const [settings, setSettings] = useState(mockSettings);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [message, setMessage] = useState('');
  const setSetting = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  return (
    <div className="grid gap-5"><NeonCard><p className="text-xs font-black uppercase tracking-[0.18em] text-vestro-gold-light">Account Settings</p><h1 className="mt-2 text-2xl font-black text-vestro-text sm:text-3xl">Manage preferences and privacy</h1></NeonCard>{message && <AlertMessage>{message}</AlertMessage>}
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <NeonCard><h2 className="text-lg font-black text-vestro-text">Notifications</h2><div className="mt-5 grid gap-3"><SettingsToggle id="email-notifications" label="Email notifications" description="Receive account and profile email updates." checked={settings.emailNotifications} onChange={(value) => setSetting('emailNotifications', value)} /><SettingsToggle id="order-notifications" label="Order notifications" description="Get updates about mock order progress." checked={settings.orderNotifications} onChange={(value) => setSetting('orderNotifications', value)} /><SettingsToggle id="promo-notifications" label="Promotional notifications" description="Receive premium collection and offer updates." checked={settings.promotionalNotifications} onChange={(value) => setSetting('promotionalNotifications', value)} /></div></NeonCard>
        <NeonCard><h2 className="text-lg font-black text-vestro-text">Display</h2><div className="mt-5 grid gap-4"><SettingsToggle id="dark-mode" label="Dark mode" description="VESTRO theme is currently dark." checked={settings.darkMode} disabled onChange={() => {}} /><SelectField id="language" label="Language" value={settings.language} onChange={(event) => setSetting('language', event.target.value)}><option>English</option><option>Sinhala</option><option>Tamil</option></SelectField></div></NeonCard>
        <NeonCard><h2 className="text-lg font-black text-vestro-text">Privacy</h2><div className="mt-5 grid gap-4"><SelectField id="profile-visibility" label="Profile visibility" value={settings.profileVisibility} onChange={(event) => setSetting('profileVisibility', event.target.value)}><option>Private</option><option>Team only</option><option>Public</option></SelectField><SettingsToggle id="data-sharing" label="Personalized recommendations" description="Use mock preferences to personalize design suggestions." checked={settings.dataSharing} onChange={(value) => setSetting('dataSharing', value)} /></div></NeonCard>
        <NeonCard><h2 className="text-lg font-black text-vestro-text">Sessions & Devices</h2><div className="mt-5 grid gap-3">{settings.sessions.map((session) => <div key={session.id} className="rounded-xl border border-vestro-border bg-vestro-elevated/70 p-4"><p className="font-bold text-vestro-text">{session.device}</p><p className="mt-1 text-sm text-vestro-muted">{session.location}</p><p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-vestro-gold-light">{session.lastActive}</p></div>)}</div></NeonCard>
      </div>
      <NeonCard><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-black text-red-100">Delete Account</h2><p className="mt-2 text-sm leading-6 text-vestro-muted">Open a safe frontend-only confirmation flow. No real deletion happens.</p></div><button type="button" onClick={() => setDeleteOpen(true)} className="min-h-11 rounded-xl border border-red-300/50 bg-red-300/10 px-5 py-3 text-sm font-black text-red-100 transition hover:bg-red-300/15 focus-visible:outline-red-300">Delete Account</button></div></NeonCard>
      <DeleteAccountModal isOpen={deleteOpen} confirmText={deleteText} password={deletePassword} onConfirmTextChange={setDeleteText} onPasswordChange={setDeletePassword} onClose={() => setDeleteOpen(false)} onSubmit={() => { setDeleteOpen(false); setMessage('Delete account request is a frontend placeholder. Backend integration is pending.'); setDeleteText(''); setDeletePassword(''); }} />
    </div>
  );
}

function ChangePassword() {
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const validate = (nextValues = values) => {
    const nextErrors = { currentPassword: nextValues.currentPassword ? '' : 'Current password is required.', newPassword: validatePassword(nextValues.newPassword), confirmPassword: nextValues.confirmPassword === nextValues.newPassword ? '' : 'Passwords do not match.' };
    if (nextValues.currentPassword && nextValues.currentPassword === nextValues.newPassword) nextErrors.newPassword = 'New password must be different from current password.';
    Object.keys(nextErrors).forEach((key) => { if (!nextErrors[key]) delete nextErrors[key]; });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const updateField = (field, value) => { const nextValues = { ...values, [field]: value }; setValues(nextValues); setMessage(''); validate(nextValues); };
  const handleSubmit = (event) => { event.preventDefault(); setMessage(''); if (!validate()) return; setIsSaving(true); window.setTimeout(() => { setIsSaving(false); setMessage('Password change validated locally. Backend integration is pending.'); setValues({ currentPassword: '', newPassword: '', confirmPassword: '' }); }, 650); };

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-5"><NeonCard><p className="text-xs font-black uppercase tracking-[0.18em] text-vestro-gold-light">Security</p><h1 className="mt-2 text-2xl font-black text-vestro-text sm:text-3xl">Change Password</h1></NeonCard>{message && <AlertMessage>{message}</AlertMessage>}<NeonCard><div className="grid gap-5">{['currentPassword', 'newPassword', 'confirmPassword'].map((field) => <div key={field} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"><InputField id={field} label={field === 'currentPassword' ? 'Current password' : field === 'newPassword' ? 'New password' : 'Confirm password'} type={visible[field] ? 'text' : 'password'} value={values[field]} error={errors[field]} autoComplete={field === 'currentPassword' ? 'current-password' : 'new-password'} onChange={(event) => updateField(field, event.target.value)} /><button type="button" onClick={() => setVisible((current) => ({ ...current, [field]: !current[field] }))} className="min-h-11 rounded-xl border border-vestro-border px-4 py-2 text-sm font-bold text-vestro-muted transition hover:border-vestro-gold/45 hover:text-vestro-gold-light focus-visible:outline-vestro-gold">{visible[field] ? 'Hide' : 'Show'}</button></div>)}<PasswordStrength password={values.newPassword} /></div></NeonCard><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><SecondaryButton type="button" className="w-full sm:w-auto">Cancel</SecondaryButton><PrimaryButton type="submit" disabled={isSaving} className="w-full sm:w-auto">{isSaving ? 'Updating...' : 'Update Password'}</PrimaryButton></div></form>
  );
}

function Profile() {
  const location = useLocation();
  const mode = getMode(location.pathname);
  const profile = useMemo(() => mockProfile, []);

  return (
    <PageContainer contentClassName="space-y-6">
      <nav aria-label="Profile sections" className="flex gap-2 overflow-x-auto rounded-2xl border border-vestro-border bg-vestro-card p-2">
        {[{ label: 'Overview', to: '/profile' }, { label: 'Edit Profile', to: '/profile/edit' }, { label: 'Settings', to: '/profile/settings' }, { label: 'Change Password', to: '/profile/change-password' }].map((item) => {
          const active = location.pathname === item.to;
          return <Link key={item.to} to={item.to} className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-black transition focus-visible:outline-vestro-gold ${active ? 'bg-vestro-gold text-vestro-page' : 'text-vestro-muted hover:bg-vestro-gold/10 hover:text-vestro-gold-light'}`}>{item.label}</Link>;
        })}
      </nav>
      {mode === 'overview' && <ProfileOverview profile={profile} />}
      {mode === 'edit' && <EditProfile profile={profile} />}
      {mode === 'settings' && <AccountSettings />}
      {mode === 'password' && <ChangePassword />}
    </PageContainer>
  );
}

export default Profile;
