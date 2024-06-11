# INITIAL SETUP

## INSTALLATION

```bash
$ pnpm install
```

## SETTING UP .ENV

```bash
'Note: during private generation a passphrase is required, this is RSA_PASSPHRASE'
openssl genrsa -des3 -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
cat private.pem | base64 '<-- Your RSA_PRIVATE'
cat public.pem | base64 '<-- Your RSA_PUBLIC'
```

RSA private key

```bash
RSA_PRIVATE = "your private key"
```

RSA public key

```bash
RSA_PUBLIC = "your public key"
```

RSA passphrase

```bash
RSA_PASSPHRASE = "your password"
```

## RUNNING THE APP

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## RUNNING TESTS

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

---

###### [GO BACK TO README](../README.md)
