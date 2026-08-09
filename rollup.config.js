import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/picture-elements-editor.ts',
  output: {
    file: 'dist/picture-elements-editor.js',
    format: 'es',
    sourcemap: !isProduction,
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    json(),
    isProduction && terser({
      output: {
        comments: false,
      },
    }),
  ],
};
