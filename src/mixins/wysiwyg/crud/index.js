import Getters from "./getters";
import Create from "./create";
import Remove from "./remove";
import Order from "./order";
import Update from "./update";

export default {
  mixins: [
    Getters,
    Create,
    Remove,
    Order,
    Update
  ],
  watch: {
    processing () {
      if (this.processing) {
        this.hideHint();
      }
    }
  }
};
