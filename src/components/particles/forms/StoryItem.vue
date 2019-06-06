<template>
  <div>
    <h1>
      <input v-model="story.title" />
    </h1>
    <div class="mt-3" contenteditable>
      {{ story.description }}
    </div>
    <div class="sidebar__title mt-4 mb-3 padding-0">user stories</div>

    <div class="user-story" v-for="(item, index) in list"
         :class="{'user-story--active': checked === index }"
         :key="index">

      <div class="user-story__tools" v-if="collection">
        <tool-list :list="collection" :active="property"
                   :label-cls="'tool-block__label--minified'" />
      </div>

      <v-layout row fill-height>
        <v-flex shrink mr-1>
          <div :class="`user-story__item user-story__item--${item.level}`">
            <v-layout fill-height>
              <v-flex shrink mr-1>
                <input class="estimation__input"
                       v-if="tab === 'estimates'"
                       v-model="index.estimation" />
              </v-flex>
              <v-flex grow>
                <div class="user-story__prefix"> # </div>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
        <v-flex grow>
          <div contenteditable
               @focus="() => active = index"
               @keyup.exact="pressed"
               @keyup.enter.exact="newSublist"
               @keyup.ctrl.186.exact="toMainList"
               @keyup.shift.186.exact="toSublist"
               v-html="item.value"></div>
        </v-flex>
      </v-layout>

    </div>
    <div ref="hint" class="hint" v-show="hint.state">
      <div v-for="(item, index) in hint.list" class="hint__item" :key="index"
           @click="event => complete(event, index)">
        {{ item | beginning }}
      </div>
    </div>
  </div>
</template>

<script>
import ToolList from "../lists/ToolList";
export default {
  name: "StoryItem",
  components: {ToolList},
  filters: {
    parsed (str) {
      return str !== null ? str.replace('<inserted>', '').replace('</inserted>', '') : '';
    },
    beginning (str) {
      if (str && str.indexOf('[') !== -1) {
        return `${str.split('[')[0]} ...`;
      }

      return str;
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
          value: null,
          estimation: 0,
          priority: 2,
          label: 1
        }
      ],
      active: null,
      hint: {
        state: false,
        list: null,
        position: null
      },
      checked: null
    }
  },
  beforeMount () {
    this.hint.list = this.sentences;
    //console.log(this.$route.params.tab);
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
    },

    tab () {
      return this.$route.params.tab;
    },
    property () {
      switch (this.tab) {
        case 'priorities':
          return 'priority';
        case 'labels':
          return 'label';
        default:
          return null;
      }
    },
    collection () {
      return this.property ? this.$store.state.story[this.property] : null;
    }
  },
  methods: {
    check (index) {
      this.checked = index;
    },
    updateTab (value) {
      this.tab = value;
    },
    complete (event, index) {
      const element = this.list[this.active];

      if (!element.sentence || !element.value) {
        element.value = event.target.outerText.replace('...', ' ');
        element.sentence = this.sentences[index];
      }
      else {
        element.value += event.target.outerText;
        element.sentence = `[inserted]this.sentences[index][/inserted]`;
      }

      this.hint.state = false;
    },
    showCompleteDialog (event) {
      const hint = this.$refs.hint;

      this.hint.position = {
        top: event.srcElement.offsetTop + 20,
        left: event.srcElement.offsetLeft
      };

      Object.assign(hint.style, this.hint.position);
      this.hint.state = true;
    },
    pressed (event) {
      this.hint.state = false;
      const element = this.list[this.active];

      if (element.value !== null && element.sentence) {
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

      this.showCompleteDialog(event);
    },
    toMainList () {
      if (this.active > 0) {
        this.createRow(this.list[this.active].level - 1);
      }
    },
    toSublist (event) {
      if (this.active < 3) {
        this.createRow(this.list[this.active].level + 1);
      }
    },
    newSublist (event) {
      this.list[this.active].value = this.list[this.active].value.replace(/(\r\n|\n|\r|<br>)/g, '');
      this.createRow(this.list[this.active].level);
    },
    createRow (level) {
      this.list.push({
        level: level,
        value: ''
      });
    }
  }
};
</script>
