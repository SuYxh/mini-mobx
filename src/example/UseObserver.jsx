import { makeAutoObservable } from 'mobx';
import { useObserver } from '../mobx-react';

class Store {
  number = 1;

  constructor() {
    makeAutoObservable(this);
  }

  add() {
    this.number++;
  }
}

let store = new Store();

export default function UseObserver () {
  return useObserver(() => {
    return (
      <div>
        <p>{store.number}</p>
        <button onClick={() => store.add()}>Add</button>
      </div>
    );
  });
}