export const validateSignup = (data) => {
  const errors = {};

  if (!data.full_name || data.full_name.length < 2)
    errors.full_name = "Full name must be at least 2 characters";

  if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
    errors.email = "Enter a valid email address";

  if (!data.password || data.password.length < 6)
    errors.password = "Password must be at least 6 characters";

  if (data.phone && !/^\+?[0-9]{10,15}$/.test(data.phone))
    errors.phone = "Enter a valid phone number";

  return errors;
};


export const validateLogin = (data) => {
  const errors = {};

  if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
    errors.email = "Enter a valid email address";

  if (!data.password) errors.password = "Password is required";

  return errors;
};


