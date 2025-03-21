// frontend-new/rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;
const baseUrl = production ? '/hello-world-mantine/' : '/';

export default {
  input: 'src/main.jsx',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: !production
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      'preventAssignment': true
    }),
    postcss({
      extract: 'bundle.css'
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      extensions: ['.js', '.jsx']
    }),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx']
    }),
    commonjs(),
    
    // Production specific plugins
    production && terser(),
    
    // Development specific plugins
    !production && serve({
      contentBase: ['dist', 'public'],
      host: 'localhost',
      port: 3000
    }),
    !production && livereload('dist')
  ],
  watch: {
    clearScreen: false
  }
};
