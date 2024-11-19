const Joi = require('@hapi/joi');

const registerSchema = Joi.object({
    firstname: Joi.string().min(3).required().messages({
      'string.min': 'First name must be at least 3 characters',
      'string.empty': 'First name is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email address',
      'string.empty': 'Email is required',
    }),
    lastname: Joi.string().min(3).required().messages({
      'string.min': 'Last name must be at least 3 characters',
      'string.empty': 'Last name is required',
    }),
    username: Joi.string().min(3).required().messages({
      'string.min': 'User name must be at least 3 characters',
      'string.empty': 'User name is required',
    }),
    address1: Joi.string().min(3).required().messages({
      'string.min': 'Address1 must be at least 3 characters',
      'string.empty': 'Address1 is required',
    }),
    address2: Joi.string().min(3).required().messages({
      'string.min': 'Address2 must be at least 3 characters',
      'string.empty': 'Address2 is required',
    }),
    state: Joi.string().min(3).required().messages({
      'string.min': 'State must be at least 3 characters',
      'string.empty': 'State is required',
    }),
    country: Joi.string().min(3).required().messages({
      'string.min': 'Country must be at least 3 characters',
      'string.empty': 'Country is required',
    }),
    city: Joi.string().min(3).required().messages({
      'string.min': 'City must be at least 3 characters',
      'string.empty': 'City is required',
    }),
    password: Joi.string().min(3).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{3,}$")).required().messages({
      'string.min': 'Password must be at least 3 characters',
      'string.empty': 'Password is required',
      'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(3).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{3,}$")).required().messages({
    'string.min': 'Password must be at least 3 characters',
    'string.empty': 'Password is required',
    'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
  }),
});

const forgetPassSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email address',
    'string.empty': 'Email is required',
  }),
  new_password: Joi.string().min(3).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{3,}$")).required().messages({
    'string.min': 'Password must be at least 3 characters',
    'string.empty': 'Password is required',
    'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
  }),
  confirm_new_password: Joi.string().valid(Joi.ref('new_password')).required().messages({
    'any.only': 'Confirm password must match the new password',
    'string.empty': 'Confirm password is required',
  }),
});

module.exports = {registerSchema,loginSchema,forgetPassSchema}