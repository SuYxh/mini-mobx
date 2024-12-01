// import { observable, autorun } from 'mobx';
import { observable, autorun } from '../mobx';


let obj = { name: 'dahuang', age: 18 };
let proxyObj = observable(obj);

console.log(proxyObj);


// autorun(() => {
//   console.log('autorun', proxyObj.name, proxyObj.age);
// });

// proxyObj.name = 'dahuang2';


autorun(() => {
  // debugger
  console.log('autorun', proxyObj.age);
});

console.log('更新 age 的值')

// debugger
proxyObj.name = 'dahuang2';
// proxyObj.age = 20;