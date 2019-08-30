<template>
  <div :class="{
      'stories-container': !storyViewMode,
      'stories-container--public': storyViewMode
    }">
    <circular-loader
      cls="loader-shadow"
      :visible="loading"
    />

    <story-header
      @share-project="share"/>

    <editable-mode-layout
      v-if="!storyViewMode"
      :processing="loading" />
    <readable-mode-layout
      v-else-if="storyViewMode"
      :processing="loading" />
  </div>
</template>

<script>
import StoryHeader from '../../particles/navigation/StoryHeader';
import EditableModeLayout from '../../particles/layouts/mode/Editable';
import ReadableModeLayout from '../../particles/layouts/mode/Readable';
import CircularLoader from '../../particles/loaders/Circular';

import LayoutMixin from '@/mixins/layout';
import { mapState } from 'vuex';

export default {
  name: 'UserStories',
  components: {
    StoryHeader,
    EditableModeLayout,
    ReadableModeLayout,
    CircularLoader
  },
  mixins: [
    LayoutMixin
  ],
  data () {
    return {
      processing: true,
      loaded: {
        dictionary: false,
        section: false,
        story: false,
        projectShare: false
      }
    };
  },
  computed: {
    ...mapState({
      storyViewMode: state => state.system.storyViewMode
    }),
    sections () {
      return this.$store.getters['entity/items']('section');
    },
    storyType () {
      return _.first(this.$route.params.storyType.split('-'));
    }
  },
  methods: {
    share () {
      this.$store.commit('story/setActiveStoryOnTab', null);
      this.$nextTick(() => {
        this.$root.$emit('share-project', this.$route.params.projectId);
      });
    },
    fetchData () {
      this.processing = true;
      this.resetData();

      this.connect('dictionary', 'entity/setList', this.filter, true, () => {
        this.loaded['dictionary'] = true;
      });
      this.connect('projectShare', 'entity/setList', this.filter, true, () => {
        this.loaded['projectShare'] = true;
      });

      let filter = JSON.parse(JSON.stringify(this.filter));
      filter.$or[0]['fullDocument.type'] = this.storyType;
      this.connect('section', 'entity/setList', filter, true, () => {
        this.loaded['section'] = true;
        let orderList = _.chain(this.sections)
          .map(item => item.storyOrder)
          .flatten()
          .value();

        let filter = JSON.parse(JSON.stringify(this.filter));
        filter.$or[0] = { 'fullDocument._id': { '$in': orderList } };

        this.connect('story', 'entity/setList', filter, true, () => {
          this.loaded['story'] = true;
        });
      });
    },
    resetData () {
      this.loaded = {
        dictionary: false,
        section: false,
        story: false
      };

      this.$store.commit('entity/resetList', ['dictionary', 'section', 'story']);
    },
    fixRoute () {
      let stub = this.$route.params.section === 'section';

      if (this.sections.length && stub) {
        const url = this.$route.path.replace('section', this.sections[0].id);
        this.$router.replace(url);
      }
    },
    fetchSnapshot () {
      const payload = {
        params: {
          id: this.$route.params.projectId,
          version: 0
        }
      };
      this.processing = true;

      this.$store.dispatch('projectVersion/view', payload)
        .then(() => {
          this.processing = false;
        })
        .catch(error => {
          this.processing = false;
          this.$router.push('/');
        });
    },
    fetch () {
      let fetch = this.storyViewMode ? 'fetchSnapshot' : 'fetchData';
      this[fetch]();
    }
  },
  beforeDestroy () {
    this.resetData();
  },
  watch: {
    storyType () {
      this.fetchData();
    },
    storyViewMode () {
      if (this.storyViewMode) {
        this.fetchSnapshot();
      }
    },
    loaded: {
      deep: true,
      handler () {
        if (this.loaded.dictionary && this.loaded.section && this.loaded.story && this.loaded.projectShare) {
          this.processing = false;
          this.fixRoute();
        }
      }
    }
  }
};
</script>
