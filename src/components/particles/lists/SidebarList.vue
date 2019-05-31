<template>
  <div class="sidebar-scroll">
    <v-list>
      <v-list-tile
        v-for="(item, key) in list"  :key="key" class="sidebar__item"
        :class="{'sidebar__item--active': active === item.title }"
        @click="() => $emit('', item.value)">
        <v-list-tile-content>
          <v-list-tile-title>
            <v-layout align-center justify-space-between row fill-height>
              <span> {{ item.title }}
                <div v-if="item.marker" class="red-circle" />
              </span>
              <span class="text-greyed" v-if="item.number">
                {{ item.number }}
              </span>
            </v-layout>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <div @click="() => $emit('menu')" class="navigation__title"
           :class="{ 'text-primary': minified }">
        {{ title }}
      </div>
    </v-list>

    <div class="sidebar-add" @click="showAddTeamModal" v-if="add">
      <v-icon>add</v-icon>
      <span v-if="!minified">
          {{ add }}
        </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "SidebarList",
  props: {
    title: {
      type: String,
      default: null
    },
    active: {
      type: String
    },
    list: {
      type: Array
    },
    btn: {
      type: String
    },
    minified: {
      type: Boolean,
      default: false
    },
    add: {
      type: String,
    },
    clickable: {
      type: Boolean,
      default: false
    }
  }
};
</script>
