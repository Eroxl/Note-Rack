import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import autoExternal from 'rollup-plugin-auto-external'
import sourcemaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import nodePolyfills from 'rollup-plugin-polyfill-node';
import dts from 'rollup-plugin-dts';

import pkg from './package.json' assert { type: "json" };

const isDev = process.env.NODE_ENV === 'dev';

const plugins = [
  ... isDev
  ? [
    replace({
      preventAssignment: false,
      'process.env.NODE_ENV': JSON.stringify('development'),
      'util.TextEncoder': 'TextEncoder'
    }),
    nodePolyfills({
      include: ['util', 'stream']
    })
  ]
  : [
    nodePolyfills({
      include: ['util', 'stream']
    }),
    autoExternal({
      packagePath: './package.json',
    }),
    sourcemaps(),
    replace({
      'util.TextEncoder': 'TextEncoder'
    }),
  ],
  resolve(),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    exclude: './node_modules/**',
  }),
  typescript({
    tsconfig: './tsconfig.json',
  }),
];


const rollupConfig = [
  {
    input: isDev
      ? 'src/demo/index.tsx'
      : 'src/index.ts',
    output: isDev
      ? {
        file: 'dist/bundle.js',
        format: 'iife'
      }
      : [
        {
          name: pkg.name,
          file: pkg.umd,
          format: 'umd',
          sourcemap: true,
        },
        {
          name: pkg.name,
          file: pkg.main,
          format: 'cjs',
          sourcemap: true,
          exports: 'auto',
        },
        {
          name: pkg.name,
          file: pkg.module,
          format: 'es',
          sourcemap: true,
        },
      ],
    plugins,
  },
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: "esm" }],
    plugins: [dts()],
  },
];

export default rollupConfig;
