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
    navigate (action) {
      return action === null ? null : this[action]();
    },
    submitEstimate ($event, id, action = null) {
      if (Number(this.archived) === Number($event.target.value)) {
        return this.navigate(action);
      }

      const payload = this.getEstimateData(id, $event.target.value);
      this.$store.dispatch('entity/update', payload)
        .then(() => {
          this.navigate(action);
        });
    }
  }
};
