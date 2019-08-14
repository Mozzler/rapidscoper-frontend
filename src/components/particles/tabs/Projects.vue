<template>
  <div class="table-container">
    <div class="table-dropdown menu-relative">
      <dropdown :list="dropdown" :selected="active"
        @update="value => active = value"/>
    </div>

    <user-data-table
      cls="projects-table"
      :loading="initialization"
      :actions="true" />
  </div>
</template>

<script>
import Dropdown from '../menus/Dropdown';
import Navigation from '@/mixins/navigation';
import UserDataTable from '../tables/UserDataTable';

export default {
  name: 'Projects',
  components: {
    UserDataTable,
    Dropdown
  },
  mixins: [
    Navigation
  ],
  data () {
    return {
      active: 'Active',
      dropdown: ['Active'],
      loading: true
    };
  }
};
</script>
