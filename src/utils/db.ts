export default {
  set: (key: string, value: any) => {
    let val = value
    if (typeof val === 'object') {
      val = JSON.stringify(val)
    }
    return localStorage.setItem(key, val)
  },

  get: (key: string) => {
    let val: any = localStorage.getItem(key)
    try {
      val = JSON.parse(val)
    } catch (e) {
      console.log(e)
    }
    return val
  },

  del: (key: string) => {
    return localStorage.removeItem(key)
  }
}