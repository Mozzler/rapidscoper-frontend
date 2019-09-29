const NOT_ASSIGN = 'Not assign';
const EMAIL = /@([a-z0-9]+)@(([a-z0-9-]+\.)*[a-z]{2,4})/gis;

export default {
  data () {
    return {
      assigned: [NOT_ASSIGN]
    };
  },
  computed: {
    assigns () {
      return this.matchAssigns();
    }
  },
  methods: {
    assign (value) {
      switch (true) {
        case value === NOT_ASSIGN:
          this.assigned = [NOT_ASSIGN];
          return;
        case this.assigned.includes(value):
          const index = this.assigned.indexOf(value);
          this.assigned.splice(index, 1);
          if (this.assigned.length === 0) {
            this.assigned = [NOT_ASSIGN];
          }
          return;
        default:
          if (this.assigned.includes(NOT_ASSIGN)) {
            this.assigned = [];
          }
          this.assigned.push(value);
      }
    },
    matchAssigns () {
      const matches = this.content.match(EMAIL);
      let assigns = ['Not assign'];

      if (matches) {
        const un = _.uniq(matches);
        assigns = [...assigns, ...un];
      }

      return assigns;
    }
  }
};
