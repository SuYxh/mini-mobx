import { isObject } from './utils';
import { object } from './observableobject';

function observable(v) {
  if (isObject(v)) {
    return object(v);
  }
}
export default observable;