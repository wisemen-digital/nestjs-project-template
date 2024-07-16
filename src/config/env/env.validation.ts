import Joi from 'joi'
import { EnvType } from '../../common/envs/env.enum.js'

const validSslTypes = ['false', 'true', 'ignore']

export const envValidationSchema = Joi.object({
  TZ: Joi.string().valid('UTC').required(),
  NODE_ENV: Joi.string().valid(...Object.values(EnvType)).required(),

  DATABASE_URI: Joi.string().uri().required(),
  DATABASE_SSL: Joi.string().valid(...validSslTypes).required(),

  RSA_PRIVATE: Joi.string().required(),
  RSA_PUBLIC: Joi.string().required(),
  RSA_PASSPHRASE: Joi.string().required(),

  REDIS_URL: Joi.string().uri().required(),

  ACCESS_TOKEN_LIFETIME: Joi.number().integer().positive().required(),
  REFRESH_TOKEN_LIFETIME: Joi.number().integer().positive().required(),

  FRONTEND_URL: Joi.string().uri().required()
})
