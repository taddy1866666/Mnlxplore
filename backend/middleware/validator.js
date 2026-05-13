const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return res.status(400).json({ message: errorMessage });
  }
  next();
};

// Auth Schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required for registration'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required for registration'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Trip Schemas
const generateTripSchema = Joi.object({
  destination: Joi.string().min(2).max(100).required(),
  budget: Joi.number().min(500).max(1000000).required(),
  days: Joi.number().min(1).max(30).required(),
  preferences: Joi.array().items(Joi.string()).max(10),
  travelMode: Joi.string().valid('walking', 'motorcycle', 'driving', 'transit').default('walking'),
  suggestedPlaces: Joi.array().max(20)
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  generateTripSchema
};
