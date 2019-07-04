<template>
  <div :id="model.id">
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
      description: this.model.description,
      stories: {
        list: [{
          parent: null,
          estimation: 0,
          priority: 0,
          label: 1,

          text: '',
          template: '',
          tail: '',
          placeholder: '',

          list: []
        }]
      }
    };
  },
  computed: {
    dictionary () {
      return this.$store.state.story.dictionary;
    }
  },
  mounted () {
    this.stories.list[0].parent = this.stories;
    this.stories.list[0].text = this.$refs.wysiwyg.createSpan('beginning', 'As a', true);
    this.stories.list[0].template = Object.values(this.dictionary.constructions)[0];
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
        entity: 'sections',
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
