<template>
    <v-flex class="fill-height">
      <!--<sidebar />-->
      <dashboard-content />
    </v-flex>
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
