<template>
    <div>
      <h1>
        <input v-model="story.title" />
      </h1>
      <div class="mt-3" contenteditable>
        {{ story.description }}
      </div>
      <div class="sidebar__title mt-4">user stories</div>
      <div class="user-story">
        <div v-for="(item, index) in story.list" contenteditable
             :key="index"
             :class="`mt-3 user-story__item user-story__item--${item.level}`"
             @blur="() => hint = false"
             @click="() => hint = false"
             @keyup.exact="pressed"
             @keyup.ctrl.186.exact="event => toMainList(item, event)"
             @keyup.shift.186.exact="event => toSublist(item, event)"
        > {{ item.value }} </div>
      </div>
      <div id="hint" class="hint" v-show="hint">
        <div v-for="item in sentences" class="hint__item">
          {{ item }}
        </div>
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
      },
      sentences: [
        'As a ...', 'When I...', 'Requires a'
      ],
      hint: false
    }
  },
  methods: {
    pressed (event) {
      this.hint = false;
      const d = document.getElementById('hint');
      d.style.top = event.srcElement.offsetTop+22 + 'px';
      d.style.left = event.srcElement.offsetTop + 'px';
      this.hint = true;
    },
    toMainList (item, event) {
      this.story.list.push({
        level: item.level - 1,
        value: 'As a'
      });
    },
    toSublist (item, event) {
      event.target.innerHTML = event.target.innerHTML.replace(':', '');
      this.story.list.push({
        level: item.level + 1,
        value: 'As a'
      });
    },
  }
};
</script>
