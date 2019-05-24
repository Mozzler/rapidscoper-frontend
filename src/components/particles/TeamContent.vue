<template>
  <v-container>
    <v-layout align-center justify-space-between row fill-height>
      <h1>{{ toTitle($route.params.name) }}</h1>
      <dashboard-action-button :text="btnText" v-if="btnText" />
    </v-layout>
    <v-tabs fixed-tabs class="tabs">
      <v-tab v-for="tab in tabs" :key="tab" @click="setTab(tab)">
        {{ tab }}
      </v-tab>
    </v-tabs>
    <tab-projects v-if="activeTab === 'Projects'" />
    <tab-users v-if="activeTab === 'Users'" />
    <tab-billing v-if="activeTab === 'Billing'" />
  </v-container>
</template>

<script>
  import Navigation from '@/mixins/navigation';
  import TabProjects from '@/components/pages/dashboard/tabs/Projects';
  import TabUsers from '@/components/pages/dashboard/tabs/Users';
  import TabBilling from '@/components/pages/dashboard/tabs/Billing';
  import DashboardActionButton from "./buttons/DashboardActionButton";

  export default {
    name: "TeamContent",
    mixins: [
      Navigation
    ],
    components: {
      DashboardActionButton,
      TabProjects,
      TabUsers,
      TabBilling
    },
    data() {
        return {
          tabs: ['Projects', 'Users', 'Billing'],
          activeTab: 'Projects'
        }
    },
    methods: {
      setTab(item) {
        this.activeTab = item;
      }
    },
    computed: {
      btnText() {
        switch (this.activeTab) {
          case 'Projects':
            return 'Create new project';
          case 'Users':
            return 'Invite user';
          default:
            return null;
        }
      }
    }
  }
</script>
