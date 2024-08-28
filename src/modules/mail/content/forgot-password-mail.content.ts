export interface ForgotPasswordMailContent {
  subject: string
  heading: string
  body: {
    text: string
    subText: string
  }
  button: {
    text: string
    deeplink: string
  }
}
