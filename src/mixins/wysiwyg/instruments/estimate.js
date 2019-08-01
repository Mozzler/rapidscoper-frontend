export default {
  methods: {
    updateEstimate ($event, id) {
      return this.$store.dispatch('entity/update', {
        data: {
          'estimate': $event.target.value
        },
        entity: 'story',
        params: {
          id: id
        }
      });
    },
    nextEstimateField ($event, id) {
      this.updateEstimate($event, id).then(() => {
        this.nextItem();
      });
    }
  }
};
