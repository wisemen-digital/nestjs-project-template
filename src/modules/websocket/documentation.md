# How it works

## Connecting

In order to connect to the WSS, you'll have to connect to the `/websockets` endpoint and include your JWT token.
This token can be provided in two ways:

- **Header parameter**
  - **key:** Authorization
  - **value:** Bearer {JWT token}
- **Query parameter**
  - **key:** authorization
  - **value:** Bearer {JWT token}

## Subscribing to a topic

In order to retrieve messages from a dedicated topic, you'll have to publish a message containing a subscribe event and the topic you want to subscribe to.

```json
{
  "event": "subscribe",
  "data": {
    "topic": "..."
  }
}
```

## Unsubscribing from a topic

In order to stop retrieving messages from a dedicated topic, you'll have to publish a message containing a unsubscribe event and the topic you want to unsubscribe from.

```json
{
  "event": "unsubscribe",
  "data": {
    "topic": "..."
  }
}
```

## Topic

### notification.{userUuid}
Global topic for user notifications.
