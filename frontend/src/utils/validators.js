export const validateFullName = (value) => {
  const fullName = value.trim();

  if (!fullName) {
    return 'Full name is required.';
  }

  if (fullName.length < 3) {
    return 'Full name must be at least 3 characters.';
  }

  return '';
};

export const validateEmail = (value) => {
  const email = value.trim();

  if (!email) {
    return 'Email is required.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Enter a valid email address.';
  }

  return '';
};

export const validateSriLankanPhone = (value) => {
  const phone = value.replace(/[\s-]/g, '');

  if (!phone) {
    return 'Phone number is required.';
  }

  if (!/^(?:\+94|94|0)7[0-9]{8}$/.test(phone)) {
    return 'Enter a valid Sri Lankan mobile number.';
  }

  return '';
};

export const validatePassword = (value) => {
  if (!value) {
    return 'Password is required.';
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (!/[A-Z]/.test(value)) {
    return 'Password must include at least one uppercase letter.';
  }

  if (!/[a-z]/.test(value)) {
    return 'Password must include at least one lowercase letter.';
  }

  if (!/[0-9]/.test(value)) {
    return 'Password must include at least one number.';
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    return 'Password must include at least one special character.';
  }

  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Confirm your password.';
  }

  if (confirmPassword !== password) {
    return 'Passwords do not match.';
  }

  return '';
};