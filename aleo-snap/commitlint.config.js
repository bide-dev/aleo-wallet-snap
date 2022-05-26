module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    (message) => /^Bumps \[.+]  \(.+\) from .+ to .+\.$/m.test(message),
  ],
  rules: {
    'body-max-line-length': [0, 'always'], // Make sure there is never a max-line-length by disabling the rule
  },
};
