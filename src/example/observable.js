import { observable, autorun } from 'mobx';

let obj = { name: 1 };
let proxyObj = observable(obj);

console.log(proxyObj);

// 创建一个响应器，其实也就是观察者，负责观察可观察的值
autorun(() => {
  console.log('autorun', proxyObj.name);
});

proxyObj.name = 2;