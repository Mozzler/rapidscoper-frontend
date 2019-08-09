<template>
  <div>
    <div v-if="title" class="sidebar__title" @click="() => $emit('menu')">
      {{ title }}
    </div>
    <v-list v-if="items.length" class="sidebar__list">
      <component :is="reorder ? 'draggable' : 'div'"
                 v-model="items"
                 @start="start"
                 @end="end"
                 ghost-class="replaceable">
        <v-list-tile
          v-for="(item, key) in items"  :key="key" class="sidebar__item"
          :class="{'sidebar__item--active ': !replacement && String(active) === itemToParam(item[indicator]) }"
          @click="() => $emit('go', itemToParam(item.title || item.name), item.id)">
            <v-list-tile-content>
          <v-list-tile-title>
            <v-layout align-center justify-space-between row fill-height>
              <span> {{ item.title || item.name }}
                <div v-if="item.marker" class="red-circle" />
              </span>
              <span class="text-greyed" v-if="item.number">
                {{ item.number }}
              </span>
            </v-layout>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      </component>
    </v-list>
    <div v-if="btn"
      class="sidebar__btn"
      @click="() => $emit('add')">
      <v-icon> add </v-icon>
      <span>
        {{ btn }}
      </span>
    </div>
  </div>
</template>

<script>

import Navigation from '@/mixins/navigation';

export default {
  name: "SidebarList",
  mixins: [
    Navigation
  ],
  props: {
    title: {
      type: String,
      default: null
    },
    active: {
      type: [String, Number]
    },
    list: {
      type: Array
    },
    btn: {
      type: String
    },
    icons: {
      type: Boolean
    },
    indicator: {
      type: String,
      default: 'id'
    },
    reorder: {
      default: null
    }
  },
  data () {
    return {
      items: this.list,
      replacement: false
    };
  },
  methods: {
    start () {
      this.replacement = true;
    },
    end ($event) {
      this.replacement = false;
      this.reorder($event, list => {
        this.items = list;
      });
    }
  },
  watch: {
    list: {
      deep: true,
      handler () {
        this.items = this.list;
      }
    }
  }
};
</script>
