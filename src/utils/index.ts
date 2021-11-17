/**
 * 本地存储方法
 */
 const db = {
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
      // todo
    }
    return val
  },

  del: (key: string) => {
    return localStorage.removeItem(key)
  }
}

/**
 * 格式化时间
 * @param { Date } date 日期对象及格式
 * @param { String } type 例如YYYY-MM-DD
 * @version 2021-10-29 zzc
 */

const formatDate = (date: string, type?: string) => {
  const time = new Date(date)
  const week = ['日', '一', '二', '三', '四', '五', '六']
  const year =  time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hours = time.getHours()
  const minutes = time.getMinutes()
  const sec = time.getSeconds()
  let str = type || 'YYYY-MM-DD'
  str = str.replace(/yyyy|YYYY/, String(year))
  str = str.replace(/yy|YY/, (year % 100) > 9 ? (year % 100).toString() : '0' + (year % 100))
  str = str.replace(/MM/, month > 9 ? String(month) : '0' + month)
  str = str.replace(/M/g, String(month))
  str = str.replace(/w|W/g, week[time.getDay()])
  str = str.replace(/dd|DD/, day > 9 ? String(day) : '0' + day)
  str = str.replace(/d|D/g, String(day))
  str = str.replace(/hh|HH/, hours > 9 ? String(hours) : '0' + hours)
  str = str.replace(/h|H/g, String(hours))
  str = str.replace(/mm/, minutes > 9 ? String(minutes) : '0' + minutes)
  str = str.replace(/m/g, String(minutes))
  str = str.replace(/ss|SS/, sec > 9 ? String(sec) : '0' + sec)
  str = str.replace(/s|S/g,  String(sec))
  return str
}

export {
  db,
  formatDate
}