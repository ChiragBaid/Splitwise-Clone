import { isValidEmail, validatePassword } from './format';

// Form validation schemas
export const validateLoginForm = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

export const validateSignupForm = (values) => {
  const errors = {};

  if (!values.firstName) {
    errors.firstName = 'First name is required';
  } else if (values.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  if (!values.lastName) {
    errors.lastName = 'Last name is required';
  } else if (values.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(values.password);
    if (!passwordValidation.isValid) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
    }
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateExpenseForm = (values) => {
  const errors = {};

  if (!values.description) {
    errors.description = 'Description is required';
  } else if (values.description.length < 3) {
    errors.description = 'Description must be at least 3 characters';
  }

  if (!values.amount) {
    errors.amount = 'Amount is required';
  } else if (isNaN(values.amount) || parseFloat(values.amount) <= 0) {
    errors.amount = 'Please enter a valid amount';
  }

  if (!values.category) {
    errors.category = 'Category is required';
  }

  if (!values.paidBy) {
    errors.paidBy = 'Please select who paid';
  }

  if (!values.splitType) {
    errors.splitType = 'Split type is required';
  }

  if (!values.members || values.members.length === 0) {
    errors.members = 'Please select at least one member';
  }

  return errors;
};

export const validateGroupForm = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Group name is required';
  } else if (values.name.length < 2) {
    errors.name = 'Group name must be at least 2 characters';
  }

  if (!values.description) {
    errors.description = 'Description is required';
  } else if (values.description.length < 5) {
    errors.description = 'Description must be at least 5 characters';
  }

  if (!values.members || values.members.length === 0) {
    errors.members = 'Please add at least one member';
  }

  return errors;
};

export const validateFriendForm = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return errors;
};

// Generic validation functions
export const isRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

export const isNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const isPositiveNumber = (value) => {
  return isNumber(value) && parseFloat(value) > 0;
};

export const isEmail = (value) => {
  return isValidEmail(value);
};

export const isPhoneNumber = (value) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(value.replace(/\D/g, ''));
};

export const isUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const minLength = (value, min) => {
  return value && value.length >= min;
};

export const maxLength = (value, max) => {
  return value && value.length <= max;
};

export const isDate = (value) => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

export const isFutureDate = (value) => {
  const date = new Date(value);
  const now = new Date();
  return date > now;
};

export const isPastDate = (value) => {
  const date = new Date(value);
  const now = new Date();
  return date < now;
};

// Custom validation rules
export const validateAmount = (amount, currency = 'USD') => {
  if (!amount) return 'Amount is required';
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return 'Please enter a valid number';
  
  if (numAmount <= 0) return 'Amount must be greater than 0';
  
  if (numAmount > 999999999) return 'Amount is too large';
  
  return null;
};

export const validatePercentage = (percentage) => {
  if (!percentage) return 'Percentage is required';
  
  const numPercentage = parseFloat(percentage);
  if (isNaN(numPercentage)) return 'Please enter a valid number';
  
  if (numPercentage < 0 || numPercentage > 100) {
    return 'Percentage must be between 0 and 100';
  }
  
  return null;
};

export const validateGroupName = (name) => {
  if (!name) return 'Group name is required';
  
  if (name.length < 2) return 'Group name must be at least 2 characters';
  
  if (name.length > 50) return 'Group name must be less than 50 characters';
  
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
    return 'Group name can only contain letters, numbers, spaces, hyphens, and underscores';
  }
  
  return null;
}; 