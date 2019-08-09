<template>
  <div>
    <h1 class="content-container__header">user stories</h1>
    <div class="user-story__block">
      <template v-if="user.length">
        <story-static
          v-for="item in user"
          :key="item.id"
          :id="item.id" />
      </template>
      <div class="text-greyed full-width text-sm-center mb-3" v-else>
        The list of user stories is empty
      </div>
    </div>

    <h1 class="content-container__header">technical stories</h1>
    <div class="user-story__block">
      <template v-if="technical.length">
        <story-static
          v-for="item in technical"
          :key="item.id"
          :id="item.id" />
      </template>
      <div class="text-greyed full-width text-sm-center mb-3" v-else>
        The list of technical stories is empty
      </div>
    </div>
  </div>
</template>

<script>
import StoryStatic from '../../particles/layouts/StoryStatic';
import { mapGetters } from 'vuex';

export default {
  name: 'Stories',
  components: {
    StoryStatic
  },
  computed: {
    ...mapGetters({
      sections: 'projectVersion/sections'
    }),
    user () {
      return this.sections('user');
    },
    technical () {
      return this.sections('technical');
    }
  }
};
</script>
