export default {
  methods: {
    updateEstimate ($event, id, next = false) {
      this.$store.dispatch('entity/update', {
        data: {
          'estimate': $event.target.value
        },
        entity: 'story',
        params: {
          id: id
        }
      }).then(() => {
        if (next) {
          this.nextItem();
        }
      });
    }
  },
  watch: {
    activeStoryOnTab () {

    }
  }
};
