//获取数据类型
export const getType = (value: any, isType?: string) => {
  const type = Object.prototype.toString.call(value)
  const match = type.match(/ [A-Za-z]*/)
  if (!match) return
  const lowerType = match[0].trim().toLowerCase()
  return !isType ? lowerType : lowerType === isType
}

/**
 * @name 本地存储方法
 */
export const db = {
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
 * @name 字典转数组
 * @param { Object } dict 字典对象
 * @param { String } label 转成后的key名字
 * @param { String } value 转成后的value名字
 * @param { Array } exclude 要排除的值,字典的value,字符串数组形式
 */
export const dictToArray = (
  dict: any,
  label = 'label',
  value = 'value',
  exclude: any[] = []
) => {
  const arr: any = []

  Object.keys(dict).map((key: any) => {
    const obj: any = {}
    const val: any = dict[key]

    obj[label] = val

    if (val instanceof Object) {
      obj[label] = val.label
    } else {
      obj[label] = val
    }

    obj[value] = isNaN(key) ? key : Number(key)

    if (exclude.indexOf(obj[value]) < 0) {
      arr.push(obj)
    }
  })

  return arr
}

/**
 * 获取url对象的参数
 * @param { String } url 路径地址
 */
export const getUrlQuery = (url: string) => {
  if (!url) {
    return
  }
  let newUrl = url
  let arr = []
  if (url.indexOf('?') > -1) {
    newUrl = url.split('?')[1]
  }
  arr = newUrl.split('&')
  const obj: any = {}
  arr.forEach(e => {
    const sp = e.split('=')
    obj[sp[0]] = sp[1]
  })
  return obj
}

/**
 * 获取对象深层值
 * @author cjb
 * @param {object} data
 * @param {string} str extra.count.score
 */
export const getObjectValue = (data: any, str: string) => {
  const fields = str.split('.')
  const return_value = (value: any, key: any) => {
    return (value || {})[key]
  }
  return fields.reduce(return_value, data)
}

/**
 * 格式化字符串
 * @author cjb
 * @param {string} str
 * 例：'{0}a{name}b{extra.count}'
 * @param {arguments} arg
 * 例：formatStr(str, { 0: 2, name: 222, extra: { count } }) | formatStr(str, 2, 222)
 */
export const formatStr = (str: string, ...arg: any) => {
  const data = getType(arg[0], 'object') ? arg[0] : arg
  const reg = new RegExp('{[a-zA-Z_.0-9]+}', 'g')
  const arr = (str.match(reg) || []).map(str =>
    str.substring(1, str.length - 1)
  )
  const reduce = (str: string, key: string) => {
    const reg = new RegExp(`\\{${key}\\}`, 'g')
    const val = getObjectValue(data, key) || ''
    return str.replace(reg, val)
  }
  return arr.reduce(reduce, str)
}