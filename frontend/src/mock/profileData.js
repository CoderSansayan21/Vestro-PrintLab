const mockProfile = {
  id: 'usr_vestro_1001',
  firstName: 'John',
  lastName: 'Smith',
  fullName: 'John Smith',
  username: 'john.smith',
  email: 'john.smith@example.com',
  phoneNumber: '+94771234567',
  nicNumber: '199512345678',
  dateOfBirth: '1995-08-18',
  gender: 'Male',
  address: '24 Gold Crest Avenue',
  city: 'Colombo',
  country: 'Sri Lanka',
  postalCode: '00500',
  bio: 'Team captain and custom jersey enthusiast focused on premium match-day kits.',
  role: 'Customer',
  status: 'Active',
  memberSince: 'January 2026',
  profileCompletion: 86,
  avatarUrl: '',
};

const mockSettings = {
  emailNotifications: true,
  orderNotifications: true,
  promotionalNotifications: false,
  darkMode: true,
  language: 'English',
  profileVisibility: 'Private',
  dataSharing: false,
  sessions: [
    {
      id: 'session_1',
      device: 'Chrome on Windows',
      location: 'Colombo, Sri Lanka',
      lastActive: 'Active now',
    },
    {
      id: 'session_2',
      device: 'Safari on iPhone',
      location: 'Colombo, Sri Lanka',
      lastActive: '2 days ago',
    },
  ],
};

export { mockProfile, mockSettings };
