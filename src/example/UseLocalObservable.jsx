import { useObserver, useLocalObservable } from "../mobx-react";

export default function UseLocalObservable() {
  const store = useLocalObservable(() => ({
    number: 1,
    add() {
      this.number++;
    },
  }));
  return useObserver(() => (
    <div>
      <p>{store.number}</p>
      <button onClick={store.add}>add</button>
    </div>
  ));
}
