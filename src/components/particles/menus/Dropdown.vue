<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <template>
        <div
          v-if="editable"
          class="user-story__editable-input user-story__editable--bordered"
          :contenteditable="editable"
          :class="{
            'text-bold': bold,
            'cursor-default': !editable
          }"
          @blur="blur"
          @click="editable ? click : null"
          v-html="project"></div>
        <span class="cursor-default" v-else> {{ project }} </span>
      </template>
      <v-btn icon v-on="on" class="dropdown-action">
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>
    </template>
    <div class="dropdown-list">
      <v-list>
        <v-list-tile v-for="(item, key) in list" :key="key" @click="$emit('update', item)"
          :class="{'v-list__tile--active': isEqual(selected, item, field)}">
          <v-list-tile-content>
            <v-list-tile-title :class="{'item-active': isEqual(selected, item, field)}">
              <span>{{ toStr(item, field) }}</span>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </div>
  </v-menu>
</template>

<script>
import ListMixin from '@/mixins/list';

export default {
  name: 'Dropdown',
  mixins: [
    ListMixin
  ],
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
    },
    field: {
      type: String,
      default: 'name'
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
    }
  },
  watch: {
    selected: {
      deep: true,
      handler () {
        this.project = this.toStr(this.selected, this.field);
      }
    }
  }
};
</script>
