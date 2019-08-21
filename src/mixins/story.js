export default {
  methods: {
    type (item) {
      switch (item) {
        case '1. Backend':
          return 'yellow';
        case 'Must have':
          return 'green';
        case 'Should have':
        case '2. Frontend':
          return 'blue';
        case 'Could have':
        case '3. MVP':
          return 'grey';
        case 'Won\'t have':
          return 'red';
      }
    },
    outline (index) {
      const labelState = _.isArray(this.active) ? this.active.includes(index) : index === this.active;
      return labelState ? '' : 'label--outline';
    },
    getStyle (index, colour) {
      return this.active.includes(index) ?
        `background: #${colour}` :
        `border: 1px solid #${colour}`;
    }
  }
};
