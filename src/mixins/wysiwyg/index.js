import Converters from "./converters";
import Getters from "./getters";
import StaticText from "./static-text";
import AutoCompleting from "./auto-completing";
import Rows from "./rows";

export default {
  mixins: [
    Converters,
    Getters,
    StaticText,
    AutoCompleting,
    Rows
  ]
};
