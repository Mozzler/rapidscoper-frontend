<template>
  <div v-if="list">
    <div v-for="(item, index) in list"
         :key="`wysiwyg-${ item.id }`">

      <div class="user-story"
           :class="{
             'user-story--active': (toolId === item.id && (tab !== 'edit' && tab !== 'estimate')),
             'cursor-pointer': (tab !== 'edit' && tab !== 'estimate'),
           }"
           :tabindex="0"
           :ref="`tool-panel-${item.id}`"
           @click="() => selectTool(item.id)"
           @keyup.enter.prevent.exact="() => setHandler('nextItem', item.id)"
           @keydown.tab.prevent.exact="() => setHandler('nextItem', item.id)"
           @keydown.down.prevent.exact="() => setHandler('nextItem', item.id)"
           @keydown.up.prevent.exact="() => setHandler('previousItem', item.id)"
           @keypress="$event => toolKey($event, item.id)">

        <div class="user-story__tools" v-if="(toolDictionary && toolId === item.id)">
          <tool-list
            :key="tab"
            :active="item[tab]"
            :list="toolDictionary"
            :minified="true"
            :label-cls="'tool-block__label--minified'"
            :loader="toolProcessing &&
              toolProcessing.type === tab &&
              toolProcessing.id === item.id"
            @update="id => submitTool(id)"/>
        </div>

        <v-layout row fill-height>
          <v-flex shrink mr-1>
            <div :class="`user-story__item user-story__item--${ item.level }`">
              <v-layout fill-height>
                <v-flex shrink mr-2>
                  <input
                    tabindex="0"
                    class="user-story__input"
                    v-if="tab === 'estimate'"
                    v-model="item.estimate"
                    @keydown.tab.exact.prevent="$event => updateEstimate($event, item.id, true)"
                    @keyup.enter.exact.prevent="$event => updateEstimate($event, item.id, true)"
                    @change="$event => updateEstimate($event, item.id)"
                    :ref="`estimate-${item.id}`"
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
                   :disabled="processing === item.id"
                   class="user-story__editable"
                   :class="{'user-story__wysiwyg--disabled': tab !== 'edit'}"
                   :ref="item.id"
                   tabindex="2"
                   @focus="() => focusEvent(item, index)"
                   @keydown.enter.exact="createStory"
                   @click="($event) => checkHint($event, item)"
                   @keydown.down.exact="focusHint"
                   @keyup.exact="keyupEvent"
                   @keydown.esc.exact="() => hintEditor = null"
                   @keydown.tab.exact="fixStaticText"
                   @keydown.delete.exact="remove"
                   @keydown.186.shift.exact="createSubstory"
                   @keydown.tab.shift.exact="decreaseStoryLevel"
                   @blur="updateStory"
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
    },
    stories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      list: null,
      hintEditor: null,
      processing: false
    };
  },
  beforeMount () {
    this.list = this.stories;
  },
  methods: {
    setHandler (handler, params) {
      if (this.tab === 'priority' || this.tab === 'label') {
        this[handler](params);
      }
    },
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
