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
import { mapGetters } from 'vuex';

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
    ...mapGetters('entity', [
      'items'
    ]),
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
      let assigns = [NOT_ASSIGN];

      if (matches) {
        const emails = _.map(matches, email => email.replace(/@/, ''));
        assigns = [...[NOT_ASSIGN], ..._.uniq(emails)];
      }

      return assigns;
    },
    getInvitations () {
      const userInfo = this.items('userInfo');

      return _.filter(this.assigned, email => {
        const notAssign = email === NOT_ASSIGN;
        const known = _.find(userInfo, item => item.email === email);

        return !notAssign && !known;
      });
    },
    normalizeAssigned () {
      this.assigned = _.filter(this.assigned, email => this.assigns.includes(email));
      if (this.assigned.length === 0) {
        this.assigned = [NOT_ASSIGN];
      }
    }
  },
  watch: {
    assigns: {
      deep: true,
      handler () {
        this.normalizeAssigned();
      }
    }
  }
};
</script>
