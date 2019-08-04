<template>
  <div>
    <div v-if="title" class="sidebar__title" @click="() => $emit('menu')">
      {{ title }}
    </div>
    <v-list v-if="items.length">
      <draggable
        v-model="items"
        @change="change">
        <v-list-tile
        v-for="(item, key) in items"  :key="key" class="sidebar__item"
        :class="{'sidebar__item--active ': active === itemToParam(item[indicator]) }"
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
      </draggable>
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
      type: String
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
    }
  },
  data () {
    return {
      items: this.list
    };
  },
  methods: {
    change ($event) {
      const moved = $event.moved;

      const projects = this.$store.getters['entity/items']('project');
      const project = _.find(projects, item => item.id === moved.element.projectId);
      const sectionOrder = project.sectionOrder;
      [sectionOrder[moved.newIndex], sectionOrder[moved.oldIndex]] = [sectionOrder[moved.oldIndex], sectionOrder[moved.newIndex]];

      const data = {
        entity: 'project',
        params: {
          id: moved.element.projectId
        },
        data: {
          id: moved.element.projectId,
          sectionOrder: sectionOrder
        }
      };

      this.$store.dispatch('entity/update', data)
        .then(() => {
          this.items = this.list;
        });
    }
  }
};
</script>
