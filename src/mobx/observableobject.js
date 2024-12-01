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