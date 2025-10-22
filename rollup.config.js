import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'test/main.ts',
  output: {
    file: 'test/dist/main.js',
    format: 'iife'
  },
  plugins: [
    svelte({
      emitCss: false,
      compilerOptions: {
        dev: false,
        compatibility: {
          componentApi: 4
        }
      },
    }),
    resolve({
      browser: true,
      exportConditions: ['svelte'],
      extensions: ['.svelte']
    }),
  ]
}
