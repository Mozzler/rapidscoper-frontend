import { mapState } from 'vuex';

export default {
  data () {
    return {
      initialization: true
    };
  },
  computed: {
    ...mapState('system', [
      'loaded'
    ]),
    initializedSets () {
      return _.pick(this.loaded, this.collections);
    }
  },
  beforeMount () {
    this.checkInitialization();
  },
  methods: {
    checkInitialization () {
      this.initialization = !_.every(this.initializedSets, item => item === true);
    }
  },
  watch: {
    initializedSets: {
      deep: true,
      handler () {
        this.checkInitialization();
      }
    }
  }
};
