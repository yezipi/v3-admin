
const HOST = {
  DEV: 'http://localhost:7002/',
  RELEASE: 'http://game.meiyechuancheng.com/api/'
}
const REQ_URL = import.meta.env.MODE === 'development' ? HOST.DEV : HOST.RELEASE
const BASE_URL = ''

export interface Conf {
  REQ_URL: string;
  BASE_URL: string;
}

export default {
  REQ_URL,
  BASE_URL,
}
