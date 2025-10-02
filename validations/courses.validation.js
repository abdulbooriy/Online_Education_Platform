import Joi from "joi";

export function courseValidation(data) {
  const Courses = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().positive().required(),
  });

  return Courses.validate(data, { abortEarly: true });
}

export function courseUpdateValidation(data) {
  const Courses = Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    price: Joi.number().positive().optional(),
  });

  return Courses.validate(data, { abortEarly: true });
}
