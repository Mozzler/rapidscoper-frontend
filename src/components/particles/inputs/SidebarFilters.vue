<template>
  <v-layout align-center justify-space-between row fill-height>
    <v-flex shrink>
      <v-layout align-center justify-start row fill-height>
        <v-flex class="filter__item--mr">
          Filters:
        </v-flex>
        <filter-menu
          title="Priorities"
          nudge-left="86"
          :list="priorities" />
        <filter-menu
          title="Labels"
          nudge-left="66"
          :list="labels" />
        <!--<v-flex class="text-greyed">Estimate time: 12 hours</v-flex>-->
      </v-layout>
    </v-flex>
    <v-flex shrink>
      <v-layout align-center justify-center class="filter__search">
        <v-icon class="mr-2">search</v-icon>
        <input class="search-input" placeholder="Search" />
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import FilterMenu from '../../particles/menus/FilterMenu';
import { mapGetters } from 'vuex';

export default {
  name: 'SidebarFilters',
  components: {
    FilterMenu
  },
  data () {
    return {
      menu: {
        priority: false,
        labels: false
      }
    };
  },
  beforeMount () {
    console.log(this.labels);
  },
  computed: {
    ...mapGetters({
      labels: 'story/labels'
    }),
    priorities () {
      return this.$store.state.story.priority;
    }
  }
};
</script>
