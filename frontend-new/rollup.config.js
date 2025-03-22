// frontend-new/rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.tsx',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    sourcemap: !production
  },
  plugins: [
      // This plugin helps to strip 'use client' directives
     {
       name: 'strip-use-client',
       transform(code) {
         // Remove 'use client' directive
         return code.replace(/['"]use client['"];?\n?/g, '');
       }
     },
    
    // Replace environment variables
    replace({
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      preventAssignment: true
    }),
    
    // Process CSS
    postcss({
      extract: 'public/bundle.css',
      minimize: production
    }),
    
    // TypeScript support
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: !production,
      inlineSources: !production
    }),
    
    // Babel for JSX and modern JavaScript features
    babel({
      babelHelpers: 'bundled',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript'
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    
    // Resolve node modules
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    
    // Convert CommonJS modules to ES6
    commonjs(),
    
    // Minify for production
    production && terser(),
    
    // Development server
    !production && serve({
      contentBase: ['public'],
      host: 'localhost',
      port: 3000
    }),
    
    // Auto-reload during development
    !production && livereload('public')
  ].filter(Boolean),
  
  // Watch settings
  watch: {
    clearScreen: false
  }
};
