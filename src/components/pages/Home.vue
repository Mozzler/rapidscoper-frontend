<template>
  <v-layout align-start justify-start row fill-height>
    <sidebar />
    <dashboard-content />
  </v-layout>
</template>

<script>
import Sidebar from "../particles/navigation/Sidebar";
import DashboardContent from "../particles/DashboardContent";

export default {
  name: 'Home',
  components: {
    DashboardContent,
    Sidebar,
  },
};
</script>
