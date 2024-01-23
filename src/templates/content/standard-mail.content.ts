import { type StandardMailContentType } from '../types/standard-mail.type.js'

export const standardMailContent = (): StandardMailContentType => {
  return {
    nl: {
      headerSection: {
        title: '',
        p1: '',
        p2: '',
        p3: ''
      },
      footerSection: {
        text: '',
        email: ''
      }
    }
  }
}
