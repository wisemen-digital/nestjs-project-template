import eslintNestJSConfig from '@wisemen/eslint-config-nestjs'

export default [
  ...eslintNestJSConfig,
  {
    ignores: [
      'src/modules/localization/generated/i18n.generated.ts'
    ]
  }
]
