import Joi from "joi";

export function userValidation(data) {
  const Users = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().optional(),
    status: Joi.string().optional(),
  });
  return Users.validate(data, { abortEarly: true });
}

export function userVerification(data) {
  const Users = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
  });
  return Users.validate(data, { abortEarly: true });
}

export function userLoginVerification(data) {
  const Users = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return Users.validate(data, { abortEarly: true });
}
