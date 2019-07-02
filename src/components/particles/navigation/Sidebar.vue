<template>
  <v-navigation-drawer
    v-model="drawer"
    permanent clipped fixed
    class="sidebar"
    width="272"
    app>

    <div class="sidebar__header">
      <v-icon class="sidebar__notification">notifications</v-icon>
      <div class="sidebar-header__img">
        <img src="@/assets/img/user.png"/>
      </div>
      <div class="text-bold" v-if="user">
        {{ user.firstName ? user.firstName : ''}} {{ user.lastName ? user.lastName : '' }}
        <span class="menu-bottom">
          <dropdown
            :list="settings"
            @update="value => handleDropdown(value)" />
        </span>
      </div>
    </div>

    <div class="sidebar__scroll">
      <sidebar-list
        :list="items"
        :active="$route.params.name"
        @go="value => goTo(`/dashboard/${value}`)" />

      <sidebar-list
        title="Teams"
        btn="Add team"
        :list="teams"
        :active="$route.params.name"
        @add="showAddTeamModal"
        @go="toTeams" />
    </div>

    <div class="sidebar__footer">
      <logo-rapid-scope />
    </div>

    <add-team-modal />
  </v-navigation-drawer>
</template>

<script>
import LogoRapidScope from '../icons/LogoRapidScope';
import Navigation from '@/mixins/navigation';
import AddTeamModal from "@/components/particles/modals/AddTeam";
import Dropdown from "../menus/Dropdown";
import SidebarList from "../lists/SidebarList";

export default {
  name: 'Sidebar',
  components: {
    SidebarList,
    LogoRapidScope,
    AddTeamModal,
    Dropdown
  },
  mixins: [
    Navigation
  ],
  data () {
    return {
      drawer: true,
      right: null,
      teamMenu: false,

      settings: ['Account Settings', 'Log out'],
      items: [
        {
          title: 'All projects',
          number: 24,
          icon: 'list_alt'
        },
        {
          title: 'Shared with me',
          number: 4,
          icon: 'share'
        },
        {
          title: 'Archived',
          number: 12,
          icon: 'archive'
        }
      ]
    };
  },
  computed: {
    teams () {
      return this.$store.getters['entity/items']('teams');
    },
    user () {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    toTeams (value, id) {
      this.$store.commit('entity/setActiveId', ['Team', id]);
      this.goTo(`/team/${value}`);
    },
    showAddTeamModal () {
      this.$root.$emit('add-team');
    },
    handleDropdown (value) {
      switch (value) {
        case 'Log out':
          this.$store.dispatch('auth/logout')
            .then(() => {
              this.$router.push('/signup');
            });
      }
    }
  }
};
</script>
