// 工具类--判断对象类型
function isObject(value) {
  const valueType = typeof value
  return (value !== null) && (valueType === "object" || valueType === "function")
}

function deepClone(originValue, map = new WeakMap()) {
  // 判断是否是一个Set类型
  if (originValue instanceof Set) {
    return new Set([...originValue])
  }
  // 判断是否是一个Map类型
  if (originValue instanceof Set) {
    return new Map([...originValue])
  }
  // 判断如果是Symbol的value,那么创建一个新的Symbol
  if (typeof originValue === "symbol") {
    return Symbol(originValue.description)
  }
  // 判断如何是函数类型，那么直接使用同一个函数
  if (typeof originValue === "function") {
    return originValue
  }
  // 判断传入的originValue是否是一个对象类型
  if (!isObject(originValue)) {
    return originValue
  }
  if (map.has(originValue)) {
    return map.get(originValue)
  }
  const newObject = Array.isArray(originValue) ? [] : {}
  map.set(originValue, newObject)
  for (const key in originValue) {
    newObject[key] = deepClone(originValue[key], map) // 递归
  }

  // 对Symbol的key进行特殊的处理
  const symbolKeys = Object.getOwnPropertySymbols(originValue)
  for (const sKey of symbolKeys) {
    newObject[sKey] = deepClone(originValue[sKey], map)
  }
  return newObject
}

export {
	deepClone
} 