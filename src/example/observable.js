// import { observable, autorun } from 'mobx';
import { observable } from '../mobx';


let obj = { name: 'dahuang', age: 18 };
let proxyObj = observable(obj);

console.log(proxyObj);

// // 创建一个响应器，其实也就是观察者，负责观察可观察的值
// autorun(() => {
//   console.log('autorun', proxyObj.name, proxyObj.age);
// });

// proxyObj.name = 2;