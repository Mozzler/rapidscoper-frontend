<template>
  <v-navigation-drawer
    v-model="drawer"
    permanent clipped fixed
    class="sidebar"
    width="272"
    app>

    <div class="sidebar__header" v-if="user">
      <!--<v-icon class="sidebar__notification">
        notifications
      </v-icon>-->
      <div class="sidebar-header__img">
        <img :src="user.avatarUrl"/>
      </div>
      <div class="text-bold">
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
        :indicator="'title'"
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
          number: 0,
          icon: 'list_alt'
        },
        {
          title: 'Shared with me',
          number: 0,
          icon: 'share'
        },
        /*{
          title: 'Archived',
          number: 12,
          icon: 'archive'
        }*/
      ]
    };
  },
  computed: {
    teams () {
      return this.$store.getters['entity/items']('team');
    },
    user () {
      return this.$store.state.auth.user;
    },
    projects () {
      return this.$store.getters['entity/items']('project');
    },
    totalProjects () {
      return this.projects.length;
    },
    totalShared () {
      return this.projects
        .filter(item => item.createdUserId !== this.user.user_id)
        .length
        .toString();
    }
  },
  beforeMount () {
    this.items[0].number = this.totalProjects;
    this.items[1].number = this.totalShared;
  },
  methods: {
    toTeams (value, id) {
      this.goTo(`/team/${id}`);
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
  },
  watch: {
    totalProjects () {
      this.items[0].number = this.totalProjects;
    },
    totalShared () {
      this.items[1].number = this.totalShared;
    }
  }
};
</script>
