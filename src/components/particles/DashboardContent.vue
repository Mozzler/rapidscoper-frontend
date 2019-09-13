<template>
  <v-container>
    <v-layout align-center justify-space-between row fill-height>
      <h1>All projects</h1>
      <dashboard-action-btn
        @show-modal="showModal"
        :text="'Create new project'"
        :mobile="true">
        <template #mobile>
          <v-btn icon class="primary" @click="showModal">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
      </dashboard-action-btn>
    </v-layout>
    <user-data-table
      :loading="initialization" />
  </v-container>
</template>

<script>
import DashboardActionBtn from '@/components/particles/buttons/DashboardActionButton';
import UserDataTable from '@/components/particles/tables/UserDataTable';

export default {
  name: 'DashboardContent',
  components: {
    DashboardActionBtn,
    UserDataTable
  },
  data () {
    return {
      showCreateProjectModal: false
    };
  },
  methods: {
    showModal () {
      this.$root.$emit('create-project');
    }
  }
};
</script>
