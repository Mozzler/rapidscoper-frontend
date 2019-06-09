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
    <wysiwyg
      :model="stories.list"
      :level="1"
      @update-text="updateText"/>

    <hint />
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

          list: []
        }]
      }
    };
  },
  beforeMount () {
    this.stories.list[0].parent = this.stories;
  },
  methods: {
    updateText (index, text) {
      this.stories.list[index].text = text;
    }
  }
};
</script>
