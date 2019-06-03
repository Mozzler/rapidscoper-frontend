<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="minified"
    permanent clipped fixed
    class="sidebar"
    app>

    <v-btn icon @click.stop="updateState">
      <v-icon v-if="!minified">chevron_left</v-icon>
      <v-icon v-else>chevron_right</v-icon>
    </v-btn>
    <div class="sidebar-header" v-if="!minified">
      <v-icon class="sidebar-notification">notifications</v-icon>
      <div class="sidebar-header__img">
        <img src="@/assets/img/user.png"/>
      </div>
      <div class="text-bold">
        Jennifer Foster
        <span class="menu-bottom">
          <dropdown :list="settings"
                    @update="value => handleDropdown(value)" />
        </span>
      </div>
    </div>

    <div class="sidebar-scroll">
      <sidebar-list :list="items" :active="$route.params.name" :minified="minified"
        title="Teams"  btn="Teams"
        @update-item="item => goTo(item.title, 'dashboard')"
        @add="() => teamMenu = !teamMenu" />

      <absolute-menu v-if="minified"
                     :x="22" :y="230" :visible="teamMenu">
        <template #content>
          <sidebar-list :list="items" :active="$route.params.name" :minified="minified"
                        title="Teams"  btn="Teams"
                        @update-item="item => goTo(item.title, 'dashboard')"
                        @add="() => teamMenu = !teamMenu" />
        </template>
      </absolute-menu>

      <team-list v-else />

      <div class="sidebar-add" @click="showAddTeamModal">
        <v-icon>add</v-icon>
        <span v-if="!minified">
          Add team
        </span>
      </div>
    </div>

    <div class="sidebar-footer" v-if="!minified">
      <logo-rapid-scope />
    </div>

    <add-team-modal />
  </v-navigation-drawer>
</template>

<script>
  import LogoRapidScope from '../icons/LogoRapidScope';
  import Navigation from '@/mixins/navigation';
  import TeamList from "../lists/TeamList";
  import AbsoluteMenu from "../menus/AbsoluteMenu";
  import AddTeamModal from "@/components/particles/modals/AddTeam";
  import Dropdown from "../menus/Dropdown";
  import SidebarList from "../lists/SidebarList";

  export default {
    name: 'Sidebar',
    components: {
      SidebarList,
      AbsoluteMenu,
      TeamList,
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
      minified () {
        return this.$store.state.auth.minified;
      },
      team () {
        return this.$route.params.section === 'team';
      }
    },
    methods: {
      showAddTeamModal() {
        this.$root.$emit('add-team');
      },
      updateState () {
        new Promise(resolve => {
          this.teamMenu = false;
          resolve();
        }).then(() => {
          this.$store.commit('updateSidebarState', !this.minified);
        });
      },
      handleDropdown(value) {
        switch (value) {
          case 'Log out':
            this.$store.dispatch('AUTH_LOGOUT')
              .then(() => {
                this.$router.push('/signup');
              });
        }
      },
    }
  };
</script>
