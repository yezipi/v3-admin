import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { themePreprocessorPlugin } from '@zougt/vite-plugin-theme-preprocessor'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    base: env.VITE_PACK_URL,
    plugins: [
      vue(),
      themePreprocessorPlugin({
        less: {
          multipleScopeVars: [
            {
              scopeName: 'theme-default',
              path: path.resolve('src/assets/css/theme/default.less'),
            },
            {
              scopeName: 'theme-dark',
              path: path.resolve('src/assets/css/theme/dark.less'),
            },
          ],
          includeStyleWithColors: [
            {
              color: '#ffffff',
            },
            {
              color: ['transparent', 'none'],
            }
          ],
          extract: false,
        },
      }),
      Components({
        resolvers: [AntDesignVueResolver({ importStyle: 'less' })],
        dts: true,
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          // modifyVars: {
          //   'primary-color': '#ff6666',
          //   'link-color': '#ff6666',
          //   'border-radius-base': '4px',
          // },
          javascriptEnabled: true
        }
      },
    },
    server: {
      host: '0.0.0.0',
      port: 9000,
      strictPort: false,
      proxy: {
        '^/api/.*': {
          target: 'http://localhost:8001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '^/public/.*': {
          target: 'http://localhost:8001/public',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/public/, '')
        },
      },
    },
  })
}
