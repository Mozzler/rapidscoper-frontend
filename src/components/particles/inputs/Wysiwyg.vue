<template>
  <div>
    <div v-for="(item, index) in list"
         :key="`wysiwyg-${ index }-${ level }`">

      <div class="user-story">
        <div class="user-story__tools" v-if="collection">
          <tool-list
            :active="item[tab]"
            :list="collection"
            :label-cls="'tool-block__label--minified'"
            @update="value => item[tab] = value"/>
        </div>

        <v-layout row fill-height>
          <v-flex shrink mr-1>
            <div
              :class="`user-story__item user-story__item--${ level }`">
              <v-layout fill-height>
                <v-flex shrink mr-2>
                  <input
                    tabindex="1"
                    class="user-story__input"
                    v-if="tab === 'estimate'"
                    v-model="item.estimation"
                    @change="$event => item.estimation = $event.target.value"
                  />
                </v-flex>
                <v-flex grow>
                  <div class="user-story__prefix"> # </div>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
          <v-flex grow text-xs-left>
            <div class="user-story__wysiwyg">
              <div class="user-story__placeholder" v-html="item.placeholder" readonly></div>
              <div contenteditable class="user-story__editable"
                   :id="storyId"
                   :ref="`editor-${ index }-${ level }`"
                   tabindex="2"
                   @blur="() => saveStory(item.id)"
                   @click="($event) => checkHint($event, index)"
                   @focus="($event) => focus($event, index)"
                   @keydown.down.exact="focusHint"
                   @keyup.exact="pressed"
                   @keydown.esc.exact="hideHint"
                   @keydown.tab.exact="fixStaticText"
                   @keydown.enter.exact="createRow"
                   @keydown.delete.exact="($event) => remove($event, index)"
                   @keydown.186.shift.exact="createSublist"
                   @keydown.tab.shift.exact="decreaseSublistLevel"
                   v-html="item.text"></div>
            </div>
          </v-flex>
        </v-layout>
      </div>

      <wysiwyg
        :sectionId="sectionId"
        :ref="`wysiwyg-child-${ index }-${ level }`"
        :model="item.list"
        :level="level+1"
        :parentIndex="index"
        @update-text="(i, text) => updateChildText(i, text, index)" />
    </div>
  </div>
</template>

<script>
import ToolList from "../lists/ToolList";
import Wysiwyg from "./Wysiwyg";

import WysiwygMixin from "@/mixins/wysiwyg";

export default {
  name: "Wysiwyg",
  components: {
    ToolList,
    Wysiwyg
  },
  mixins: [
    WysiwygMixin
  ],
  props: {
    model: {
      type: Array,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    parentIndex: {
      type: Number,
      default: 1
    },
    sectionId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      list: this.model,
      focused: null,
      hint: {
        filter: null,
        chapter: null
      }
    };
  },
  computed: {
    tab () {
      let key = this.$route.params.tab.slice(0, -1);
      if (key.slice(-2) === 'ie') {
        key = `${key.slice(0, -2)}y`;
      }
      return key;
    },
    storyId () {
      return this.model.storyId ? this.model.storyId : this.uuid();
    },
    collection () {
      return this.$store.state.story[this.tab];
    },
  },
  methods: {
    updateText () {
      this.$emit('update-text', this.focused, this.list[this.focused]);
    },
    updateChildText (index, obj, parentIndex) {
      this.list[parentIndex].list[index] = obj;
    },
    saveStory (id) {
      let action = 'entity/create';
      const story = {
        entity: 'story',
        data: {
          type: 'user',
          sectionId: this.sectionId,
          teamId: this.activeProject.teamId,
          projectId: this.activeProject.id,
          level: this.level - 1,
          markup: this.editor.text
        }
      };

      if (id) {
        action = 'entity/update';
        story.params = { 'id': id };
      }
      this.$store.dispatch(action, story);
    }
  },
  watch: {
    model: {
      deep: true,
      handler () {
        new Promise(resolve => {
          this.list = this.model;
          resolve();
        }).then(() => {
          if (!this.isEditable(this.event)) {
            document.execCommand('selectAll', false, null);
            document.getSelection().collapseToEnd();
          }
        });
      }
    }
  }
};
</script>
