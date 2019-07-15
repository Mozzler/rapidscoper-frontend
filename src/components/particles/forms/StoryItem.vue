<template>
  <div :id="model.id" class="user-story__block">
    <h1>
      <input v-model="name"
             @input="updateSectionName"
             @blur="() => updateStory('name')" />
    </h1>
    <div class="mt-3 user-story__wysiwyg">
      <div class="user-story__placeholder text-greyed">
        {{ !description ? 'Describe this section' : '' }}
      </div>
      <div contenteditable class="user-story__editable"
           v-html="description"
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
        :ref="'wysiwyg'"
        :model="stories.list"
        :level="1"
        @update-text="updateText"/>
    </div>
  </div>
</template>

<script>
import Wysiwyg from "../inputs/Wysiwyg";
import ErrorHandler from "@/mixins/error-handler";
import StoryInitializer from "@/mixins/wysiwyg/story-initializer";

export default {
  name: "StoryItem",
  components: {
    Wysiwyg
  },
  mixins: [
    ErrorHandler,
    StoryInitializer
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
      description: this.model.description
    };
  },
  methods: {
    updateText (index, input) {
      this.stories.list[index].text = input.text;
      this.stories.list[index].placeholder = input.placeholder;
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
  }
};
</script>
