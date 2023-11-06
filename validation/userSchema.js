import Joi from "joi";

const userRegistrationSchema = Joi.object({
  name: Joi.string().required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(new RegExp(".*[0-9].*"))
    .required(),

  money_balance: Joi.number().required(),
});

export { userRegistrationSchema };
