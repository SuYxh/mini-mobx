import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";

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

function HocObserver() {
  return (
    <div>
      <p>{store.number}</p>
      <button onClick={() => store.add()}>Add</button>
    </div>
  );
}

export default observer(HocObserver);
