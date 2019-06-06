export default {
  methods: {
    type (item) {
      switch (item) {
        case 'Backend':
          return 'yellow';
        case 'Must have':
          return 'green';
        case 'Should have':
        case 'Frontend':
          return 'blue';
        case 'Could have':
        case 'MVP':
          return 'grey';
        case 'Won\'t have':
          return 'red';
      }
    },
    outline (index) {
      return Number(index) === Number(this.active) ? '' : 'label--outline';
    }
  }
}
