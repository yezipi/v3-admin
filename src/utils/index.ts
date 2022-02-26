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

/**
 * file文件转blob
 * @param { File } file 文件对象
 * @version 2021-11-28 zzc
 */
const dataURItoBlob = (file: File) => {
  return new Promise((resolve: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ({ target }: any) => {
      const base64 = target.result
      const byteString = atob(base64.split(',')[1]);
      const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
      const buffs = new ArrayBuffer(byteString.length);
      const u8a = new Uint8Array(buffs);
      for (let i = 0; i < byteString.length; i++) {
        u8a[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([buffs], {type: mimeString});
      resolve(URL.createObjectURL(blob))
    }
  })
}

/**
 * 复制文本内容
 * @param { String } text 文本内容
 * @version 2021-11-18 zzc
 */
const copyText = (text: string | number) => {
  const doc: any = document
  const inputEle: any = doc.createElement('input')
  inputEle.id = 'copyId'
  inputEle.value = text
  inputEle.type = 'text'
  inputEle.style="opacity: 0;position: fixed;left:-100px;bottom: -100px"
  document.body.appendChild(inputEle)
  inputEle.select()
  document.execCommand('copy')
  alert('复制成功')
  doc.querySelector('#copyId').remove()
}

/**
 * 防抖函数：高频事件触发，但在n秒内只会执行一次
 * @param { Function } fn 回调函数
 * @param { Number } delay 延迟时间
 * @param { Boolean } immediate 是否立即执行
 * @description 如果短时间内大量触发同一事件，只会执行一次函数
 * @version 2021-11-28 zzc
 */
 const debounce = function (fn: Function, delay: number = 300) {
  let timer: any = null
  return function (this: any, ...args: any) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 时间格式化，多少秒，多少分钟前
 * @param { Date } time 日期对象及格式
 * @version 2021-01-14 zzc
 */
const timeAgao = (time: any) => {
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  // const halfamonth = day * 15
  const month = day * 30
  const dateTimeStamp = Date.parse(time)
  const now = new Date().getTime()
  const diffValue = now - dateTimeStamp
  let result = ''
  if (diffValue < 0) {
    return
  }
  const monthC = diffValue / month
  // console.log(monthC)
  // var weekC = diffValue / (7 * day)
  const dayC = diffValue / day
  const hourC = diffValue / hour
  const minC = diffValue / minute
  if (monthC >1) {
    result = time.substring(0, 10)
  } else if (dayC >= 1) {
    result = `${parseInt(String(dayC))}天前`
  } else if (hourC >= 1) {
    result = `${parseInt(String(hourC))}小时前`
  } else if (minC >= 1) {
    result = `${parseInt(String(minC))}分钟前`
  } else result = '刚刚'
  return result
}

export {
  db,
  dataURItoBlob,
  formatDate,
  timeAgao,
  copyText,
  debounce
}