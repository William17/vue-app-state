import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import {uglify} from 'rollup-plugin-uglify'

export default [
  {
    input: 'src/index.js',
    plugins: [
      babel(),
      uglify()
    ],
    output: {
      name: 'AppState',
      file: pkg.browser,
      format: 'umd'
    },
    sourceMap: true
  },
  {
    input: 'src/index.js',
    plugins: [
      babel()
    ],
    output: {
      format: 'cjs',
      file: pkg.main
    }
  },
  {
    input: 'src/index.js',
    output: {
      format: 'es',
      file: pkg.module
    }
  }
]
