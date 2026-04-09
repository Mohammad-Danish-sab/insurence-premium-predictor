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


export const validatePredictForm = (data) => {
  const errors = {};

  if (!data.age || data.age < 18 || data.age > 100)
    errors.age = "Age must be between 18 and 100";

  if (!data.bmi || data.bmi < 10 || data.bmi > 60)
    errors.bmi = "BMI must be between 10 and 60";

  if (data.children < 0 || data.children > 10)
    errors.children = "Children must be between 0 and 10";

  if (!data.sex) errors.sex = "Please select gender";

  if (!data.region) errors.region = "Please select region";

  return errors;
};
