<template>
  <v-layout align-start justify-start row fill-height>
    <sidebar />
    <v-flex align-self-baseline class="dashboard-content">
      <dashboard-content v-if="route === 'dashboard'" />
      <team-content v-else-if="route === 'team'" />
    </v-flex>
  </v-layout>
</template>

<script>
import Sidebar from '../../particles/navigation/Sidebar';
import DashboardContent from '../../particles/DashboardContent';
import TeamContent from '../../particles/TeamContent';

export default {
  name: 'Home',
  components: {
    DashboardContent,
    TeamContent,
    Sidebar
  },
  computed: {
    route () {
      return this.$route.params.section;
    },
  }
};
</script>
