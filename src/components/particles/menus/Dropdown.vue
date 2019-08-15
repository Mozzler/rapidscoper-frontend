<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <template
        :class="{
          'text-bold': bold,
          'cursor-default': !editable
        }">
        <input v-if="editable"
          ref="project-input"
          placeholder="Project"
          class="user-story__editable-input"
          @blur="blur"
          @click="click"
          v-model="project" />
        <span v-else>
          {{ project }}
        </span>
      </template>
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
  name: 'Dropdown',
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
    },
    editable: {
      type: Boolean,
      default: false
    },
    submit: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      project: null
    };
  },
  mounted () {
    this.initData();
  },
  methods: {
    resize () {
      const input = this.$refs['project-input'];
      if (input) {
        input.style.width = input.value.length + 'ch';
      }
    },
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
    },
    click ($event) {
      this.$store.commit('story/setActiveStoryOnTab', null);
      this.$nextTick(() => {
        $event.target.focus();
      });
    },
    async blur () {
      if (!this.project) {
        this.initData();
        return;
      }

      const response = await this.submit(this.project, this.selected.id);
      if (response === 'error') {
        this.initData();
      }
    },
    initData () {
      this.project = this.toStr(this.selected, 'name');
    }
  },
  watch: {
    project () {
      this.resize();
    },
    selected: {
      deep: true,
      handler () {
        this.initData();
      }
    }
  }
};
</script>
