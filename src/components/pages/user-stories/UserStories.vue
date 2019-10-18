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
      :class="{'noprint': storyViewMode}"
      :disabled="processing" />

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
import IntroductionMixin from '@/mixins/introduction';

import LayoutMixin from '@/mixins/layout';
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'UserStories',
  components: {
    StoryHeader,
    EditableModeLayout,
    ReadableModeLayout,
    CircularLoader
  },
  mixins: [
    LayoutMixin,
    IntroductionMixin
  ],
  data () {
    return {
      processing: true,
      collections: [
        'userInfo', 'invite', 'project', 'userProject'
      ],
      loaded: {
        dictionary: false,
        section: false,
        story: false,
        projectShare: false,
        comment: false
      }
    };
  },
  beforeMount () {
    document.addEventListener('click', this.documentClick);
  },
  computed: {
    ...mapState({
      storyViewMode: state => state.system.storyViewMode
    }),
    ...mapState('system', [ 'comment' ]),
    ...mapGetters('entity', [
      'items'
    ]),
    sections () {
      return this.items('section');
    },
    storyType () {
      return _.first(this.$route.params.storyType.split('-'));
    }
  },
  methods: {
    ...mapMutations('system', [
      'setLoadedState',
      'setComment'
    ]),
    documentClick () {
      this.$nextTick(() => {
        if (!document.getSelection().toString().length) {
          this.setComment({ state: null });
        }
      });
    },
    fetchData () {
      this.processing = true;
      this.resetData();

      _.each(['comment', 'dictionary', 'projectShare'], key => {
        this.connect(key, 'entity/setList', this.filter, true, () => {
          this.loaded[key] = true;
          this.setLoadedState({ key, value: true });
        });
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
    document.removeEventListener('click', this.documentClick);
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
        let loaded = _.every(this.loaded, item => item);
        if (loaded && !this.initialization) {
          this.processing = false;
          this.fixRoute();
        }
      }
    }
  }
};
</script>
