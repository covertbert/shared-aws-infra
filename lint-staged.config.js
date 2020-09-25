module.exports = {
  '*.{ts,js,json,md,yml}': ['prettier --write'],
  '*.{ts}': ['eslint --fix'],
}
