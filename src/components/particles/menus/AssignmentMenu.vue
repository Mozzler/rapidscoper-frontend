<template>
  <v-layout pt-4 v-if="assigns.length > 1" justify-space-between row fill-height>
    <v-flex>{{ reassign ? 'Reassign' : 'Assign' }} a comment thread to:</v-flex>
    <v-flex class="text-sm-right">
      <assign-dropdown
        :list="assigns"
        :selected='assigned'
        @update="assign" />
    </v-flex>
  </v-layout>
</template>

<script>
import AssignDropdown from '../lists/AssignDropdown';

const NOT_ASSIGN = 'Not assign';
const EMAIL = /@([a-z0-9]+)@(([a-z0-9-]+\.)*[a-z]{2,4})/gis;

export default {
  name: 'AssignmentMenu',
  components: {
    AssignDropdown
  },
  props: {
    content: {
      type: String
    },
    reassign: {
      type: Boolean,
      default: false
    }
  },
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
</script>
