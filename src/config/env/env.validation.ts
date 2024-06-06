import Joi from 'joi'
import { EnvType } from '../../utils/envs/env.enum.js'

const validSslTypes = ['false', 'true', 'ignore']

export const envValidationSchema = Joi.object({
  TZ: Joi.string().valid('UTC').required(),
  NODE_ENV: Joi.string().valid(...Object.values(EnvType)).required(),

  TYPEORM_URI: Joi.string().uri().required(),
  TYPEORM_SSL: Joi.string().valid(...validSslTypes).required(),

  RSA_PRIVATE: Joi.string().required(),
  RSA_PUBLIC: Joi.string().required(),
  RSA_PASSPHRASE: Joi.string().required(),

  REDIS_HOST: Joi.string().hostname().required(),
  REDIS_PORT: Joi.number().port().required(),

  ACCESS_TOKEN_LIFETIME: Joi.number().integer().positive().required(),
  REFRESH_TOKEN_LIFETIME: Joi.number().integer().positive().required(),

  FRONTEND_URL: Joi.string().uri().required(),

  S3_ENDPOINT: Joi.string().required(),
  S3_REGION: Joi.string().required(),
  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().uuid().required(),
  S3_BUCKET: Joi.string().required()
})
