<template>
  <div class="tool-section pt-4" v-if="story">
    <div class="tool-block">
      <div class="section__title">
        ID
      </div>
      <div class="tool-section__text">
        {{ story.storyIdentifier }}
      </div>
    </div>

    <div class="tool-block">
      <div class="section__title">
        Estimate
      </div>
      <div class="tool-block__text">
        <input class="user-story__input"
           :value="story.estimate"
           type="number"
           @focus="focusEstimate"
           @input="$event => updateEstimate($event, story.id)"
           @blur="$event => submitEstimate($event, story.id)" />
        <span class="ml-2">{{ hours(story.estimate) }}</span>
      </div>
    </div>

    <div class="tool-block">
      <div class="section__title">
        Priority
      </div>
      <tool-list
        :active="story.priority"
        :list="priorities"
        :shortcutted="false"
        :loader="toolProcessing &&
          toolProcessing.type === 'priority' &&
          toolProcessing.id === story.id"
        @update="id => updateToolId(id, story, 'priority')" />
    </div>

    <div class="tool-block">
      <v-layout align-start justify-space-between row fill-height >
        <div class="section__title">
          Labels
        </div>
        <div class="section__ref">
          Settings
        </div>
      </v-layout>
      <tool-list
        :active="story.labels"
        :list="labels"
        :shortcutted="false"
        :label-cls="'tool-block__label rounded'"
        :loader="toolProcessing &&
          toolProcessing.type === 'labels' &&
          toolProcessing.id === story.id"
        @update="id => updateToolId(id, story, 'labels')" />
    </div>

    <!--<div class="tool-block">
      <div class="section__title">
        Attachments
      </div>
      <div class="tool-block__text">
        <div class="tool-block__file">
          <v-layout align-center justify-center row fill-height>
            <v-icon>
              add
            </v-icon>
          </v-layout>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import ToolList from "../lists/ToolList";

import ProcessingMixin from '@/mixins/wysiwyg/instruments/processing';
import EstimateMixin from '@/mixins/wysiwyg/instruments/estimate';

export default {
  name: "ToolSection",
  mixins: [
    ProcessingMixin,
    EstimateMixin
  ],
  components: {
    ToolList
  },
  computed: {
    labels () {
      return this.$store.state.story.labels;
    },
    priorities () {
      return this.$store.state.story.priority;
    },
    stories () {
      return this.$store.getters['entity/items']('story');
    },
    story () {
      return _.find(this.stories, item => item.id === this.toolId);
    }
  },
  methods: {
    hours (str) {
      return Number(str) > 1 ? 'hours' : 'hour';
    }
  }
};
</script>
