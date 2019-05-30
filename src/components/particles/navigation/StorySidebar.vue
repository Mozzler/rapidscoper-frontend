<template>
  <div class="l-sidebar mini-sidebar">
    <div class="sidebar-section">
      REQ.
    </div>

    <v-list>
      <v-list-tile v-for="(item, key) in req" :key="key">
        <v-list-tile-content>
          <v-list-tile-title>
            <v-layout align-center justify-space-between row fill-height>
              <component :is="key" />
            </v-layout>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <div class="sidebar-section">
      IMP.
    </div>

    <v-list>
      <v-list-tile v-for="(item, key) in imp" :key="key">
        <v-list-tile-content>
          <v-list-tile-title>
            <v-layout align-center justify-space-between row fill-height>
              <v-icon v-if="item">{{ key }}</v-icon>
              <component :is="key" v-else />
            </v-layout>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import LogoRapidScope from '../icons/LogoRapidScope';
import Navigation from '@/mixins/navigation';
import TeamList from "../lists/TeamList";
import AbsoluteMenu from "../menus/AbsoluteMenu";
import AddTeamModal from "@/components/particles/modals/AddTeam";
import Dropdown from "../menus/Dropdown";

import TechnicalRequirementsIcon from "../icons/TechnicalRequirements";
import FunctionalRequirementsIcon from "../icons/FunctionalRequirements";
import BookIcon from "../icons/Book";
import SitemapIcon from "../icons/Sitemap";

export default {
  name: 'StorySidebar',
  components: {
    AbsoluteMenu,
    TeamList,
    LogoRapidScope,
    AddTeamModal,
    Dropdown,

    BookIcon,
    SitemapIcon,
    TechnicalRequirementsIcon,
    FunctionalRequirementsIcon
  },
  mixins: [
    Navigation
  ],
  data () {
    return {
      drawer: true,
      req: {
        'functional-requirements-icon': false,
        'technical-requirements-icon': false
      },
      imp: {
        'storage': true,
        'verified_user': true,
        'sitemap-icon': false,
        'extension': true,
        'done_all': true,
        'book-icon': false,
        'attach_file': true
      }
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
    showAddTeamModal () {
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
              this.$router.push('/');
            });
      }
    }
  }
};
</script>
