<template>
  <div class="header">
    <v-layout align-center justify-space-between row fill-height>
      <v-flex>
        <v-btn icon class="text-size--18">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <span class="text-size--16">
          <dropdown :list="projects" selected="Skellorbit"
                    @update="value => project = value" />
        </span>
      </v-flex>
      <v-flex>
        <v-tabs fixed-tabs class="tabs stories-tabs">
          <v-tab v-for="tab in tabs" :key="tab" @click="setTab(tab)">
            {{ tab }}
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-flex text-xs-right>
        <v-btn icon>
          <sort-icon />
        </v-btn>
        <v-btn icon>
          <v-icon>visibility</v-icon>
        </v-btn>
        <v-btn class="btn-rapid primary" large>
          Share
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import SortIcon from "../icons/Filter";
import Dropdown from "../menus/Dropdown";
export default {
  name: "StoryHeader",
  components: {
    SortIcon,
    Dropdown
  },
  data () {
    return {
      projects: [
        'Skellorbit', 'Antares', 'Vega'
      ],
      project: 'Skellorbit',

      tabs: [
        'Edit', 'Estimates', 'Priorities', 'Labels', 'Comments'
      ],
      tab: 'Edit'
    };
  },
  methods: {
    setTab (item) {
      this.tab = item;
    },
  }
};
</script>
