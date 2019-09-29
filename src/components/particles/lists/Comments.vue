<template>
  <div class="tool-section pt-4">
    <div class="section__title">
      comments
    </div>

    <div class="mt-3">
      <dropdown :list="dropdown" :selected="commentStatus"
                @update="value => commentStatus = value"/>
    </div>
    <template v-if="list.length">
      <v-divider horizontal></v-divider>
      <div>
        <div v-for="(item, index) in list" :key="index">
          <div class="comment cursor-pointer"
               @[event]="() => showComment(item)">
            <v-layout row fill-height>
              <v-flex shrink mr-2>
                <img class="comment__img"
                     :src="item.avatarUrl" />
              </v-flex>
              <v-flex grow>
                <v-layout column fill-height>
                  <div class="font-weight-bold"> {{ item.name }} </div>
                  <div class="comment__subtitle"> {{ item.time }} </div>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-layout fill-height row mt-2>
              <v-flex>
                <div class="comment__text" v-if="item.status !== 'deleted'"> {{ item.content }} </div>
                <div class="comment__text text-greyed" v-else> Delete the comment </div>
                <div class="comment__subtitle" v-if="!item.parentCommentId">
                  {{ item.replies.length | s('reply', 'replies') }}
                </div>
              </v-flex>
            </v-layout>
          </div>
          <v-divider horizontal></v-divider>
        </div>
      </div>
    </template>
    <div
      v-else
      class="text-greyed mt-3">
      <v-divider horizontal></v-divider>
        There are no comments yet
    </div>
  </div>
</template>

<script>
import Dropdown from '../menus/Dropdown';
import { mapMutations } from 'vuex';

export default {
  name: 'Comments',
  inject: ['entity'],
  props: {
    'source': {},
    'clickable': {
      default: false,
      type: Boolean
    }
  },
  components: {
    Dropdown
  },
  data () {
    return {
      dropdown: ['Active', 'Resolved', 'Deleted'],
      commentStatus: 'Active'
    };
  },
  computed: {
    comments () {
      return this.source(this.entity);
    },
    list () {
      const status = this.commentStatus.toLowerCase();
      return _.filter(this.comments, comment => {
        const acceptable = comment.status === status;
        const visible = this.clickable || comment.visibleToClient;

        return visible && acceptable;
      });
    },
    stories () {
      return this.$store.getters['entity/items']('story');
    },
    event () {
      return this.clickable ? 'click' : null;
    }
  },
  methods: {
    ...mapMutations('system', [ 'setComment' ]),
    showComment (item) {
      this.setComment({
        id: item.id,
        state: item.storyId,
        x: 300,
        y: 300,
        markup: '',
        item: _.find(this.stories, story => story.id === item.storyId),
        precomment: false
      });
      this.$root.$emit('write-comment');
    }
  }
};
</script>
