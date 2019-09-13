<template>
  <div class="table-container">
    <div class="table-dropdown menu-relative">
      <dropdown
        :list="dropdown"
        :selected="option"
        @update="update" />
    </div>

    <user-data-table
      cls="projects-table"
      :loading="initialization"
      :filter="filter"
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
      option: 'Active',
      dropdown: ['Active', 'Archived'],
      loading: true
    };
  },
  computed: {
    filter () {
      return this.option.toLowerCase();
    }
  },
  methods: {
    update (value) {
      this.option = value;
    }
  }
};
</script>
