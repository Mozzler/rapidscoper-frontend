<template>
  <div>
    <h1>
      <input
        v-model="story.title" />
    </h1>
    <div class="mt-3" contenteditable>
      {{ story.description }}
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

      <hint />
    </div>
  </div>
</template>

<script>
import Wysiwyg from "../inputs/Wysiwyg";
import Hint from "../lists/Hint";

export default {
  name: "StoryItem",
  components: {
    Wysiwyg,
    Hint
  },
  data () {
    return {
      story: {
        title: 'Mobile Sign Up',
        description: 'Sign up simply means to register. It could be portal, newsletter or things the like. So when you visit and access anything for the first time, you need to sign up.',
      },
      stories: {
        list: [{
          parent: null,
          estimation: 0,
          priority: 2,
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

    this.stories.list[0].text = this.$refs.wysiwyg.setStaticText('beginning', 'As a', true);
    this.stories.list[0].template = this.dictionary.constructions[0];
  },
  methods: {
    updateText (index, input) {
      this.stories.list[index].text = input.text;
      this.stories.list[index].placeholder = input.placeholder;
    }
  }
};
</script>
