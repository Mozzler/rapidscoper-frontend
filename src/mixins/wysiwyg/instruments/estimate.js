export default {
  data () {
    return {
      stack: {}
    };
  },
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
      this.range = null;
      this.$store.commit('entity/update', payload);
    },
    navigate (action) {
      return action === null ? null : this[action]();
    },
    blur ($event, action) {
      $event.target.blur();
      this.navigate(action);
    },
    submitEstimate ($event, id, action = null) {
      if (Number(this.archived) === Number($event.target.value)) {
        return this.navigate(action);
      }

      if (!_.has(this.stack, id)) {
        this.stack[id] = this.archived;
      }

      this.processing = id;

      const payload = this.getEstimateData(id, $event.target.value);
      this.$store.dispatch('entity/update', payload)
        .then(() => {
          this.processing = null;
        })
        .catch(error => {
          this.processing = null;
          let id = error.config.params.id;
          let msg = error.response && error.response.data && _.first(error.response.data);

          if (msg) {
            this.$root.$emit('show-error-message', msg.message);
          }

          let original = _.find(this.list, item => item.id === id);
          this.$store.commit('entity/update', {
            entity: 'story',
            data: {
              ...original,
              estimate: this.stack[id]
            }
          });

          delete this.stack[id];
        });
    }
  }
};
