<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <span :class="{'text-bold': bold}">{{ selected }}</span>
      <v-btn icon v-on="on" class="dropdown-action">
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>
    </template>
    <div class="dropdown-list">
      <v-list>
        <v-list-tile v-for="(item, key) in list" :key="key" @click="$emit('update', item)"
          :class="{'v-list__tile--active': selected === item}">
          <v-list-tile-content>
            <v-list-tile-title :class="{'item-active': selected === item}">
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
    name: "Dropdown",
    props: {
      list: {
        type: Array,
        required: true
      },
      selected: {
        type: String,
        required: false
      },
    }
  }
</script>
