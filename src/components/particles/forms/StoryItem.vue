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
          <div contenteditable class="user-story__editable"
               @focus="() => active = index"
               @keyup.exact="pressed"
               @keyup.enter.exact="newSublist"
               @keyup.ctrl.186.exact="toMainList"
               @keyup.shift.186.exact="toSublist"
               v-html="item.value"></div>
        </v-flex>
      </v-layout>

    </div>
    <div ref="hint" class="hint" v-show="hint.state && hint.list">
      <div class="hint__item"
           v-for="(item, index) in completing"
           :key="index"
           @click="event => complete(event, index)">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
import ToolList from "../lists/ToolList";
import AutoCompleting from '@/mixins/auto-completing';

export default {
  name: "StoryItem",
  components: {ToolList},
  mixins: [
    AutoCompleting
  ],
  filters: {
    parsed (str) {
      return str !== null ? str.replace('<inserted>', '').replace('</inserted>', '') : '';
    },
  },
  data() {
    return {
      story: {
        title: 'Mobile Sign Up',
        description: 'Sign up simply means to register. It could be portal, newsletter or things the like. So when you visit and access anything for the first time, you need to sign up.',
      },
      list: [
        {
          value: '',
          estimation: 0,
          priority: 2,
          label: 1,
          level: 1,

          sentence: '',
          replacement: ''
        }
      ],
      active: null,
      hint: {
        state: false,
        list: null,
        position: null
      },
      checked: null,
      filtered: null
    }
  },
  computed: {
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
    pressed (event) {
      /*

      let cursorPosition = event.view.getSelection().anchorOffset;

      const element = this.list[this.active];

      if (element.sentence) {
        const template = element.sentence;

        for (let i = 0; i < element.value.length; i++) {
          if (template[i] === '[') {
            let brackets = template.substring(i).split(/[[\]]/).filter(item => !!item);
            let replacement = brackets[0];
            let part = element.value.indexOf('</span>', template[i]);

          }

        }
      }*/


      if(!this.list[this.active].sentence) {
        this.hint.list = this.beginnings;
      }


      this.hint.state = false;
      const element = this.list[this.active];

      if (element.value !== null && element.sentence) {
        const A = element.value.trim();
        const difference = element.sentence.split(A).join(' ');
        const parts = difference.trim().split(' ');
        const brackets = parts[0];

        switch (true) {
          case brackets === '[beginning]':
            this.hint.list = this.beginnings;
            element.replacement = brackets.replace(/[[\]]/g,'');
            break;
          case brackets === '[user-type]':
            this.hint.list = this.users;
            element.replacement = brackets.replace(/[[\]]/g,'');
            break;
          case brackets === '[field]':
            this.hint.list = this.fields;
            element.replacement = brackets.replace(/[[\]]/g,'');
            break;
          case brackets === '[requirement-type]':
            this.hint.list = this.requirements;
            element.replacement = brackets.replace(/[[\]]/g,'');
            break;
          default:
            break;
        }
      }

      this.showCompleteDialog(event);
    },

    toMainList () {
      this.hint.state = false;

      if (this.active > 0) {
        this.createRow(this.list[this.active].level - 1);
      }
    },
    toSublist (event) {
      this.hint.state = false;

      if (this.active < 3) {
        this.createRow(this.list[this.active].level + 1);
      }
    },
    newSublist (event) {
      this.hint.state = false;

      if(this.list[this.active].value) {
        this.list[this.active].value = this.list[this.active].value
          .replace(/(\r\n|\n|\r|<br>)/g, '')
          .replace(/<div>/gi,'<br>')
          .replace(/<\/div>/gi,'');

        this.createRow(this.list[this.active].level);
      }
      else {
        this.list[this.active].value = null;
      }
    },
    createRow (level) {
      this.hint.state = false;

      this.list.push({
        level: level,
        value: ''
      });
    }
  }
};
</script>
