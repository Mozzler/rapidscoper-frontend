<template>
  <v-flex class="filter__item filter__item--mr">
    <div class="mr-1"> {{ title }}: </div>
    <v-menu v-model="show"
            :nudge-bottom="nudgeBottom"
            :nudge-left="nudgeLeft">
      <template v-slot:activator="{ on }">
        <v-icon v-on="on">add</v-icon>
      </template>

      <div class="dropdown-list">
        <v-list>
          <v-list-tile v-for="(item, key) in items" :key="key" @click="$emit('update', item)"
                       :class="{'v-list__tile--active': isEqual(selected, item)}">
            <v-list-tile-content>
              <v-list-tile-title :class="{'item-active': isEqual(selected, item)}">
                <span>{{ toStr(item, field) }}</span>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </div>
    </v-menu>
  </v-flex>
</template>

<script>
import ListMixin from '@/mixins/list';

export default {
  name: 'FilterMenu',
  mixins: [
    ListMixin
  ],
  props: {
    nudgeBottom: {
      default: 30
    },
    nudgeLeft: {
      default: 0
    },
    list: {
      default: []
    },
    selected: {
      default: null
    },
    field: {
      default: 'name'
    },
    title: {
      default: null
    }
  },
  data () {
    return {
      show: null,
      items: []
    };
  },
  beforeMount () {
    this.initData();
  },
  methods: {
    initData () {
      this.items = [...this.list];

      if (!this.items.length) {
        this.items.push('None labels to filter');
      }
    }
  },
  watch: {
    list: {
      deep: true,
      handler () {
        this.initData();
      }
    }
  }
};
</script>
