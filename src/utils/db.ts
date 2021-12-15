export default {
  set: (key: string, value: any) => {
    let val = value
    if (typeof val === 'object') {
      val = JSON.stringify({ type: 'object', data: val })
    }
    localStorage.setItem(key, val)
  },

  get: (key: string) => {
    const val: any = localStorage.getItem(key)
    if (val.indexOf('"type":"object"') > -1) {
      return JSON.parse(val).data
    }
    return val
  },

  del: (key: string) => {
    return localStorage.removeItem(key)
  }
}