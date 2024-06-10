import { EnvType } from './env.enum.js'

export const isLocalEnv = (): boolean => process.env.NODE_ENV === EnvType.LOCAL
export const isTestEnv = (): boolean => process.env.NODE_ENV === EnvType.TEST
export const isQaEnv = (): boolean => process.env.NODE_ENV === EnvType.QA
export const isDevelopmentEnv = (): boolean => process.env.NODE_ENV === EnvType.DEVELOPMENT
export const isStagingEnv = (): boolean => process.env.NODE_ENV === EnvType.STAGING
export const isProductionEnv = (): boolean => process.env.NODE_ENV === EnvType.PRODUCTION
