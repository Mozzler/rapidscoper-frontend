<template>
  <div class="scrollable-layout" ref="scrollable-layout">
    <div class="content-filter" v-if="sidebarFilter">
      <v-layout align-center justify-space-between row fill-height>
        <v-flex shrink>
          <v-layout align-center justify-start row fill-height>
            <v-flex class="filter__item--mr">
              Filters:
            </v-flex>
            <v-flex class="filter__item filter__item--mr">
              <div class="mr-1">Priorities: </div>
              <v-menu v-model="menu.priority"
                      :nudge-bottom="30"
                      :nudge-left="86">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">add</v-icon>
                </template>

                <div class="dropdown-list">
                  <v-list>
                    <v-list-tile v-for="(item, key) in priorities" :key="key" @click="$emit('update', item)"
                                 :class="{'v-list__tile--active': isEqual(selected, item)}">
                      <v-list-tile-content>
                        <v-list-tile-title :class="{'item-active': isEqual(selected, item)}">
                          <span>{{ item }}</span>
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </div>
              </v-menu>
            </v-flex>
            <v-flex class="filter__item filter__item--mr">
              <div class="mr-1">Labels: </div>
              <v-icon>add</v-icon>
            </v-flex>
            <!--<v-flex class="text-greyed">Estimate time: 12 hours</v-flex>-->
          </v-layout>
        </v-flex>
        <v-flex shrink>
          <v-layout align-center justify-center class="filter__search">
            <v-icon class="mr-2">search</v-icon>
            <input class="search-input" placeholder="Search" />
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
    <div class="content-container"
         v-for="(story, index) in sections"
         :key="index">
      <v-layout align-start justify-center row fill-height>
        <div class="content" ref="layout-content">
          <story-item
            :model="story"
            ref="storyItem"
            @show-error="value => message = value"/>
        </div>
        <hint />
        <alert :message="message" />
      </v-layout>
    </div>
  </div>
</template>

<script>
import StoryItem from '../../particles/forms/StoryItem';
import Hint from '../lists/Hint';

import ScrollMixin from '@/mixins/scroll';

export default {
  name: 'StoryContent',
  components: {
    StoryItem,
    Hint
  },
  mixins: [
    ScrollMixin
  ],
  data () {
    return {
      message: null,
      scrollActive: false,
      scrollSelector: '.user-story__block',
      menu: {
        priority: false,
        labels: false
      }
    };
  },
  beforeMount () {
    this.$root.$on('create-new-section', this.createSection);
    this.$root.$on('show-error-message', this.setErrorMessage);
  },
  beforeDestroy () {
    this.$root.$off('create-new-section');
    this.$root.$off('show-error-message');
  },
  computed: {
    sections () {
      return this.$store.getters['story/orderedSections'](this.projectId, this.storyType);
    },
    activeSectionId () {
      return this.$route.params.section;
    },
    projectId () {
      return this.$route.params.projectId;
    },
    projects () {
      return this.$store.getters['entity/items']('project');
    },
    activeProject () {
      return this.projects.find(item => item.id === this.projectId);
    },
    storyType () {
      const splitted = this.$route.params.storyType.split('-');
      return _.first(splitted);
    },
    sidebarFilter () {
      return this.$store.state.system.sidebarFilter;
    },
    priorities () {
      return this.$store.state.story.priority;
    }
  },
  methods: {
    setErrorMessage (error) {
      this.message = error;
    },
    getSectionData () {
      const untitled = this.sections.filter(item => item.name.includes('Untitled'));
      const number = untitled.length;

      return {
        entity: 'section',
        data: {
          name: `Untitled${number ? ' ' + number : ''}`,
          description: '',
          projectId: this.activeProject.id,
          teamId: this.activeProject.teamId,
          type: this.storyType
        }
      };
    },
    isEqual (left, right, field = 'id') {
      if (typeof left === 'object' && typeof right === 'object') {
        return left[field] === right[field];
      }

      return left === right;
    },
    async createSection () {
      const section = this.getSectionData();

      await this.$store.dispatch('entity/create', section);

      let orderList = _.chain(this.sections)
        .map(item => item.storyOrder)
        .flatten()
        .value();

      let filter = {
        $or: [
          { 'fullDocument._id': { '$in': [ orderList ] } }
        ]
      };
      this.$socket.recreateWatchers('story', true, filter);
    }
  }
};
</script>
