
export interface ConfigType {
  REQ_URL: string;
  BASE_URL: string;
  HOST: any
}

export type PackEnvType  = 'dev' | 'test' | 'production'

const env = import.meta.env

console.log('当前环境: ', env)

const HOST = {
  dev: {
    apiUrl: 'http://localhost:8001/'
  },
  test: {
    apiUrl: 'http://localhost:8001/'
  },
  production: {
    apiUrl: 'http://localhost:8001/'
  }
}

const REQ_URL = HOST[ env.VITE_PACK_ENV as PackEnvType ].apiUrl
const BASE_URL = env.BASE_URL


export default {
  HOST,
  REQ_URL,
  BASE_URL,
}
