import assert from 'assert'
import { DefaultApi, type LanguageStringMap, createConfiguration } from '@onesignal/node-onesignal'
import { captureException } from '@sentry/node'
import { Injectable, Logger } from '@nestjs/common'
import dayjs from 'dayjs'
import { type NotificationType } from '../content/notification.type.js'
import { getContentForType } from '../content/notification.content.js'
import { isNotificationEnabled } from '../utils/is-notification-enabled.util.js'
import { isTestEnv } from '../../../utils/envs/env-checks.js'
import { type Notification } from '../entities/notification.entity.js'

@Injectable()
export class OneSignalClient {
  client: DefaultApi
  appId: string
  appKey: string

  private readonly HIGH_PRIORITY = 10

  constructor () {
    const appId = process.env.ONESIGNAL_APP_ID
    const appKey = process.env.ONESIGNAL_API_KEY

    assert(appId, 'ONESIGNAL_APP_ID is required')
    assert(appKey, 'ONESIGNAL_API_KEY is required')

    this.appId = appId
    this.appKey = appKey

    const configuration = createConfiguration({
      authMethods: {
        user_auth_key: {
          tokenProvider: {
            getToken: () => this.appId
          }
        },
        rest_api_key: {
          tokenProvider: {
            getToken: () => this.appKey
          }
        }
      }
    })

    this.client = new DefaultApi(configuration)
  }

  public async sendNotification (
    notificationUuid: string,
    notifications: Notification[],
    type: NotificationType,
    sendAfter: Date,
    additionalOptions?: { content?: LanguageStringMap, data?: object }
  ): Promise<void> {
    if (isTestEnv()) {
      return
    }

    const deviceUuids = notifications
      .filter(notification => isNotificationEnabled(type, notification.config))
      .map(setting => setting.deviceUuid)

    if (deviceUuids.length === 0) {
      return
    }

    const content = getContentForType(type)
    const sendAfterTimestamp = dayjs(sendAfter).toISOString()

    try {
      await this.client.createNotification({
        id: notificationUuid,
        app_id: this.appId,
        contents: additionalOptions?.content ?? content.content,
        headings: content.heading,
        priority: this.HIGH_PRIORITY,
        include_aliases: {
          external_id: deviceUuids
        },
        target_channel: 'push',
        send_after: sendAfterTimestamp,
        data: additionalOptions?.data
      })
    } catch (error) {
      Logger.error('OneSignalClient - Failed to send notification', error)
      captureException(error)
    }
  }

  public async cancelNotification (notificationUuid: string): Promise<void> {
    if (isTestEnv()) {
      return
    }

    try {
      await this.client.cancelNotification(this.appId, notificationUuid)
    } catch (error) {
      Logger.error('OneSignalClient - Failed to cancel notification', error)
      captureException(error)
    }
  }
}
