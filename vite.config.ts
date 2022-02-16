import { defineConfig } from 'vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ ArcoResolver() ],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  // 开启less支持
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'arcoblue-6': '#f85959',
        },
        javascriptEnabled: true
      }
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    proxy: {
      '^/api/.*': {
        target: 'http://localhost:7001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '^/public/.*': {
        target: 'http://localhost:7001/public',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/public/, '')
      },
    },
  },
})
