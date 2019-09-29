<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-layout row fill-height justify-end>
        <div class="cursor-default mr-2">
          <div
            class="text-sm-right"
            v-for="(item, index) in selected"
            :key="index">
            {{item}}
          </div>
        </div>
        <v-btn icon v-on="on" class="dropdown-action" :style="{top: '2px'}">
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
      </v-layout>
    </template>
    <div class="dropdown-list">
      <v-list>
        <v-list-tile v-for="(item, key) in list" :key="key" @click="$emit('update', item)"
                     :class="{ 'v-list__tile--active': selected.includes(item) }">
          <v-list-tile-content>
            <v-list-tile-title :class="{ 'item-active': selected.includes(item) }">
              <span>{{ item }}</span>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: 'AssignDropdown',
  props: {
    list: {
      type: Array,
      required: true
    },
    selected: {
      type: Array,
      required: false
    }
  }
}
</script>
