import crypto from 'crypto'

export function getPrivateKey (): string {
  if (process.env.RSA_PRIVATE == null) {
    throw new Error('RSA_PRIVATE not set in environment')
  }
  if (process.env.RSA_PASSPHRASE == null) {
    throw new Error('RSA_PASSPHRASE not set in environment')
  }

  const rawKey = Buffer.from(process.env.RSA_PRIVATE, 'base64')
  const passPhrase = process.env.RSA_PASSPHRASE
  const key = crypto.createPrivateKey({ key: rawKey, passphrase: passPhrase })

  return exportKey(key)
}

export function getPublicKey (): string {
  if (process.env.RSA_PUBLIC == null) {
    throw new Error('RSA_PUBLIC not set in environment')
  }

  const rawKey = Buffer.from(process.env.RSA_PUBLIC, 'base64')
  const key = crypto.createPublicKey({ key: rawKey })

  return exportKey(key)
}

function exportKey (key: crypto.KeyObject): string {
  return key
    .export({ type: 'pkcs1', format: 'pem' })
    .toString()
}
