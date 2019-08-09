<template>
  <div class="scrollable-layout" ref="scrollable-layout">
    <div class="content-container">
      <v-layout align-start justify-center row fill-height>
        <div class="content">
          <stories />
        </div>
      </v-layout>
    </div>

    <div class="content-container">
      <v-layout align-start justify-center row fill-height>
        <div class="content">
          <h1 class="content-container__header mt-3">summary</h1>
          <div class="user-story__block" :id="1">
            <h1> Estimate for priority </h1>
            <div class="mt-3 user-story__wysiwyg">
              Time estimate for each priority.
            </div>
            <summary-list
              total="true"
              collection="priority" />
          </div>
          <div class="user-story__block" :id="2">
            <h1> Estimate for labels </h1>
            <div class="mt-3 user-story__wysiwyg">
              Time estimate for each label.
            </div>
            <summary-list
              label-cls="tool-block__label rounded"
              collection="labels" />
          </div>
        </div>
      </v-layout>
    </div>

    <div class="content-container">
      <v-layout align-start justify-center row fill-height>
        <div class="content">
          <h1 class="content-container__header">dictionary</h1>
          <dictionary-static />
        </div>
      </v-layout>
    </div>
  </div>
</template>

<script>
import DictionaryStatic from '../../particles/layouts/DictionaryStatic';
import SummaryList from '../../particles/lists/Summary';
import Stories from '../../particles/public/Stories';
import ScrollMixin from '@/mixins/scroll';

export default {
  name: "StoryContentPublic",
  components: {
    SummaryList,
    DictionaryStatic,
    Stories
  },
  mixins: [
    ScrollMixin
  ],
  computed: {
    sections () {
      return this.$store.getters['projectVersion/chapters'];
    }
  },
  mounted () {
    this.handleScroll();
  },
  methods: {
    handleScroll () {
      const nodes = this.$refs['scrollable-layout'].querySelectorAll('*[id]');
      const node = _.find(nodes, item => item.getBoundingClientRect().top > -24);

      this.$router.replace({
        name: 'shared-project',
        params: {
          section: node.id
        }
      });
    }
  }
};
</script>
