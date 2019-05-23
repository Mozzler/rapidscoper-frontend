<template>
  <v-navigation-drawer
    v-model="drawer"
    stateless
    class="sidebar">

    <div class="sidebar-header">
      <div class="sidebar-header__img">
        <img src="@/assets/img/user.png"/>
      </div>
      <div class="text-bold">
        Jennifer Foster
      </div>
    </div>

    <v-list>
      <v-list-tile v-for="item in items" :key="item" class="sidebar__item"
        :class="{'sidebar__item--active': $route.params.tab === itemToParam(item, 'main')}"
        @click="goTo(item)">
          <v-list-tile-content>
            <v-list-tile-title>
                {{ item }}
            </v-list-tile-title>
          </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <div class="sidebar-section">Teams</div>

    <v-list>
      <v-list-tile
        v-for="item in teams"
        :key="item"
        @click="">
        <v-list-tile-content>
          <v-list-tile-title>{{ item }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <div>Add team</div>

    <div class="sidebar-footer" v-if="!mini">
      <logo-rapid-scope />
    </div>
  </v-navigation-drawer>
</template>

<script>
    import LogoRapidScope from "../icons/LogoRapidScope";
    export default {
      name: "Sidebar",
      components: {LogoRapidScope},
      data() {
        return {
          drawer: true,
          mini: false,
          right: null,

          items: [
            'All projects',
            'Shared with me',
            'Archived'
          ],
          teams: [
            'The Bumpy Hamsters',
            'West World',
            'The Ramblers'
          ],
        }
      },
      methods: {
        itemToParam(str) {
          return str.toLowerCase().replace(/ /g, '-');
        },
        goTo(item, name) {
          this.$router.push({
            name: name,
            params: {
              tab: this.itemToParam(item)
            }
          });
        }
      }
    }
</script>

<style scoped>

</style>
