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
    focusEstimate ($event) {
      $event.focus();
      $event.target.setSelectionRange(0, $event.target.value.length);
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

      this.processing = id;
      const payload = this.getEstimateData(id, $event.target.value);
      this.$store.dispatch('entity/update', payload)
        .then(() => {
          this.navigate(action);
          this.processing = null;
        });
    }
  }
};
