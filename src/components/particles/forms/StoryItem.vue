<template>
  <div class="user-story__block"
    :id="model.id">

    <circular-loader
      cls="loader-shadow--without-padding"
      :size="50"
      :visible="processing"
      :width="5" />

    <div
      class="user-story__section-container"
      @mouseover="() => hovered = model.id"
      @mouseleave="() => hovered = null">
      <v-icon
        @click="removeSection"
        class="user-story__delete-section"
        v-if="hovered !== null">
        delete
      </v-icon>
      <h1>
        <input
          class="user-story__editable--bordered-1"
          v-model="name"
          @click="click"
          @input="updateSectionName"
          @blur="() => updateStory('name')" />
      </h1>
    </div>
    <div class="mt-3 user-story__wysiwyg">
      <div class="user-story__placeholder text-greyed">
        {{ !description ? 'Describe this section' : '' }}
      </div>
      <div contenteditable
           class="user-story__editable"
           v-html="description"
           @click="click"
           @input="event => updateSection('description', event)"
           @blur="() => updateStory('description')">
      </div>
    </div>
    <div class="sidebar__title mt-4 mb-3 padding-0">
      user stories
    </div>

    <div v-if="stories.length">
      <wysiwyg
        :sectionId="model.id"
        :stories="stories"/>
    </div>
    <div v-else>
      <v-divider class="my-3" />
      <div class="text-sm-center text-greyed">
        <span v-if="filters.priorities.length || filters.labels.length">
          There are no stories for the selected filters
        </span>
        <span v-else>There are no stories in the sections yet</span>
      </div>
      <v-divider class="my-3" />
    </div>
  </div>
</template>

<script>
import Wysiwyg from '../inputs/Wysiwyg';
import ErrorHandler from '@/mixins/error-handler';
import CircularLoader from '../../particles/loaders/Circular';

import { mapState } from 'vuex';

export default {
  name: 'StoryItem',
  components: {
    Wysiwyg,
    CircularLoader
  },
  mixins: [
    ErrorHandler
  ],
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      hovered: null,
      name: this.model.name,
      description: this.model.description,
      processing: null
    };
  },
  computed: {
    ...mapState({
      filters: state => state.story.filters
    }),
    stories () {
      return this.$store.getters['story/content'](this.model.id);
    }
  },
  methods: {
    click (event) {
      this.$store.commit('story/setActiveStoryOnTab', null);
      this.$nextTick(() => {
        event.target.focus();
      });
    },
    updateSection (item, event) {
      this[item] = event.target.innerText;

      document.execCommand('selectAll', false, null);
      document.getSelection().collapseToEnd();
    },
    updateSectionName () {
      const data = {
        name: this.name,
        id: this.model.id
      };

      this.$store.commit('entity/update', {
        entity: 'section',
        data: data
      });
    },
    updateStory (item) {
      const data = {
        entity: 'section',
        data: {
          [item]: this[item]
        },
        params: {
          id: this.model.id
        }
      };
      this.$store.dispatch('entity/update', data)
        .then(() => {})
        .catch(error => {
          const msg = this.handleErrors(error, true);
          this.$emit('show-error', msg);
        });
    },
    removeSection () {
      this.processing = this.model.id;
      this.$store.dispatch('entity/delete', {
        entity: 'section',
        id: this.model.id
      }).then(() => {
        this.processing = null;
      });
    }
  },
  watch: {
    'model.name' () {
      this.name = this.model.name;
    },
    'model.description' () {
      this.description = this.model.description;
    }
  }
};
</script>
