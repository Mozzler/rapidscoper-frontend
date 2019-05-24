<template>
  <v-navigation-drawer
    v-model="drawer"
    stateless
    class="sidebar">

    <div class="sidebar-header">
      <v-icon class="sidebar-notification">notifications</v-icon>
      <div class="sidebar-header__img">
        <img src="@/assets/img/user.png"/>
      </div>
      <div class="text-bold">
        Jennifer Foster
      </div>
    </div>

    <v-list>
      <v-list-tile v-for="(number, key) in items" :key="key" class="sidebar__item"
        :class="{'sidebar__item--active': $route.params.name === itemToParam(key)}"
        @click="goTo(key, 'dashboard')">
          <v-list-tile-content>
            <v-list-tile-title>
              <v-layout align-center justify-space-between row fill-height>
                <span>{{ key }}</span>
                <span class="text-greyed">{{ number }}</span>
              </v-layout>
            </v-list-tile-title>
          </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <div class="sidebar-section">Teams</div>

    <v-list>
      <v-list-tile
        v-for="(number, key) in teams"
        :key="key" class="sidebar__item"
        :class="{'sidebar__item--active': $route.params.name === itemToParam(key)}"
        @click="goTo(key, 'team')">
        <v-list-tile-content>
          <v-list-tile-title>
            <v-layout align-center justify-space-between row fill-height>
              <span>{{ key }} <div class="red-circle" /></span>
              <span class="text-greyed">{{ number }}</span>
            </v-layout>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <div class="sidebar-add">
      <v-icon>add</v-icon>
      <span>
        Add team
      </span>
    </div>

    <div class="sidebar-footer" v-if="!mini">
      <logo-rapid-scope />
    </div>
  </v-navigation-drawer>
</template>

<script>
    import LogoRapidScope from "../icons/LogoRapidScope";
    import Navigation from '@/mixins/navigation';

    export default {
      name: "Sidebar",
      components: {LogoRapidScope},
      mixins: [
        Navigation
      ],
      data() {
        return {
          drawer: true,
          mini: false,
          right: null,

          items: {
            'All projects': 24,
            'Shared with me': 4,
            'Archived': 12
          },
          teams: {
            'The Bumpy Hamsters': 16,
            'West World': 3,
            'The Ramblers': 1
          },
        }
      },
      methods: {
        goTo(item, name) {
          console.log(name);
          this.$router.push({
            name: 'dashboard',
            params: {
              name: this.itemToParam(item),
              section: name
            }
          });
        }
      }
    }
</script>

<style scoped>

</style>
