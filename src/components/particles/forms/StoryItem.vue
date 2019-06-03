<template>
    <div>
      <h1>
        <input v-model="story.title" />
      </h1>
      <div class="mt-3" contenteditable>
        {{ story.description }}
      </div>
      <div class="mt-4">user stories</div>

      <div class="user-story">
        <div v-for="item in story.list" contenteditable
             :class="`mt-3 user-story__item user-story__item--${item.level}`"
             @keyup.shift.186="event => pressed(item, event)"
        > {{ item.value }} </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "StoryItem",
  data() {
    return {
      story: {
        title: 'Mobile Sign Up',
        description: 'Sign up simply means to register. It could be portal, newsletter or things the like. So when you visit and access anything for the first time, you need to sign up.',
        list: [
          {
            level: 1,
            value: 'hello'
          },
          {
            level: 2,
            value: 'world'
          }
        ]
      }
    }
  },
  methods: {
    pressed (item, event) {
      switch (true) {
        case event.altKey && event.shiftKey && item.level < 3:
          event.target.innerHTML = event.target.innerHTML.slice(0, -1);

          this.story.list.push({
            level: item.level - 1,
            value: 'As a'
          });
          break;
        case event.shiftKey && item.level < 3:
          event.target.innerHTML = event.target.innerHTML.slice(0, -1);

          this.story.list.push({
            level: item.level + 1,
            value: 'As a'
          });
          break;
      }
    }
  }
};
</script>
