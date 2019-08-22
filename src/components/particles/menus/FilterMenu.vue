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
          <v-list-tile v-for="(item, index) in items"
                       @click="() => select(index)"
                       :key="index"
                       :class="{'v-list__tile--active': exists(index)}">
            <v-list-tile-content>
              <v-list-tile-title
                :class="{'item-active': exists(index)}">
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
    field: {
      default: 'name'
    },
    title: {
      default: ''
    }
  },
  data () {
    return {
      show: null,
      items: [],
      selected: []
    };
  },
  beforeMount () {
    this.initData();
  },
  methods: {
    initData () {
      let type = this.title.toLowerCase();
      this.items = [...this.list];

      if (!this.items.length) {
        this.items.push(`None ${type} to filter`);
      }
    },
    exists (index) {
      return this.selected.includes(index);
    },
    select (index) {
      const found = _.findIndex(this.selected, item => item === index);

      if (found === -1) {
        this.selected.push(index);
      } else {
        this.selected.splice(found, 1);
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
