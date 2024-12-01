import { makeAutoObservable } from "mobx";
import { Observer } from "../mobx-react";

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

export default function UseObserver() {
  return (
    <Observer>
      {() => (
        <div>
          <p>{store.number}</p>
          <button onClick={() => store.add()}>Add</button>
        </div>
      )}
    </Observer>
  );
}
