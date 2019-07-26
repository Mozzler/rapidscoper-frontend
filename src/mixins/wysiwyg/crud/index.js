import Create from "./create";
import Remove from "./remove";
import Order from "./order";
import Update from "./update";

export default {
  mixins: [
    Create,
    Remove,
    Order,
    Update
  ]
};
