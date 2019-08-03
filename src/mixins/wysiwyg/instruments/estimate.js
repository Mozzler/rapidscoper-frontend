export default {
  methods: {
    getEstimateData (id, estimate) {
      return {
        data: {
          'estimate': estimate,
          id: id
        },
        entity: 'story',
        params: {
          id: id
        }
      };
    },
    updateEstimate ($event, id) {
      const payload = this.getEstimateData(id, $event.target.value);
      this.$store.commit('entity/update', payload);
    },
    submitEstimate ($event, id, next = false) {
      const payload = this.getEstimateData(id, $event.target.value);
      this.$store.dispatch('entity/update', payload)
        .then(() => {
          if (next) {
            this.nextItem();
          }
        });
    }
  }
};
