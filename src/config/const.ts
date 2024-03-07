export const ACCEPTED_LANGUAGES = ['nl'] as const

export type ACCEPTED_LANGUAGE = typeof ACCEPTED_LANGUAGES[number]

export const DEFAULT_LANGUAGE: ACCEPTED_LANGUAGE = 'nl' as const

export type Translateable<T> = {
  [lang in ACCEPTED_LANGUAGE]: T
}
