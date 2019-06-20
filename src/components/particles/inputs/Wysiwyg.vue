<template>
  <div>
    <div v-for="(item, index) in list" :key="`wysiwyg-${ index }-${ level }`">
      <div class="user-story">
        <div class="user-story__tools"
             v-if="collection">
          <tool-list
            :list="collection"
            :label-cls="'tool-block__label--minified'" />
        </div>

        <v-layout row fill-height>
          <v-flex shrink mr-1>
            <div
              :class="`user-story__item user-story__item--${ level }`">
              <v-layout fill-height>
                <v-flex shrink mr-1>
                  <template #estimate>
                    <input
                      class="estimation__input"
                      v-if="tab === 'estimates'"
                      v-model="item.estimation"
                    />
                  </template>
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
                   :ref="`editor-${ index }-${ level }`"
                   @focus="($event) => focus($event, index)"
                   @keydown.down.exact="focusHint"
                   @keyup.exact="pressed"
                   @keydown.esc.exact="hide"
                   @keydown.tab.exact="fixStaticText"
                   @keypress.ctrl.enter.exact="createField"
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
        :ref="`wysiwyg-child-${ index }-${ level }`"
        :model="item.list"
        :level="level+1"
        :parentIndex="index"
        @update-text="(i, text) => updateChildText(i, text, index)"/>
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
      return this.$route.params.tab;
    },
    collection () {
      return this.$store.state.story[this.tab];
    }
  },
  methods: {
    updateText () {
      this.$emit('update-text', this.focused, this.list[this.focused]);
    },
    updateChildText (index, obj, parentIndex) {
      this.list[parentIndex].list[index] = obj;
    },
  },
  watch: {
    model: {
      deep: true,
      handler () {
        new Promise(resolve => {
          this.list = this.model;
          resolve();
        }).then(() => {
          document.execCommand('selectAll', false, null);
          document.getSelection().collapseToEnd();
        });
      }
    }
  }
};
</script>
