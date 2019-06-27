<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <span :class="{'text-bold': bold}">{{ toStr(selected, 'name') }}</span>
      <v-btn icon v-on="on" class="dropdown-action">
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>
    </template>
    <div class="dropdown-list">
      <v-list>
        <v-list-tile v-for="(item, key) in list" :key="key" @click="$emit('update', item)"
          :class="{'v-list__tile--active': isEqual(selected, item)}">
          <v-list-tile-content>
            <v-list-tile-title :class="{'item-active': isEqual(selected, item)}">
              <span>{{ toStr(item, 'name') }}</span>
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
      type: [String, Object],
      required: false
    },
    bold: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toStr (item, field) {
      if (typeof item === 'object') {
        return item[field];
      }

      return item;
    },
    isEqual (left, right, field = 'id') {
      if (typeof left === 'object' && typeof right === 'object') {
        return left[field] === right[field];
      }

      return left === right;
    }
  }
}
</script>
