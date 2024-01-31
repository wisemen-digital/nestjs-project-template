export interface ForgotPasswordContentType {
  nl: {
    headerSection: {
      title: string
      p1: string
      p2: string
    }
    resetPasswordLink: string
    footerSection: {
      text: string
      email: string
    }
  }
}
