const js = require("@eslint/js");
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  { 
    ignores: ['node_modules/*', 'local.js'] 
  },
  {
    languageOptions:{
      globals: {
        ...globals.node,
        es6: true
   
      },
      sourceType: 'commonjs',
      parserOptions: {
        ecmaVersion: 'latest'
      }
    },
    rules: {
      'comma-dangle': ['error', 'never'],
      'indent': ['error', 2],
      'max-len': ['error', {code: 155}]
    }  
  }

];