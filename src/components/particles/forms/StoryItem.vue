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
        :stories="stories" />
    </div>
    <div v-else>
      <v-divider class="my-3" />
      <div class="text-sm-center text-greyed">
        <span v-if="filters.priorities.length || filters.labels.length">
          There are no stories for the selected filters
        </span>
        <div v-else>
          <div>There are no stories in the sections yet</div>
          <div class="text-reference" @click="createFirstStory">Create story</div>
        </div>
      </div>
      <v-divider class="my-3" />
    </div>
  </div>
</template>

<script>
import Wysiwyg from '../inputs/Wysiwyg';
import CircularLoader from '../../particles/loaders/Circular';

import { mapState } from 'vuex';
import { mapGetters } from 'vuex';

export default {
  name: 'StoryItem',
  components: {
    Wysiwyg,
    CircularLoader
  },
  props: {
    model: {
      type: [Object, undefined],
      required: true
    }
  },
  data () {
    return {
      hovered: null,
      name: null,
      description: null,
      processing: null
    };
  },
  beforeMount () {
    this.hovered = null;
    this.name = this.model.name;
    this.description = this.model.description;
    this.processing = null;
  },
  computed: {
    ...mapState({
      filters: state => state.story.filters
    }),
    ...mapGetters({
      items: 'entity/items'
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
    async createFirstStory () {
      const data = {
        id: this.getObjectId(),
        type: 'user',
        storyIdentifier: this.identifier,
        parentStoryId: null,
        afterStoryId: 0,

        estimate: 0,
        priority: null,
        labels: [],
        level: 0,

        markup: `<span class="user-story__editable--beginning">As a </span>&nbsp;`,

        sectionId: this.model.id,
        teamId: this.model.teamId,
        projectId: this.model.projectId
      };

      await this.$store.dispatch('entity/create', {
        entity: 'story',
        data: data
      });

      this.$socket.recreateWatchers('story', false);
    },
    async removeSection () {
      this.$root.$emit('delete-section', this.model.id);
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
