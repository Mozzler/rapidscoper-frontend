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
    <user-story
      :model="list" />
  </div>
</template>

<script>
import UserStory from "../inputs/UserStory";

export default {
  name: "StoryItem",
  components: {
    UserStory
  },
  data () {
    return {
      story: {
        title: 'Mobile Sign Up',
        description: 'Sign up simply means to register. It could be portal, newsletter or things the like. So when you visit and access anything for the first time, you need to sign up.',
      },
      list: [
        {
          level: 1,
          text: '',
          estimation: 0,
          priority: 2,
          label: 1
        }
      ]
    };
  }
};
</script>
