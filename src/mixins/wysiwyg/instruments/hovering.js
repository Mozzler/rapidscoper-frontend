export default {
  data () {
    return {
      hovered: null,
      movable: null
    };
  },
  methods: {
    startDragging (id) {
      this.movable = id;
      this.$store.commit('story/setActiveStoryOnTab', null);
    },
    setHovered (value = null) {
      if (this.movable === null) {
        this.hovered = value;
      }
    },
    resetMovable () {
      this.movable = null;
    }
  }
};
