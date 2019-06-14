import Converters from "./converters";
import Getters from "./getters";
import StaticText from "./static-text";
import AutoCompleting from "./auto-completing";
import Rows from "./rows";
import Filters from "./filters";

export default {
  mixins: [
    Converters,
    Getters,
    StaticText,
    AutoCompleting,
    Rows,
    Filters
  ],
  data () {
    return {
      event: null,
      previous: null,
      next: null
    };
  },
  beforeMount () {
    this.$root.$on('set-focus-to-input', this.focusInputFromHint);
    this.$root.$on('hint-complete', this.hintComplete);
  },
  beforeDestroy () {
    this.$root.$off('set-focus-to-input');
    this.$root.$off('hint-complete');
  },
  computed: {
    dictionary () {
      return this.$store.state.story.dictionary;
    },
    editor () {
      return this.focused !== null ? this.list[this.focused] : null;
    },
    ref () {
      return `editor-${this.focused}-${this.level}`;
    }
  },
};
