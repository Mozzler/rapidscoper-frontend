<template>
  <div v-if="list">
    <div v-for="(item, index) in list"
         :key="`wysiwyg-${ index }-${ level }`">
      <div class="user-story"
           :class="{
             'user-story--active': (toolId === item.id && (tab !== 'edit' && tab !== 'estimate')),
             'cursor-pointer': (tab !== 'edit' && tab !== 'estimate')
           }"
           @click="() => selectTool(item.id)"
           @keypress="$event => toolKey($event, item.id)">

        <div class="user-story__tools" v-if="collection">
          <tool-list
            :active="item[tab]"
            :list="collection"
            :label-cls="'tool-block__label placeholder--minified'"
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
                    @change="$event => updateEstimation($event, item.id)"
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
              <div class="user-story__placeholder"
                   v-html="item.placeholder"
                   readonly></div>
              <div :contenteditable="(processing !== `${storyId}-${index}`)"
                   class="user-story__editable"
                   :id="storyId"
                   :ref="`editor-${ index }-${ level }`"
                   :disabled="processing"
                   tabindex="2"
                   @blur="() => saveStory(item.id, index)"
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
              <circular-loader
                cls="user-story__loader"
                :size="10"
                :width="7"
                :visible="processing === `${storyId}-${index}`" />
            </div>
          </v-flex>
        </v-layout>
      </div>

      <wysiwyg
        :parentStoryId="item.id"
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
import CircularLoader from "../../particles/loaders/Circular";

import WysiwygMixin from "@/mixins/wysiwyg";

export default {
  name: "Wysiwyg",
  components: {
    ToolList,
    Wysiwyg,
    CircularLoader
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
    },
    parentStoryId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      list: this.model,
      focused: null,
      hintEditor: null,
      processing: false
    };
  },
  computed: {
    tab () {
      let modifiable = ['estimates', 'priorities', 'labels'];
      let tab = this.$route.params.tab;

      if (modifiable.includes(tab)) {
        tab = tab.slice(0, -1);

        if (tab.slice(-2) === 'ie') {
          tab = `${tab.slice(0, -2)}y`;
        }
      }

      return tab;
    },
    storyId () {
      return (this.model.storyId || this.model.id) ? (this.model.id || this.model.storyId) : this.uuid();
    },
    collection () {
      return this.$store.state.story[this.tab];
    },
    section () {
      return this.$store.getters['entity/items']('section').find(item => item.id === this.sectionId);
    }
  },
  methods: {
    updateEstimation ($event, id) {
      this.$store.dispatch('entity/update', {
        data: {
          'estimate': $event.target.value
        },
        entity: 'story',
        params: {
          id: id
        }
      });
    },
    updateText () {
      this.$emit('update-text', this.focused, this.list[this.focused]);
    },
    updateChildText (index, obj, parentIndex) {
      this.list[parentIndex].list[index] = obj;
    },
    saveStory (id, index, cb = () => {}) {
      if (this.storyId === this.hintEditor || !this.editor) {
        return;
      }

      this.processing = `${this.storyId}-${index}`;

      let action = 'entity/create';

      const story = {
        entity: 'story',
        data: {
          type: this.editor.type,
          sectionId: this.sectionId,
          parentStoryId: this.list[index].parentStoryId,
          teamId: this.activeProject.teamId,
          projectId: this.activeProject.id,
          markup: this.editor.text,
          afterStoryId: 0
        }
      };

      if (id) {
        action = 'entity/update';
        story.params = { 'id': id };
      }

      if (!(this.focused === 0 && this.level === 1)) {
        story.data.afterStoryId = this.list.length > 1 && this.list[index - 1] ?
          this.list[index - 1].id : (this.list[index].parent ? this.list[index].parent.id : null);
      }

      this.$store.dispatch(action, story)
        .then(response => {
          this.$socket.recreateWatchers('story');

          this.list[index].id = response.item.id;
          this.list[index].parentStoryId = response.item.parentStoryId;
          this.processing = false;

          cb(response);
        });
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
