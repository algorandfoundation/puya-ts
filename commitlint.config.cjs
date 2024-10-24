module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0, 'always', ['pascal-case', 'upper-case']],
    'type-empty': [2, 'never'],
    'subject-empty': [0, 'always'],
    'body-leading-blank': [0, 'always'],
    'body-max-line-length': [0, 'always', 200],
    'header-max-length': [0, 'always', 150],
    'footer-max-length': [0, 'always', 150],
    'footer-max-line-length': [0, 'always', 150],
  },
}

