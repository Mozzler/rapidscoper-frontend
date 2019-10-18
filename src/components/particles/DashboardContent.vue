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
import ConnectIndicatorMixin from '@/mixins/connect-indicator';

export default {
  name: 'DashboardContent',
  components: {
    DashboardActionBtn,
    UserDataTable
  },
  mixins: [
    ConnectIndicatorMixin
  ],
  data () {
    return {
      showCreateProjectModal: false,
      collections: [
        'userInfo', 'userProject', 'project'
      ]
    };
  },
  methods: {
    showModal () {
      this.$root.$emit('create-project');
    }
  }
};
</script>
