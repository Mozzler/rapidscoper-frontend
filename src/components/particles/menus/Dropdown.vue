<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <template>
        <div
          class="user-story__editable-input"
          :contenteditable="editable"
          :class="{
            'text-bold': bold,
            'cursor-default': !editable
          }"
          @blur="blur"
          @click="editable ? click : null"
          v-html="project" />
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
      project: this.toStr(this.selected, 'name')
    };
  },
  beforeMount () {
    this.initData();
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
    },
    click ($event) {
      this.$store.commit('story/setActiveStoryOnTab', null);
      this.$nextTick(() => {
        $event.target.focus();
      });
    },
    async blur ($event) {
      const text = $event.target.innerHTML.trim();
      if (!text) {
        this.initData($event);
        return;
      }

      const response = await this.submit(text, this.selected.id);
      if (response === 'error') {
        this.initData($event);
      }
    },
    initData ($event = null) {
      if ($event !== null) {
        $event.target.innerHTML = this.project;
      }
    },
  },
  watch: {
    selected: {
      deep: true,
      handler () {
        this.project = this.toStr(this.selected, 'name');
      }
    }
  }
};
</script>
