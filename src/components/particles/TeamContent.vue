<template>
  <v-container>
    <v-layout align-center justify-space-between row fill-height>
      <h1>{{ team.name }}</h1>
      <dashboard-action-btn
        v-if="btnText"
        :text="btnText"
        @show-modal="showModal"
        :mobile="true">
        <template #mobile>
          <v-btn icon class="primary" @click="showModal">
            <v-icon v-if="activeTab === 'Projects'">add</v-icon>
            <v-icon v-else-if="activeTab === 'Users'">how_to_reg</v-icon>
          </v-btn>
        </template>
      </dashboard-action-btn>
    </v-layout>
    <v-tabs fixed-tabs class="tabs team-tabs">
      <v-tab v-for="tab in tabs" :key="tab" @click="setTab(tab)">
        {{ tab }}
      </v-tab>
    </v-tabs>

    <tab-projects v-if="activeTab === 'Projects'" />
    <tab-users v-if="activeTab === 'Users'" />
    <tab-billing v-if="activeTab === 'Billing'" />
    <tab-advanced v-if="activeTab === 'Advanced'" />
  </v-container>
</template>

<script>
import Navigation from '@/mixins/navigation';

import TabProjects from '@/components/particles/tabs/Projects';
import TabUsers from '@/components/particles/tabs/Users';
import TabBilling from '@/components/particles/tabs/Billing';
import TabAdvanced from '@/components/particles/tabs/Advanced';

import DashboardActionBtn from './buttons/DashboardActionButton';

export default {
  name: 'TeamContent',
  mixins: [
    Navigation
  ],
  components: {
    DashboardActionBtn,
    TabProjects,
    TabUsers,
    TabBilling,
    TabAdvanced
  },
  data () {
    return {
      tabs: ['Projects', 'Users', 'Billing', 'Advanced'],
      activeTab: 'Projects',

      modals: {
        Projects: 'create-project',
        Users: 'invite-user'
      }
    };
  },
  methods: {
    setTab (item) {
      this.activeTab = item;
    },
    showModal () {
      this.$root.$emit(this.modals[this.activeTab]);
    }
  },
  computed: {
    btnText () {
      switch (this.activeTab) {
        case 'Projects':
          return 'Create new project';
        case 'Users':
          return 'Enter email to invite user';
        default:
          return null;
      }
    },
    activeTeamId () {
      return this.$route.params.name;
    },
    teams () {
      return this.$store.getters['entity/items']('team');
    },
    team () {
      const filtered = this.teams.filter(item => item.id === this.activeTeamId);
      return filtered[0];
    }
  }
};
</script>
