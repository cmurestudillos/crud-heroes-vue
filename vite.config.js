import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
    host: true, // Permite conexiones externas (útil para Docker/contenedores)
    open: true, // Abre automáticamente el navegador
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  preview: {
    port: 8080,
    host: true,
    open: true,
  },
  // Optimización de dependencias
  optimizeDeps: {
    include: ['vue'],
  },
  // Variables de entorno
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
});
