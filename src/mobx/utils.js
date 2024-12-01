let mobxGuid = 0;

export const globalState = {
  pendingReactions: [],
  trackingDerivation: null
}

/**
 * @description: 用于存储管理对象的符号
 */
export const $mobx = Symbol('mobx administration');

/**
 * @description: 获取一个唯一的 ID
 * @return {*}
 */
export function getNextId() {
  return ++mobxGuid;
}

/**
 * @description: 判断是否是对象
 * @param {*} value
 * @return {*}
 */
export function isObject(value) {
  return value !== null && typeof value === 'object';
}

/**
 * @description: 添加一个隐藏属性
 * @param {*} obj 目标对象
 * @param {*} propName 属性名
 * @param {*} value 属性值
 * @return {*}
 */
export function addHiddenProp(obj, propName, value) {
  Object.defineProperty(obj, propName, {
    // 不可枚举
    enumerable: false,
    // 可写
    writable: true,
    // 不可配置
    configurable: false,
    value
  });
}

/**
 * @description: 获取管理对象
 * @param {*} target
 * @return {*}
 */
export function getAdm(target) {
  return target[$mobx];
}

