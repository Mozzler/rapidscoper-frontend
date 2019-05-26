<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="minified"
    permanent
    clipped
    fixed
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
      </div>
    </div>

    <div class="sidebar-scroll">
      <v-list>
        <v-list-tile v-for="(item, key) in items" :key="key" class="sidebar__item"
          :class="{'sidebar__item--active': $route.params.name === itemToParam(item.title)}"
          @click="goTo(item.title, 'dashboard')">
            <v-list-tile-content>
              <v-list-tile-title>
                <v-icon v-if="minified">{{item.icon}}</v-icon>
                <v-layout v-else align-center justify-space-between row fill-height>
                    <span>{{ item.title }}</span>
                    <span class="text-greyed">{{ item.number }}</span>
                </v-layout>
              </v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <div @click="() => teamMenu = !teamMenu" class="sidebar-section"
           :class="{'text-primary': team && minified}">
        Teams
      </div>

      <absolute-menu v-if="minified"
                     :x="22" :y="230" :visible="teamMenu">
        <template #content>
          <team-list />
        </template>
      </absolute-menu>
      <team-list v-else />

      <div class="sidebar-add">
        <v-icon>add</v-icon>
        <span v-if="!minified">
          Add team
        </span>
      </div>
    </div>

    <div class="sidebar-footer" v-if="!minified">
      <logo-rapid-scope />
    </div>
  </v-navigation-drawer>
</template>

<script>
import LogoRapidScope from '../icons/LogoRapidScope';
import Navigation from '@/mixins/navigation';
import TeamList from "../lists/TeamList";
import AbsoluteMenu from "../menus/AbsoluteMenu";

export default {
  name: 'Sidebar',
  components: {
    AbsoluteMenu,
    TeamList,
    LogoRapidScope
  },
  mixins: [
    Navigation
  ],
  data () {
    return {
      drawer: true,
      right: null,
      teamMenu: false,

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
    updateState () {
      new Promise(resolve => {
        this.teamMenu = false;
        resolve();
      }).then(() => {
        this.$store.commit('updateSidebarState', !this.minified);
      });
    }
  }
};
</script>
