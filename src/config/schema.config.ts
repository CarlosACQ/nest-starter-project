import * as Joi from 'joi';

//Validaciones para variables de ambiente utilizando Joi
const configSchema = Joi.object({
  APP_TITLE: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  API_PREFIX: Joi.string().required(),
  API_VERSION: Joi.string().required(),
  APP_EXPIRES: Joi.number().required(),
  API_KEY: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_TOKEN_EXPIRES_IN: Joi.number().required(),
  JWT_REFRESHTOKEN_EXPIRES_IN: Joi.number().required(),
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_NAME: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
});

export default configSchema;