import crypto from 'crypto'

function exportKey (key: crypto.KeyObject): string {
  return key
    .export({ type: 'pkcs1', format: 'pem' })
    .toString()
}

export function getPrivateKey (): string {
  if (process.env.RSA_PRIVATE == null || process.env.RSA_PASSPHRASE == null) {
    throw new Error('RSA_PRIVATE or RSA_PASSPHRASE not set in environment')
  }

  const key = crypto.createPrivateKey({
    key: Buffer.from(process.env.RSA_PRIVATE, 'base64'),
    passphrase: process.env.RSA_PASSPHRASE
  })

  return exportKey(key)
}

export function getPublicKey (): string {
  if (process.env.RSA_PUBLIC == null) {
    throw new Error('RSA_PUBLIC not set in environment')
  }

  const key = crypto.createPublicKey({
    key: Buffer.from(process.env.RSA_PUBLIC, 'base64')
  })

  return exportKey(key)
}
