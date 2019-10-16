<template>
  <v-layout align-start justify-start row fill-height>
    <sidebar class="dashboard-sidebar" />
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

import { mapMutations } from 'vuex';

export default {
  name: 'Home',
  components: {
    DashboardContent,
    TeamContent,
    Sidebar
  },
  data () {
    return {
      collections: [
        'project',
        'userTeam',
        'userProject',
        'userInfo',
        'invite'
      ]
    };
  },
  beforeMount () {
    this.connectCollections();
    /*console.log('loading');
    this.collections.forEach(async (item) => {
      const entity = item
        .split(/(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('-');


      await this.$store.dispatch('entity/read', { entity });
    });
    console.log('loading finished');*/
  },
  methods: {
    ...mapMutations('system', [
      'setLoadedState'
    ]),
    handleLoaded (key) {
      this.setLoadedState({ key, value: true });
    },
    connectCollections () {
      _.each(this.collections, key => {
        this.setLoadedState({ key, value: false });
      });
      _.each(this.collections, key => {
        this.connect(key, 'entity/setList', null, true, () => this.handleLoaded(key));
      });
    }
  },
  computed: {
    route () {
      return this.$route.params.section;
    }
  }
};
</script>
