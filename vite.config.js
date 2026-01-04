import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
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
    // Optimización para chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
        },
      },
    },
    // Tamaño de chunk más grande para evitar warnings innecesarios
    chunkSizeWarningLimit: 1000,
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
