import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import path from 'node:path';
const __dirname = import.meta.dirname;
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [eslint({ exclude: ['**/node_modules/**', '**/dist/**', '**/*.min.*'] })],
  build: {
    minify: false,
    manifest: true,
    emptyOutDir: false,
    outDir: path.resolve(__dirname, 'dist'), // dist directory for the vite build?
    rollupOptions: {
      input: path.resolve(__dirname, '/scripts/index.js'),
    },
    define: {
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    },
  },
});
