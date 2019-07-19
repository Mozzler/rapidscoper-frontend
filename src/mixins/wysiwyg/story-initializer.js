export default {
  data () {
    return {
      stories: {
        list: [ this.getDefaultStoryList() ]
      }
    };
  },
  beforeMount () {
    this.$root.$on('update-model', this.updateModel);
    this.updateModel();
  },
  computed: {
    sections () {
      return this.$store.getters['entity/section'];
    },
    sectionContent () {
      return this.$store.getters['story/content'](this.model.id);
    },
    dictionary () {
      return this.$store.getters['story/dictionary'];
    }
  },
  methods: {
    getDefaultStoryList () {
      return {
        parent: null,
        estimation: 0,
        priority: 0,
        label: 1,

        text: '',
        template: '',
        tail: '',
        placeholder: '',

        list: []
      };
    },
    updateModel () {
      this.stories.list = this.$store.getters['story/content'](this.model.id);
      this.stories.list.forEach((value, index) => {
        this.stories.list[index].parent = this.stories;
      });
    }
  },
  beforeDestroy () {
    this.$root.$off('update-model', this.updateModel);
  }
};
