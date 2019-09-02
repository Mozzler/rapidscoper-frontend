<template>
  <div v-if="list">
    <component :is="tab === 'edit' ? 'draggable' : 'div'"
               v-model="list"
               :clone="clone"
               @start="start"
               ghost-class="user-story__draggable"
               @change="change">
      <div v-for="(item, index) in list"
           :key="`wysiwyg-${ item.id }`">

      <div class="user-story"
           :class="{
             'user-story--active': toolId === item.id,
             'cursor-pointer': (tab !== 'edit' && tab !== 'estimate'),
             'cursor-default': tab === 'estimate',
             'user-story--draggable': replacement === item.id,
           }"
           :tabindex="0"
           :key="`tool-panel-${item.id}`"
           :ref="`tool-panel-${item.id}`"
           @click="() => selectTool(item.id)"
           @mouseover="() => hovered = item.id"
           @mouseleave="() => hovered = null"
           @keyup.enter.prevent.exact="() => setHandler('nextItem', item.id)"
           @keydown.tab.prevent.exact="() => setHandler('nextItem', item.id)"
           @keydown.down.prevent.exact="() => setHandler('nextItem', item.id)"
           @keydown.up.prevent.exact="() => setHandler('previousItem', item.id)"
           @keypress="$event => toolKey($event, item.id)">

        <div class="user-story__tools" v-if="(toolDictionary && toolId === item.id)">
          <component :is="tab === 'labels' ? 'label-list' : 'tool-list'"
            :key="`tool-list-${item.id}`"
            :active="item[tab]"
            :list="toolDictionary"
            :minified="true"
            :label-cls="'tool-block__label--minified'"
            @update="id => submitTool(id)"/>
        </div>

        <v-layout align-center row fill-height>
          <v-flex shrink mr-1 align-self-baseline>
            <priority-indicator
              v-if="tab === 'priority'"
              :index="item.priority"
            />
            <div :class="`user-story__item user-story__item--${ item.level }`">
              <v-layout align-center fill-height>
                <v-flex shrink mr-2 v-if="tab === 'estimate'">
                  <input
                    :tabindex="0"
                    class="user-story__input"
                    v-model="item.estimate"
                    @focus="() => selectTool(item.id)"
                    @keydown.up.exact.prevent="$event => blur($event, 'previousItem')"
                    @keyup.down.exact.prevent="$event => blur($event, 'nextItem')"
                    @keydown.tab.exact.prevent="$event => blur($event, 'nextItem')"
                    @keyup.enter.exact.prevent="$event => blur($event, 'nextItem')"
                    @input="$event => updateEstimate($event, item.id)"
                    @blur="$event => submitEstimate($event, item.id)"
                    :ref="`estimate-${item.id}`"
                    :key="`estimate-${item.id}`"
                  />
                </v-flex>
                <v-flex grow>
                  <v-layout row
                            align-center
                            fill-height
                            class="user-story__prefix">
                    <div class="drag-icon" v-if="tab === 'edit'"
                         @mousedown="() => startDragging(item.id)">
                      <drag />
                    </div>
                    <div>#</div>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
          <v-flex text-xs-left align-center row fill-height
            class="word-break-word">
            <div class="user-story__wysiwyg">
              <div class="user-story__placeholder"
                   v-html="item.placeholder"
                   readonly></div>
              <div class="user-story__editable"
                   tabindex="0"
                   :contenteditable="processing !== item.id && tab === 'edit'"
                   :disabled="processing === item.id"
                   :class="{
                    'user-story__wysiwyg--disabled': tab !== 'edit',
                    'text-dark-grey': !item.type && beginning(item.markup)
                   }"
                   :ref="item.id"
                   :id="item.id"
                   @paste="ctrlV"
                   @focus="() => focusEvent(item, index)"
                   @keydown.enter.exact="createStory"
                   @click="($event) => checkHint($event, item, index)"
                   @keydown.down.exact="focusHint"
                   @keyup.exact="keyupEvent"
                   @keydown="keydownEvent"
                   @keydown.esc.exact="() => hintEditor = null"
                   @keydown.tab.exact="fixStaticText"
                   @keydown.delete.exact="remove"
                   @keydown.186.shift.exact="createSubstory"
                   @keydown.tab.shift.exact="decreaseStoryLevel"
                   @blur="() => updateStory(index)"
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
    </component>
  </div>
</template>

<script>
import ToolList from '../lists/ToolList';
import LabelList from '../lists/LabelList';
import CircularLoader from '../../particles/loaders/Circular';
import PriorityIndicator from '../../particles/indicators/Priority';

import WysiwygMixin from '@/mixins/wysiwyg';
import Drag from '../icons/Drag';

export default {
  name: 'Wysiwyg',
  components: {
    Drag,
    ToolList,
    CircularLoader,
    PriorityIndicator,
    LabelList
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
      processing: false,
      replacement: null,

      hovered: null,
      movable: null
    };
  },
  beforeMount () {
    this.list = this.stories;
  },
  methods: {
    setHandler (handler, params) {
      if (this.tab === 'priority' || this.tab === 'labels') {
        this[handler](params);
      }
    },
    beginning (markup) {
      return !markup.includes('user-story__editable--beginning');
    },
    clone (item) {
      this.replacement = item.id;
    },
    start () {
      this.primaryList = JSON.parse(JSON.stringify(this.list));
    },
    change ($event) {
      if (this.tab !== 'edit') {
        return;
      }

      const event = $event.moved;
      const sliced = this.primaryList.slice(event.oldIndex);

      let ids = [];
      for (let i = 0; i < sliced.length; i++) {
        if (sliced[i].level > event.element.level || sliced[i].id === event.element.id) {
          ids.push(sliced[i].id);
        } else {
          break;
        }
      }

      if (ids.length) {
        const afterStoryId = event.newIndex === 0 ? 0 : this.list[event.newIndex - 1].id;

        this.$store.dispatch('story/move', {
          //parentStoryId: event.element.parentStoryId,
          afterStoryId: afterStoryId,
          storyIds: ids
        });
      }

      this.replacement = null;
    },
    startDragging (id) {
      this.movable = id;
      this.$store.commit('story/setActiveStoryOnTab', null);
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
