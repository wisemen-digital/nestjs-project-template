import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import type { Integration } from '@sentry/types'
import type { Express } from 'express'

export function initSentry (app?: Express): void {
  if (process.env.SENTRY_DSN === undefined) return

  const integrations: Integration[] = [
    new Sentry.Integrations.Http({ tracing: true })
  ]

  if (app != null) integrations.push(new Tracing.Integrations.Express({ app }))

  Sentry.init({
    environment: process.env.NODE_ENV,
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: Number(process.env.SENTRY_SAMPLE_RATE ?? '1'),
    integrations
  })
}
