import { type ForgotPasswordContentType } from '../types/forgot-password.type.js'

export const forgotPasswordMailContent = (): ForgotPasswordContentType => {
  return {
    nl: {
      headerSection: {
        title: '',
        p1: '',
        p2: ''
      },
      resetPasswordLink: '',
      footerSection: {
        text: '',
        email: ''
      }
    }
  }
}
