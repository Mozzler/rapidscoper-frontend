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
      <wysiwyg :sectionId="model.id" />
    </div>
  </div>
</template>

<script>
import Wysiwyg from "../inputs/Wysiwyg";
import ErrorHandler from "@/mixins/error-handler";

export default {
  name: "StoryItem",
  components: {
    Wysiwyg
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
      description: this.model.description
    };
  },
  methods: {
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
