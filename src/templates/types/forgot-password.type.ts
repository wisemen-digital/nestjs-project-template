export interface ForgotPasswordContentType {
  nl: {
    headerSection: {
      title: string
      p1: string
      p2: string
      p3: string
    }
    resetPasswordLink: string
    footerSection: {
      text: string
      email: string
    }
  }
}
