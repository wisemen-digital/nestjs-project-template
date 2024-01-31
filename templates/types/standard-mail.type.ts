export interface StandardMailContentType {
  nl: {
    headerSection: {
      title: string
      p1: string
      p2: string
      p3: string
    }
    footerSection: {
      text: string
      email: string
    }
  }
}
