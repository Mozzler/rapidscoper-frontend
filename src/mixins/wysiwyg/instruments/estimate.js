export default {
  methods: {
    updateEstimate ($event, id) {
      this.$store.dispatch('entity/update', {
        data: {
          'estimate': $event.target.value
        },
        entity: 'story',
        params: {
          id: id
        }
      });
    }
  }
}
