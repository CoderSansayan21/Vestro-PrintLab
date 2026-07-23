export const authRoles = [
  {
    title: 'Customer',
    value: 'customer',
    label: 'Design & Order',
    description:
      'Design your own jerseys using AI, customize every detail, place orders, and track deliveries.',
    features: ['AI Design', '3D Preview', 'Order Tracking'],
    buttonLabel: 'Continue as Customer',
    icon: 'M12 3.5 15.5 5.5v3.75c0 2.1-1.25 4-3.5 4.75-2.25-.75-3.5-2.65-3.5-4.75V5.5L12 3.5Zm-5.5 17c.45-2.75 2.55-4.5 5.5-4.5s5.05 1.75 5.5 4.5h-11Z',
  },
  {
    title: 'Professional Designer',
    value: 'designer',
    label: 'Design Services',
    description:
      'Receive customer projects, manage your portfolio, communicate with clients, and earn income.',
    features: ['Portfolio', 'Project Management', 'Payments'],
    buttonLabel: 'Continue as Designer',
    icon: 'M7.5 5.5h9v13h-9v-13Zm0 3h9M10 12h4M10 15h4M5 8.5h2.5M16.5 8.5H19',
  },
];

export const defaultAuthRole = authRoles[0];

export const authRolesByValue = authRoles.reduce((roles, role) => {
  roles[role.value] = role;
  return roles;
}, {});

export function getAuthRole(roleValue) {
  return authRolesByValue[roleValue] || defaultAuthRole;
}

export function getAuthRoleRouteState(role) {
  return {
    selectedRole: role.value,
    selectedRoleTitle: role.title,
  };
}
