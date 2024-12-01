# Mobx 学习



### MobX 的核心设计思想

1. **简单且可预测**

- MobX 采用简单直观的响应式编程模型
- 遵循 "任何源自应用状态的东西都应该自动获得" 的理念

2. **面向对象的响应式编程**

- 使用可观察对象（Observable）作为状态管理的基础
- 通过装饰器或函数将普通数据结构转换为可观察对象





![zh.flow](https://qn.huat.xyz/mac/202412011428197.png)





## 实现管理对象

asDynamicObservableObject 关系图：

![58a3fd9e6546c1177d01623a022c3ca8](https://qn.huat.xyz/mac/202412011430925.png)

### Index.js

```js
export { default as observable } from './observable';
```



### observable.js

```js
import { isObject } from './utils';
import { object } from './observableobject';

function observable(v) {
  if (isObject(v)) {
    return object(v);
  }
}
export default observable;
```



### observableobject.js

```js
import { getNextId, $mobx, addHiddenProp, getAdm } from './utils';

const objectProxyTraps = {
  get(target, name) {
    return getAdm(target).get(name);
  },
  set(target, name, value) {
    return getAdm(target).set(name, value);
  }
}

class ObservableObjectAdministration {
  constructor(target, values, name) {
    this.target = target;
    //存放属性的信息
    this.values = values;
    this.name = name;
  }

  get(key) {
    return this.target[key];
  }
  set(key, value) {
    if (this.values.has(key)) {
      return this.target[key] = value;
    }
  }
}

function asObservableObject(target) {
  // 获取一个唯一的 ID
  const name = `ObservableObject@${getNextId()}`;
  // 创建一个 ObservableObjectAdministration 对象，用于管理可观察对象
  const adm = new ObservableObjectAdministration(
    target, new Map(), name
  );
  // 将 adm 对象添加到 target 对象的 $mobx 属性中
  addHiddenProp(target, $mobx, adm);//target[$mobx]=adm
  return target;
}

function asDynamicObservableObject(target) {
  // 创建一个动态可观察对象
  asObservableObject(target);
  // 使用 Proxy 对象来拦截和处理对目标对象的访问和修改
  const proxy = new Proxy(target, objectProxyTraps);
  return proxy;
}

export function object(target) {
  // 创建一个动态可观察对象
  const dynamicObservableObject = asDynamicObservableObject({});
  console.log('dynamicObservableObject',dynamicObservableObject);
  return target
}
```



### utils.js

```js
let mobxGuid = 0;

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
```

