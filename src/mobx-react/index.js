import { useState } from 'react';
import { Reaction } from 'mobx';

export function useObserver(fn) {
  //仅仅是为了得到一个强行更新组件的函数
  const [, setState] = useState({});
  const forceUpdate = () => setState({});

  let reaction = new Reaction('observer', forceUpdate);
  let rendering;
  reaction.track(() => {
    rendering = fn();
  });
  return rendering;
}