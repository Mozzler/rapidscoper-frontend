<template>
  <div v-if="list">
    <div v-for="(item, index) in list"
         :key="`wysiwyg-${ item.id }`">

      <div class="user-story"
           :class="{
             'user-story--active': (toolId === item.id && (tab !== 'edit' && tab !== 'estimate')),
             'cursor-pointer': (tab !== 'edit' && tab !== 'estimate'),
           }"
           tabindex="0"
           @click="() => selectTool(item.id)"
           @keyup.enter.exact="nextItem"
           @keyup.tab.prevent.exact="nextItem"
           @keyup.page-down.prevent.exact="nextItem"
           @keyup.page-up.prevent.exact="previousItem"
           @keypress="$event => toolKey($event, item.id)">

        <div class="user-story__tools" v-if="(toolDictionary && toolId === item.id)">
          <circular-loader
            cls="loader-shadow--without-padding"
            :size="50"
            :width="5"
            :visible="toolProcessing"
          />
          <tool-list
            :key="tab"
            :active="item[tab]"
            :list="toolDictionary"
            :label-cls="'tool-block__label--minified'"
            @update="updateToolId"/>
        </div>

        <v-layout row fill-height>
          <v-flex shrink mr-1>
            <div :class="`user-story__item user-story__item--${ item.level }`">
              <v-layout fill-height>
                <v-flex shrink mr-2>
                  <input
                    tabindex="1"
                    class="user-story__input"
                    v-if="tab === 'estimate'"
                    v-model="item.estimate"
                    @change="$event => updateEstimate($event, item.id)"
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
              <div :contenteditable="processing !== item.id && tab === 'edit'"
                   class="user-story__editable"
                   :ref="item.id"
                   :disabled="processing === item.id"
                   tabindex="2"
                   @focus="() => focusEvent(item, index)"
                   @keydown.enter.exact="createStory"
                   @blur="updateStory"
                   @click="($event) => checkHint($event, index)"
                   @keydown.down.exact="focusHint"
                   @keyup.exact="keyupEvent"
                   @keydown.esc.exact="hideHint"
                   @keydown.tab.exact="fixStaticText"
                   @keydown.delete.exact="($event) => remove($event, item)"
                   @keydown.186.shift.exact="createSubstory"
                   @keydown.tab.shift.exact="decreaseStoryLevel"
                   v-html="item.markup"></div>
              <circular-loader
                cls="user-story__loader"
                :size="10"
                :width="7"
                :visible="processing === item.id" />
            </div>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script>
import ToolList from "../lists/ToolList";
import CircularLoader from "../../particles/loaders/Circular";

import WysiwygMixin from "@/mixins/wysiwyg";

export default {
  name: "Wysiwyg",
  components: {
    ToolList,
    CircularLoader
  },
  mixins: [
    WysiwygMixin
  ],
  props: {
    sectionId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: null,
      hintEditor: null,
      processing: false,
    };
  },
  beforeMount () {
    this.list = this.stories;
  },
  computed: {
    stories () {
      return this.$store.getters['story/content'](this.sectionId);
    }
  },
  methods: {
    collapseToEnd () {
      this.$nextTick(() => {
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
      });
    }
  },
  watch: {
    stories: {
      deep: true,
      handler () {
        new Promise(resolve => {
          this.list = this.stories;
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
