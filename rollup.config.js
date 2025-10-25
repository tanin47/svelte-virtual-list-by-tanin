import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'test/main.ts',
  output: { file: 'test/dist/main-rollup.js', 'format': 'iife' },
  plugins: [
    svelte({
      emitCss: false,
    }),
    resolve({
      browser: true,
    }),
  ]
}
