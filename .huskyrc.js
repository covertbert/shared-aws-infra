module.exports = {
  hooks: {
    'pre-commit': 'lint-staged',
    'post-merge': 'npm i',
    'pre-push': 'yarn test',
  },
}
