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
// For GitHub Pages deployment, set the base path
const basePath = production ? '/papers-feed-frontend-dev/' : '/';

export default {
  input: 'src/main.tsx',
  output: {
    file: 'public/bundle.js',
    format: 'iife', // For browser compatibility
    name: 'app',
    sourcemap: !production,
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    }
  },
  plugins: [
    // Replace environment variables
    replace({
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      'process.env.BASE_PATH': JSON.stringify(basePath),
      preventAssignment: true
    }),
    
    // Process CSS with extraction to a separate file
    postcss({
      extract: true,
      modules: true, // Enable CSS modules
      namedExports: true,
      minimize: production,
      extensions: ['.css']
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
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: 'node_modules/**'
    }),
    
    // Resolve node modules
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      dedupe: ['react', 'react-dom', '@mantine/core', '@tabler/icons-react']
    }),
    
    // Convert CommonJS modules to ES6
    commonjs({
      include: 'node_modules/**',
      transformMixedEsModules: true,
      // This helps with resolving named exports from CJS modules
      namedExports: {
        '@tabler/icons-react': Object.keys(require('@tabler/icons-react'))
      }
    }),
    
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
  
  // External dependencies already available in the global scope
  external: [],
  
  // Watch settings
  watch: {
    clearScreen: false
  }
};
