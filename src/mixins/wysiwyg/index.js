import Instruments from "./instruments";
import Crud from "./crud";
import Converters from "./converters";
import Getters from "./getters";
import StaticText from "./static-text";
import AutoCompleting from "./auto-completing";
import Rows from "./rows";
import Filters from "./filters";
import Hint from "./hint";
import ActionHelper from "./action-helper";

export default {
  mixins: [
    Instruments,
    Crud,
    Converters,
    Getters,
    StaticText,
    AutoCompleting,
    Rows,
    Filters,
    Hint,
    ActionHelper
  ],
  data () {
    return {
      event: null,
      previous: null,
      next: null
    };
  },
  beforeMount () {
    if (!this.$listeners['hint-complete']) {
      this.$root.$on('hint-complete', this.hintComplete);
    }
  },
  beforeDestroy () {
    //this.$root.$off('hint-complete');
  },
  computed: {
    adjustConstructions () {
      return this.$store.state.story.adjustConstructions;
    },
    projects () {
      return this.$store.getters['entity/items']('project');
    },
    activeProject () {
      return this.projects.find(item => item.id === this.activeProjectId);
    },
    activeProjectId () {
      return this.$route.params.projectId;
    }
  },
};
