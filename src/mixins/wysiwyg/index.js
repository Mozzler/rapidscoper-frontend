import Instruments from './instruments';
import Crud from './crud';
import Converters from './converters';
import Getters from './getters';
import StaticText from './static-text';
import AutoCompleting from './auto-completing';
import BasicEvents from './basic-events';
import Filters from './filters';
import Hint from './hint';
import ActionHelper from './action-helper';

export default {
  mixins: [
    Instruments,
    Crud,
    Converters,
    Getters,
    StaticText,
    AutoCompleting,
    BasicEvents,
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
};
