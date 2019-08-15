<template>
  <div class="user-story__block"
    :id="model.id"
    :class="{'user-story__block--blur': stories.length === 0}">

    <circular-loader
      cls="loader-shadow--without-padding"
      :size="50"
      :width="5"
      :visible="stories.length === 0" />

    <h1>
      <input v-model="name"
             @click="click"
             @input="updateSectionName"
             @blur="() => updateStory('name')" />
    </h1>
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

    <div>
      <wysiwyg
        :sectionId="model.id"
        :stories="stories"/>
    </div>
  </div>
</template>

<script>
import Wysiwyg from "../inputs/Wysiwyg";
import ErrorHandler from "@/mixins/error-handler";
import CircularLoader from "../../particles/loaders/Circular";

export default {
  name: "StoryItem",
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
      name: this.model.name,
      description: this.model.description,
      processing: null
    };
  },
  computed: {
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
