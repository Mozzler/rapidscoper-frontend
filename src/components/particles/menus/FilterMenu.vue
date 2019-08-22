<template>
  <v-flex class="filter__item filter__item--mr">
    <div class="mr-1">
      <v-layout align-start justify-center row fill-height>
        <div>{{ title }}:&nbsp;</div>
        <div v-for="(index, indexInSelected) in selected"
           :key="index"
           v-html="adjusted(index, indexInSelected)"
           @click="() => unselect(indexInSelected)">
          {{ adjusted(index, indexInSelected) }}
        </div>
      </v-layout>
    </div>
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
import { mapGetters } from 'vuex';

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
  computed: {
    ...mapGetters({
      filters: 'story/filters'
    }),
    selected () {
      return this.filters[this.type];
    },
    type () {
      return this.title.toLowerCase();
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
        this.items.push(`None ${this.type} to filter`);
      }
    },
    exists (index) {
      return this.selected.includes(index);
    },
    select (index) {
      if (!this.list.length) {
        return;
      }

      const found = _.findIndex(this.selected, item => item === index);
      let modified = [...this.selected];

      if (found === -1) {
        modified.push(index);
      } else {
        modified.splice(found, 1);
      }

      this.$store.commit('story/updateFilters', {
        type: this.type,
        set: modified
      });
    },
    adjusted (index, indexInSelected) {
      const tail = (indexInSelected + 1 < this.selected.length) ? '&nbsp;and&nbsp;' : '';
      return `<span class="text-bold">${this.list[index]}</span><span>${tail}</span>`;
    },
    unselect (indexInSelected) {
      let modified = [...this.selected];
      modified.splice(indexInSelected, 1);

      this.$store.commit('story/updateFilters', {
        type: this.type,
        set: modified
      });
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
