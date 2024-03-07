import { type Translateable } from '../../../config/const.js'

export interface ForgotPasswordMailType {
  subject: string
  heading: string
  body: {
    text: string
    subText: string
  }
  button: {
    text: string
  }
}

export const ForgotPasswordTranslation: Translateable<ForgotPasswordMailType> = {
  nl: {
    subject: 'Wachtwoord resetten',
    heading: 'Reset je wachtwoord',
    body: {
      text: 'Er is een verzoek ingediend om het wachtwoord van uw account te resetten. U kunt uw wachtwoord opnieuw instellen via de onderstaande knop.',
      subText: 'Deze link is 24 uur geldig en kan slechts één keer gebruikt worden.'
    },
    button: {
      text: 'Reset wachtwoord'
    }
  }
}
