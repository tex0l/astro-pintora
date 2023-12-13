module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': 'standard-with-typescript',
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    },
    {
      // Define the configuration for `.astro` file.
      files: ['*.astro'],
      // Allows Astro components to be parsed.
      parser: 'astro-eslint-parser',
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      }
    }
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'rules': {}
}
