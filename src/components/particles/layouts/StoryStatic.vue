<template>
  <div :id="model.id">
    <h1>
      {{ model.name }}
    </h1>
    <div v-if="model.description" class="mt-3 user-story__wysiwyg">
      {{ model.description }}
    </div>
    <div class="user-story mt-4 mb-5">
      <div v-if="model.list.length">
        <div v-for="item in model.list" :key="item.id">
          <v-layout align-center row fill-height mb-2>
            <v-flex shrink mr-1 align-self-baseline>
              <priority-indicator
                :index="item.priority"
              />
              <div :class="`user-story__item user-story__item--${ item.level }`">
                <v-layout align-center fill-height>
                  <v-flex grow>
                    <div>#</div>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
            <v-flex grow text-xs-left align-center row fill-height>
              <div class="user-story__wysiwyg">
                <span class="user-story--without-padding word-break-word"
                      v-html="augmented(item.markup)"
                ></span>
                <v-layout class="indicators"
                          align-center justify-start row fill-height>
                  <mark-indicator
                    :value="item.estimate"
                    :icon="'estimate-icon'" />
                  <mark-indicator
                    :value="0"
                    :icon="'attachment-icon'" />
                  <label-indicator
                    :list="item.labels" />
                  </v-layout>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </div>
      <div class="text-greyed full-width text-sm-center noprint" v-else>
        The list of stories is empty
      </div>
    </div>
  </div>
</template>

<script>
import PriorityIndicator from '../../particles/indicators/Priority';
import LabelIndicator from '../../particles/indicators/Label';
import MarkIndicator from '../../particles/indicators/Mark';
import Tools from '@/mixins/story';

import { mapGetters } from 'vuex';

export default {
  name: 'StoryStatic',
  inject: ['entity'],
  components: {
    PriorityIndicator,
    LabelIndicator,
    MarkIndicator
  },
  mixins: [
    Tools
  ],
  props: {
    id: {
      required: true
    }
  },
  computed: {
    ...mapGetters({
      section: 'projectVersion/section'
    }),
    model () {
      return this.section(this.id, this.entity);
    }
  },
  methods: {
    augmented (markup) {
      return markup;
    }
  }
};
</script>
