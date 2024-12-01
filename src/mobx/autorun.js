import { getNextId } from "./utils"
import Reaction from './reaction';
function autorun(view) {
  const name = 'Autorun@' + getNextId();
  const reaction = new Reaction(
    name,
    function () {
      this.track(view);
    }
  );
  reaction.schedule();
}
export default autorun;