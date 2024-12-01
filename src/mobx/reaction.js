import { globalState } from "./utils";
export default class Reaction {
  constructor(name, onInvalidate) {
    this.name = name;
    this.onInvalidate = onInvalidate;
    this.observing = []; //表示它观察到了哪些可观察变量
  }
  track(fn) {
    //Derivation=reaction
    globalState.trackingDerivation = this;
    fn.call();
    globalState.trackingDerivation = null;
    bindDependencies(this);
  }
  schedule() {
    globalState.pendingReactions.push(this);
    runReactions();
  }
  runReaction() {
    this.onInvalidate();
  }
}

function bindDependencies(derivation) {
  console.log('bindDependencies', derivation, derivation instanceof Reaction)
  const { observing } = derivation;
  observing.forEach((observableValue) => {
    observableValue.observers.add(derivation);
  });
}


function runReactions() {
  const allReactions = globalState.pendingReactions;
  let reaction;
  while ((reaction = allReactions.shift())) {
    reaction.runReaction();
  }
}
