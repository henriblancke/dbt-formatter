import camelCase from 'lodash.camelcase';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const pkg = require('./package.json');

const cmdName = 'dbt-command';
const libName = 'dbt-formatter';


export default [
  {
    input: `src/${libName}.ts`,
    output: {
      name: camelCase(libName),
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      typescript()
    ]
  },
  {
    input: `src/${libName}.ts`,
    external: ['fs'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      typescript()
    ]
  },
  {
    input: `src/${cmdName}.ts`,
    external: ['fs'],
    output: [
      { file: pkg.bin, format: 'cjs' }

    ],
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      typescript()
    ]
  }
];
