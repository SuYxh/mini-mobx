import { getNextId, $mobx, addHiddenProp, getAdm, globalState } from './utils';

import Reaction from './reaction'

const objectProxyTraps = {
  get(target, name) {
    return getAdm(target).get(name);
  },
  set(target, name, value) {
    return getAdm(target).set(name, value);
  }
}

function reportObserved(observableValue) {
  const trackingDerivation = globalState.trackingDerivation;
  console.log('reportObserved', trackingDerivation, trackingDerivation instanceof Reaction)
  if (trackingDerivation) {
    trackingDerivation.observing.push(observableValue);
  }
}

function propagateChanged(observableValue) {
  const { observers } = observableValue;
  observers.forEach(observer => {
    observer.runReaction();
  });
}

// 管理可观察值
class ObservableValue {
  constructor(value) {
    this.value = value;
    this.observers = new Set();//此可观察值的监听者，可以说观察者
  }
  get() {
    console.log('ObservableValue-get', this, this instanceof ObservableValue);
    // this: ObservableValue 
    reportObserved(this);
    return this.value;
  }
  setNewValue(newValue) {
    this.value = newValue;
    propagateChanged(this);
  }
}

// 管理可观察对象
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
      return this.setObservablePropValue(key, value);
      // return this.target[key] = value;
    }
  }
  // 扩展可观察对象
  extend(key, descriptor) {
    this.defineObservableProperty(key, descriptor.value);
  }
  // 设置可观察属性值
  setObservablePropValue(key, value) {
    const observableValue = this.values.get(key);
    observableValue.setNewValue(value)
    return true;
  }
  // 获取可观察属性值
  getObservablePropValue(key) {
    return this.values.get(key).get();
  }
  // 定义可观察属性
  defineObservableProperty(key, value) {
    const descriptor = {
      configurable: true,
      enumerable: true,
      get() {
        console.log('defineObservableProperty-get')
        return this[$mobx].getObservablePropValue(key);
      },
      set() {
        console.log('defineObservableProperty-set')
        return this[$mobx].setObservablePropValue(key, value);
      }
    }
    Object.defineProperty(this.target, key, descriptor);
    // 将可观察值添加到 values 中
    this.values.set(key, new ObservableValue(value));
  }
}

// 创建一个可观察对象
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

// 创建一个动态可观察对象，将目标对象变成可观察对象
function asDynamicObservableObject(target) {
  asObservableObject(target);
  // 使用 Proxy 对象来拦截和处理对目标对象的访问和修改
  const proxy = new Proxy(target, objectProxyTraps);
  return proxy;
}

// 将目标对象的属性添加到动态可观察对象中
function extendObservable(proxyObject, properties) {
  // 获取目标对象的属性描述符
  const descriptors = Object.getOwnPropertyDescriptors(properties);
  // 获取代理对象的管理器
  const adm = proxyObject[$mobx];
  // 遍历属性描述符，将属性添加到代理对象中
  Reflect.ownKeys(descriptors).forEach(key => {
    adm.extend(key, descriptors[key]);
  });
  return proxyObject;
}

export function object(target) {
  // 创建一个动态可观察对象。 
  // 创建了一个空对象，变成了代理对象，而且配置了一个对象管理器
  const dynamicObservableObject = asDynamicObservableObject({});
  console.log('dynamicObservableObject',dynamicObservableObject);
  // 将 target 对象的属性添加到动态可观察对象中
  return extendObservable(dynamicObservableObject, target);
}