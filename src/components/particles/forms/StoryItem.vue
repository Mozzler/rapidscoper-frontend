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
      <div v-for="(item, index) in list" contenteditable
           :key="index"
           :class="`mt-3 user-story__item user-story__item--${item.level}`"
           @focus="() => active = index"
           @keyup.exact="pressed"
           @keyup.ctrl.186.exact="event => toMainList(item, event)"
           @keyup.shift.186.exact="event => toSublist(item, event)"
      >{{ item.value | parsed }}</div>
    </div>
    <div id="hint" class="hint" v-show="hint.state">
      <div v-for="(item, index) in hint.list" class="hint__item" :key="index"
           @click="event => complete(event, index)">
        {{ item | beginning }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StoryItem",
  filters: {
    parsed (str) {
      return str !== null ? str.replace('<inserted>', '').replace('</inserted>', '') : '';
    },
    beginning (str) {
      return `${str.split('[')[0]} ...`;
    }
  },
  data() {
    return {
      story: {
        title: 'Mobile Sign Up',
        description: 'Sign up simply means to register. It could be portal, newsletter or things the like. So when you visit and access anything for the first time, you need to sign up.',
      },
      list: [
        {
          level: 1,
          sentence: null,
          value: null
        }
      ],

      active: null,
      hint: {
        state: false,
        list: null
      }
    }
  },
  beforeMount() {
    this.hint.list = this.sentences;
  },
  computed: {
    sentences () {
      return [
        'As a [user_type] I can [] so that []',
        'Requires a [requirement_type] called [field]',
        'When I []'
      ];
    },
    userTypes () {
      return [
        'New User'
      ];
    },
    requirementTypes () {
      return [
        'Model',
        'Field',
        'Page',
        'API endpoint'
      ];
    }
  },
  methods: {
    complete (event, index) {
      const element = this.list[this.active];

      if (element.value === null) {
        element.value = event.target.outerText.replace('...', ' ');
        element.sentence = this.sentences[index];
      }
      else {
        element.value += event.target.outerText;
        element.sentence = `[inserted]this.sentences[index][/inserted]`;
      }

      this.hint.state = false;
    },
    pressed (event) {
      this.hint.state = false;
      const element = this.list[this.active];

      if (element.value !== null) {
        const A = element.value.trim();
        const difference = element.sentence.split(A).join(' ');
        const parts = difference.trim().split(' ');
        const brackets = parts[0];

        switch (true) {
          case brackets === '[user_type]':
            this.hint.list = this.userTypes;
            break;
          case brackets === '[requirement_type]':
            this.hint.list = this.requirementTypes;
            break;
          default:
            return;
        }
      }

      const d = document.getElementById('hint');
      d.style.top = event.srcElement.offsetTop+22 + 'px';
      d.style.left = event.srcElement.offsetTop + 'px';
      this.hint.state = true;
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
